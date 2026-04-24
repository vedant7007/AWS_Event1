# Cloud-Tycoon Website — Implementation Checklist

## Phase 1: Planning & Design (Week 1)

### Questions Development
- [ ] Write all Year 1 questions (6 per role × 3 roles = 18 questions total)
- [ ] Write all Year 2 questions (6 per role × 3 roles = 18 questions)
- [ ] Write all Year 3 questions (8 per role × 3 roles = 24 questions)
- [ ] For each question, document:
  - [ ] Scenario text
  - [ ] All 3-4 answer options
  - [ ] Correct answer
  - [ ] Why it's correct
  - [ ] Difficulty level (Easy/Medium/Hard)
- [ ] Get feedback from 2-3 AWS experts (clarity, accuracy, difficulty)
- [ ] Adjust any ambiguous questions

### Cascade Logic Design
- [ ] Document Year 1 → Year 2 transformations
  - If CTO chose X, then Year 2 starting state is Y
  - Create a decision tree (spreadsheet)
- [ ] Document Year 2 → Year 3 transformations
- [ ] Define market event impacts (penalties, bonuses)
- [ ] Test cascade logic with 3 sample team paths

### Database Schema
- [ ] Design MongoDB schema for team state
- [ ] Design questions table (question_id, role, year, type, options, correct_answer)
- [ ] Design scoring table (team_id, round, score, answers_submitted)
- [ ] Design cascade rules table (condition → state_change)

---

## Phase 2: Frontend Development (Week 1-2)

### Core Pages
- [ ] **Landing Page**
  - [ ] Header with logo, tagline
  - [ ] "Register Team" button
  - [ ] "How to Play" link
  - [ ] Event details card

- [ ] **Team Registration Page**
  - [ ] Form with team name, member names
  - [ ] Role assignment dropdowns
  - [ ] Submit button
  - [ ] Success message + login credentials

- [ ] **Team Login Page**
  - [ ] Team ID input
  - [ ] Role selection (CTO/CFO/PM)
  - [ ] Member name field
  - [ ] Login button

- [ ] **Pre-Event Training Hub**
  - [ ] Video: "What is AWS?" (3 min)
  - [ ] Role guide for each role (text + video)
  - [ ] Glossary with AWS terms (EC2, RDS, S3, etc.)
  - [ ] Practice question (to learn the UI)

- [ ] **Round Overview Page**
  - [ ] Scenario text (large, engaging)
  - [ ] Company state (revenue, costs, runway)
  - [ ] "Start Round" button

- [ ] **Question Screen (CRITICAL)**
  - [ ] Full-screen lockdown (no background visible)
  - [ ] Question counter (3 of 6)
  - [ ] Timer (displays remaining time, warns at 2 mins)
  - [ ] Role badge ("Cloud Architect")
  - [ ] Question text
  - [ ] Radio buttons for MCQ
  - [ ] Text input for numerical/short-text
  - [ ] True/False toggle
  - [ ] Rating scale (1-10 slider)
  - [ ] Previous/Next buttons
  - [ ] Submit Round button (locked until all answered)
  - [ ] Progress indicator (6 dots, one per question)

- [ ] **Year-End Report Page**
  - [ ] 3 metric cards (revenue, costs, net profit)
  - [ ] Decisions made (list)
  - [ ] Market event description + impact
  - [ ] New company state
  - [ ] "Continue to Next Year" button

- [ ] **Leaderboard Page**
  - [ ] Live-updating table (team name, profit, rank)
  - [ ] Auto-refresh every 10 seconds
  - [ ] Show your team highlighted

- [ ] **Final Results Page**
  - [ ] Gold/Silver/Bronze badges for top 3
  - [ ] Full ranking
  - [ ] Your team's score breakdown
  - [ ] "Download Report" button
  - [ ] Share button

