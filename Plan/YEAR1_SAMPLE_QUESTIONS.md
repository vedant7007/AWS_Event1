# Cloud-Tycoon: Year 1 Sample Questions
## "The Cost Crisis" — Turn a losing startup profitable

---

## YEAR 1 CONTEXT
**Company:** PulseStream (video analytics startup)  
**Monthly Revenue:** $12,000  
**Monthly AWS Bill:** $18,000 (way too high)  
**Monthly Loss:** –$6,000  
**Runway:** 10 months of VC cash left  

**What you know:**
- 4 EC2 instances (2 are oversized, running at 5-10% CPU)
- 3 RDS databases (1 has zero queries in 6 months)
- 200GB of S3 storage (mostly old backups)
- All on On-Demand pricing (expensive)
- No monitoring or alerts set up
- Teams must cut costs WITHOUT breaking the user experience

---

## CTO QUESTIONS (Cloud Architect)

### Q1.1 — MCQ: Scenario (Easy-Medium)
**Question:**
Your monitoring shows 4 EC2 instances. Two are running at 5% CPU, two at 85% CPU. This is a clear waste. What's your first action?

**Options:**
- A) Terminate the 2 low-CPU instances immediately to save money ❌
- B) Downsize the low-CPU instances to smaller types, monitor 85% CPU ones ✅ (CORRECT)
- C) Add 2 more instances to balance the load ❌
- D) Not sure / leave as is ❌

**Why B is correct:**
Terminating without investigation risks breaking something. Downsizing is the pro move — keeps the service running while saving money. The 85% CPU ones might need attention too (upgrade or scale).

**Difficulty:** Medium (requires strategic thinking)

**Teaching moment:** Right-sizing is smarter than termination when you don't fully understand the workload.

---

### Q1.2 — MCQ: Scenario (Easy-Medium)
**Question:**
One of your 3 RDS databases, called "legacy-analytics-db", hasn't had a single query in 6 months. The database stores 50GB of data. Nobody on the team knows what it was for. What do you do?

**Options:**
- A) Delete it immediately, save $200/month ❌
- B) Snapshot it to S3 as a backup, then delete it ✅ (CORRECT)
- C) Leave it running — too risky to touch ❌
- D) Move it to a cheaper instance type ❌

**Why B is correct:**
Safe deletion is the professional approach. If it turns out you needed it, you have a backup. This teaches the importance of being cautious with production data.

**Difficulty:** Easy (but shows good engineering practice)

**Teaching moment:** Always backup before deleting; you don't know what you don't know.

---

### Q1.3 — True/False (Easy)
**Question:**
Terminating an EC2 instance automatically deletes all attached EBS volumes.

**Answer:** False ❌

**Explanation:**
By default, the OS disk (root volume) is deleted, but other data volumes are NOT deleted unless you explicitly check "Delete on Termination". This is a safety feature. Students learn this is a critical setting they must understand.

**Difficulty:** Easy (concept check)

**Teaching moment:** EC2 termination is not the same as data deletion; you have control.

---

### Q1.4 — Rate This Decision (1-10) (Medium)
**Question:**
A team member suggests: "We should delete any service or database we're not 100% sure we need, to cut costs as aggressively as possible."

How would you rate this strategy? (1=terrible idea, 10=great idea)

**Ideal range:** 3-4

**Explanation:**
This is too aggressive and reckless. In a startup with incomplete documentation (like yours), aggressive deletion risks breaking something. Score 1-2 = understands risk. Score 5-6 = reasonable but risky. Score 7-10 = hasn't thought through consequences.

**Why 3-4 is ideal:**
Aggressive cost-cutting is necessary, but not reckless. Find a middle ground: snapshot, monitor, then delete after 2-4 weeks of zero activity.

**Difficulty:** Medium (requires judgment)

**Teaching moment:** Cost-cutting must balance safety and speed.

---

## CFO QUESTIONS (Financial Analyst)

### Q1.1 — Numerical: Cost Calculation (Medium)
**Question:**
Current AWS costs breakdown:
- EC2: $12,000/month (4 instances, 2 are oversized)
- RDS: $4,000/month (3 databases, 1 unused)
- S3: $1,500/month (mostly old backups)
- Other: $500/month
**TOTAL: $18,000/month**

You decide to:
1. Right-size 2 oversized EC2 instances (save 35% on those; calculate: 35% of the $8,000 spent on those 2 = $2,800 savings)
2. Delete unused RDS database (save $200/month)
3. Move old S3 backups to Glacier (save 70%; calculate: 70% of $1,500 = $1,050 savings)

What's your new monthly AWS bill?

**Calculation:**
$18,000 – $2,800 – $200 – $1,050 = **$13,950**

