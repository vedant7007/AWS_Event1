# Cloud-Tycoon: Simplified Website Design & Architecture Plan
**For AWS Club VJIT — Beginner-Friendly Edition**

---

## SECTION 1: OVERVIEW & SIMPLIFICATIONS

### Target Audience
- **1st year B.Tech students** (many with zero AWS knowledge)
- **Team-based learning** (3 members per team, different roles)
- **Engagement > Complexity** — fun, visual, not intimidating

### Key Simplifications vs Original
| Original | Simplified |
|----------|-----------|
| 5 years, complex AWS architecture | 3 years, focused on core concepts |
| 12 questions per round | 6-8 questions per round |
| Complex numerical calculations | Simple math (percentages, additions) |
| Advanced services (CloudFront, WAF, Reserved Instances) | Basics (EC2, RDS, S3, Auto-Scaling, Multi-AZ) |
| Cascading market events (complex) | 1-2 dramatic moments per year |
| Abstract cost optimization | Concrete: "your bill is $X, reduce it" |

### Three Role Definitions
1. **Cloud Architect (CTO)** — Technical choices (which services to use, scaling decisions)
2. **Financial Analyst (CFO)** — Cost tracking, ROI calculations, budget management
3. **Growth Lead (PM)** — User experience, revenue growth, feature prioritization

Each role gets **different questions** tailored to their expertise, but all answers affect the shared company state.

---

## SECTION 2: WEBSITE USER FLOWS

### Phase 1: Pre-Event (Registration & Team Setup)

#### Page: Landing Page
```
┌─────────────────────────────────────┐
│  CLOUD-TYCOON: THE 3-YEAR TURNAROUND │
│  AWS Club VJIT                        │
├─────────────────────────────────────┤
│  "Turn a failing startup profitable  │
│   in 3 years. Make smart decisions.  │
│   Compete with other teams."         │
├─────────────────────────────────────┤
│  [Register Your Team]  [How to Play] │
└─────────────────────────────────────┘
```

#### Page: Team Registration
```
Form Fields:
- Team Name
- Team Lead Name (email, phone)
- Member 2 Name
- Member 3 Name
- College/Department

Radio buttons:
- Who is the Cloud Architect? [dropdown]
- Who is the Financial Analyst? [dropdown]
- Who is the Growth Lead? [dropdown]

[Submit Registration]
→ Generates unique Team ID + login credentials for all 3 members
```

#### Page: Pre-Event Training
- **Overview video** (3 min): "What is AWS? Core services at a glance"
- **Role guide** (per role):
  - CTO: "Your job is to choose the right AWS services"
  - CFO: "Your job is to keep costs down while growing revenue"
  - PM: "Your job is to grow users while maintaining quality"
- **Glossary**: Simple definitions of EC2, RDS, S3, Auto-Scaling, Multi-AZ

---

### Phase 2: Event Day (Lockdown Mode)

#### Page: Team Login (Before Event Starts)
```
Enter Team ID: ________________
Your Role: [Cloud Architect ▼]
Team Member Name: ________________

[Login]
```

#### Page: Round Overview (Shown at Round Start)
```
┌──────────────────────────────────────┐
│ YEAR 1 — THE COST CRISIS             │
├──────────────────────────────────────┤
│ Your company PulseStream is losing   │
│ money. AWS bill: $18,000/month       │
│ Revenue: $12,000/month               │
│ You have 3 months to fix this.       │
│                                      │
│ Your role: Cloud Architect           │
│ Focus: Choose the right services     │
├──────────────────────────────────────┤
│ [Start Round]                        │
└──────────────────────────────────────┘
```

#### Page: Question Screen (FULL SCREEN, LOCKDOWN MODE)
```
CRITICAL FEATURES:
✓ Full viewport — no background apps visible
✓ Questions rotate (not all visible at once)
✓ Timer visible (8 minutes per round)
✓ Team members see different questions
✓ Submit button locked until all answers filled
✓ Browser tab switching = admin alert

Layout:
┌─────────────────────────────────────────┐
│ YEAR 1 — QUESTION 3 OF 6                │
├─────────────────────────────────────────┤
│ Timer: 06:45                            │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [CTO Question]                      │ │
│ │ Your EC2 instances are running at   │ │
│ │ 5% CPU usage. What do you do?       │ │
│ │                                     │ │
│ │ ○ Leave them alone                 │ │
│ │ ○ Downsize them                    │ │
│ │ ○ Terminate them                   │ │
│ │ ○ Not sure                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [← Previous] [Next →] [Submit Round]    │
└─────────────────────────────────────────┘
```

