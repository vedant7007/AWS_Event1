const CascadeRule = require('../models/CascadeRule');
const MarketEvent = require('../models/MarketEvent');

/**
 * Calculate Year 2 starting state based on Year 1 decisions
 */
async function calculateYear2StartingState(year1Answers, year1State) {
  const year2State = {
    monthlyBill: year1State.monthlyBill,
    monthlyRevenue: 15000, // Growth trigger
    cumulativeProfit: year1State.cumulativeProfit
  };

  // Get all cascade rules for Year 1 -> Year 2
  const rules = await CascadeRule.find({
    'triggerCondition.year': 1,
    'effect.targetYear': 2
  });

  // Apply each rule based on Year 1 answers
  for (const rule of rules) {
    const triggered = checkRuleTrigger(rule, year1Answers);
    if (triggered) {
      applyRuleEffect(year2State, rule.effect);
    }
  }

  year2State.runwayMonths = calculateRunway(year2State);
  return year2State;
}

/**
 * Calculate Year 3 starting state based on Year 2 decisions
 */
async function calculateYear3StartingState(year2Answers, year2State) {
  const year3State = {
    monthlyBill: year2State.monthlyBill,
    monthlyRevenue: 18000, // Growth trigger (major customer surge)
    cumulativeProfit: year2State.cumulativeProfit
  };

  // Get all cascade rules for Year 2 -> Year 3
  const rules = await CascadeRule.find({
    'triggerCondition.year': 2,
    'effect.targetYear': 3
  });

  // Apply each rule based on Year 2 answers
  for (const rule of rules) {
    const triggered = checkRuleTrigger(rule, year2Answers);
    if (triggered) {
      applyRuleEffect(year3State, rule.effect);
    }
  }

  year3State.runwayMonths = calculateRunway(year3State);
  return year3State;
}

/**
 * Check if a cascade rule is triggered by the answers
 */
function checkRuleTrigger(rule, answers) {
  const condition = rule.triggerCondition;
  
  if (!condition.role || !condition.questionId) return false;

  const roleAnswers = answers[condition.role];
  if (!roleAnswers) return false;

  const questionAnswer = roleAnswers[condition.questionId];
  return questionAnswer === condition.answerValue;
}

/**
 * Apply cascade rule effects to state
 */
function applyRuleEffect(state, effect) {
  if (effect.stateChanges) {
    if (effect.stateChanges.monthlyBillModifier) {
      state.monthlyBill *= (1 + effect.stateChanges.monthlyBillModifier);
    }
    if (effect.stateChanges.revenueModifier) {
      state.monthlyRevenue *= (1 + effect.stateChanges.revenueModifier);
    }
  }
}

/**
 * Calculate runway in months
 */
function calculateRunway(state) {
  const monthlyLoss = state.monthlyRevenue - state.monthlyBill;
  if (monthlyLoss >= 0) return 999; // Profitable, infinite runway
  return Math.ceil(state.cumulativeProfit / Math.abs(monthlyLoss));
}

/**
 * Apply market event to team based on preparedness
 */
async function applyMarketEvent(teamId, year, eventId) {
  const event = await MarketEvent.findOne({ eventId });
  if (!event) return null;

  // Check if team is prepared (has monitoring, etc.)
  const isPrepared = await checkTeamPreparedness(teamId, year);

  const impact = isPrepared ? event.impact.ifPrepared : event.impact.ifUnprepared;

  // Record that event was applied to this team
  await MarketEvent.updateOne(
    { eventId },
    { $push: { appliedTeams: teamId } }
  );

  return {
    event,
    impact,
    isPrepared
  };
}

/**
 * Check if team is prepared for certain scenarios
 */
async function checkTeamPreparedness(teamId, year) {
  const Team = require('../models/Team');
  const team = await Team.findOne({ teamId });

  if (!team || !team.gameState[`year${year}`]) return false;

  const yearData = team.gameState[`year${year}`];
  
  // Check for monitoring setup (CTO decisions)
  const hasMonitoring = yearData.answers.cto && yearData.answers.cto.monitoring === true;
  
  return hasMonitoring;
}

/**
 * Calculate final scores and leaderboard position
 */
async function calculateFinalScores() {
  const Team = require('../models/Team');
  
  const teams = await Team.find({ eventStatus: 'completed' });

  // Sort by final profit
  teams.sort((a, b) => {
    const aProfitYear3 = a.gameState.year3?.companyState?.cumulativeProfit || 0;
    const bProfitYear3 = b.gameState.year3?.companyState?.cumulativeProfit || 0;
    return bProfitYear3 - aProfitYear3;
  });

  // Update ranks
  for (let i = 0; i < teams.length; i++) {
    await Team.updateOne(
      { teamId: teams[i].teamId },
      { 
        'finalScore.rank': i + 1,
        'finalScore.finishedAt': new Date()
      }
    );
  }

  return teams;
}

module.exports = {
  calculateYear2StartingState,
  calculateYear3StartingState,
  applyMarketEvent,
  calculateFinalScores,
  checkTeamPreparedness
};
