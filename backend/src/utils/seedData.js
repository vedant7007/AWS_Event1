const Question = require('../models/Question');
const { generateTeamId } = require('../utils/helpers');

/**
 * Seed Year 1 questions into database
 */
async function seedYear1Questions() {
  const year1Questions = [
    // ===== CTO QUESTIONS (Year 1) =====
    {
      questionId: 'Y1_CTO_Q1',
      year: 1,
      role: 'cto',
      questionNumber: 1,
      type: 'mcq',
      scenario: 'PulseStream is bleeding money. Your monitoring shows 4 EC2 instances. Two are running at 5% CPU, two at 85% CPU.',
      question: 'Your monitoring shows 4 EC2 instances. Two are running at 5% CPU, two at 85% CPU. This is a clear waste. What\'s your first action?',
      options: [
        { optionId: 'A', text: 'Terminate the 2 low-CPU instances immediately to save money', value: 'A' },
        { optionId: 'B', text: 'Downsize the low-CPU instances to smaller types, monitor 85% CPU ones', value: 'B' },
        { optionId: 'C', text: 'Add 2 more instances to balance the load', value: 'C' },
        { optionId: 'D', text: 'Not sure / leave as is', value: 'D' }
      ],
      correctAnswer: 'B',
      correctAnswerText: 'Downsize the low-CPU instances to smaller types, monitor 85% CPU ones',
      explanation: 'Terminating without investigation risks breaking something. Downsizing is the pro move — keeps the service running while saving money. The 85% CPU ones might need attention too (upgrade or scale).',
      difficulty: 'medium',
      teachingMoment: 'Right-sizing is smarter than termination when you don\'t fully understand the workload.',
      scoringRubric: { full: 100, partial: 50, incorrect: 0 },
      cascadeEffect: {
        description: 'Choosing to downsize properly reduces Year 1 costs and carries forward to Year 2',
        impactOnYear2: { monthlyBillModifier: -0.15 },
        impactOnYear3: null
      }
    },
    {
      questionId: 'Y1_CTO_Q2',
      year: 1,
      role: 'cto',
      questionNumber: 2,
      type: 'mcq',
      scenario: 'One of your 3 RDS databases, called "legacy-analytics-db", hasn\'t had a single query in 6 months. The database stores 50GB of data.',
      question: 'One RDS database, "legacy-analytics-db", hasn\'t had a single query in 6 months. Nobody knows what it was for. What do you do?',
      options: [
        { optionId: 'A', text: 'Delete it immediately, save $200/month', value: 'A' },
        { optionId: 'B', text: 'Snapshot it to S3 as a backup, then delete it', value: 'B' },
        { optionId: 'C', text: 'Leave it running — too risky to touch', value: 'C' },
        { optionId: 'D', text: 'Move it to a cheaper instance type', value: 'D' }
      ],
      correctAnswer: 'B',
      correctAnswerText: 'Snapshot it to S3 as a backup, then delete it',
      explanation: 'Safe deletion is the professional approach. If it turns out you needed it, you have a backup. This teaches the importance of being cautious with production data.',
      difficulty: 'easy',
      teachingMoment: 'Always backup before deleting; you don\'t know what you don\'t know.',
      scoringRubric: { full: 100, partial: 0, incorrect: 0 },
      cascadeEffect: {
        description: 'Safe practices in Year 1 prevent data loss and build good habits',
        impactOnYear2: { monthlyBillModifier: -0.05 },
        impactOnYear3: null
      }
    },
    {
      questionId: 'Y1_CTO_Q3',
      year: 1,
      role: 'cto',
      questionNumber: 3,
      type: 'truefalse',
      scenario: 'Understanding EC2 instance lifecycle',
      question: 'Terminating an EC2 instance automatically deletes all attached EBS volumes.',
      options: [
        { optionId: 'true', text: 'True', value: true },
        { optionId: 'false', text: 'False', value: false }
      ],
      correctAnswer: false,
      correctAnswerText: 'False',
      explanation: 'By default, the OS disk (root volume) is deleted, but other data volumes are NOT deleted unless you explicitly check "Delete on Termination".',
      difficulty: 'easy',
      teachingMoment: 'EC2 termination is not the same as data deletion; you have control.',
      scoringRubric: { full: 100, partial: 0, incorrect: 0 }
    },

    // ===== CFO QUESTIONS (Year 1) =====
    {
      questionId: 'Y1_CFO_Q1',
      year: 1,
      role: 'cfo',
      questionNumber: 1,
      type: 'numerical',
      scenario: 'Current AWS costs breakdown: EC2: $12,000/month, RDS: $4,000/month, S3: $1,500/month, Other: $500/month. TOTAL: $18,000/month',
      question: 'After optimizations (EC2 -35%, RDS -$200, S3 -70%), what is your new monthly AWS bill? (Round to nearest $100)',
      options: null,
      correctAnswer: 13950,
      acceptableRange: { min: 13700, max: 14200 },
      explanation: '$18,000 – $2,800 (35% of $8,000) – $200 – $1,050 (70% of $1,500) = $13,950',
      difficulty: 'medium',
      teachingMoment: 'Even small cost cuts compound; a few wise decisions add up.',
      scoringRubric: { full: 100, partial: 50, incorrect: 0 }
    },
    {
      questionId: 'Y1_CFO_Q2',
      year: 1,
      role: 'cfo',
      questionNumber: 2,
      type: 'mcq',
      scenario: 'After cost cuts, monthly bill drops from $18,000 to $13,950. Revenue is still $12,000/month.',
      question: 'When do you reach profitability (break-even)?',
      options: [
        { optionId: 'A', text: 'Never, costs too high', value: 'A' },
        { optionId: 'B', text: 'You\'re still losing $1,950/month; it\'ll take 7+ months', value: 'B' },
        { optionId: 'C', text: 'In about 2-3 months if you can grow revenue to $14,000+/mo', value: 'C' },
        { optionId: 'D', text: 'You break even immediately (costs = revenue)', value: 'D' }
      ],
      correctAnswer: 'C',
      correctAnswerText: 'In about 2-3 months if you can grow revenue to $14,000+/mo',
      explanation: 'You\'re losing $1,950/month. If revenue grows by ~15% to $14,000, you flip to profitable. Profitability is about the gap; fix it on either side (costs or revenue).',
      difficulty: 'medium',
      teachingMoment: 'Understanding break-even analysis is critical for financial health.',
      scoringRubric: { full: 100, partial: 0, incorrect: 0 }
    },

    // ===== PM QUESTIONS (Year 1) =====
    {
      questionId: 'Y1_PM_Q1',
      year: 1,
      role: 'pm',
      questionNumber: 1,
      type: 'mcq',
      scenario: 'You\'re cutting costs aggressively. AWS bill down by 30%, but server response times increased.',
      question: 'You\'re cutting costs aggressively. What\'s the biggest risk?',
      options: [
        { optionId: 'A', text: 'Users leave due to slowness', value: 'A' },
        { optionId: 'B', text: 'Team burnout', value: 'B' },
        { optionId: 'C', text: 'Competitors steal market share', value: 'C' },
        { optionId: 'D', text: 'AWS closes account', value: 'D' }
      ],
      correctAnswer: 'A',
      correctAnswerText: 'Users leave due to slowness',
      explanation: 'Cost cuts must not break user experience. Losing users is more catastrophic than saving on infrastructure.',
      difficulty: 'medium',
      teachingMoment: 'Product quality > cost savings. Balance is key.',
      scoringRubric: { full: 100, partial: 0, incorrect: 0 }
    },
    {
      questionId: 'Y1_PM_Q2',
      year: 1,
      role: 'pm',
      questionNumber: 2,
      type: 'rating',
      scenario: 'Strategic decision about cost-cutting approach',
      question: 'Rate this decision (1=terrible, 10=great): "Delete any feature we\'re unsure about to save costs"',
      options: [
        { optionId: '1', text: '1 - Terrible', value: 1 },
        { optionId: '2', text: '2', value: 2 },
        { optionId: '3', text: '3', value: 3 },
        { optionId: '4', text: '4', value: 4 },
        { optionId: '5', text: '5 - Neutral', value: 5 },
        { optionId: '6', text: '6', value: 6 },
        { optionId: '7', text: '7', value: 7 },
        { optionId: '8', text: '8', value: 8 },
        { optionId: '9', text: '9', value: 9 },
        { optionId: '10', text: '10 - Excellent', value: 10 }
      ],
      correctAnswer: { min: 3, max: 4 },
      correctAnswerText: 'Rating 3-4 is ideal',
      explanation: 'Too aggressive and reckless. Find a middle ground: snapshot, monitor, then delete after 2-4 weeks of zero activity.',
      difficulty: 'medium',
      teachingMoment: 'Cost-cutting must balance safety and speed.',
      scoringRubric: { full: 100, partial: 50, incorrect: 0 }
    }
  ];

  try {
    // Insert questions into database
    const result = await Question.insertMany(year1Questions);
    console.log(`✓ Inserted ${result.length} Year 1 questions`);
    return result;
  } catch (err) {
    console.error('Error seeding questions:', err.message);
    throw err;
  }
}

module.exports = { seedYear1Questions };