#### Anti-Cheating Features
1. **Lockdown Mode**: Full screen, no tab switching
   - Warn team when switching tabs (3 warns, auto-submit)
   - Log all activity to admin panel
   - No copy-paste
   - No developer tools

2. **Role Separation**: Each member logs in separately
   - CFO sees only financial questions
   - CTO sees only technical questions
   - PM sees only growth questions
   - Prevents sharing answers before submit

3. **Admin Alerts**:
   - Tab switch detected
   - Unusual activity (multiple devices)
   - Question submitted too quickly (likely copied)
   - Long inactivity

---

### Phase 3: Post-Round (Cascade Effects)

#### Page: Year-End Company State Report
```
┌────────────────────────────────────────┐
│ END OF YEAR 1 REPORT                   │
├────────────────────────────────────────┤
│ Your Decisions: ✓                      │
│ - Downsized 2 EC2 instances            │
│ - Terminated unused RDS database       │
│ - Moved old backups to cheaper storage │
│                                        │
│ Impact on Year 1:                      │
│ Revenue: $12,000/mo (unchanged)        │
│ AWS Bill: $14,200/mo (was $18,000)     │
│ Monthly Loss: –$2,200 (was –$6,000)    │
│ Runway: 12+ months (was 10)            │
│                                        │
│ Market Event: "Cost Spike Alert"       │
│ AWS discovered hidden charges from     │
│ data transfer. Lucky you had alerts!   │
│ Penalty: –$300 (other teams: –$800)    │
│                                        │
│ Net Profit (Year 1): –$26,400          │
│ Runway Status: STABLE ✓                │
├────────────────────────────────────────┤
│ [Continue to Year 2]                   │
└────────────────────────────────────────┘
```

**Key insight**: Decisions from Year 1 **cascade** into Year 2 starting state:
- If you downsized heavily → Year 2 starts with lower base costs (but may face capacity issues in Year 3 surge)
- If you invested in monitoring → Year 2 costs more but you catch problems earlier
- If you committed to Reserved Instances in Year 2 → Year 3 options are locked in

---

## SECTION 3: THE THREE SIMPLIFIED YEARS

### YEAR 1: The Cost Crisis (Cleanup Phase)
**Duration**: 8 minutes for questions + 2 min reveal

**Scenario**:
PulseStream was poorly set up. Previous team just spun up services without planning.
- Monthly Bill: **$18,000**
- Monthly Revenue: **$12,000**
- Monthly Loss: **–$6,000**
- Runway: **10 months** (if you don't fix this, you're dead)

**Roles & Questions**:

**CTO Questions** (3 questions):
1. **MCQ**: Your servers are oversized. What's the first thing you check?
   - A) CPU and memory usage patterns
   - B) Network throughput
   - C) Disk IOPS
   - D) Not sure
   - **Answer**: A (correct) → reveals that 2 instances run at 5% CPU

2. **MCQ**: An RDS database shows zero queries in 6 months. What do you do?
   - A) Delete it immediately, save $200/mo
   - B) Snapshot it first, then delete (safer)
   - C) Leave it, might be needed
   - D) Move to cheaper instance
   - **Answer**: B (correct) → teaches safe deletion

3. **True/False**: Auto-Scaling will cost you more than static instances in Year 1.
   - **Answer**: False (correct) — Auto-Scaling helps you right-size; static big instances cost more

**CFO Questions** (2 questions):
1. **Numerical**: Current bill breakdown:
   - EC2: $12,000
   - RDS: $4,000
   - S3: $1,500
   - Other: $500
   
   If you downsize EC2 (save 30% = $3,600), delete unused RDS (save $200), move old backups to cheaper storage (save $800), what's your new monthly bill?
   - **Answer**: $13,400 (accept 13,200–13,600)

2. **MCQ**: You've saved $4,600/month in costs. Revenue is still $12,000/mo. How long until you're profitable?
   - A) 3 months (break even, then positive)
   - B) 6 months
   - C) 12 months
   - D) Never, costs too high
   - **Answer**: A (correct) — $12,000 - $7,400 = $4,600 positive

