const CascadeRule = require('../models/CascadeRule');
const MarketEvent = require('../models/MarketEvent');

const YEAR_REVENUE_TARGETS = {
  0: 10000,
  1: 12000,
  2: 15000,
  3: 18000,
  4: 22000,
};

async function calculateNextYearStartingState(currentYear, currentAnswers, currentState) {
  const nextYear = currentYear + 1;
  const nextState = {
    monthlyBill: currentState.monthlyBill,
    monthlyRevenue: YEAR_REVENUE_TARGETS[nextYear] || currentState.monthlyRevenue * 1.15,
    cumulativeProfit: currentState.cumulativeProfit
  };

  const rules = await CascadeRule.find({
    'triggerCondition.year': currentYear,
    'effect.targetYear': nextYear
  });

  for (const rule of rules) {
    const triggered = checkRuleTrigger(rule, currentAnswers);
    if (triggered) {
      applyRuleEffect(nextState, rule.effect);
    }
  }

  nextState.runwayMonths = calculateRunway(nextState);
  return nextState;
}

function checkRuleTrigger(rule, answers) {
  const condition = rule.triggerCondition;
  if (!condition.role || !condition.questionId) return false;

  const roleAnswers = answers[condition.role];
  if (!roleAnswers) return false;

  return roleAnswers[condition.questionId] === condition.answerValue;
}

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

function calculateRunway(state) {
  const monthlyLoss = state.monthlyRevenue - state.monthlyBill;
  if (monthlyLoss >= 0) return 999;
  return Math.ceil(state.cumulativeProfit / Math.abs(monthlyLoss));
}

async function applyMarketEvent(teamId, year, eventId) {
  const event = await MarketEvent.findOne({ eventId });
  if (!event) return null;

  const isPrepared = await checkTeamPreparedness(teamId, year);

  const impact = isPrepared ? event.impact.ifPrepared : event.impact.ifUnprepared;

  await MarketEvent.updateOne(
    { eventId },
    { $push: { appliedTeams: teamId } }
  );

  return { event, impact, isPrepared };
}

async function checkTeamPreparedness(teamId, year) {
  const Team = require('../models/Team');
  const team = await Team.findOne({ teamId });

  if (!team || !team.gameState[`year${year}`]) return false;

  const yearData = team.gameState[`year${year}`];
  const hasMonitoring = yearData.answers.cto && yearData.answers.cto.monitoring === true;

  return hasMonitoring;
}

async function calculateFinalScores() {
  const Team = require('../models/Team');
  const teams = await Team.find({ eventStatus: 'completed' });

  teams.sort((a, b) => {
    const aProfit = a.gameState.year4?.companyState?.cumulativeProfit || 0;
    const bProfit = b.gameState.year4?.companyState?.cumulativeProfit || 0;
    return bProfit - aProfit;
  });

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
  calculateNextYearStartingState,
  applyMarketEvent,
  calculateFinalScores,
  checkTeamPreparedness
};
