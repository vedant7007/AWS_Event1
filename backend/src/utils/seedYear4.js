const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('../models/Question');

const SCENARIO = 'Double crisis — AWS us-east-1 partial outage affecting EC2 and RDS, AND CloudTrail logs show suspicious API calls from a potentially compromised IAM key.';

const year3Questions = [
  // ===== CTO — Cloud Architect (Q1–Q8) =====
  {
    questionId: 'Y4_CTO_Q1', year: 3, role: 'cto', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'AWS us-east-1 is partially down and your single-AZ RDS is unavailable. What should have prevented this?',
    options: [
      { optionId: 'A', text: 'Daily RDS snapshots', value: 'A' },
      { optionId: 'B', text: 'Multi-AZ RDS deployment with automatic failover', value: 'B' },
      { optionId: 'C', text: 'A larger RDS instance type', value: 'C' },
      { optionId: 'D', text: 'RDS in a public subnet for better connectivity', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Multi-AZ RDS deployment with automatic failover',
    explanation: 'Multi-AZ maintains a synchronous standby in a different AZ and auto-fails over in 1–2 minutes.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CTO_Q2', year: 3, role: 'cto', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'You want to automatically route traffic to a backup region when us-east-1 goes down. Which service?',
    options: [
      { optionId: 'A', text: 'AWS CloudFront origin failover', value: 'A' },
      { optionId: 'B', text: 'Amazon Route 53 with health checks and failover routing', value: 'B' },
      { optionId: 'C', text: 'AWS Global Accelerator with endpoint health checks', value: 'C' },
      { optionId: 'D', text: 'Both B and C are valid approaches', value: 'D' }
    ],
    correctAnswer: 'D',
    correctAnswerText: 'Both B and C are valid approaches',
    explanation: 'Both Route 53 failover and Global Accelerator can detect regional failure and redirect traffic.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CTO_Q3', year: 3, role: 'cto', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'Post-incident, CTO proposes deploying across 3 AWS regions simultaneously. Rate this for Year 4.',
    options: [
      { optionId: 'A', text: 'Excellent — 3 regions gives the best resilience', value: 'A' },
      { optionId: 'B', text: 'Good — right direction, but 2 regions (active-passive) is usually sufficient', value: 'B' },
      { optionId: 'C', text: 'Risky — 3-region active-active is extremely complex and expensive for a startup', value: 'C' },
      { optionId: 'D', text: 'Bad — multi-region is only for Fortune 500', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Risky — 3-region active-active is extremely complex and expensive for a startup',
    explanation: 'Active-passive 2-region delivers most resilience benefit at a fraction of the complexity.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CTO_Q4', year: 3, role: 'cto', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'During the outage, CTO wants to check which AWS services are affected. Where to look first?',
    options: [
      { optionId: 'A', text: 'AWS CloudTrail', value: 'A' },
      { optionId: 'B', text: 'AWS Service Health Dashboard (health.aws.amazon.com)', value: 'B' },
      { optionId: 'C', text: 'Amazon CloudWatch Alarms', value: 'C' },
      { optionId: 'D', text: 'AWS Config compliance dashboard', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'AWS Service Health Dashboard (health.aws.amazon.com)',
    explanation: 'Service Health Dashboard provides real-time status of all AWS services by region.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CTO_Q5', year: 3, role: 'cto', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'CTO implements VPC Flow Logs after the security incident. Rate this decision.',
    options: [
      { optionId: 'A', text: 'Excellent — Flow Logs capture all network traffic metadata for security analysis', value: 'A' },
      { optionId: 'B', text: 'Good — valuable for forensics, though they add some storage cost', value: 'B' },
      { optionId: 'C', text: 'Neutral — Flow Logs are too noisy to be useful', value: 'C' },
      { optionId: 'D', text: 'Bad — Flow Logs create a privacy risk for users', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — Flow Logs capture all network traffic metadata for security analysis',
    explanation: 'VPC Flow Logs are foundational security — essential for detecting lateral movement or exfiltration.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CTO_Q6', year: 3, role: 'cto', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream wants to detect compromised IAM keys earlier. Which AWS service automatically analyzes CloudTrail?',
    options: [
      { optionId: 'A', text: 'AWS Config', value: 'A' },
      { optionId: 'B', text: 'Amazon GuardDuty', value: 'B' },
      { optionId: 'C', text: 'AWS Inspector', value: 'C' },
      { optionId: 'D', text: 'AWS Security Hub', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Amazon GuardDuty',
    explanation: 'GuardDuty uses ML to analyze CloudTrail, VPC Flow Logs, and DNS for suspicious activity.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CTO_Q7', year: 3, role: 'cto', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'Define RTO and RPO for PulseStream\'s database. Most appropriate combination for a video SaaS?',
    options: [
      { optionId: 'A', text: 'RTO: 24 hours, RPO: 24 hours', value: 'A' },
      { optionId: 'B', text: 'RTO: 4 hours, RPO: 1 hour', value: 'B' },
      { optionId: 'C', text: 'RTO: 1 hour, RPO: 15 minutes', value: 'C' },
      { optionId: 'D', text: 'RTO: 30 seconds, RPO: 0 seconds', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'RTO: 1 hour, RPO: 15 minutes',
    explanation: '1-hour RTO and 15-minute RPO is reasonable and achievable. 24hrs is too slow; sub-second is enterprise-grade.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CTO_Q8', year: 3, role: 'cto', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'IAM audit reveals 12 service accounts with console access that shouldn\'t have it. What should CTO do?',
    options: [
      { optionId: 'A', text: 'Nothing — console access is harmless for service accounts', value: 'A' },
      { optionId: 'B', text: 'Remove console access from all service accounts; they should use programmatic access only', value: 'B' },
      { optionId: 'C', text: 'Convert them to root accounts for better control', value: 'C' },
      { optionId: 'D', text: 'Move them to a separate AWS account', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Remove console access from all service accounts; they should use programmatic access only',
    explanation: 'Service accounts should only have programmatic access. Console access is unnecessary attack surface.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },

  // ===== CFO — Financial Analyst (Q1–Q8) =====
  {
    questionId: 'Y4_CFO_Q1', year: 3, role: 'cfo', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'CFO says "We\'ve never had a breach, so cyber insurance isn\'t necessary." Rate this reasoning.',
    options: [
      { optionId: 'A', text: 'Sound — past record is reliable predictor', value: 'A' },
      { optionId: 'B', text: 'Reasonable — insurance is mainly for regulated industries', value: 'B' },
      { optionId: 'C', text: 'Flawed — absence of past breaches doesn\'t mean low future risk for a growing company', value: 'C' },
      { optionId: 'D', text: 'Great — insurance is always a waste for startups', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Flawed — absence of past breaches doesn\'t mean low future risk for a growing company',
    explanation: 'Security incidents are "when, not if" for growing companies with user data.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CFO_Q2', year: 3, role: 'cfo', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'SLA promises 99.9% uptime. A 4-hour outage occurred this month. Was the SLA breached?',
    options: [
      { optionId: 'A', text: 'No — 99.9% allows up to 8.7 hours of downtime', value: 'A' },
      { optionId: 'B', text: 'Yes — 4 hours exceeds the 43.8-minute monthly allowance for 99.9% uptime', value: 'B' },
      { optionId: 'C', text: 'No — SLA breaches only count if the customer reports them', value: 'C' },
      { optionId: 'D', text: 'Yes — any downtime is an automatic SLA breach', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Yes — 4 hours exceeds the 43.8-minute monthly allowance for 99.9% uptime',
    explanation: '99.9% uptime = 43.8 min allowed downtime. 4 hours = roughly 5× the allowance.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CFO_Q3', year: 3, role: 'cfo', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'Security incident response costs $35,000. Cyber insurance has $50,000 limit and $10,000 deductible. What does insurance cover?',
    options: [
      { optionId: 'A', text: '$35,000', value: 'A' },
      { optionId: 'B', text: '$25,000', value: 'B' },
      { optionId: 'C', text: '$50,000', value: 'C' },
      { optionId: 'D', text: '$0 — deductible exceeds incident cost', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: '$25,000',
    explanation: 'Insurance pays: $35,000 − $10,000 deductible = $25,000.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CFO_Q4', year: 3, role: 'cfo', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'Best formula to capture ROI of high-availability (HA) investment?',
    options: [
      { optionId: 'A', text: 'ROI = HA cost / total revenue', value: 'A' },
      { optionId: 'B', text: 'ROI = (Expected annual outage cost − HA cost) / HA cost', value: 'B' },
      { optionId: 'C', text: 'ROI = number of incidents prevented × average ticket cost', value: 'C' },
      { optionId: 'D', text: 'ROI = uptime percentage × monthly revenue', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'ROI = (Expected annual outage cost − HA cost) / HA cost',
    explanation: 'HA ROI = value of risk avoided minus cost of prevention.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CFO_Q5', year: 3, role: 'cfo', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'AWS bill includes $4,000 in data transfer costs from failover testing. How should CFO classify this?',
    options: [
      { optionId: 'A', text: 'Capital expenditure', value: 'A' },
      { optionId: 'B', text: 'Operational cost — part of the reliability program budget', value: 'B' },
      { optionId: 'C', text: 'Marketing cost', value: 'C' },
      { optionId: 'D', text: 'Sunk cost — write it off', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Operational cost — part of the reliability program budget',
    explanation: 'Failover testing is an ongoing operational reliability cost, not a one-time event.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CFO_Q6', year: 3, role: 'cfo', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'CFO suggests reducing AWS Support from Business ($100/mo) to Developer ($29/mo) post-incident. Rate this timing.',
    options: [
      { optionId: 'A', text: 'Excellent — cost discipline is critical', value: 'A' },
      { optionId: 'B', text: 'Good — Developer Support is sufficient', value: 'B' },
      { optionId: 'C', text: 'Terrible timing — post-incident is exactly when you need faster support response', value: 'C' },
      { optionId: 'D', text: 'Neutral — support tier doesn\'t affect resolution', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'Terrible timing — post-incident is exactly when you need faster support response',
    explanation: 'Business Support = 1-hour response for production outages vs 12 business hours for Developer.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CFO_Q7', year: 3, role: 'cfo', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'Board asks "What did this incident cost us in total?" Which costs should CFO include?',
    options: [
      { optionId: 'A', text: 'Only direct AWS infrastructure costs', value: 'A' },
      { optionId: 'B', text: 'Direct AWS costs + SLA credits + incident response labor + lost revenue + reputational cost estimate', value: 'B' },
      { optionId: 'C', text: 'Only the SLA penalties paid', value: 'C' },
      { optionId: 'D', text: 'Only costs that appear in the AWS bill', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Direct AWS costs + SLA credits + incident response labor + lost revenue + reputational cost estimate',
    explanation: 'Complete incident cost = infra + SLA credits + labor + lost revenue + churn impact.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_CFO_Q8', year: 3, role: 'cfo', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream now processes payments. Which compliance framework becomes relevant?',
    options: [
      { optionId: 'A', text: 'HIPAA', value: 'A' },
      { optionId: 'B', text: 'SOC 2 Type I only', value: 'B' },
      { optionId: 'C', text: 'PCI-DSS (Payment Card Industry Data Security Standard)', value: 'C' },
      { optionId: 'D', text: 'ISO 14001', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'PCI-DSS (Payment Card Industry Data Security Standard)',
    explanation: 'Any company processing cardholder data must comply with PCI-DSS.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },

  // ===== PM — Growth Lead / Product (Q1–Q8) =====
  {
    questionId: 'Y4_PM_Q1', year: 3, role: 'pm', questionNumber: 1, type: 'mcq',
    scenario: SCENARIO,
    question: 'T+30 minutes into the outage. What should the PM\'s first customer communication say?',
    options: [
      { optionId: 'A', text: 'Nothing yet — wait until engineering understands the full scope', value: 'A' },
      { optionId: 'B', text: 'We are aware of an issue and our team is actively investigating. Updates every 30 minutes.', value: 'B' },
      { optionId: 'C', text: 'AWS infrastructure is down — outside our control.', value: 'C' },
      { optionId: 'D', text: 'All systems operational. (while investigating)', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'We are aware of an issue and our team is actively investigating. Updates every 30 minutes.',
    explanation: 'Acknowledge early, take ownership, commit to update cadence.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_PM_Q2', year: 3, role: 'pm', questionNumber: 2, type: 'mcq',
    scenario: SCENARIO,
    question: 'PulseStream is down 4 hours during business hours. Three enterprise customers on a call demanding answers. Who should be on that call?',
    options: [
      { optionId: 'A', text: 'The PM alone', value: 'A' },
      { optionId: 'B', text: 'PM + CEO or VP Engineering — enterprise customers in crisis need senior presence', value: 'B' },
      { optionId: 'C', text: 'The on-call engineer', value: 'C' },
      { optionId: 'D', text: 'No one — send an email instead', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'PM + CEO or VP Engineering — enterprise customers in crisis need senior presence',
    explanation: 'Enterprise customers need to feel senior leadership takes the issue seriously.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_PM_Q3', year: 3, role: 'pm', questionNumber: 3, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM proposes publishing a detailed post-mortem to all customers including what went wrong, root cause, and remediation. Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — radical transparency builds deep customer trust', value: 'A' },
      { optionId: 'B', text: 'Good — valuable for enterprise customers, keep technical depth appropriate', value: 'B' },
      { optionId: 'C', text: 'Risky — publishing failure details gives competitors intelligence', value: 'C' },
      { optionId: 'D', text: 'Bad — post-mortems should always be internal only', value: 'D' }
    ],
    correctAnswer: 'A',
    correctAnswerText: 'Excellent — radical transparency builds deep customer trust',
    explanation: 'Public post-mortems are a hallmark of operationally mature companies.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_PM_Q4', year: 3, role: 'pm', questionNumber: 4, type: 'mcq',
    scenario: SCENARIO,
    question: 'Security breach exposed user metadata. Under GDPR, how many hours to notify the supervisory authority?',
    options: [
      { optionId: 'A', text: '24 hours', value: 'A' },
      { optionId: 'B', text: '48 hours', value: 'B' },
      { optionId: 'C', text: '72 hours', value: 'C' },
      { optionId: 'D', text: '7 days', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: '72 hours',
    explanation: 'GDPR Article 33 requires notification within 72 hours.',
    difficulty: 'easy', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_PM_Q5', year: 3, role: 'pm', questionNumber: 5, type: 'mcq',
    scenario: SCENARIO,
    question: 'What single initiative has the highest long-term trust impact after an outage?',
    options: [
      { optionId: 'A', text: 'Offering 1-month free trial to churned customers', value: 'A' },
      { optionId: 'B', text: 'Delivering consistently on reliability over the next 6 months — actions, not words', value: 'B' },
      { optionId: 'C', text: 'Sending a CEO apology email', value: 'C' },
      { optionId: 'D', text: 'Adding more features to distract from the incident', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Delivering consistently on reliability over the next 6 months — actions, not words',
    explanation: 'Trust is rebuilt through sustained reliability, not one-time gestures.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_PM_Q6', year: 3, role: 'pm', questionNumber: 6, type: 'mcq',
    scenario: SCENARIO,
    question: 'Three months post-incident, churn rate increased 3%. PM\'s first analytical step?',
    options: [
      { optionId: 'A', text: 'Assume it\'s entirely incident-related and offer discounts', value: 'A' },
      { optionId: 'B', text: 'Segment churned customers — were they incident-affected? What reasons in exit surveys?', value: 'B' },
      { optionId: 'C', text: 'Accelerate new feature development', value: 'C' },
      { optionId: 'D', text: 'Reduce pricing across the board', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Segment churned customers — were they incident-affected? What reasons in exit surveys?',
    explanation: 'Not all churn is incident-related. Segment by impact and exit data to find the right response.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_PM_Q7', year: 3, role: 'pm', questionNumber: 7, type: 'mcq',
    scenario: SCENARIO,
    question: 'PM proposes a "Reliability Roadmap" — public 6-month plan showing specific technical investments to prevent future outages. Rate this.',
    options: [
      { optionId: 'A', text: 'Excellent — demonstrates accountability and forward commitment', value: 'A' },
      { optionId: 'B', text: 'Good — powerful for enterprise sales, but must be realistic and achievable', value: 'B' },
      { optionId: 'C', text: 'Risky — sets expectations that must be met or trust is further damaged', value: 'C' },
      { optionId: 'D', text: 'Bad — never publish technical infrastructure plans', value: 'D' }
    ],
    correctAnswer: 'B',
    correctAnswerText: 'Good — powerful for enterprise sales, but must be realistic and achievable',
    explanation: 'Only publish commitments the team can meet. Work with engineering to set achievable milestones.',
    difficulty: 'hard', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  },
  {
    questionId: 'Y4_PM_Q8', year: 3, role: 'pm', questionNumber: 8, type: 'mcq',
    scenario: SCENARIO,
    question: 'Post-incident, a journalist contacts PulseStream about the security breach. Who should handle this?',
    options: [
      { optionId: 'A', text: 'The on-call engineer', value: 'A' },
      { optionId: 'B', text: 'The PM', value: 'B' },
      { optionId: 'C', text: 'The CEO or designated PR/communications lead, with legal counsel review', value: 'C' },
      { optionId: 'D', text: 'No one — never engage with journalists about security incidents', value: 'D' }
    ],
    correctAnswer: 'C',
    correctAnswerText: 'The CEO or designated PR/communications lead, with legal counsel review',
    explanation: 'Security breach press inquiries require senior leadership, prepared messaging, and legal review.',
    difficulty: 'medium', scoringRubric: { full: 10, partial: 0, incorrect: -5 }
  }
];

async function seed() {
  console.log('🌱 Seeding Year 4 (Round 4)...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected');

  const del = await Question.deleteMany({ year: 3 });
  console.log(`🗑️  Removed ${del.deletedCount} old year-3 questions`);

  await Question.insertMany(year3Questions);
  console.log(`✓ Inserted ${year3Questions.length} Year 4 questions`);

  const total = await Question.countDocuments();
  console.log(`   Total in DB: ${total}`);
  console.log('✅ Year 4 done!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