**PM Questions** (2 questions):
1. **MCQ**: You're cutting costs aggressively. What's the biggest risk?
   - A) Users leave due to slowness
   - B) Team burnout
   - C) Competitors steal market share
   - D) AWS closes account
   - **Answer**: A (correct) — cost cuts must not break UX

2. **Rate 1-10**: "We should delete all features we're unsure about to save costs."
   - **Ideal rating**: 3-4 (too aggressive, might lose users)

**Market Event (End of Year 1)**:
"AWS Month-End Invoice Shock"
- Teams with **CloudWatch monitoring → Alert triggered, minor hit (–$200)**
- Teams without monitoring → Blindsided by data transfer charges (–$800)
- Teams that cut aggressively but smartly → Minimal impact (–$100)

**Year 1 Outcome**:
- New base cost: ~$7,400-$8,200/month (depends on choices)
- Revenue: $12,000/month
- Status: **STABLE** or **BLEEDING** (determines Year 2 narrative)

---

### YEAR 2: The Scale Moment (Growth Phase)
**Duration**: 8 minutes for questions + 2 min reveal

**Scenario**:
You've stabilized. Now traffic is growing steadily. A major customer signs on. You need to scale, but smart.

**Starting State** (dynamically shows their Year 1 result):
- Monthly Bill: [varies based on Year 1 choices]
- Monthly Revenue: **$12,000 → $15,000** (steady growth)
- Runway: **Good** or **Tight** (depends on Year 1)

**Roles & Questions**:

**CTO Questions** (3 questions):
1. **MCQ**: Traffic is growing 20%/month. Your servers are at 70% capacity. What's your move?
   - A) Buy bigger instances now, be safe
   - B) Set up Auto-Scaling, let it handle spikes
   - C) Wait until you hit 90% capacity
   - D) Not sure
   - **Answer**: B (correct) — Auto-Scaling is the smart move

2. **MCQ**: Your database is the bottleneck (slow queries). Options:
   - A) Upgrade to bigger RDS instance ($400/mo extra)
   - B) Add read replicas ($300/mo)
   - C) Optimize queries (free, takes time)
   - D) Move to NoSQL
   - **Answer**: C or B (both smart; A is wasteful)

3. **True/False**: You should set up Multi-AZ (redundancy) now to avoid problems later.
   - **Answer**: True (correct) — better to invest early than scramble in Year 3

**CFO Questions** (2 questions):
1. **Numerical**: You want to commit to Reserved Instances to save money.
   - Current EC2 bill: $8,000/month
   - 1-year RI: 30% discount
   - 3-year RI: 50% discount
   
   What's your monthly savings with 1-year RI on 70% of instances?
   - Calculation: (70% × $8,000) × 30% = $1,680
   - **Answer**: $1,680 (accept 1,600–1,800)

2. **MCQ**: The CEO suggests committing 100% of infrastructure to 3-year RIs (save 50%). Your concern:
   - A) Business pivots → stuck paying for unused capacity
   - B) Instance types improve → we'll be outdated
   - C) Workforce grows → need more machines
   - D) All of above
   - **Answer**: D (correct) — commitment is risky without lock-in flexibility

**PM Questions** (2 questions):
1. **MCQ**: A major customer wants SLA guarantee (99.9% uptime). You're currently at 99%. What do you do?
   - A) Promise 99.9%, hope for the best
   - B) Invest in Multi-AZ + monitoring now (costs $1,000/mo)
   - C) Hire ops team
   - D) Tell customer "no"
   - **Answer**: B (correct) — SLA is competitive, invest for it

2. **Rate 1-10**: "We should immediately commit to Reserved Instances for all infrastructure to maximize savings and focus on growth."
   - **Ideal rating**: 4-5 (good instinct but risky; Savings Plans are better)

**Market Event (End of Year 2)**:
"Major Customer Cancellation + CEO Pivot Signal"
- Teams over-committed to 3-year RIs → **Can't scale down, stuck paying (–$2,000)**
- Teams on 1-year RIs or Savings Plans → **Flexible, adjust easily (–$500)**
- Teams with no commitment → **No penalty, but missed savings (–$1,200)**

