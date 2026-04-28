const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Submission = require('../models/Submission');
const Question = require('../models/Question');
const { verifyToken } = require('../middleware/auth');
const { 
  generateSubmissionId, 
  scoreAnswer, 
  calculateRoleScore,
  checkSuspiciousPatterns,
  formatCompanyState
} = require('../utils/helpers');
const {
  calculateNextYearStartingState,
  applyMarketEvent
} = require('../utils/cascadeLogic');
const { redisClient, isRedisReady } = require('../utils/redis');

/**
 * POST /api/submissions/:year
 * Submit answers for a year
 */
router.post('/:year', verifyToken, async (req, res) => {
  try {
    const { year } = req.params;
    const { answers } = req.body;
    const { teamId, userId, role } = req.user;

    if (![0, 1, 2, 3, 4].includes(parseInt(year))) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    // Get team and questions
    const [team, questions] = await Promise.all([
      Team.findOne({ teamId }),
      Question.find({ year: parseInt(year), role })
    ]);

    if (!team) return res.status(404).json({ error: 'Team not found' });
    if (!questions.length) return res.status(404).json({ error: 'Questions not found' });

    // Score answers
    const questionScores = {};
    for (const question of questions) {
      const userAnswer = answers[question.questionId];
      questionScores[question.questionId] = scoreAnswer(question, userAnswer);
    }

    const roleScore = calculateRoleScore(questionScores);
    
    // Create submission record
    const submissionId = generateSubmissionId();
    const submission = new Submission({
      submissionId,
      teamId,
      year: parseInt(year),
      role,
      answers,
      scores: {
        questionScores,
        roleTotal: Object.values(questionScores).reduce((a, b) => a + b, 0),
        rolePercentage: roleScore
      },
      timeSpentSeconds: req.body.timeSpent || 0
    });

    await submission.save();

    // Update team game state
    const yearKey = `year${year}`;
    const updateData = {
      [`gameState.${yearKey}.answers.${role}`]: answers,
      [`gameState.${yearKey}.scores.${role}`]: roleScore,
      [`gameState.${yearKey}.timeSpent.${role}`]: req.body.timeSpent || 0,
      [`gameState.${yearKey}.submittedAt`]: new Date()
    };

    await Team.updateOne({ teamId }, updateData);

    // Invalidate Leaderboard cache so ranking updates immediately
    if (isRedisReady()) {
      await redisClient.del('global:leaderboard');
    }

    // Check if all roles have submitted for THIS team
    const updatedTeam = await Team.findOne({ teamId });
    const checkState = updatedTeam.gameState[yearKey];
    const allSubmitted = 
      checkState && 
      Object.keys(checkState.answers.cto || {}).length > 0 &&
      Object.keys(checkState.answers.cfo || {}).length > 0 &&
      Object.keys(checkState.answers.pm || {}).length > 0;

    if (allSubmitted) {
      // Calculate cascade effects
      await processYearCompletion(teamId, year);
    }

    // Check if ALL teams have completed all 3 roles for this round
    // If so, automatically mark the round as done
    try {
      const GameSettings = require('../models/GameSettings');
      const allTeams = await Team.find({ teamId: { $ne: 'ADMIN-EVENT-2026' } });
      const allTeamsComplete = allTeams.length > 0 && allTeams.every(t => {
        const yd = t.gameState?.[yearKey];
        if (!yd || !yd.answers) return false;
        const ctoDone = yd.answers.cto && Object.keys(yd.answers.cto).length > 0;
        const cfoDone = yd.answers.cfo && Object.keys(yd.answers.cfo).length > 0;
        const pmDone = yd.answers.pm && Object.keys(yd.answers.pm).length > 0;
        return ctoDone && cfoDone && pmDone;
      });

      if (allTeamsComplete) {
        await GameSettings.findOneAndUpdate(
          { id: 'global_settings' },
          { isRoundActive: false, lastUpdated: new Date() }
        );
        console.log(`[AUTO] Round ${parseInt(year) + 1} auto-completed — all teams finished.`);
      }
    } catch (autoErr) {
      console.error('Auto-complete check error:', autoErr);
    }

    res.status(201).json({
      submissionId,
      roleScore,
      questionScores,
      allSubmitted: !!allSubmitted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Process year completion and cascade to next year
 */
async function processYearCompletion(teamId, year) {
  const team = await Team.findOne({ teamId });
  const yearKey = `year${year}`;
  const FINAL_YEAR = 4;
  const TOTAL_YEARS = 5;

  const roundTotal =
    (team.gameState[yearKey].scores.cto || 0) +
    (team.gameState[yearKey].scores.cfo || 0) +
    (team.gameState[yearKey].scores.pm || 0);

  const avgTimeSpent = (
    (team.gameState[yearKey].timeSpent?.cto || 0) +
    (team.gameState[yearKey].timeSpent?.cfo || 0) +
    (team.gameState[yearKey].timeSpent?.pm || 0)
  ) / 3;

  const outputTime = Math.round(avgTimeSpent);

  if (!team.gameState[yearKey].timeSpent) {
    team.gameState[yearKey].timeSpent = { cto: 0, cfo: 0, pm: 0 };
  }
  team.gameState[yearKey].timeSpent.outputTime = outputTime;
  team.gameState[yearKey].scores.roundAvg = roundTotal;

  team.points = (team.points || 0) + roundTotal;

  const defaultCompanyStates = {
    0: { monthlyBill: 8500, monthlyRevenue: 10000, cumulativeProfit: -30000, runwayMonths: 14 },
    1: { monthlyBill: 7400, monthlyRevenue: 12000, cumulativeProfit: -26400, runwayMonths: 12 },
  };

  if (defaultCompanyStates[year] && (!team.gameState[yearKey].companyState || !team.gameState[yearKey].companyState.monthlyBill)) {
    team.gameState[yearKey].companyState = defaultCompanyStates[year];
  }

  const event = await applyMarketEvent(teamId, year, `EVENT_YEAR${year}`);
  if (event && event.impact) {
    team.gameState[yearKey].marketEvent = {
      name: event.event.eventName,
      penalty: event.impact.penalty,
      description: event.event.description
    };

    if (team.gameState[yearKey].companyState) {
      team.gameState[yearKey].companyState.cumulativeProfit += event.impact.penalty;
    }
  }

  if (year < FINAL_YEAR) {
    const nextYear = year + 1;
    const nextYearKey = `year${nextYear}`;

    if (team.gameState[yearKey].companyState) {
      team.gameState[nextYearKey].companyState =
        await calculateNextYearStartingState(year, team.gameState[yearKey].answers, team.gameState[yearKey].companyState);
    }

    team.currentYear = nextYear;
  } else {
    team.eventStatus = 'completed';
  }

  const currentProfit = team.gameState[yearKey].companyState?.cumulativeProfit || 0;

  if (!team.finalScore) {
    team.finalScore = { cumulativeProfit: currentProfit, totalScore: roundTotal };
  } else {
    team.finalScore.cumulativeProfit = currentProfit;
  }

  if (year === FINAL_YEAR) {
    let totalScore = 0;
    let roleCount = 0;
    for (let y = 0; y <= FINAL_YEAR; y++) {
      const yd = team.gameState[`year${y}`];
      if (yd?.scores) {
        totalScore += (yd.scores.cto || 0) + (yd.scores.cfo || 0) + (yd.scores.pm || 0);
        roleCount += 3;
      }
    }
    team.finalScore.totalScore = roleCount > 0 ? Math.round(totalScore / roleCount) : 0;
  }

  await team.save();
}

/**
 * GET /api/submissions/:teamId/:year
 * Get team's submission for a year
 */
router.get('/:teamId/:year', async (req, res) => {
  try {
    const { teamId, year } = req.params;

    const submission = await Submission.findOne({
      teamId,
      year: parseInt(year)
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.status(200).json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/submissions/disqualify/:year
 * Disqualify a user for cheating
 */
router.post('/disqualify/:year', verifyToken, async (req, res) => {
  try {
    const { year } = req.params;
    const { reason } = req.body;
    const { teamId, role } = req.user;

    const team = await Team.findOne({ teamId });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const yearKey = `year${year}`;
    if (!team.gameState[yearKey]) return res.status(400).json({ error: 'Invalid year' });

    const updateData = {
      [`gameState.${yearKey}.scores.${role}`]: 0,
      [`gameState.${yearKey}.answers.${role}`]: { disqualified: true },
      [`gameState.${yearKey}.submittedAt`]: new Date(),
      $inc: { 'fraudFlags.tabSwitches': 1 },
      $push: { 'gameState.violations': { role, year, reason: reason || 'Cheating detected' } }
    };

    await Team.updateOne({ teamId }, updateData);

    res.status(200).json({ success: true, message: 'User disqualified for this round' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
