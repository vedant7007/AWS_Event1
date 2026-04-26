const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Question = require('../models/Question');
const GameSettings = require('../models/GameSettings');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { redisClient, isRedisReady } = require('../utils/redis');

/**
 * GET /api/admin/settings
 * Get global game settings
 */
router.get('/settings', verifyToken, async (req, res) => {
  try {
    const cacheKey = 'global:settings';
    
    // Check Cache
    if (isRedisReady()) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('[Redis Hit] Serving global settings');
        return res.status(200).json(JSON.parse(cached));
      }
    }

    let settings = await GameSettings.findOne({ id: 'global_settings' });
    if (!settings) {
      settings = new GameSettings({ id: 'global_settings' });
      await settings.save();
    }

    // Save to Cache (5 min TTL)
    if (isRedisReady()) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(settings));
    }

    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/settings
 * Update active round or start/stop round
 */
router.post('/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { currentRound, isRoundActive, resetRoundData } = req.body;
    const settings = await GameSettings.findOneAndUpdate(
      { id: 'global_settings' },
      { currentRound, isRoundActive, lastUpdated: new Date() },
      { new: true, upsert: true }
    );

    if (resetRoundData !== undefined && resetRoundData !== null) {
       const updateObj = {};
       updateObj[`gameState.year${resetRoundData}`] = { 
           answers: { cto: {}, cfo: {}, pm: {} }, 
           scores: { cto: 0, cfo: 0, pm: 0, roundAvg: 0 }, 
           companyState: { monthlyBill: 0, monthlyRevenue: 0, runwayMonths: 0, cumulativeProfit: 0 } 
       };
       
       await Team.updateMany({ teamId: { $ne: 'ADMIN-EVENT-2026' } }, {
          $set: updateObj
       });
    }

    // Invalidate caches
    if (isRedisReady()) {
      await redisClient.del('global:settings');
      await redisClient.del('leaderboard:global');
      console.log('[Redis Invalidate] Setting and leaderboard caches cleared');
    }

    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/teams
 */
router.get('/teams', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const teams = await Team.find(
      { teamId: { $ne: 'ADMIN-EVENT-2026' } },
      'teamId teamName members currentYear eventStatus points finalScore gameState'
    );

    res.status(200).json({
      total: teams.length,
      teams: teams.map(team => ({
        teamId: team.teamId,
        teamName: team.teamName,
        members: team.members ? team.members.map(m => ({ name: m.name, role: m.role })) : [],
        status: team.eventStatus,
        currentYear: team.currentYear,
        points: team.points || 0,
        cumulativeProfit: team.finalScore?.cumulativeProfit || 0,
        gameState: team.gameState
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/reset-game
 */
router.post('/reset-game', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { resetType } = req.body;
    const Submission = require('../models/Submission');
    
    if (resetType === 'total') {
      // DANGEROUS: Wipes all teams except main admin
      await Team.deleteMany({ teamId: { $ne: 'ADMIN-EVENT-2026' } });
      await Submission.deleteMany({});
    } else {
      // PARTIAL: Wipes submissions and resets progress but keeps teams and questions
      await Submission.deleteMany({});
      await Team.updateMany({ teamId: { $ne: 'ADMIN-EVENT-2026' } }, { 
        currentYear: 0, 
        points: 0, 
        eventStatus: 'registered',
        fraudFlags: { tabSwitches: 0, multiDeviceLogin: false, fastSubmissions: 0 },
        gameState: { 
          year0: { answers: { cto: {}, cfo: {}, pm: {} }, scores: { cto: 0, cfo: 0, pm: 0, roundAvg: 0 }, companyState: { monthlyBill: 0, monthlyRevenue: 0, runwayMonths: 0, cumulativeProfit: 0 } },
          year1: { answers: { cto: {}, cfo: {}, pm: {} }, scores: { cto: 0, cfo: 0, pm: 0, roundAvg: 0 }, companyState: { monthlyBill: 0, monthlyRevenue: 0, runwayMonths: 0, cumulativeProfit: 0 } },
          year2: { answers: { cto: {}, cfo: {}, pm: {} }, scores: { cto: 0, cfo: 0, pm: 0, roundAvg: 0 }, companyState: { monthlyBill: 0, monthlyRevenue: 0, runwayMonths: 0, cumulativeProfit: 0 } },
          year3: { answers: { cto: {}, cfo: {}, pm: {} }, scores: { cto: 0, cfo: 0, pm: 0, roundAvg: 0 }, companyState: { monthlyBill: 0, monthlyRevenue: 0, runwayMonths: 0, cumulativeProfit: 0 } },
          year4: { answers: { cto: {}, cfo: {}, pm: {} }, scores: { cto: 0, cfo: 0, pm: 0, roundAvg: 0 }, companyState: { monthlyBill: 0, monthlyRevenue: 0, runwayMonths: 0, cumulativeProfit: 0 } },
          violations: [] 
        },
        finalScore: { cumulativeProfit: 0, totalScore: 0, rank: 0 }
      });
    }

    // Reset global round settings
    await GameSettings.findOneAndUpdate(
      { id: 'global_settings' },
      { currentRound: 0, isRoundActive: false, lastUpdated: new Date() }
    );

    res.status(200).json({ success: true, message: 'Game re-initialized successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Question Management (CRUD)
 */
router.get('/questions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const questions = await Question.find().sort({ year: 1, role: 1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/questions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { year, role, question, options, correctAnswer, scoringRubric, type, scenario, acceptableRange } = req.body;
    const questionId = `Q-${year}-${role}-${Date.now()}`;
    const newQuestion = new Question({
      questionId,
      year,
      role,
      question,
      options,
      correctAnswer,
      type: type || 'mcq',
      scenario: scenario || 'AWS Operational Event',
      scoringRubric: scoringRubric || { full: 10, partial: 0, incorrect: 0 },
      acceptableRange: acceptableRange
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/questions/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/questions/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Question eliminated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Create Admin
 */
const bcrypt = require('bcryptjs');

router.post('/create-admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { teamId, memberName, password } = req.body;
    if (await Team.findOne({ teamId })) return res.status(400).json({ error: 'Admin ID exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminTeam = new Team({
      teamId, teamName: 'Admin Control',
      members: [{ name: memberName, role: 'admin', password: hashedPassword, userId: `admin-${Date.now()}` }],
      currentYear: 0, eventStatus: 'registered'
    });
    await adminTeam.save();
    res.status(201).json({ message: 'Admin created successfully', teamId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