**Year 2 Outcome**:
- Monthly revenue: **$15,000–$18,000**
- Infrastructure readiness: **Flexible** or **Locked-in** (affects Year 3 options)
- Status: **READY TO GROW** or **OVER-COMMITTED**

---

### YEAR 3: The Viral Surge (Scale Crisis)
**Duration**: 10 minutes for questions (more complex) + 2 min reveal

**Scenario**:
Your product went viral. Traffic is 10x baseline overnight. Users are seeing errors. Revenue is pouring in, but your infrastructure is screaming.

**Starting State**:
- Infrastructure: Varies based on Year 2
- Current capacity: **Handling 10% of incoming traffic**
- Error rate: **Climbing (1% → 15% → 30%)**
- Revenue spike: **Potential +$5,000/mo IF you keep service up**

**Roles & Questions**:

**CTO Questions** (4 questions):
1. **MCQ**: Traffic is 10x. App servers at 95% CPU. What's the fastest fix?
   - A) Buy 10x more instances manually
   - B) Enable Auto-Scaling (handles spikes automatically)
   - C) Optimize code (takes too long)
   - D) Shut down, reboot servers
   - **Answer**: B (correct) — Auto-Scaling is the only scalable solution

2. **MCQ**: Database is the bottleneck (slow queries). Quick fix:
   - A) Upgrade RDS instance (costs +$500/mo, doesn't help immediately)
   - B) Add caching layer (Redis, reduces DB load 70%, costs +$150/mo) — **ANSWER**
   - C) Add read replicas (helps, but complex to set up fast)
   - D) Do nothing
   - **Answer**: B (correct) — caching gives immediate relief

3. **MCQ**: For overflow capacity (extra 50% traffic spike), what's smart?
   - A) 100% On-Demand EC2 (reliable, expensive)
   - B) Mix: 70% On-Demand + 30% Spot (cheaper, risky)
   - C) 100% Spot instances (cheap, might shut down mid-surge)
   - D) Don't add capacity, throttle users
   - **Answer**: B (correct) — balance cost and reliability

4. **True/False**: Auto-Scaling instantly adds servers the moment CPU spikes.
   - **Answer**: False (correct) — there's a 2-5 minute delay for warm-up

**CFO Questions** (2 questions):
1. **Numerical**: Year 3 surge revenue potential: +$5,000/mo if you stay up.
   - Current costs: $10,000/mo (varies based on Year 2)
   - Auto-Scaling costs during surge: +$3,000/mo (temporary)
   - Caching layer: +$150/mo (permanent)
   - Multi-AZ bonus: Survive one AZ outage without losing revenue
   
   **Question**: Is it worth adding Auto-Scaling + caching to capture the surge?
   - A) No, costs too much
   - B) Yes, net gain of $1,850/mo (even if surge is temporary)
   - C) Only if we have runway
   - D) Not sure
   - **Answer**: B (correct) — surge payoff > infrastructure costs

2. **MCQ**: Year 3 profit (after new costs):
   - Current: Revenue $15,000 - Costs $10,000 = **$5,000/mo profit**
   - With surge: Revenue $20,000 - Costs $13,150 = **$6,850/mo profit**
   
   **Question**: Scale or stay safe?
   - A) Stay safe, $5,000/mo is good
   - B) Scale aggressively, capture $6,850/mo
   - C) Scale slowly, risk losing market to competitors
   - D) Shut down, the surge will end anyway
   - **Answer**: B (correct) — scale for the surge

**PM Questions** (2 questions):
1. **MCQ**: During surge, users are hitting error pages. What do you prioritize?
   - A) Add features to keep them engaged
   - B) Fix errors, maintain service quality, then add features
   - C) Tell them to wait
   - D) Blame AWS
   - **Answer**: B (correct) — quality > features during crisis

2. **Rate 1-10**: "Panic-buy 50 more EC2 instances and do whatever it takes to stay online."
   - **Ideal rating**: 3-4 (emotional, not strategic; wastes money)

**Market Event (End of Year 3)**:
"The Influencer Livestream"
- A second viral moment hits + original influencer livestreams FROM your platform
- Teams with **Auto-Scaling + Caching**: Survive both spikes, revenue +$5,000 (Total Year 3 profit: **+$20,550**)
- Teams with **only Auto-Scaling**: Survive first spike, bottleneck on second (Revenue +$2,000, profit: **+$7,000**)
- Teams with **no preparation**: Outage, users churn, reputation hit (Profit: **+$500** or negative)