**Answer:** $13,950  
**Acceptable range:** $13,700–$14,200 (allows ±$200 math error)

**Why this matters:**
From –$6,000/month loss to –$1,950/month loss. You've bought yourself more runway.

**Difficulty:** Medium (multi-step math)

**Teaching moment:** Even small cost cuts compound; a few wise decisions add up.

---

### Q1.2 — MCQ: Cost vs Revenue (Easy-Medium)
**Question:**
After your cost cuts this year, your monthly bill drops from $18,000 to $13,950. Revenue is still $12,000/month. When do you reach profitability (break-even)?

**Options:**
- A) You're still losing $1,950/month; it'll take 7+ months to profit ❌
- B) You break even immediately (costs = revenue) ❌
- C) You're close but not profitable yet; need one more $1,950 cut ❌
- D) In about 2-3 months if you can get revenue above $14,000/mo ✅ (CORRECT)

**Why D is correct:**
You're losing $1,950/month now. If you can grow revenue by $2,000 (to $14,000) OR cut another $1,950 in costs, you flip to profitable. Since this is Year 1, growth is slow but you only need a ~15% increase to break even.

**Difficulty:** Easy-Medium (requires thinking about break-even, not just costs)

**Teaching moment:** Profitability is about the gap; you can fix it on either side (cost cuts or revenue growth).

---

### Q1.3 — MCQ: Trade-off (Medium)
**Question:**
You've identified you can save $1,200/month by not setting up CloudWatch monitoring ($30/month cost). Your CFO loves this idea. Your CTO is nervous. What happens?

**Options:**
- A) Skip monitoring, save the $30/month, everything will be fine ❌
- B) Set up CloudWatch ($30/month) and save $1,800 overall due to catching issues early ✅ (CORRECT)
- C) Set up monitoring only after profitability ❌
- D) Build custom monitoring for free ❌

**Why B is correct:**
The Year 1 market event is "Cost Shock Alert" — hidden data transfer charges. Teams with CloudWatch see it coming (alert triggered) and lose $200. Teams without lose $800. So CloudWatch pays for itself (~13x over) by catching the issue early.

**Difficulty:** Medium (requires forward-thinking about risk)

**Teaching moment:** Some costs are NOT costs; they're insurance that prevents bigger losses.

---

## PM QUESTIONS (Product Manager)

### Q1.1 — MCQ: Scenario (Easy)
**Question:**
You're cutting costs heavily: downsizing servers, deleting unused databases, reducing storage. What's the biggest risk to your business?

**Options:**
- A) Users experience slowness or errors, leave the platform ✅ (CORRECT)
- B) Team morale drops due to stress ❌
- C) Competitors steal market share while you're distracted ❌
- D) AWS closes your account for weird activity ❌

**Why A is correct:**
You have $12,000/month revenue. If users churn due to performance issues, you lose revenue. That's the biggest risk. The cost-cutting is only worthwhile if it doesn't break the product.

**Difficulty:** Easy (common sense, but important)

**Teaching moment:** Product > Cost. Always.

---

### Q1.2 — Rate This Decision (1-10) (Medium)
**Question:**
A data-driven PM suggests: "We should delete any feature with <5% daily active users, to reduce complexity and operational costs."

Rate this strategy. (1=terrible, 10=great)

**Ideal range:** 5-6

**Explanation:**
- Score 1-2 = Too cautious, doesn't understand startup pressures
- Score 3-4 = Reasonable but missing nuance (some low-traffic features are critical)
- **Score 5-6 = Balanced** ← Right answer. Low-traffic features CAN be deleted IF they're not core to the user experience or brand promise.
- Score 7-8 = A bit aggressive, risky
- Score 9-10 = Reckless

**Why 5-6:**
It's a reasonable heuristic but requires judgment. Before deleting, ask: "Is this feature core to why users love us?" If yes, keep it. If it's a nice-to-have, delete.

**Difficulty:** Medium (requires product thinking, not just metrics)

**Teaching moment:** Metrics guide decisions, but they don't make them alone.

---

### Q1.3 — MCQ: Growth vs Survival (Medium)
**Question:**
You're burning cash. A customer asks for a custom feature (would cost $5,000 to build, revenue = $3,000/month). Do you build it?

**Options:**
- A) Yes, every revenue stream helps ❌
- B) No, you're in survival mode; focus on cutting costs, not building ✅ (CORRECT)
- C) Build it but charge more ❌
- D) Ask AWS for funding ❌

**Why B is correct:**
In Year 1, you're in survival mode (losing $6,000/month). You don't have capacity for custom builds. Focus on the core product and cost-cutting. Once profitable (Year 2+), then you can do custom work.

**Difficulty:** Medium (requires understanding startup strategy phases)

