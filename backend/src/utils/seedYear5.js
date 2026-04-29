const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('../models/Question');

const SCENARIO = 'PulseStream is profitable and planning global expansion. A well-funded competitor just launched. Investors are asking about IPO readiness.';

const year4Questions = [
  // ===== CTO — Cloud Architect (Q1–Q8) =====
  {
    questionId: 'Y5_CTO_Q1', year: 4, role: 'cto', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream serves 10M monthly video views globally. Best delivery architecture for international latency?',
    options: [
      { optionId: 'A', text: 'Serve all video directly from S3 in us-east-1', value: 'A' },
      { optionId: 'B', text: 'Deploy EC2 instances in every country', value: 'B' },
      { optionId: 'C', text: 'Use Amazon CloudFront with global edge locations', value: 'C' },
      { optionId: 'D', text: 'Use Direct Connect to all major markets', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Use Amazon CloudFront with global edge locations',
    explanation: 'CloudFront has 400+ global edge locations and caches video content close to users.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CTO_Q2', year: 4, role: 'cto', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'Which framework provides the most structured evaluation for enterprise production-readiness?',
    options: [
      { optionId: 'A', text: 'AWS Free Tier compliance check', value: 'A' },
      { optionId: 'B', text: 'AWS Well-Architected Framework review across all 5 pillars', value: 'B' },
      { optionId: 'C', text: 'AWS Trusted Advisor cost checks only', value: 'C' },
      { optionId: 'D', text: 'CloudFormation template validation', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'AWS Well-Architected Framework review across all 5 pillars',
    explanation: 'Well-Architected covers Operational Excellence, Security, Reliability, Performance, Cost Optimization.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CTO_Q3', year: 4, role: 'cto', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream needs to support 50,000 concurrent API connections from enterprise integrations. Which service?',
    options: [
      { optionId: 'A', text: 'Amazon EC2 with custom load balancer code', value: 'A' },
      { optionId: 'B', text: 'Amazon API Gateway with usage plans and throttling', value: 'B' },
      { optionId: 'C', text: 'AWS Lambda alone', value: 'C' },
      { optionId: 'D', text: 'Amazon SQS for all API connections', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Amazon API Gateway with usage plans and throttling',
    explanation: 'API Gateway is built for high-concurrency API management with throttling, auth, and auto-scaling.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CTO_Q4', year: 4, role: 'cto', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'What does SOC 2 "Type II" mean compared to Type I?',
    options: [
      { optionId: 'A', text: 'Type II is cheaper and faster', value: 'A' },
      { optionId: 'B', text: 'Type II covers more security domains', value: 'B' },
      { optionId: 'C', text: 'Type II demonstrates controls operated effectively over a period of time (6–12 months)', value: 'C' },
      { optionId: 'D', text: 'Type II is optional; Type I is mandatory', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Type II demonstrates controls operated effectively over a period of time (6–12 months)',
    explanation: 'Type I = point-in-time. Type II = sustained effectiveness over time. Enterprise customers require Type II.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CTO_Q5', year: 4, role: 'cto', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'Real-time video processing with under 200ms latency. Most critical architecture component?',
    options: [
      { optionId: 'A', text: 'Choosing the right S3 storage class', value: 'A' },
      { optionId: 'B', text: 'Placing compute in the same region and AZ as the data to minimize latency', value: 'B' },
      { optionId: 'C', text: 'Using the largest available EC2 instance type', value: 'C' },
      { optionId: 'D', text: 'Maximizing CloudFront cache TTL', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Placing compute in the same region and AZ as the data to minimize latency',
    explanation: 'For sub-200ms, network hops are the enemy. Same region + same AZ eliminates cross-region latency.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CTO_Q6', year: 4, role: 'cto', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'CTO proposes adopting Infrastructure as Code (CloudFormation/Terraform) for all new deployments. Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — IaC is essential for consistent, auditable, repeatable infrastructure at scale', value: 'A' },
      { optionId: 'B', text: 'Good — choose Terraform for multi-cloud or CloudFormation for AWS-native', value: 'B' },
      { optionId: 'C', text: 'Neutral — IaC adds complexity for small teams', value: 'C' },
      { optionId: 'D', text: 'Bad — manual deployments give more control', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — IaC is essential for consistent, auditable, repeatable infrastructure at scale',
    explanation: 'IaC is non-negotiable for enterprise-grade operations. Enables consistency, version control, disaster recovery.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CTO_Q7', year: 4, role: 'cto', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'Architecture review reveals a single 5TB RDS instance handling all database load. What should CTO prioritize?',
    options: [
      { optionId: 'A', text: 'Upgrade to the largest RDS instance type', value: 'A' },
      { optionId: 'B', text: 'Implement database sharding or read replicas, and evaluate Aurora for auto-scaling storage', value: 'B' },
      { optionId: 'C', text: 'Move all data to S3 and use Athena for queries', value: 'C' },
      { optionId: 'D', text: 'Add more application servers to reduce DB connections', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Implement database sharding or read replicas, and evaluate Aurora for auto-scaling storage',
    explanation: 'Single large RDS = scaling bottleneck. Read replicas and Aurora are proven patterns for growth.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CTO_Q8', year: 4, role: 'cto', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'CTO wants entire infrastructure deployed as Terraform before IPO. Rate as IPO readiness requirement.',
    options: [
      { optionId: 'A', text: 'Excellent — IaC is a key signal of engineering maturity to investors and auditors', value: 'A' },
      { optionId: 'B', text: 'Good — important but secondary to financial controls', value: 'B' },
      { optionId: 'C', text: 'Neutral — investors don\'t care about infra tooling', value: 'C' },
      { optionId: 'D', text: 'Bad — IPO prep should focus only on financial audits', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — IaC is a key signal of engineering maturity to investors and auditors',
    explanation: 'IPO readiness includes demonstrating operational maturity. IaC enables consistency, DR, and audit trails.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },

  // ===== CFO — Financial Analyst (Q1–Q8) =====
  {
    questionId: 'Y5_CFO_Q1', year: 4, role: 'cfo', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'AWS offers $2M/year EDP with 15% discount. Most important condition before signing?',
    options: [
      { optionId: 'A', text: 'CEO is satisfied with AWS support quality', value: 'A' },
      { optionId: 'B', text: 'Projected AWS spend is at or above $2M/year', value: 'B' },
      { optionId: 'C', text: 'More than 100 employees', value: 'C' },
      { optionId: 'D', text: 'Using at least 10 different AWS services', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Projected AWS spend is at or above $2M/year',
    explanation: 'EDP is a minimum spend commitment. If you commit $2M but spend $1.3M, you pay the $700K gap.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CFO_Q2', year: 4, role: 'cfo', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'AWS cost is $85K/month with 8,500 paying users. Rate this unit economics profile.',
    options: [
      { optionId: 'A', text: 'Excellent — $10/user/month is industry-leading', value: 'A' },
      { optionId: 'B', text: 'Good — depends on ARPU; at $50/month ARPU this is 80% gross margin', value: 'B' },
      { optionId: 'C', text: 'Concerning — $10/user/month is too high', value: 'C' },
      { optionId: 'D', text: 'Cannot be assessed without knowing EC2 instance count', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — depends on ARPU; at $50/month ARPU this is 80% gross margin',
    explanation: '$10/user is only meaningful alongside ARPU. At $50 = 20% infra cost (great). At $12 = 83% (terrible).',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CFO_Q3', year: 4, role: 'cfo', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'Most critical financial control for IPO readiness related to cloud spend?',
    options: [
      { optionId: 'A', text: 'Minimizing total AWS spend', value: 'A' },
      { optionId: 'B', text: 'Implementing robust financial controls with auditable cost allocation, forecasting, and variance reporting', value: 'B' },
      { optionId: 'C', text: 'Switching to a cheaper cloud provider', value: 'C' },
      { optionId: 'D', text: 'Eliminating all RI commitments before IPO', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Implementing robust financial controls with auditable cost allocation, forecasting, and variance reporting',
    explanation: 'Auditors want: consistent cost allocation, documented forecasting, variance reporting — not just a low bill.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CFO_Q4', year: 4, role: 'cfo', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: '3 enterprise customers want custom SLAs, custom pricing, custom data residency. Financial risk?',
    options: [
      { optionId: 'A', text: 'No risk', value: 'A' },
      { optionId: 'B', text: 'Revenue recognition complexity and hidden operational costs reducing effective margin', value: 'B' },
      { optionId: 'C', text: 'Reduced AWS costs', value: 'C' },
      { optionId: 'D', text: 'Increased AWS volume discounts', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Revenue recognition complexity and hidden operational costs reducing effective margin',
    explanation: 'Custom deals create complexity in SLA liabilities, support costs, and revenue recognition.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CFO_Q5', year: 4, role: 'cfo', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'CFO presents "Rule of 40" to investors: 35% revenue growth + 8% FCF margin = 43. Rate this score.',
    options: [
      { optionId: 'A', text: 'Excellent — 43 is strong for a SaaS company at this stage', value: 'A' },
      { optionId: 'B', text: 'Good — above 40 threshold, competitive with public SaaS comps', value: 'B' },
      { optionId: 'C', text: 'Neutral — only applies to public companies', value: 'C' },
      { optionId: 'D', text: 'Bad — FCF margin of 8% is too low', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — 43 is strong for a SaaS company at this stage',
    explanation: 'Rule of 40 = growth + profit margin. Scores above 40 are considered healthy for SaaS.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CFO_Q6', year: 4, role: 'cfo', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'CFO asked to model financial impact of a 6-month AWS regional outage. What does this exercise demonstrate?',
    options: [
      { optionId: 'A', text: 'That AWS outages are the CFO\'s fault', value: 'A' },
      { optionId: 'B', text: 'Financial dependency on AWS and the value of multi-region investment', value: 'B' },
      { optionId: 'C', text: 'That insurance is unnecessary', value: 'C' },
      { optionId: 'D', text: 'That PulseStream should move on-premises', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Financial dependency on AWS and the value of multi-region investment',
    explanation: 'Quantifies business dependency on AWS and supports ROI case for multi-region investment.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CFO_Q7', year: 4, role: 'cfo', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'Board wants a 3-year cloud cost forecast. Most critical inputs?',
    options: [
      { optionId: 'A', text: 'Current AWS bill only', value: 'A' },
      { optionId: 'B', text: 'Historical AWS unit costs combined with user growth projections and planned feature changes', value: 'B' },
      { optionId: 'C', text: 'Number of AWS services in use', value: 'C' },
      { optionId: 'D', text: 'Current RI contract expiry dates', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Historical AWS unit costs combined with user growth projections and planned feature changes',
    explanation: 'Unit costs × volume projections gives a bottom-up, defensible forecast.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_CFO_Q8', year: 4, role: 'cfo', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'IPO auditors want "financial controls over cloud spend." Most comprehensive practices?',
    options: [
      { optionId: 'A', text: 'AWS Budgets alerts only', value: 'A' },
      { optionId: 'B', text: 'Cost Allocation Tags + monthly cost review + documented approval workflow + CUR-based board reporting', value: 'B' },
      { optionId: 'C', text: 'Monthly CEO review of the AWS bill', value: 'C' },
      { optionId: 'D', text: 'RI purchase approvals only', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Cost Allocation Tags + monthly cost review + documented approval workflow + CUR-based board reporting',
    explanation: 'Auditors want systematic controls: tagging, governance, review cadence, and reporting infrastructure.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },

  // ===== PM — Growth Lead / Product (Q1–Q8) =====
  {
    questionId: 'Y5_PM_Q1', year: 4, role: 'pm', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'Launching in the EU. Which product change is legally REQUIRED under GDPR?',
    options: [
      { optionId: 'A', text: 'Adding dark mode to the UI', value: 'A' },
      { optionId: 'B', text: 'Translating the app into all EU languages', value: 'B' },
      { optionId: 'C', text: 'Implementing consent mechanisms for data collection and a right-to-erasure process', value: 'C' },
      { optionId: 'D', text: 'Offering a 30-day free trial for EU customers', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Implementing consent mechanisms for data collection and a right-to-erasure process',
    explanation: 'GDPR mandates explicit consent and right to request deletion. Non-negotiable.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_PM_Q2', year: 4, role: 'pm', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'Hyperscaler offers PulseStream\'s top 3 customers 40% discount to switch. PM proposes matching price for only those 3. Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — retain key customers at all costs', value: 'A' },
      { optionId: 'B', text: 'Good — targeted retention discount is better than losing them', value: 'B' },
      { optionId: 'C', text: 'Risky — sets a precedent and may not address the real reason they\'re considering switching', value: 'C' },
      { optionId: 'D', text: 'Bad — never discount for any reason', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Risky — sets a precedent and may not address the real reason they\'re considering switching',
    explanation: 'Price matching buys time but doesn\'t solve the root problem. Understand the real objection first.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_PM_Q3', year: 4, role: 'pm', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'Which product milestone has the HIGHEST investor importance for IPO readiness?',
    options: [
      { optionId: 'A', text: 'Launching a mobile app', value: 'A' },
      { optionId: 'B', text: 'Achieving consistent NRR above 110%', value: 'B' },
      { optionId: 'C', text: 'Shipping 20 new features in 12 months', value: 'C' },
      { optionId: 'D', text: 'Reaching 10,000 registered users', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Achieving consistent NRR above 110%',
    explanation: 'NRR above 110% = existing customers expanding spend. Single most important SaaS metric for investors.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_PM_Q4', year: 4, role: 'pm', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM proposes building a self-serve enterprise tier (sign up without talking to sales). Rate for Year 5.',
    options: [
      { optionId: 'A', text: 'Excellent — product-led growth at enterprise scale', value: 'A' },
      { optionId: 'B', text: 'Good — reduces sales cost and accelerates onboarding significantly', value: 'B' },
      { optionId: 'C', text: 'Risky — enterprise customers need hand-holding; self-serve may reduce deal size', value: 'C' },
      { optionId: 'D', text: 'Bad — enterprise sales must always be human-led', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — reduces sales cost and accelerates onboarding significantly',
    explanation: 'PLG for enterprise is proven (Slack, Figma, Notion). Design flow that leads to human sales for larger contracts.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_PM_Q5', year: 4, role: 'pm', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM asked to build a "defensible moat." Which source is HARDEST for competitors to replicate?',
    options: [
      { optionId: 'A', text: 'A beautiful UI design', value: 'A' },
      { optionId: 'B', text: 'Low pricing', value: 'B' },
      { optionId: 'C', text: 'Network effects or proprietary data models trained on PulseStream\'s unique video dataset', value: 'C' },
      { optionId: 'D', text: 'Being first to market', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Network effects or proprietary data models trained on PulseStream\'s unique video dataset',
    explanation: 'Data moats and network effects compound over time and take years to replicate.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_PM_Q6', year: 4, role: 'pm', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'Which certification most directly improves enterprise sales AND investor confidence simultaneously?',
    options: [
      { optionId: 'A', text: 'ISO 9001 Quality Management', value: 'A' },
      { optionId: 'B', text: 'SOC 2 Type II and ISO 27001', value: 'B' },
      { optionId: 'C', text: 'AWS Partner Network Advanced Tier', value: 'C' },
      { optionId: 'D', text: 'PCI-DSS Level 1', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'SOC 2 Type II and ISO 27001',
    explanation: 'SOC 2 Type II + ISO 27001 = gold standard combination for enterprise SaaS security credibility.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_PM_Q7', year: 4, role: 'pm', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'International expansion reveals video processing requirements differ between markets. PM\'s best response?',
    options: [
      { optionId: 'A', text: 'Build separate product for each market', value: 'A' },
      { optionId: 'B', text: 'Create a configurable, market-adaptive architecture with region-specific rules as a config layer', value: 'B' },
      { optionId: 'C', text: 'Require all international customers to use US product config', value: 'C' },
      { optionId: 'D', text: 'Outsource international product decisions', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Create a configurable, market-adaptive architecture with region-specific rules as a config layer',
    explanation: 'Configurable architecture = one codebase serving multiple markets without multiplying maintenance.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y5_PM_Q8', year: 4, role: 'pm', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'NRR is 105%. PM asked to improve it to 120%. Which lever has the MOST direct impact?',
    options: [
      { optionId: 'A', text: 'Acquiring more new customers', value: 'A' },
      { optionId: 'B', text: 'Improving onboarding to reduce churn and launching expansion pricing tiers for upsells', value: 'B' },
      { optionId: 'C', text: 'Reducing price for all customers', value: 'C' },
      { optionId: 'D', text: 'Hiring more customer success managers', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Improving onboarding to reduce churn and launching expansion pricing tiers for upsells',
    explanation: 'NRR improvement = reduce churn (better onboarding) + drive expansion revenue (tier-based upsells).',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  }
];

async function seed() {
  console.log('🌱 Seeding Year 5 (Round 5)...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected');

  const del = await Question.deleteMany({ year: 4 });
  console.log(`🗑️  Removed ${del.deletedCount} old year-4 questions`);

  await Question.insertMany(year4Questions);
  console.log(`✓ Inserted ${year4Questions.length} Year 5 questions`);

  const total = await Question.countDocuments();
  console.log(`   Total in DB: ${total}`);
  console.log('✅ Year 5 done!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
