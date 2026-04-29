const Question = require('../models/Question');

const YEAR1_SCENARIO = 'PulseStream is bleeding money — $18,000/month AWS costs against $12,000/month revenue. Mission: cut waste without breaking the product.';

const year0Questions = [
  // ===== CTO — Cloud Architect (Q1–Q8) =====
  {
    questionId: 'Y1_CTO_Q1', year: 0, role: 'cto', questionNumber: 1, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream\'s EC2 instances average 12% CPU but run 24/7 on m5.xlarge. What is the BEST first action?',
    options: [
      { optionId: 'A', text: 'Terminate all instances immediately', value: 'A' },
      { optionId: 'B', text: 'Right-size to a smaller instance type like t3.medium', value: 'B' },
      { optionId: 'C', text: 'Add more instances for redundancy', value: 'C' },
      { optionId: 'D', text: 'Move everything to Lambda right away', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Right-size to a smaller instance type like t3.medium',
    explanation: 'Right-sizing to match actual utilization is the fastest, safest cost win.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CTO_Q2', year: 0, role: 'cto', questionNumber: 2, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'Your team found 15 unused Elastic IPs and 8 unattached EBS volumes. Rate the decision to delete all of them today.',
    options: [
      { optionId: 'A', text: 'Great — unused resources are pure waste, delete now', value: 'A' },
      { optionId: 'B', text: 'Good — tag and confirm for 3–5 days, then delete', value: 'B' },
      { optionId: 'C', text: 'Risky — some may be needed for planned deployments; full team audit first', value: 'C' },
      { optionId: 'D', text: 'Bad — always keep spare resources for emergencies', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — tag and confirm for 3–5 days, then delete',
    explanation: 'A short confirmation window prevents accidental deletion of resources earmarked for upcoming work.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y1_CTO_Q3', year: 0, role: 'cto', questionNumber: 3, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'Which AWS tool gives you the fastest visual breakdown of where PulseStream\'s $18K/month is being spent?',
    options: [
      { optionId: 'A', text: 'AWS CloudTrail', value: 'A' },
      { optionId: 'B', text: 'Amazon Inspector', value: 'B' },
      { optionId: 'C', text: 'AWS Cost Explorer', value: 'C' },
      { optionId: 'D', text: 'AWS Config', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'AWS Cost Explorer',
    explanation: 'Cost Explorer visualizes spend by service, region, and time period.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CTO_Q4', year: 0, role: 'cto', questionNumber: 4, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'A developer suggests setting up Auto Scaling immediately during the cleanup phase. Rate this suggestion.',
    options: [
      { optionId: 'A', text: 'Excellent — Auto Scaling should always be set up first', value: 'A' },
      { optionId: 'B', text: 'Good — but right-size instances before configuring Auto Scaling', value: 'B' },
      { optionId: 'C', text: 'Neutral — Auto Scaling won\'t help the current cost problem', value: 'C' },
      { optionId: 'D', text: 'Bad — Auto Scaling adds complexity and cost in Year 1', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — but right-size instances before configuring Auto Scaling',
    explanation: 'If you scale the wrong instance type, you amplify waste. Right-size first, then configure scaling.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y1_CTO_Q5', year: 0, role: 'cto', questionNumber: 5, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream uses gp2 EBS volumes. What simple change could reduce storage costs immediately?',
    options: [
      { optionId: 'A', text: 'Switch to io2 volumes for better performance', value: 'A' },
      { optionId: 'B', text: 'Migrate to gp3 volumes — same performance, ~20% cheaper', value: 'B' },
      { optionId: 'C', text: 'Delete all EBS volumes and use S3 instead', value: 'C' },
      { optionId: 'D', text: 'Reduce volume size by 50%', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Migrate to gp3 volumes — same performance, ~20% cheaper',
    explanation: 'gp3 delivers same baseline performance as gp2 at about 20% lower cost. Zero-risk, zero-downtime change.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CTO_Q6', year: 0, role: 'cto', questionNumber: 6, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'The CTO wants to identify which EC2 instances haven\'t been accessed in 30+ days. Which tool helps most?',
    options: [
      { optionId: 'A', text: 'Amazon CloudWatch — check CPU metrics for flatline periods', value: 'A' },
      { optionId: 'B', text: 'AWS CloudTrail — check API call history', value: 'B' },
      { optionId: 'C', text: 'Amazon Macie — scan for sensitive data', value: 'C' },
      { optionId: 'D', text: 'AWS Artifact — review compliance reports', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Amazon CloudWatch — check CPU metrics for flatline periods',
    explanation: 'CloudWatch CPU/network metrics showing zero activity over 30 days = strong signal instance is idle.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CTO_Q7', year: 0, role: 'cto', questionNumber: 7, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream\'s data transfer costs are surprisingly high. What is the most common hidden cause?',
    options: [
      { optionId: 'A', text: 'Too many CloudWatch alarms', value: 'A' },
      { optionId: 'B', text: 'EC2 instances in different AZs transferring data between each other', value: 'B' },
      { optionId: 'C', text: 'S3 bucket policies being too permissive', value: 'C' },
      { optionId: 'D', text: 'Too many IAM roles', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'EC2 instances in different AZs transferring data between each other',
    explanation: 'Cross-AZ data transfer is charged per GB and is frequently overlooked.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CTO_Q8', year: 0, role: 'cto', questionNumber: 8, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'Which AWS service provides automated recommendations to reduce costs, improve security, and increase performance?',
    options: [
      { optionId: 'A', text: 'AWS CloudFormation', value: 'A' },
      { optionId: 'B', text: 'AWS Trusted Advisor', value: 'B' },
      { optionId: 'C', text: 'Amazon GuardDuty', value: 'C' },
      { optionId: 'D', text: 'AWS Service Catalog', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'AWS Trusted Advisor',
    explanation: 'Trusted Advisor scans your account and provides actionable recommendations across cost, security, fault tolerance, and performance.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },

  // ===== CFO — Financial Analyst (Q1–Q8) =====
  {
    questionId: 'Y1_CFO_Q1', year: 0, role: 'cfo', questionNumber: 1, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'Which metric best measures PulseStream\'s AWS cost efficiency in Year 1?',
    options: [
      { optionId: 'A', text: 'Total number of EC2 instances', value: 'A' },
      { optionId: 'B', text: 'AWS cost as a percentage of monthly revenue', value: 'B' },
      { optionId: 'C', text: 'Average S3 storage size', value: 'C' },
      { optionId: 'D', text: 'Number of AWS services in use', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'AWS cost as a percentage of monthly revenue',
    explanation: 'Cost-to-revenue ratio shows whether infrastructure investment is proportionate to business output.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CFO_Q2', year: 0, role: 'cfo', questionNumber: 2, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'The CFO proposes cutting the AWS budget by 60% in Month 1 to stop losses fast. Rate this plan.',
    options: [
      { optionId: 'A', text: 'Excellent — aggressive cuts show financial discipline', value: 'A' },
      { optionId: 'B', text: 'Good — 60% is achievable by cutting all non-production resources', value: 'B' },
      { optionId: 'C', text: 'Risky — unplanned cuts could kill revenue-generating services', value: 'C' },
      { optionId: 'D', text: 'Bad — never cut more than 10% in a single month', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Risky — unplanned cuts could kill revenue-generating services',
    explanation: 'Cutting 60% overnight without auditing risks taking down the platform itself.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y1_CFO_Q3', year: 0, role: 'cfo', questionNumber: 3, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream switches 5 × m5.xlarge On-Demand ($0.192/hr) to 5 × t3.medium On-Demand ($0.0416/hr). Approximate monthly saving?',
    options: [
      { optionId: 'A', text: '$150', value: 'A' },
      { optionId: 'B', text: '$270', value: 'B' },
      { optionId: 'C', text: '$540', value: 'C' },
      { optionId: 'D', text: '$700', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: '$540',
    explanation: 'Savings per instance = ($0.192 − $0.0416) × 720 hrs ≈ $108/month. × 5 instances ≈ $540/month.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CFO_Q4', year: 0, role: 'cfo', questionNumber: 4, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'The CFO sets up an AWS Budget alert at $15,000/month that emails the team. Rate this as a cost control measure.',
    options: [
      { optionId: 'A', text: 'Excellent — real-time alerts are the best cost control tool', value: 'A' },
      { optionId: 'B', text: 'Good — alerts are useful but must be paired with a defined response plan', value: 'B' },
      { optionId: 'C', text: 'Neutral — email alerts are too slow to prevent overspend', value: 'C' },
      { optionId: 'D', text: 'Bad — AWS Budgets is unreliable', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — alerts are useful but must be paired with a defined response plan',
    explanation: 'Alerts alone are passive. Define: who receives it, what they review, what action they take.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y1_CFO_Q5', year: 0, role: 'cfo', questionNumber: 5, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream\'s CFO wants to allocate AWS costs across different product features. Which AWS feature enables this?',
    options: [
      { optionId: 'A', text: 'AWS Organizations', value: 'A' },
      { optionId: 'B', text: 'Cost Allocation Tags', value: 'B' },
      { optionId: 'C', text: 'AWS Budgets', value: 'C' },
      { optionId: 'D', text: 'AWS Config', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Cost Allocation Tags',
    explanation: 'Cost Allocation Tags let you tag resources by feature, team, or environment.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CFO_Q6', year: 0, role: 'cfo', questionNumber: 6, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream\'s CFO wants to forecast next month\'s AWS bill. Which Cost Explorer feature helps most?',
    options: [
      { optionId: 'A', text: 'Reserved Instance recommendations', value: 'A' },
      { optionId: 'B', text: 'Cost forecasting based on historical trends', value: 'B' },
      { optionId: 'C', text: 'AWS Compute Optimizer', value: 'C' },
      { optionId: 'D', text: 'S3 Storage Lens', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Cost forecasting based on historical trends',
    explanation: 'Cost Explorer\'s forecasting uses historical patterns to project future costs.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CFO_Q7', year: 0, role: 'cfo', questionNumber: 7, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'Which AWS pricing model has zero upfront commitment and charges per second of usage?',
    options: [
      { optionId: 'A', text: 'Reserved Instances (1-year no upfront)', value: 'A' },
      { optionId: 'B', text: 'Savings Plans', value: 'B' },
      { optionId: 'C', text: 'On-Demand', value: 'C' },
      { optionId: 'D', text: 'Spot Instances', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'On-Demand',
    explanation: 'On-Demand has no commitment and bills per second. Most flexible, most expensive.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_CFO_Q8', year: 0, role: 'cfo', questionNumber: 8, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream accidentally ran a large EC2 instance for an extra 10 days due to a forgotten test. Can the CFO request a credit from AWS?',
    options: [
      { optionId: 'A', text: 'Yes — AWS always refunds accidental usage', value: 'A' },
      { optionId: 'B', text: 'No — AWS does not provide credits for accidental resource usage', value: 'B' },
      { optionId: 'C', text: 'Yes — only if PulseStream has an Enterprise Support plan', value: 'C' },
      { optionId: 'D', text: 'No — but AWS may offer a courtesy credit for first-time incidents if you contact support', value: 'D' }
    ],
    correctAnswer: 'D',
    correctAnswerText: 'No — but AWS may offer a courtesy credit for first-time incidents if you contact support',
    explanation: 'AWS doesn\'t have automatic refunds, but support teams sometimes offer one-time courtesy credits.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },

  // ===== PM — Growth Lead / Product (Q1–Q8) =====
  {
    questionId: 'Y1_PM_Q1', year: 0, role: 'pm', questionNumber: 1, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'Engineering wants to shut down the video processing pipeline nightly (10 PM–6 AM) to save costs. What should the PM check FIRST?',
    options: [
      { optionId: 'A', text: 'Whether the CTO approves the shutdown', value: 'A' },
      { optionId: 'B', text: 'If any customers actively upload or process videos overnight', value: 'B' },
      { optionId: 'C', text: 'What the AWS pricing difference is between peak and off-peak hours', value: 'C' },
      { optionId: 'D', text: 'Whether the board needs to approve service changes', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'If any customers actively upload or process videos overnight',
    explanation: 'Customer usage data must drive this decision. Assumptions without data can break SLAs.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_PM_Q2', year: 0, role: 'pm', questionNumber: 2, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: '40% of AWS spend supports a feature only 5% of users actively use. A PM proposes removing it immediately. Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — obvious ROI decision, cut it now', value: 'A' },
      { optionId: 'B', text: 'Good — but first check if those 5% are high-value paying customers', value: 'B' },
      { optionId: 'C', text: 'Neutral — need a full product review before acting', value: 'C' },
      { optionId: 'D', text: 'Bad — removing features always causes churn', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — but first check if those 5% are high-value paying customers',
    explanation: '5% of users might be your enterprise customers driving 60% of revenue. Always segment by value.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y1_PM_Q3', year: 0, role: 'pm', questionNumber: 3, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'A PM proposes freezing all new feature development in Year 1 to focus entirely on cost cleanup. Rate this call.',
    options: [
      { optionId: 'A', text: 'Great — cost discipline must come before growth', value: 'A' },
      { optionId: 'B', text: 'Good — a 4–6 week freeze is reasonable, but set a clear end date', value: 'B' },
      { optionId: 'C', text: 'Risky — a long freeze risks losing competitive ground and team morale', value: 'C' },
      { optionId: 'D', text: 'Bad — features always take priority over infrastructure', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — a 4–6 week freeze is reasonable, but set a clear end date',
    explanation: 'A short, time-boxed freeze is defensible. Open-ended freeze damages roadmap and morale.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y1_PM_Q4', year: 0, role: 'pm', questionNumber: 4, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'After the Year 1 cleanup, AWS costs drop to $11K/month and revenue is $12K. What should the PM prioritize next?',
    options: [
      { optionId: 'A', text: 'Immediately launch 3 new features to accelerate growth', value: 'A' },
      { optionId: 'B', text: 'Stabilize the current product and grow the user base before adding complexity', value: 'B' },
      { optionId: 'C', text: 'Cut AWS costs further to $8K regardless of impact', value: 'C' },
      { optionId: 'D', text: 'Rebuild the architecture from scratch with more engineers', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Stabilize the current product and grow the user base before adding complexity',
    explanation: 'At near break-even, reliable revenue growth is the priority, not feature risk.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_PM_Q5', year: 0, role: 'pm', questionNumber: 5, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream has 3 product features. The PM needs to decide which to keep, defer, and cut during Year 1 constraints. What framework fits best?',
    options: [
      { optionId: 'A', text: 'SWOT Analysis', value: 'A' },
      { optionId: 'B', text: 'MoSCoW Method (Must have, Should have, Could have, Won\'t have)', value: 'B' },
      { optionId: 'C', text: 'A/B Testing', value: 'C' },
      { optionId: 'D', text: 'Net Promoter Score', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'MoSCoW Method (Must have, Should have, Could have, Won\'t have)',
    explanation: 'MoSCoW forces explicit decisions about what\'s essential vs what can wait.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_PM_Q6', year: 0, role: 'pm', questionNumber: 6, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream\'s NPS score is 42. After the Year 1 cleanup it drops to 35. What should the PM investigate first?',
    options: [
      { optionId: 'A', text: 'Whether AWS pricing changed', value: 'A' },
      { optionId: 'B', text: 'If the cleanup caused any performance degradation customers noticed', value: 'B' },
      { optionId: 'C', text: 'Whether competitors launched new features', value: 'C' },
      { optionId: 'D', text: 'If the NPS survey methodology changed', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'If the cleanup caused any performance degradation customers noticed',
    explanation: 'Post-cleanup NPS drop most likely signals customers felt a performance or reliability impact.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_PM_Q7', year: 0, role: 'pm', questionNumber: 7, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'The PM is asked to define a success metric for Year 1. Which metric best reflects the year\'s goal?',
    options: [
      { optionId: 'A', text: 'Number of new features shipped', value: 'A' },
      { optionId: 'B', text: 'Monthly AWS cost as a % of revenue, targeting below 80%', value: 'B' },
      { optionId: 'C', text: 'Number of new user sign-ups', value: 'C' },
      { optionId: 'D', text: 'Average daily active users', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Monthly AWS cost as a % of revenue, targeting below 80%',
    explanation: 'Year 1 is a cost cleanup year. Primary success metric should measure whether the bleeding has stopped.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y1_PM_Q8', year: 0, role: 'pm', questionNumber: 8, type: 'mcq',
    scenario: YEAR1_SCENARIO,
    question: 'PulseStream\'s PM wants to reduce customer support tickets during Year 1. Which initiative has the highest ROI?',
    options: [
      { optionId: 'A', text: 'Hire 2 more support agents', value: 'A' },
      { optionId: 'B', text: 'Build a self-service FAQ and in-app help documentation for the top 10 reported issues', value: 'B' },
      { optionId: 'C', text: 'Launch a community forum', value: 'C' },
      { optionId: 'D', text: 'Offer all customers a dedicated account manager', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Build a self-service FAQ and in-app help documentation for the top 10 reported issues',
    explanation: 'Addressing top 10 issues through self-service documentation typically deflects 30–50% of tickets.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  }
];

async function seedYear1Questions() {
  try {
    await Question.deleteMany({ year: 0 });
    const result = await Question.insertMany(year0Questions);
    console.log(`✓ Inserted ${result.length} Year 1 (Round 1) questions`);
    return result;
  } catch (err) {
    console.error('Error seeding Year 1:', err.message);
    throw err;
  }
}

module.exports = { seedYear1Questions, year0Questions };
