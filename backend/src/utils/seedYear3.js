const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('../models/Question');

const SCENARIO = 'A celebrity posts a video processed by PulseStream. Traffic jumps 10× in 20 minutes. Uploads are queuing, the database is struggling.';

const year2Questions = [
  // ===== CTO — Cloud Architect (Q1–Q8) =====
  {
    questionId: 'Y3_CTO_Q1', year: 2, role: 'cto', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'RDS database CPU hits 95% during the spike. What is the FASTEST mitigation with zero downtime?',
    options: [
      { optionId: 'A', text: 'Upgrade the RDS instance type immediately', value: 'A' },
      { optionId: 'B', text: 'Enable Multi-AZ failover', value: 'B' },
      { optionId: 'C', text: 'Add a read replica and redirect read traffic to it', value: 'C' },
      { optionId: 'D', text: 'Increase max_connections in the DB parameter group', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Add a read replica and redirect read traffic to it',
    explanation: 'Read replicas can be created and used within minutes. DB resizes cause a brief outage.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CTO_Q2', year: 2, role: 'cto', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'Which CloudWatch metric should Auto Scaling use to trigger scale-out during a video processing spike?',
    options: [
      { optionId: 'A', text: 'Network packets in', value: 'A' },
      { optionId: 'B', text: 'CPUUtilization > 70% for 2 consecutive minutes', value: 'B' },
      { optionId: 'C', text: 'Memory utilization > 90%', value: 'C' },
      { optionId: 'D', text: 'Disk I/O wait time', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'CPUUtilization > 70% for 2 consecutive minutes',
    explanation: 'CPU is the most direct signal for compute-bound video processing. 2-minute window prevents false triggers.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CTO_Q3', year: 2, role: 'cto', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'CTO decides to use Spot Instances for the auto-scaled worker fleet during the viral spike. Rate this decision.',
    options: [
      { optionId: 'A', text: 'Excellent — Spot Instances are the cheapest way to scale', value: 'A' },
      { optionId: 'B', text: 'Good — cost-effective if the workload is fault-tolerant', value: 'B' },
      { optionId: 'C', text: 'Risky — Spot Instances can be interrupted with 2 minutes notice during a high-demand event', value: 'C' },
      { optionId: 'D', text: 'Bad — Spot Instances should never be used for production', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Risky — Spot Instances can be interrupted with 2 minutes notice during a high-demand event',
    explanation: 'AWS can reclaim Spot during high-demand events. For viral spikes, On-Demand is safer.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y3_CTO_Q4', year: 2, role: 'cto', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'S3 bucket receives 50× normal PUT requests during the spike. What happens?',
    options: [
      { optionId: 'A', text: 'S3 throttles all requests above 1,000 PUT/second per prefix', value: 'A' },
      { optionId: 'B', text: 'S3 performance degrades after 100 concurrent users', value: 'B' },
      { optionId: 'C', text: 'S3 automatically scales without any performance impact', value: 'C' },
      { optionId: 'D', text: 'S3 requires a support request to increase limits', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'S3 throttles all requests above 1,000 PUT/second per prefix',
    explanation: 'S3 has 3,500 PUT and 5,500 GET per second per prefix limit. Above this = 503 errors.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CTO_Q5', year: 2, role: 'cto', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'ALB starts returning 504 Gateway Timeout errors during the spike. Most likely cause?',
    options: [
      { optionId: 'A', text: 'The ALB itself is out of capacity', value: 'A' },
      { optionId: 'B', text: 'Backend EC2 instances are overwhelmed and taking too long to respond', value: 'B' },
      { optionId: 'C', text: 'The S3 bucket is full', value: 'C' },
      { optionId: 'D', text: 'The CloudFront distribution is misconfigured', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Backend EC2 instances are overwhelmed and taking too long to respond',
    explanation: '504 = ALB waiting for backend response that doesn\'t come. EC2 is overwhelmed. ALB itself scales automatically.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CTO_Q6', year: 2, role: 'cto', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream wants to pre-warm capacity before a scheduled product launch. Most reliable approach?',
    options: [
      { optionId: 'A', text: 'Contact AWS support to pre-warm ALB 24 hours before', value: 'A' },
      { optionId: 'B', text: 'Set Auto Scaling minimum capacity higher before the event, then scale back after', value: 'B' },
      { optionId: 'C', text: 'Use Spot Instances with a 500% higher request limit', value: 'C' },
      { optionId: 'D', text: 'Set CloudFront TTL to zero', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Set Auto Scaling minimum capacity higher before the event, then scale back after',
    explanation: 'Raising Auto Scaling minimum ensures baseline capacity is already running.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CTO_Q7', year: 2, role: 'cto', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'Video processing workers need to share job state during scale-out. Which AWS service is BEST?',
    options: [
      { optionId: 'A', text: 'Amazon S3 for all shared state', value: 'A' },
      { optionId: 'B', text: 'Amazon ElastiCache (Redis) for low-latency shared state across workers', value: 'B' },
      { optionId: 'C', text: 'AWS Lambda for stateless processing only', value: 'C' },
      { optionId: 'D', text: 'Amazon DynamoDB with on-demand capacity', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Amazon ElastiCache (Redis) for low-latency shared state across workers',
    explanation: 'ElastiCache Redis provides sub-millisecond shared state access across distributed workers.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CTO_Q8', year: 2, role: 'cto', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'CTO suggests adding a "graceful degradation" mode that serves cached thumbnails when processing is backlogged. Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — graceful degradation protects user experience during overload', value: 'A' },
      { optionId: 'B', text: 'Good — valuable resilience feature; ensure cache refresh works post-recovery', value: 'B' },
      { optionId: 'C', text: 'Neutral — cached thumbnails are too stale to be useful', value: 'C' },
      { optionId: 'D', text: 'Bad — always show real-time data or show nothing', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — graceful degradation protects user experience during overload',
    explanation: 'Serving slightly stale thumbnails is far better than 500 errors. Users notice errors, not thumbnails.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },

  // ===== CFO — Financial Analyst (Q1–Q8) =====
  {
    questionId: 'Y3_CFO_Q1', year: 2, role: 'cfo', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'Viral spike doubles On-Demand EC2 spend, adding $12,000. How should this be classified in the budget?',
    options: [
      { optionId: 'A', text: 'Capital expenditure', value: 'A' },
      { optionId: 'B', text: 'Unplanned operational expenditure — flag and build a contingency budget', value: 'B' },
      { optionId: 'C', text: 'Marketing cost, since it came from viral growth', value: 'C' },
      { optionId: 'D', text: 'Ignore it — one-time events shouldn\'t be budgeted', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Unplanned operational expenditure — flag and build a contingency budget',
    explanation: 'Unexpected infra spend from traffic events is operational cost. Flag it, root-cause it, budget for it.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CFO_Q2', year: 2, role: 'cfo', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'Spike brings 50,000 new sign-ups but costs extra $22,000. Monthly revenue per user is $2. Is it worth it?',
    options: [
      { optionId: 'A', text: 'No — $22K exceeds the immediate revenue', value: 'A' },
      { optionId: 'B', text: 'Yes — if 20% convert to paying users, monthly LTV far exceeds $22K', value: 'B' },
      { optionId: 'C', text: 'Neutral — impossible to determine without churn data', value: 'C' },
      { optionId: 'D', text: 'No — viral growth is never reliable', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Yes — if 20% convert to paying users, monthly LTV far exceeds $22K',
    explanation: '20% of 50K = 10,000 users × $2/month = $20K/month. Payback in just over 1 month.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CFO_Q3', year: 2, role: 'cfo', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'CFO sets a hard AWS limit at $25,000/month and configures Lambda to auto-stop all EC2 if breached. Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — hard caps protect from runaway bills', value: 'A' },
      { optionId: 'B', text: 'Good — alerts are useful, but auto-stopping all instances will take down the product', value: 'B' },
      { optionId: 'C', text: 'Risky — auto-stopping production during a viral moment destroys revenue at peak opportunity', value: 'C' },
      { optionId: 'D', text: 'Bad — never monitor cloud spend', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Risky — auto-stopping production during a viral moment destroys revenue at peak opportunity',
    explanation: 'Auto-stopping all production during a viral moment = taking product offline at peak value.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y3_CFO_Q4', year: 2, role: 'cfo', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'Post-spike, AWS bill is $32,000 vs $20,000 budget. Which report helps CFO identify what drove the overage?',
    options: [
      { optionId: 'A', text: 'AWS Personal Health Dashboard', value: 'A' },
      { optionId: 'B', text: 'AWS Cost and Usage Report filtered by service and date range', value: 'B' },
      { optionId: 'C', text: 'AWS Trusted Advisor cost checks', value: 'C' },
      { optionId: 'D', text: 'Amazon CloudWatch billing dashboard', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'AWS Cost and Usage Report filtered by service and date range',
    explanation: 'CUR provides line-item spend by service, resource, and hour.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CFO_Q5', year: 2, role: 'cfo', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'CFO wants to add a $10,000/month contingency line in the cloud budget after the spike. Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — contingency budgets are standard financial practice', value: 'A' },
      { optionId: 'B', text: 'Good — reasonable buffer for a product with viral potential', value: 'B' },
      { optionId: 'C', text: 'Neutral — contingency budgets encourage wasteful spending', value: 'C' },
      { optionId: 'D', text: 'Bad — budgets should only contain committed costs', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — contingency budgets are standard financial practice',
    explanation: 'Smart financial planning for variable cloud costs. The spike proved the need.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y3_CFO_Q6', year: 2, role: 'cfo', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'Investors ask for "cloud unit economics." Which metrics are MOST relevant?',
    options: [
      { optionId: 'A', text: 'Total EC2 instance count and region', value: 'A' },
      { optionId: 'B', text: 'AWS cost per active user, cost per video processed, and cloud gross margin', value: 'B' },
      { optionId: 'C', text: 'Number of Reserved Instances purchased', value: 'C' },
      { optionId: 'D', text: 'Average CloudWatch alarm count', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'AWS cost per active user, cost per video processed, and cloud gross margin',
    explanation: 'Unit economics tie infrastructure cost to business outputs — what investors actually care about.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CFO_Q7', year: 2, role: 'cfo', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream earns $3 revenue per user, AWS cost is $1.20 per user. Infrastructure gross margin?',
    options: [
      { optionId: 'A', text: '40%', value: 'A' },
      { optionId: 'B', text: '60%', value: 'B' },
      { optionId: 'C', text: '80%', value: 'C' },
      { optionId: 'D', text: '25%', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: '60%',
    explanation: '($3.00 − $1.20) / $3.00 = $1.80 / $3.00 = 60%.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_CFO_Q8', year: 2, role: 'cfo', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'CFO wants to model three cost scenarios for Year 4 (base, optimistic 2×, stress 5×). Best tool?',
    options: [
      { optionId: 'A', text: 'AWS Cost Explorer historical trends only', value: 'A' },
      { optionId: 'B', text: 'A financial model combining CUR data, unit economics, and growth assumptions in a spreadsheet', value: 'B' },
      { optionId: 'C', text: 'AWS Budgets with three separate alerts', value: 'C' },
      { optionId: 'D', text: 'Amazon QuickSight connected to billing data', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'A financial model combining CUR data, unit economics, and growth assumptions in a spreadsheet',
    explanation: 'Scenario modeling requires combining AWS unit costs with business growth assumptions.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },

  // ===== PM — Growth Lead / Product (Q1–Q8) =====
  {
    questionId: 'Y3_PM_Q1', year: 2, role: 'pm', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'During the spike, video uploads are failing. What should the PM do FIRST?',
    options: [
      { optionId: 'A', text: 'Wait for engineering to fix it before saying anything', value: 'A' },
      { optionId: 'B', text: 'Post a status update acknowledging the issue', value: 'B' },
      { optionId: 'C', text: 'Offer all affected users an immediate refund', value: 'C' },
      { optionId: 'D', text: 'Temporarily disable uploads for everyone', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Post a status update acknowledging the issue',
    explanation: 'Proactive, honest communication during incidents builds trust.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_PM_Q2', year: 2, role: 'pm', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'A week after the spike, 60% of new users churned. Most likely product root cause?',
    options: [
      { optionId: 'A', text: 'AWS infrastructure was too expensive', value: 'A' },
      { optionId: 'B', text: 'New users experienced failures or slowness during onboarding and didn\'t return', value: 'B' },
      { optionId: 'C', text: 'The product doesn\'t have enough features', value: 'C' },
      { optionId: 'D', text: 'Competitors ran a counter-marketing campaign', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'New users experienced failures or slowness during onboarding and didn\'t return',
    explanation: 'Post-spike churn almost always traces to poor first experiences.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_PM_Q3', year: 2, role: 'pm', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'Support ticket volume increased 8× during the spike. Fastest way to reduce incoming volume?',
    options: [
      { optionId: 'A', text: 'Hire 5 more support agents immediately', value: 'A' },
      { optionId: 'B', text: 'Publish a detailed status page and FAQ addressing the most common spike-related issues', value: 'B' },
      { optionId: 'C', text: 'Close the support chat during the incident', value: 'C' },
      { optionId: 'D', text: 'Ask customers to wait and try again later', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Publish a detailed status page and FAQ addressing the most common spike-related issues',
    explanation: 'Most tickets during incidents ask the same question. A clear status page deflects the majority.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_PM_Q4', year: 2, role: 'pm', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM wants to create a "Viral Readiness Checklist" for future launch events. Rate this initiative.',
    options: [
      { optionId: 'A', text: 'Excellent — proactive planning for high-traffic events is exactly what PulseStream needs', value: 'A' },
      { optionId: 'B', text: 'Good — useful checklist, needs joint ownership with engineering', value: 'B' },
      { optionId: 'C', text: 'Neutral — checklists don\'t help with truly unexpected events', value: 'C' },
      { optionId: 'D', text: 'Bad — viral events are inherently unpredictable', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — proactive planning for high-traffic events is exactly what PulseStream needs',
    explanation: 'A checklist covering comms templates, scaling thresholds, escalation paths dramatically reduces response time.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  },
  {
    questionId: 'Y3_PM_Q5', year: 2, role: 'pm', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM is analyzing why 60% of spike-era sign-ups churned. Most useful data source?',
    options: [
      { optionId: 'A', text: 'AWS Cost Explorer spend data', value: 'A' },
      { optionId: 'B', text: 'Session recordings and funnel drop-off analytics for new users during the spike period', value: 'B' },
      { optionId: 'C', text: 'Customer support ticket categories', value: 'C' },
      { optionId: 'D', text: 'Marketing campaign attribution data', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Session recordings and funnel drop-off analytics for new users during the spike period',
    explanation: 'Session recordings show exactly where users dropped off — the most direct evidence.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_PM_Q6', year: 2, role: 'pm', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'CEO wants a "Viral Mode" that caps processing speed to manage costs. How should PM frame this to users?',
    options: [
      { optionId: 'A', text: 'Tell users there is a processing speed cap during high demand', value: 'A' },
      { optionId: 'B', text: 'Frame it as "Fair Processing" — ensuring all users get consistent processing time', value: 'B' },
      { optionId: 'C', text: 'Don\'t tell users about the cap', value: 'C' },
      { optionId: 'D', text: 'Tell users the cap is an AWS limitation', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Frame it as "Fair Processing" — ensuring all users get consistent processing time',
    explanation: '"Fair Processing" is honest, user-centric framing. "Speed cap" sounds punitive; "AWS limitation" shifts blame.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_PM_Q7', year: 2, role: 'pm', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'Should the PM send a post-incident email to all 50,000 new sign-ups explaining what happened?',
    options: [
      { optionId: 'A', text: 'Only email users who submitted a support ticket', value: 'A' },
      { optionId: 'B', text: 'Email everyone — transparency with all users builds long-term trust', value: 'B' },
      { optionId: 'C', text: 'Only email paying customers', value: 'C' },
      { optionId: 'D', text: 'Send nothing — emails about incidents remind users of negative experiences', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Email everyone — transparency with all users builds long-term trust',
    explanation: 'A well-crafted post-incident email demonstrates accountability and gives churned users a reason to reconsider.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y3_PM_Q8', year: 2, role: 'pm', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM proposes using the viral spike as a marketing case study: "PulseStream scaled to 10× traffic in under 30 minutes." Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — turn the crisis into a proof point', value: 'A' },
      { optionId: 'B', text: 'Good — powerful if accurate and approved by engineering and legal', value: 'B' },
      { optionId: 'C', text: 'Risky — if failures also happened, the case study may be challenged publicly', value: 'C' },
      { optionId: 'D', text: 'Bad — never publicize operational details', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — powerful if accurate and approved by engineering and legal',
    explanation: 'Must be accurate and balanced. If failures also occurred, acknowledge them or the story backfires.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 5, incorrect: -5 }
  }
];

async function seed() {
  try {
    console.log('🌱 Seeding Year 3 (Round 3)...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected');
    const deleted = await Question.deleteMany({ year: 2 });
    console.log(`🗑️  Removed ${deleted.deletedCount} old year-2 questions`);
    const inserted = await Question.insertMany(year2Questions);
    console.log(`✓ Inserted ${inserted.length} Year 3 questions`);
    const total = await Question.countDocuments();
    console.log(`   Total in DB: ${total}`);
    console.log('✅ Year 3 done!');
    process.exit(0);
  } catch (err) { console.error('❌', err.message); process.exit(1); }
}
seed();