**Year 3 Outcome**:
- Cumulative profit: **Varies hugely** (–$50k to +$40k depending on all 3 years)
- User base: **Stable** or **Growing** (affects final valuation)
- Infrastructure maturity: **Production-ready** or **Fragile**

---

## SECTION 4: QUESTION TYPES & DIFFICULTY

### Question Type Distribution

Per Role, Per Round (total 6-8 questions per round):

| Type | Count | Difficulty | Purpose |
|------|-------|-----------|---------|
| **MCQ – Scenario** | 2 | Easy-Medium | "What's the right choice given this situation?" |
| **MCQ – Trade-off** | 1 | Medium | "No perfect answer; which is smartest?" |
| **True/False** | 1 | Easy | Quick concept check |
| **Numerical** | 1 | Medium | Math: cost/revenue calculations |
| **Rate 1-10** | 1 | Medium | Judge a risky decision; ideal range provided |
| **FLEX (optional)** | 1 | Varies | Extra challenge or clarification question |

### Difficulty Calibration for 1st Years

**Easy** (should know or guess):
- "Auto-Scaling helps with spikes" (True)
- "Oversized servers are wasteful" (obvious from context)
- "You should check utilization before downsizing" (logical)

**Medium** (requires thinking + some AWS knowledge):
- "Which is the best strategy: buy bigger now vs auto-scale?" (requires trade-off thinking)
- "Caching reduces DB load — worth +$150/mo cost?" (cost-benefit analysis)
- "Commit to Reserved Instances for how long?" (risk assessment)

**Hard** (avoid in Year 1, okay in Year 3):
- "Calculate IRR on infrastructure investment" ❌ (too hard)
- "Design a multi-region failover strategy" ❌ (too hard)
- "What's the optimal RI split across instance types?" ❌ (too hard)

**Good approach**: Most questions should be **Medium** with clear, defensible answers. Avoid ambiguous questions.

---

## SECTION 5: DATABASE SCHEMA & CASCADE LOGIC

### Team State (Persists Across All 3 Years)

```json
{
  "team_id": "T001",
  "team_name": "CloudStars",
  "members": [
    { "name": "Alice", "role": "cto", "user_id": "U001" },
    { "name": "Bob", "role": "cfo", "user_id": "U002" },
    { "name": "Charlie", "role": "pm", "user_id": "U003" }
  ],
  "year_1": {
    "decisions": {
      "downsize_ec2": true,
      "delete_unused_rds": true,
      "move_backups_glacier": true,
      "setup_monitoring": true
    },
    "answers": {
      "cto_q1": "B",
      "cto_q2": "B",
      "cto_q3": true,
      "cfo_q1": 13400,
      "cfo_q2": "A",
      "pm_q1": "A",
      "pm_q2": 3
    },
    "scores": {
      "cto_score": 75,
      "cfo_score": 85,
      "pm_score": 60,
      "round_avg": 73
    },
    "company_state": {
      "monthly_bill": 7400,
      "monthly_revenue": 12000,
      "runway_months": 12,
      "cumulative_profit": -26400,
      "monitoring_enabled": true,
      "capacity_status": "right-sized"
    },
    "market_event": {
      "name": "Cost Shock Alert",
      "penalty": -200,
      "reason": "Monitoring caught hidden charges early"
    }
  },
  "year_2": {
    "starting_state": {
      "monthly_bill": 7400,  // Cascaded from Year 1
      "monthly_revenue": 15000,
      "runway_months": 12
    },
    "decisions": {
      "autoscaling_enabled": true,
      "multi_az_enabled": true,
      "reserved_instance_commitment": "1-year-70-percent",
      "optimization_focus": "capacity"
    },
    "answers": { /* ... */ },
    "scores": { /* ... */ },
    "company_state": {
      "monthly_bill": 5900,  // 1-year RI savings applied
      "monthly_revenue": 15000,
      "runway_months": 18,
      "cumulative_profit": -13500,  // Running total
      "autoscaling_enabled": true,
      "multi_az_enabled": true,
      "reserved_commitment": "1-year-70-percent"
    },
    "market_event": {
      "name": "Customer Cancellation",
      "penalty": -500,
      "reason": "Flexible commitment allowed adjustment"
    }
  },
  "year_3": {
    "starting_state": {
      "monthly_bill": 5900,
      "monthly_revenue": 15000,
      "runway_months": 18,
      "autoscaling_enabled": true,
      "multi_az_enabled": true
    },
    "viral_surge": {
      "traffic_multiplier": 10,
      "error_rate_start": 1,
      "revenue_potential": 5000  // Extra if they handle surge
    },
    "decisions": {
      "autoscaling_aggressive": true,
      "caching_layer_added": true,
      "spot_instances_mixed": true
    },
    "answers": { /* ... */ },
    "scores": { /* ... */ },
    "company_state": {
      "monthly_bill": 9050,  // Higher during surge
      "monthly_revenue": 20000,  // Captured full surge
      "runway_months": 36,  // Profitable
      "cumulative_profit": 20550,  // Total across all years
      "final_valuation_index": 8.2  // Composite score
    },
    "market_event": {
      "name": "The Influencer Livestream",
      "bonus": 5000,
      "reason": "Survived surge, captured revenue"
    }
  },
  "final_score": {
    "cumulative_profit": 20550,
    "ranking": 3,
    "comparison": "Better than 60% of teams"
  }
}
```