### Styling & UX
- [ ] Use Tailwind CSS or CSS-in-JS (styled-components)
- [ ] Mobile responsive (test on tablets, phones)
- [ ] Dark mode support
- [ ] Accessibility: ARIA labels, keyboard navigation
- [ ] Test on Chrome, Firefox, Safari

### Security & Lockdown
- [ ] Implement Fullscreen API (lock to full screen)
- [ ] Detect tab switches:
  - [ ] `visibilitychange` event listener
  - [ ] Warn on first tab switch
  - [ ] Auto-submit on 3rd tab switch
  - [ ] Log to admin panel
- [ ] Disable copy-paste: `onCopy`, `onPaste` handlers
- [ ] Disable right-click context menu
- [ ] Prevent F12 (DevTools): `keydown` listener
- [ ] Detect multiple devices logging in as same user (flag in admin)

---

## Phase 3: Backend Development (Week 1-2)

### API Endpoints

**Authentication**
```
POST /api/auth/register
  Input: team_name, members[], roles[]
  Output: team_id, login_credentials

POST /api/auth/login
  Input: team_id, role, member_name
  Output: jwt_token, team_state

POST /api/auth/logout
  Input: jwt_token
```

**Questions**
```
GET /api/questions/:year/:round
  Input: year (1-3), role (cto/cfo/pm)
  Output: [questions] (6-8 per call)

GET /api/question/:question_id
  Output: full question details
```

**Submissions**
```
POST /api/submissions/:year
  Input: year, answers{q1: "A", q2: 500, ...}
  Process: 
    - Validate all answers submitted
    - Score each answer
    - Trigger cascade logic
    - Emit market event
  Output: year_end_state, next_year_starting_state
```

**State & Reports**
```
GET /api/team/:team_id/state
  Output: current company state (profit, costs, runway, etc.)

GET /api/leaderboard
  Output: all teams ranked by profit

GET /api/team/:team_id/report/:year
  Output: detailed year report (decisions, scores, impact)
```

**Admin**
```
GET /api/admin/status
  Output: live event status (teams in Y1, Y2, Y3, alerts)

GET /api/admin/alerts
  Output: fraud alerts (tab switches, unusual activity)

POST /api/admin/event/:event_id/trigger
  Manually trigger market event
```

### Database Implementation
```javascript
// Example: MongoDB Team Collection
db.teams.insertOne({
  team_id: "T001",
  team_name: "CloudStars",
  members: [
    { name: "Alice", role: "cto", user_id: "U001" },
    { name: "Bob", role: "cfo", user_id: "U002" },
    { name: "Charlie", role: "pm", user_id: "U003" }
  ],
  year_1: {
    answers: {
      cto: { q1: "B", q2: "B", q3: true },
      cfo: { q1: 13400, q2: "A" },
      pm: { q1: "A", q2: 3 }
    },
    scores: { cto: 75, cfo: 85, pm: 60, round_avg: 73 },
    company_state: {
      monthly_bill: 7400,
      monthly_revenue: 12000,
      runway_months: 12,
      cumulative_profit: -26400
    },
    market_event: { name: "Cost Shock Alert", penalty: -200 },
    timestamp: ISODate("2024-05-10T14:30:00Z")
  },
  year_2: { /* same structure */ },
  year_3: { /* same structure */ },
  final_score: {
    cumulative_profit: 20550,
    rank: 3,
    created_at: ISODate("2024-05-10T18:00:00Z")
  }
})
```

### Cascade Logic (Node.js)
```javascript
// Example: Calculate Year 2 starting state based on Year 1 decisions
function calculateYear2StartingState(year1Answers, year1State) {
  const year2State = {
    monthly_bill: year1State.monthly_bill,
    monthly_revenue: 15000, // Growth trigger
    runway_months: Math.round(year1State.cumulative_profit / -year1State.monthly_bill)
  };

  // Apply decision cascades
  if (year1Answers.cto.q1 === "B") {
    // Downsized instances → lower costs
    year2State.monthly_bill *= 0.95;
  }

  if (year1Answers.pm.monitoring_enabled) {
    // Set up monitoring in Year 1 → early warning in Year 2
    year2State.cost_monitoring = true;
  }

  return year2State;
}
```