**Teaching moment:** Different business phases require different strategies. Year 1 is survival.

---

## QUESTION TYPE SUMMARY

| Question | Type | Role | Difficulty | Learning Goal |
|----------|------|------|-----------|--------------|
| Q1.1 | MCQ – Scenario | CTO | Medium | Right-sizing vs termination |
| Q1.2 | MCQ – Scenario | CTO | Medium | Safe deletion practices |
| Q1.3 | True/False | CTO | Easy | EC2 termination mechanics |
| Q1.4 | Rate 1-10 | CTO | Medium | Balancing aggressiveness & safety |
| Q1.1 | Numerical | CFO | Medium | Cost calculations |
| Q1.2 | MCQ – Trade-off | CFO | Medium | Break-even analysis |
| Q1.3 | MCQ – Trade-off | CFO | Medium | True cost of "savings" |
| Q1.1 | MCQ – Scenario | PM | Easy | Product > cost |
| Q1.2 | Rate 1-10 | PM | Medium | Data-driven decision making |
| Q1.3 | MCQ – Scenario | PM | Medium | Business phase strategy |

---

## HOW TO ADAPT THESE

### To make easier:
- Remove "Ideal range" — just ask "Is this a good idea?"
- Reduce calculation complexity (fewer steps)
- Provide more context in the scenario

### To make harder:
- Add more numerical calculations
- Present ambiguous scenarios with no clear answer
- Require longer explanations
- Include trick answers that sound right

### To make more AWS-specific:
- Reference actual AWS service names
- Include AWS pricing models
- Ask about specific service combinations

### To make more accessible:
- Use simpler language
- Avoid jargon (or define it in glossary)
- Use relatable analogies
- Provide worked examples

---

## SCORING RUBRIC

### MCQ Questions
- Correct answer: 10 points
- Incorrect answer: 0 points

### True/False
- Correct answer: 10 points
- Wrong answer: 0 points

### Numerical
- Exact answer: 10 points
- Within ±5% of correct: 8 points
- Within ±10%: 5 points
- Wrong ballpark: 0 points

### Rate 1-10
- Within ideal range (±1): 10 points
- Within ideal range (±2): 7 points
- Far from ideal (>3): 2 points

### Round Average
- Sum all points, divide by question count
- Goal: 60+ points = solid, 70+ = good, 80+ = excellent

---

## MARKET EVENT: Year 1 Ending

**Event Name:** "Cost Shock Alert"

**Scenario:**
AWS's month-end invoice arrives with a surprise: hidden data transfer charges. Teams that set up monitoring catch it immediately. Teams that ignored it are blindsided.

**Impact:**
- **Teams with CloudWatch + billing alerts:** Minor hit = –$200
- **Teams without monitoring:** Major hit = –$800
- **Cost-conscious teams (multiple safeguards):** Minimal hit = –$100

**Why this happens:**
- Data transfer OUT of AWS (when videos leave your servers) costs money
- Without monitoring, you don't know how much until the bill comes
- With monitoring, you see it accumulating and can adjust

**Teaches:**
Visibility into costs is a strategic decision, not optional. A small investment in monitoring (or built-in alerts) saves you from blindsided surprises.

---

## YEAR 1 COMPANY STATE OUTCOMES

Depending on answers, teams end up in one of these states:

### Path A: Conservative & Smart (BEST)
- Cut EC2 costs aggressively ✅
- Safely deleted unused RDS ✅
- Set up monitoring ✅
- **Year 1 end:** Bill = $7,400/mo, profitable in 2 months
- **Runway:** 18+ months
- **Status:** STABLE

### Path B: Moderate (GOOD)
- Some cuts, some caution
- May have skipped monitoring
- **Year 1 end:** Bill = $12,000/mo, still losing $1,000/mo
- **Runway:** 12 months
- **Status:** TIGHT

### Path C: Aggressive & Reckless (BAD)
- Cut too much, broke something
- No monitoring = caught off-guard by cost spike
- **Year 1 end:** Bill = $9,000/mo, but also lost users (revenue dropped to $10,000)
- **Runway:** 6 months
- **Status:** DANGER

The cascade: whichever path a team takes in Year 1 determines their starting point in Year 2. Stable teams have more flexibility. Tight teams must grow or cut more.

---

**End of Year 1 Sample Questions**

To generate Year 2 & 3 questions, follow the same structure:
1. Define scenario (what's the business challenge?)
2. 3 CTO questions (technical choices)
3. 2 CFO questions (financial choices)
4. 2 PM questions (growth/product choices)
5. 1 market event (reward good decisions, punish bad ones)

Each role should get questions tailored to their expertise, not just trivia about AWS. The goal is decision-making, not memorization.