### How Cascade Works

**Year 1 → Year 2**:
- **If you cut aggressively** (downsize, delete unused resources):
  - Year 2 base cost is LOW ✓ (good for profitability)
  - But Year 3 surge might overload you (no headroom)
  
- **If you set up monitoring** in Year 1:
  - Year 2 sees market event earlier (minor penalty vs blindsided)
  - Better decision-making in Year 2
  
- **If you invested in Multi-AZ early** (Year 2):
  - Year 3 surge is handled better (one AZ can fail, service stays up)

**Year 2 → Year 3**:
- **If you committed to 3-year RIs**:
  - Year 3 costs are locked (can't scale down if surge ends)
  - Profit from Year 3 surge is lower (paying for unused capacity)
  
- **If you enabled Auto-Scaling** in Year 2:
  - Year 3 surge is automatic and fast (no manual intervention)
  - You capture the full revenue spike
  
- **If you ignored resilience**:
  - Year 3 surge hits, infrastructure fails
  - Revenue drops, reputation damage

---

## SECTION 6: WEBSITE PAGES & FEATURES

### Admin Dashboard (For Event Organizers)

```
┌─────────────────────────────────────────┐
│ ADMIN PANEL — Cloud-Tycoon Event        │
├─────────────────────────────────────────┤
│ Live Status:                            │
│ ✓ Year 1 — 38 teams, 8 mins left       │
│ ⚠ 3 teams haven't submitted yet        │
│                                        │
│ Alerts:                                │
│ 🚨 Team T009 — Multiple tab switches   │
│ 🚨 Team T015 — Unusually fast answers  │
│ ⚠ Team T022 — No activity (5 mins)     │
│                                        │
│ [View Leaderboard] [View Submissions]  │
│ [Trigger Market Event] [Settings]      │
└─────────────────────────────────────────┘
```

**Admin Features**:
- **Real-time leaderboard** (cumulative profit per team)
- **Fraud detection** (tab switches, unusual patterns, speed flags)
- **Round management** (manually extend time, trigger market events)
- **Team monitoring** (which members are logged in, active)
- **Detailed feedback** (per team, per round)

### Leaderboard (Real-Time)

```
┌──────────────────────────────────────────────┐
│ LIVE LEADERBOARD — Year 1 (In Progress)     │
├──────────────────────────────────────────────┤
│ Rank │ Team Name      │ Profit  │ Status    │
├──────┼────────────────┼─────────┼───────────┤
│  1   │ CloudStars     │ –$20k   │ ✓ Stable │
│  2   │ DevOps Kings   │ –$23k   │ ✓ Stable │
│  3   │ AWS Ninjas     │ –$28k   │ ⚠ Tight  │
│  ... │                │         │           │
│  38  │ StartUp Inc    │ –$45k   │ 🔴 Danger│
└──────────────────────────────────────────────┘

[Refresh] [Detailed View]
```

### Final Results Page (After Year 3)

```
┌────────────────────────────────────────┐
│ FINAL RESULTS — Cloud-Tycoon           │
├────────────────────────────────────────┤
│ 🏆 Leaderboard:                        │
│                                        │
│ 🥇 1st: CloudStars — $35,200 profit   │
│ 🥈 2nd: DevOps Kings — $28,900 profit │
│ 🥉 3rd: AWS Ninjas — $22,150 profit   │
│                                        │
├────────────────────────────────────────┤
│ Your Team: CloudStars (Rank #1)        │
│ Final Profit: $35,200                  │
│ Final Valuation: 8.8/10                │
│                                        │
│ Detailed Breakdown:                    │
│ Year 1 Profit: –$26,400                │
│ Year 2 Profit: +$8,850                 │
│ Year 3 Profit: +$52,750                │
│                                        │
│ Best Decision: Multi-AZ in Year 2      │
│ Riskiest Move: Aggressive cost cuts Y1 │
│ Market Event Impact: +$7,200 total     │
│                                        │
│ [Download Report] [Replay Rounds]      │
└────────────────────────────────────────┘
```

---

## SECTION 7: TECHNICAL STACK

### Frontend
- **React.js** — Interactive UI, real-time updates
- **TypeScript** — Type-safe code
- **Tailwind CSS** — Styling
- **Socket.io** — Real-time leaderboard/alerts

### Backend
- **Node.js / Express** — API server
- **MongoDB** — Store team data, answers, cascade state
- **Redis** — Cache leaderboard, real-time events
- **JWT** — Authentication (team ID + role)

### Security
- **Full-screen lockdown** (Fullscreen API)
- **Browser activity monitoring** (tab switch detection)
- **Rate limiting** (prevent brute-force submissions)
- **CORS** (only allow official domain)
- **Content Security Policy** (prevent copy-paste)

### Deployment
- **AWS EC2** or **Heroku** for backend
- **Vercel** or **Netlify** for frontend
- **Firebase** for simple option (no server management)

---

## SECTION 8: TIMELINE & DELIVERABLES

### Pre-Event (2 weeks before)
- [ ] Finalize all questions (6-8 per round, per role)
- [ ] Build frontend (login, question screens, lockdown mode)
- [ ] Build admin dashboard
- [ ] Test cascade logic (decisions → next year state)
- [ ] User testing with 5-10 students

### 1 Week Before
- [ ] Deploy to production
- [ ] Organize proctor training
- [ ] Set up team registrations
- [ ] Load test (can it handle 60 teams simultaneously?)

### Event Day
- [ ] 30 mins before: Teams register, log in, confirm roles
- [ ] Year 1 questions live (30 mins: 20 mins questions + 10 mins reveal)
- [ ] 15-min break
- [ ] Year 2 questions live (30 mins)
- [ ] 15-min break
- [ ] Year 3 questions live (30 mins, longer due to complexity)
- [ ] Announce results, awards

### Post-Event
- [ ] Collect feedback
- [ ] Publish detailed breakdowns per team
- [ ] Host debrief session ("What went well, what didn't")

---

## SECTION 9: HANDHOLDING & GUIDANCE

### Offline "Lifeline" Bot
Each team gets **2 uses per round** of an offline concept helper (no internet, no cheating):
- "What is Auto-Scaling?"
- "How does Reserved Instances work?"
- "What's the difference between EC2 and RDS?"

**Simple, no spoilers**, just definitions.

### Pre-Event Learning Path
1. **Video (3 min)**: "AWS in 3 minutes for beginners"
2. **Role Guides (5 min each)**:
   - CTO: How to think about services
   - CFO: How to track costs
   - PM: How to balance growth & quality
3. **Interactive Glossary**: Hover over AWS terms in questions → definition pops up

### In-Round Hints
If a team is stuck:
- **Proctors can give hints** (but not answers):
  - "Think about what happens to your bill when you have unused resources"
  - "Would keeping an unused database running help or hurt your bottom line?"

---

## SECTION 10: SUCCESS METRICS

### For Students
✓ **Engagement**: >80% of students attend both days
✓ **Learning**: Can name 3+ AWS services after event
✓ **Fun**: Average satisfaction >4/5

### For Event
✓ **No technical issues**: <2 min downtime total
✓ **Fraud prevention**: 0 confirmed cheating incidents
✓ **Cascade logic works**: Year 3 scores clearly show impact of earlier decisions
✓ **Competitive**: Top 5 teams separated by <$10k profit

---

## SECTION 11: NEXT STEPS

### What You Need to Build First
1. **Design the 3x3x6 questions** (3 years, 3 roles, 6 questions per role per year)
   - Start with Year 1 (easiest)
   - Each question needs: scenario, 3-4 options, correct answer, why it's correct
   
2. **Decide the exact cascade rules**:
   - If Year 1 cost = X, what's Year 2 starting cost?
   - If Year 2 has Auto-Scaling, what bonus does Year 3 get?
   - Build a spreadsheet showing all possible paths
   
3. **Mock up the UI**:
   - Login page
   - Question screen
   - Year-end report
   - Leaderboard
   
4. **Plan the database**:
   - What data does each team state hold?
   - How do decisions transform into next-year numbers?

### Recommended Approach
**Start small**: Build Year 1 first, test with 5 friends, then expand to Year 2 & 3. Don't try to build everything at once.

---

## APPENDIX: YEAR 1 QUESTIONS (Complete Example)

### CTO Questions (Cloud Architect)

**Q1 [MCQ – Scenario]**
Your monitoring dashboard shows 4 EC2 instances. Two are at 5% CPU, two are at 85% CPU. What's your first action?
- A) Terminate the 2 low-CPU instances immediately
- B) Downsize the low-CPU instances and investigate why 2 are overloaded
- C) Add more instances to balance the load
- D) Contact AWS support
- **Answer**: B
- **Why**: Terminating without investigation might break something. Downsizing + investigation is smarter.