### Market Events Engine
```javascript
// Example: Process market event impact
function applyMarketEvent(teamState, eventType) {
  const events = {
    "cost_shock_alert": {
      if_prepared: { penalty: -200, reason: "Monitoring caught it early" },
      if_unprepared: { penalty: -800, reason: "Blindsided by data transfer charges" }
    },
    "customer_cancellation": {
      if_flexible_ri: { penalty: -500, reason: "Can adjust capacity" },
      if_locked_ri: { penalty: -2000, reason: "Stuck paying for unused capacity" }
    }
  };

  const event = events[eventType];
  const isPrepared = checkPreparation(teamState); // check monitoring, RIs, etc.
  
  const impact = isPrepared ? event.if_prepared : event.if_unprepared;
  teamState.cumulative_profit += impact.penalty;
  
  return { impact, new_state: teamState };
}
```

---

## Phase 4: Testing (Week 2-3)

### Unit Tests
- [ ] Test cascade logic (10+ scenarios)
  - Path 1: Aggressive cuts → tight budget → scaled surplus
  - Path 2: Conservative approach → comfortable costs → less profit
  - Path 3: Locked-in RI → Year 3 inflexible
- [ ] Test scoring logic (all question types)
- [ ] Test market event impacts
- [ ] Test leaderboard calculations

