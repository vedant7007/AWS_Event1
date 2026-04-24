const crypto = require('crypto');

/**
 * Generate unique team ID
 */
function generateTeamId() {
  return 'T' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

/**
 * Generate unique user ID
 */
function generateUserId() {
  return 'U' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

/**
 * Generate unique submission ID
 */
function generateSubmissionId() {
  return 'S' + crypto.randomBytes(6).toString('hex').toUpperCase();
}

/**
 * Calculate score for a single answer
 */
function scoreAnswer(question, userAnswer) {
  if (!question || !question.correctAnswer) return 0;

  if (question.type === 'mcq' || question.type === 'truefalse') {
    return userAnswer === question.correctAnswer ? question.scoringRubric.full : 0;
  }

  if (question.type === 'numerical') {
    if (!question.acceptableRange) {
      return userAnswer === question.correctAnswer ? question.scoringRubric.full : 0;
    }
    
    const val = parseFloat(userAnswer);
    if (val >= question.acceptableRange.min && val <= question.acceptableRange.max) {
      return question.scoringRubric.full;
    }
    return 0;
  }

  if (question.type === 'rating') {
    // For ratings, full score if in ideal range
    if (question.correctAnswer.min && question.correctAnswer.max) {
      const rating = parseInt(userAnswer);
      if (rating >= question.correctAnswer.min && rating <= question.correctAnswer.max) {
        return question.scoringRubric.full;
      }
    }
    return 0;
  }

  return 0;
}

/**
 * Calculate role average score
 */
function calculateRoleScore(questionScores) {
  if (!questionScores || Object.keys(questionScores).length === 0) return 0;
  
  const scores = Object.values(questionScores);
  const total = scores.reduce((a, b) => a + b, 0);
  return Math.round(total / scores.length);
}

/**
 * Check for suspicious answer patterns
 */
function checkSuspiciousPatterns(submission, timeSpentSeconds) {
  const flags = [];

  // Too fast submission (less than 2 minutes for 6-8 questions)
  if (timeSpentSeconds < 120) {
    flags.push({
      flagType: 'fast-submission',
      description: `Submitted in ${timeSpentSeconds}s (suspicious)`
    });
  }

  // All same answer
  const answers = Object.values(submission.answers || {});
  if (answers.length > 1 && answers.every(a => a === answers[0])) {
    flags.push({
      flagType: 'all-same-answers',
      description: 'All answers identical'
    });
  }

  return flags;
}

/**
 * Format company state for display
 */
function formatCompanyState(state) {
  return {
    monthlyBill: Math.round(state.monthlyBill),
    monthlyRevenue: Math.round(state.monthlyRevenue),
    monthlyProfit: Math.round(state.monthlyRevenue - state.monthlyBill),
    runwayMonths: state.runwayMonths,
    cumulativeProfit: Math.round(state.cumulativeProfit),
    status: state.runwayMonths > 12 ? 'THRIVING' : state.runwayMonths > 0 ? 'STABLE' : 'CRITICAL'
  };
}

module.exports = {
  generateTeamId,
  generateUserId,
  generateSubmissionId,
  scoreAnswer,
  calculateRoleScore,
  checkSuspiciousPatterns,
  formatCompanyState
};