**Q2 [MCQ – Scenario]**
Your database "legacy-analytics-db" hasn't been queried in 6 months, but nobody knows its purpose. What do you do?
- A) Delete it immediately, save the cost
- B) Take a snapshot, then delete it (safe backup first)
- C) Leave it running, too risky to touch
- D) Move it to a cheaper database type
- **Answer**: B
- **Why**: Safe deletion is the professional approach.

**Q3 [True/False]**
Terminating an EC2 instance automatically deletes all attached EBS volumes.
- **Answer**: False
- **Why**: It depends on the "Delete on Termination" flag. Students learn this is a setting they must explicitly configure.

### CFO Questions (Financial Analyst)

**Q1 [Numerical]**
Current AWS costs:
- EC2: $12,000/month (4 instances, 2 are oversized)
- RDS: $4,000/month (3 databases, 1 unused)
- S3: $1,500/month (mostly old backups)
- Other: $500/month

If you:
- Right-size 2 EC2 instances (save 35% on those: 35% × $8,000 = $2,800)
- Delete unused RDS (save $200)
- Move old S3 backups to Glacier (save 70%: 70% × $1,500 = $1,050)

What's your new monthly bill?

Calculation: $18,000 – $2,800 – $200 – $1,050 = **$13,950**
- **Answer**: $13,950 (accept $13,700–$14,200)