### Integration Tests
- [ ] Test full flow: Register → Year 1 → Year 2 → Year 3 → Final Score
- [ ] Test role separation (CFO doesn't see CTO questions)
- [ ] Test lockdown mode (tab switch detection, copy-paste blocking)
- [ ] Test fraud detection (unusual activity patterns)

### User Testing
- [ ] Recruit 10 students (mix of tech/non-tech backgrounds)
- [ ] Task 1: Register team (3 mins)
- [ ] Task 2: Complete Year 1 questions (8 mins)
- [ ] Task 3: Navigate leaderboard & report (2 mins)
- [ ] Collect feedback:
  - [ ] Was anything confusing?
  - [ ] Did questions feel fair?
  - [ ] How engaging was it (1-10)?
  - [ ] Any technical issues?
- [ ] Iterate on unclear questions, fix any UI issues

### Load Testing
- [ ] Can backend handle 60+ simultaneous users?
- [ ] Can leaderboard update in <1 second?
- [ ] Use Apache JMeter or similar:
  - [ ] Simulate 60 teams logging in simultaneously
  - [ ] Simulate all 60 submitting Year 1 at same time
  - [ ] Measure response times, errors

---

## Phase 5: Admin Dashboard (Week 2)

- [ ] **Live Status Board**
  - [ ] How many teams in Y1, Y2, Y3?
  - [ ] Time remaining this round
  - [ ] Submit counts (who's submitted, who hasn't)
  
- [ ] **Fraud Detection**
  - [ ] Tab switch alerts (team, timestamp, count)
  - [ ] Unusual answer patterns (too fast, same as other team)
  - [ ] Multiple devices flag
  
- [ ] **Round Management**
  - [ ] Manual extend time button
  - [ ] Trigger market event button (for demos)
  - [ ] Cancel submission button (admin override)
  
- [ ] **Results Export**
  - [ ] Download leaderboard as CSV
  - [ ] Download team report as PDF
  - [ ] Email results to participants

---

## Phase 6: Deployment (1 week before event)

### Production Checklist
- [ ] Environment variables configured (API keys, DB URLs, JWT secrets)
- [ ] HTTPS enabled (SSL certificate)
- [ ] Database backups scheduled
- [ ] CORS policy locked down (only allow official domain)
- [ ] Rate limiting enabled (prevent brute-force)
- [ ] Error logging configured (Sentry, LogRocket)
- [ ] CDN set up for static assets (images, CSS, JS)

### Hosting Options
1. **Simple (Firebase)**: Easy, no server management, $0-50/month
   - Firestore for DB
   - Cloud Functions for API
   - Hosting for frontend
   
2. **Moderate (Heroku + MongoDB)**: $20-50/month
   - Heroku for backend
   - MongoDB Atlas for database
   - Vercel for frontend
   
3. **Professional (AWS)**: $30-100+/month
   - EC2 for backend
   - RDS for database
   - CloudFront for CDN

### Backup & Recovery
- [ ] Database backup before event (1 copy)
- [ ] Database backup during event (hourly)
- [ ] Disaster recovery plan (what if server goes down? How do we resume?)

---

## Phase 7: Event Day (Day of)

### 2 Hours Before
- [ ] Verify all servers running
- [ ] Check database connectivity
- [ ] Run smoke tests (login, question screen, submit)
- [ ] Verify leaderboard live
- [ ] Verify admin dashboard
- [ ] Test on multiple browsers/devices

### 1 Hour Before
- [ ] Brief proctor team:
  - [ ] How to monitor admin dashboard
  - [ ] How to help stuck teams (hint without spoiling)
  - [ ] What to do if technical issue occurs
- [ ] Open registration page
- [ ] Send team login links
- [ ] Verify all teams can login

### During Event
- [ ] Monitor admin dashboard continuously
- [ ] Watch for fraud alerts
- [ ] Prepare to extend time if needed
- [ ] Have backup power, backup internet ready
- [ ] Keep slack channel open for proctor communication

### After Event
- [ ] Generate final leaderboard
- [ ] Export all results
- [ ] Send thank you email with results links
- [ ] Collect feedback survey

---

## Phase 8: Post-Event

- [ ] Host debrief session (30 mins)
  - [ ] Show top 3 teams' decisions
  - [ ] Explain cascade logic
  - [ ] Q&A with AWS industry experts
  
- [ ] Publish detailed blog post:
  - [ ] "Here's what the winning team did"
  - [ ] "Common mistakes teams made"
  - [ ] "What we learned about teaching AWS"

- [ ] Iterate for next year:
  - [ ] Simplify questions that confused people
  - [ ] Add more years if platform holds up
  - [ ] Consider prizes/incentives

---

## Recommended Tech Stack (Quick Setup)

### Frontend
```
create-react-app
├── tailwindcss (styling)
├── axios (API calls)
├── react-router (navigation)
└── socket.io-client (real-time updates)
```

### Backend
```
Node.js + Express
├── mongoose (MongoDB)
├── jsonwebtoken (auth)
├── socket.io (real-time)
├── express-rate-limit (security)
└── dotenv (config)
```

### Quick Deployment
```
1. Frontend → Vercel (free, automatic deploys from GitHub)
2. Backend → Heroku (free tier, or $5/month)
3. Database → MongoDB Atlas (free tier, 512MB)
4. Total cost: $0-30/month for your first event
```

---

## Key Dates (Assuming Event in 2 Weeks)

| Date | Task |
|------|------|
| Today | Finalize all questions |
| Day 1-3 | Frontend build |
| Day 4-5 | Backend build |
| Day 6-7 | Testing & iteration |
| Day 8-9 | User testing, fixes |
| Day 10 | Admin dashboard, final checks |
| Day 11 | Deploy to production, proctor training |
| Day 12 | 24-hour pre-event prep |
| Day 13 | **EVENT DAY** |

---

## Critical Success Factors

1. **Questions are clear** — test with 5 students before event
2. **Cascade logic works** — decide if Year 1 decision X leads to Year 2 cost Y
3. **Lockdown mode works** — no cheating, but also not annoying
4. **Database is stable** — can handle 60+ simultaneous users
5. **Admin dashboard works** — proactors know what's happening
6. **Customer support ready** — have a Slack channel for proactors to ask questions during event

Start with the questions first. Everything else flows from having good questions. Don't rush this part.

Good luck! 🚀
