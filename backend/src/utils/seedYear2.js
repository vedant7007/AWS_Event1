const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('../models/Question');

const SCENARIO = 'PulseStream has stabilized at 200 concurrent users with predictable daily traffic. AWS is offering 1-year RIs at 40% discount. How much to commit?';

const year1Questions = [
  // ===== CTO — Cloud Architect (Q1–Q8) =====
  {
    questionId: 'Y2_CTO_Q1', year: 1, role: 'cto', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream\'s core processing fleet has predictable load. Which EC2 purchase model fits best?',
    options: [
      { optionId: 'A', text: 'All Spot Instances for maximum savings', value: 'A' },
      { optionId: 'B', text: 'All On-Demand for maximum flexibility', value: 'B' },
      { optionId: 'C', text: '1-year Reserved Instances for the baseline, On-Demand for spikes', value: 'C' },
      { optionId: 'D', text: '3-year Reserved Instances for maximum discount', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: '1-year Reserved Instances for the baseline, On-Demand for spikes',
    explanation: 'Mixed model is best practice: RIs for baseline, On-Demand for variable load.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CTO_Q2', year: 1, role: 'cto', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'What is the key advantage of Convertible Reserved Instances over Standard Reserved Instances?',
    options: [
      { optionId: 'A', text: 'They are always cheaper', value: 'A' },
      { optionId: 'B', text: 'They can be exchanged for a different instance family if your needs change', value: 'B' },
      { optionId: 'C', text: 'They have no upfront payment option', value: 'C' },
      { optionId: 'D', text: 'They come with a 3-year term only', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'They can be exchanged for a different instance family if your needs change',
    explanation: 'Convertible RIs let you swap to a different instance family or size.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CTO_Q3', year: 1, role: 'cto', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream signs RI commitments and then a new GPU-based EC2 family launches that would improve performance at lower cost. What should the CTO do?',
    options: [
      { optionId: 'A', text: 'Break the RI commitment immediately', value: 'A' },
      { optionId: 'B', text: 'Convert to Convertible RIs and exchange them for the new instance family', value: 'B' },
      { optionId: 'C', text: 'Continue with the current RIs until they expire', value: 'C' },
      { optionId: 'D', text: 'Buy additional On-Demand GPU instances on top', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Convert to Convertible RIs and exchange them for the new instance family',
    explanation: 'Convertible RIs were designed exactly for this use case.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CTO_Q4', year: 1, role: 'cto', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream commits 80% of its fleet to 3-year Standard RIs to maximize discounts. Rate this commitment level.',
    options: [
      { optionId: 'A', text: 'Excellent — 3-year RIs give the deepest discount', value: 'A' },
      { optionId: 'B', text: 'Good — 80% RI coverage is industry best practice', value: 'B' },
      { optionId: 'C', text: 'Risky — a 3-year lock-in on 80% of the fleet is too inflexible for a young startup', value: 'C' },
      { optionId: 'D', text: 'Bad — never buy Reserved Instances', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Risky — a 3-year lock-in on 80% of the fleet is too inflexible for a young startup',
    explanation: 'For a startup still finding its architecture, 3-year RIs on 80% is over-committed.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y2_CTO_Q5', year: 1, role: 'cto', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'What minimum utilization percentage makes a 1-year Reserved Instance financially worthwhile compared to On-Demand?',
    options: [
      { optionId: 'A', text: '25%', value: 'A' },
      { optionId: 'B', text: '40%', value: 'B' },
      { optionId: 'C', text: '55%', value: 'C' },
      { optionId: 'D', text: '80%', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: '55%',
    explanation: '1-year RI with ~40% discount breaks even vs On-Demand at around 55–60% utilization.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CTO_Q6', year: 1, role: 'cto', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream\'s CTO proposes a 70% RI, 20% On-Demand, 10% Spot fleet strategy. Rate this architecture.',
    options: [
      { optionId: 'A', text: 'Excellent — this is a well-balanced fleet strategy', value: 'A' },
      { optionId: 'B', text: 'Good — solid approach, though the exact split depends on workload types', value: 'B' },
      { optionId: 'C', text: 'Risky — too much RI commitment for a startup at this stage', value: 'C' },
      { optionId: 'D', text: 'Bad — Spot Instances are too unreliable for production', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — this is a well-balanced fleet strategy',
    explanation: 'This is the recognized AWS best-practice fleet mix.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y2_CTO_Q7', year: 1, role: 'cto', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream\'s CTO wants to see RI utilization reports. Where do they find this in AWS?',
    options: [
      { optionId: 'A', text: 'AWS CloudTrail', value: 'A' },
      { optionId: 'B', text: 'AWS Cost Explorer — Reserved Instance Utilization report', value: 'B' },
      { optionId: 'C', text: 'AWS Config', value: 'C' },
      { optionId: 'D', text: 'Amazon CloudWatch', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'AWS Cost Explorer — Reserved Instance Utilization report',
    explanation: 'Cost Explorer has a dedicated RI Utilization report.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CTO_Q8', year: 1, role: 'cto', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'Compute Optimizer recommends changing 6 instances from m5.large to t3.medium. Before acting, what should be verified?',
    options: [
      { optionId: 'A', text: 'Whether the instances are tagged correctly', value: 'A' },
      { optionId: 'B', text: 'That the t3.medium can handle peak load, not just average load', value: 'B' },
      { optionId: 'C', text: 'Whether the instances are in the right AWS Region', value: 'C' },
      { optionId: 'D', text: 'That the change won\'t affect the billing cycle', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'That the t3.medium can handle peak load, not just average load',
    explanation: 'Compute Optimizer uses average metrics. Always validate against peak utilization.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },

  // ===== CFO — Financial Analyst (Q1–Q8) =====
  {
    questionId: 'Y2_CFO_Q1', year: 1, role: 'cfo', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'On-Demand price for m5.large is $0.096/hr. 1-year No-Upfront RI is $0.060/hr. Monthly saving for 10 instances running 24/7?',
    options: [
      { optionId: 'A', text: '$180', value: 'A' },
      { optionId: 'B', text: '$259', value: 'B' },
      { optionId: 'C', text: '$360', value: 'C' },
      { optionId: 'D', text: '$432', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: '$259',
    explanation: 'Hourly saving = $0.036. × 720 hrs × 10 instances = $259.20/month.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CFO_Q2', year: 1, role: 'cfo', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'Which line items should the CFO split into "committed" vs "variable" cost?',
    options: [
      { optionId: 'A', text: 'Committed: EC2 RIs, Support plan / Variable: On-Demand, data transfer, S3 storage', value: 'A' },
      { optionId: 'B', text: 'Committed: S3, Lambda / Variable: EC2, RDS', value: 'B' },
      { optionId: 'C', text: 'Committed: All AWS costs / Variable: Only support plan', value: 'C' },
      { optionId: 'D', text: 'Committed: Data transfer / Variable: Compute', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Committed: EC2 RIs, Support plan / Variable: On-Demand, data transfer, S3 storage',
    explanation: 'RI and support costs are fixed. On-Demand, data transfer, storage are variable.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CFO_Q3', year: 1, role: 'cfo', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream buys 10 RIs but only uses 7 on average. What is the cost of 1 month of unused RI capacity at $0.060/hr per instance?',
    options: [
      { optionId: 'A', text: '$64.80', value: 'A' },
      { optionId: 'B', text: '$129.60', value: 'B' },
      { optionId: 'C', text: '$194.40', value: 'C' },
      { optionId: 'D', text: '$259.20', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: '$129.60',
    explanation: '3 unused × $0.060/hr × 720 hours = $129.60/month wasted.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CFO_Q4', year: 1, role: 'cfo', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'The CFO is evaluating RIs for the RDS database. It runs 24/7. What should the CFO check first?',
    options: [
      { optionId: 'A', text: 'Whether RDS supports Reserved Instances (it does)', value: 'A' },
      { optionId: 'B', text: 'Whether the DB instance type is likely to stay the same for 12 months', value: 'B' },
      { optionId: 'C', text: 'How many read replicas exist', value: 'C' },
      { optionId: 'D', text: 'Whether Multi-AZ is enabled', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Whether the DB instance type is likely to stay the same for 12 months',
    explanation: 'If a DB right-sizing or engine upgrade is planned, commit after those changes.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CFO_Q5', year: 1, role: 'cfo', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'Year 2 budget is $12,000/month. Actual Month 1 spend is $13,200. By what percentage did spend exceed budget?',
    options: [
      { optionId: 'A', text: '8%', value: 'A' },
      { optionId: 'B', text: '10%', value: 'B' },
      { optionId: 'C', text: '12%', value: 'C' },
      { optionId: 'D', text: '15%', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: '10%',
    explanation: '($13,200 − $12,000) / $12,000 = 10% over budget.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CFO_Q6', year: 1, role: 'cfo', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'RI coverage is 30% and the CFO wants to raise it to 70%. Rate this goal.',
    options: [
      { optionId: 'A', text: 'Excellent — always maximize RI coverage', value: 'A' },
      { optionId: 'B', text: 'Good — a reasonable target if utilization data supports it', value: 'B' },
      { optionId: 'C', text: 'Risky — jumping from 30% to 70% too fast risks over-commitment', value: 'C' },
      { optionId: 'D', text: 'Bad — 30% is the right level for a startup', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — a reasonable target if utilization data supports it',
    explanation: '70% is solid benchmark, but increase incrementally and validate utilization at each step.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y2_CFO_Q7', year: 1, role: 'cfo', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'What does the Cost and Usage Report (CUR) contain that Cost Explorer doesn\'t?',
    options: [
      { optionId: 'A', text: 'A graphical dashboard of spend trends', value: 'A' },
      { optionId: 'B', text: 'Line-item billing data at the resource level for every hour — ideal for custom analysis', value: 'B' },
      { optionId: 'C', text: 'Automated RI purchase recommendations', value: 'C' },
      { optionId: 'D', text: 'Pre-built executive summaries', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Line-item billing data at the resource level for every hour — ideal for custom analysis',
    explanation: 'CUR is the most granular AWS billing artifact — hourly, resource-level data.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_CFO_Q8', year: 1, role: 'cfo', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'Year 2 ends with AWS costs at $10,500/month and revenue at $16,000/month. Rate PulseStream\'s financial health.',
    options: [
      { optionId: 'A', text: 'Excellent — positive margin and improving trajectory', value: 'A' },
      { optionId: 'B', text: 'Good — profitable but cost-to-revenue ratio of 66% should improve further', value: 'B' },
      { optionId: 'C', text: 'Neutral — margins are too thin to celebrate', value: 'C' },
      { optionId: 'D', text: 'Bad — $10,500 AWS spend is still too high', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — positive margin and improving trajectory',
    explanation: 'Moving from -$6K monthly loss to +$5.5K monthly profit in 2 years is strong progress.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },

  // ===== PM — Growth Lead / Product (Q1–Q8) =====
  {
    questionId: 'Y2_PM_Q1', year: 1, role: 'pm', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'Engineering needs 6 months of stable capacity for a new AI feature. CFO wants flexibility to cut if the feature fails. How does the PM resolve this?',
    options: [
      { optionId: 'A', text: 'Side with engineering — product needs come first', value: 'A' },
      { optionId: 'B', text: 'Side with CFO — financial flexibility always wins', value: 'B' },
      { optionId: 'C', text: 'Propose Convertible RIs — commitment with flexibility to change instance types', value: 'C' },
      { optionId: 'D', text: 'Delay the feature until Year 3', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Propose Convertible RIs — commitment with flexibility to change instance types',
    explanation: 'Convertible RIs give stable capacity while preserving ability to exchange instance types.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_PM_Q2', year: 1, role: 'pm', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream is planning Southeast Asia expansion in 6 months. Rate the decision to sign 1-year RIs in us-east-1 right now.',
    options: [
      { optionId: 'A', text: 'Great — lock in savings now, expansion is separate', value: 'A' },
      { optionId: 'B', text: 'Good — commit 50% in us-east-1 while leaving room for SEA', value: 'B' },
      { optionId: 'C', text: 'Risky — expansion may significantly shift your traffic and capacity mix', value: 'C' },
      { optionId: 'D', text: 'Bad — never buy RIs when expansion is planned', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Risky — expansion may significantly shift your traffic and capacity mix',
    explanation: 'Regional RIs are locked to their region. If SEA shifts load, us-east-1 RIs become stranded.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y2_PM_Q3', year: 1, role: 'pm', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'A customer wants a written SLA guaranteeing 99.9% uptime. Does buying Reserved Instances help deliver this?',
    options: [
      { optionId: 'A', text: 'Yes — RIs reserve capacity and guarantee uptime', value: 'A' },
      { optionId: 'B', text: 'No — RIs are a billing model, not an uptime guarantee', value: 'B' },
      { optionId: 'C', text: 'Yes — AWS gives SLA credits only to RI customers', value: 'C' },
      { optionId: 'D', text: 'No — only Dedicated Hosts guarantee uptime', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'No — RIs are a billing model, not an uptime guarantee',
    explanation: 'RIs are purely a pricing mechanism. Uptime comes from Multi-AZ, Auto Scaling, health checks.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_PM_Q4', year: 1, role: 'pm', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM must decide: invest in a reliability feature (reduces downtime) or a growth feature (attracts new users). In Year 2, which takes priority?',
    options: [
      { optionId: 'A', text: 'Always the growth feature', value: 'A' },
      { optionId: 'B', text: 'Always the reliability feature', value: 'B' },
      { optionId: 'C', text: 'Depends on current churn rate and customer satisfaction scores', value: 'C' },
      { optionId: 'D', text: 'Depends on which feature engineering can build faster', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Depends on current churn rate and customer satisfaction scores',
    explanation: 'Data drives the answer: if churn is high → reliability. If NPS is strong → growth.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_PM_Q5', year: 1, role: 'pm', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM proposes locking the product roadmap for 12 months to give engineering stability. Rate this decision.',
    options: [
      { optionId: 'A', text: 'Excellent — roadmap stability maximizes engineering throughput', value: 'A' },
      { optionId: 'B', text: 'Good — stability is valuable but 12 months is too long in a competitive market', value: 'B' },
      { optionId: 'C', text: 'Risky — market conditions change; a fully locked roadmap can\'t respond', value: 'C' },
      { optionId: 'D', text: 'Bad — roadmaps should be re-prioritized every sprint', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — stability is valuable but 12 months is too long in a competitive market',
    explanation: '6-month commitments with quarterly reviews balance stability with market responsiveness.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y2_PM_Q6', year: 1, role: 'pm', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'Feature A (high demand, 3 months) vs Feature B (low demand, 1 week, removes key pain point). Which should PM prioritize?',
    options: [
      { optionId: 'A', text: 'Feature A — higher user demand always wins', value: 'A' },
      { optionId: 'B', text: 'Feature B — quick wins build momentum', value: 'B' },
      { optionId: 'C', text: 'Depends on the pain point\'s impact on churn and revenue', value: 'C' },
      { optionId: 'D', text: 'Always build both simultaneously', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Depends on the pain point\'s impact on churn and revenue',
    explanation: 'If the pain point causes churn, Feature B\'s 1-week investment may generate more value.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_PM_Q7', year: 1, role: 'pm', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: '15 customers request Slack integration. What is the PM\'s next step?',
    options: [
      { optionId: 'A', text: 'Build it immediately — 15 requests is enough validation', value: 'A' },
      { optionId: 'B', text: 'Add it to the backlog and prioritize in next planning cycle', value: 'B' },
      { optionId: 'C', text: 'Interview 5 of the requesting customers to understand the specific workflow need before building', value: 'C' },
      { optionId: 'D', text: 'Reject it — integrations are too complex for Year 2', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Interview 5 of the requesting customers to understand the specific workflow need before building',
    explanation: '15 requests validate demand but not definition. 5 interviews surface the real workflow need.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y2_PM_Q8', year: 1, role: 'pm', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'A/B test after 3 weeks: Version B has 12% higher engagement. What does the PM do?',
    options: [
      { optionId: 'A', text: 'Immediately roll out Version B to all users', value: 'A' },
      { optionId: 'B', text: 'Run the test for 2 more weeks to ensure statistical significance', value: 'B' },
      { optionId: 'C', text: 'Switch all users to Version B and retire Version A', value: 'C' },
      { optionId: 'D', text: 'Run a third version C to continue optimizing', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Run the test for 2 more weeks to ensure statistical significance',
    explanation: '3 weeks may not be enough for statistical significance. Premature rollout = common PM mistake.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  }
];

async function seed() {
  try {
    console.log('🌱 Seeding Year 2 (Round 2)...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const deleted = await Question.deleteMany({ year: 1 });
    console.log(`🗑️  Removed ${deleted.deletedCount} old year-1 questions`);

    const inserted = await Question.insertMany(year1Questions);
    console.log(`✓ Inserted ${inserted.length} Year 2 questions`);

    const byRole = await Question.aggregate([
      { $match: { year: 1 } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log('\n📊 Year 2 Breakdown:');
    byRole.forEach(r => console.log(`   ${r._id.toUpperCase()}: ${r.count}`));

    const total = await Question.countDocuments();
    console.log(`\n   Total questions in DB: ${total}`);
    console.log('✅ Year 2 seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