**Q2 [MCQ – Trade-off]**
You've cut costs by $4,200/month. Your current revenue is $12,000/month. You're currently losing $6,000/month. After these cuts, you'll profit:
- A) Nothing, still breaking even
- B) $1,800/month (get to $0 loss first, then profit)
- C) $6,000/month (back to break-even)
- D) Can't tell, need more info
- **Answer**: B
- **Why**: New bill = $18,000 – $4,200 = $13,800. Revenue = $12,000. Loss = $1,800/month (better than $6,000 loss). They're moving toward profitability.

### PM Questions (Product Manager)

**Q1 [MCQ – Scenario]**
You're cutting costs heavily (downsize servers, delete features, reduce resources). What's the biggest risk to your business?
- A) Users experience slowness, leave the platform
- B) Team morale drops
- C) Competitors steal market share
- D) AWS closes your account
- **Answer**: A
- **Why**: Cost-cutting must never break the user experience. That's the core product risk.

**Q2 [Rate 1-10]**
"We should cut any service or feature we're not 100% sure we need, to reduce costs as much as possible."
- **Ideal rating**: 3-4 (too aggressive, likely to break UX or lose users)
- **Why**: Some uncertainty is okay. Over-cutting is reckless.

---

**End of Design Plan**

Good luck with your event! Start with the questions first, then build the platform around them. The cascade logic is the key — make sure each year's starting state depends on the prior year's decisions. That's what makes it memorable.
