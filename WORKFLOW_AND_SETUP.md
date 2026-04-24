# 🎮 Cloud-Tycoon Platform - Setup & Workflow Guide

## 🔧 What's Now Fixed

✅ **Port 5000 cleared** - Process using port 5000 has been killed  
✅ **npm run seed added** - Seed script now available  
✅ **Frontend dependencies installed** - react-scripts and all deps installed  
✅ **.env files created** - Both backend and frontend configured for local development  
✅ **Seed database script created** - Ready to populate MongoDB with Year 1 questions  

---

## ⚡ Quick Start (Right Now!)

### Step 1: Ensure MongoDB is Running

**Option A: Local MongoDB (Easiest for Testing)**
```bash
# If you have MongoDB installed, start it:
mongod
# Should show: waiting for connections on port 27017
```

**Option B: MongoDB Atlas (Cloud - Requires Account)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create free cluster
- Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/cloud-tycoon`
- Update `.env` MONGODB_URI with your connection string

### Step 2: Start Backend

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Expected output:**
```
[nodemon] starting `node src/server.js`
✓ Connected to MongoDB
🚀 Cloud-Tycoon Backend running on port 5000
📊 Environment: development
🔗 Frontend URL: http://localhost:3000
```

### Step 3: Seed Database (New!)

**Terminal 2 (while backend is running):**
```bash
cd backend
npm run seed
```

**Expected output:**
```
🌱 Starting database seed...
📦 Connecting to MongoDB...
✓ Connected to MongoDB
🗑️  Clearing existing Year 1 questions...
✓ Cleared existing Year 1 questions
📚 Inserting 8 Year 1 questions...
✓ Inserted 8 questions

📊 Database Summary:
   Total questions: 8
   Year 1: 8 questions

✅ Database seeding completed successfully!
```

### Step 4: Start Frontend

**Terminal 3:**
```bash
cd frontend
npm start
```

**Expected output:**
```
webpack compiled...
Compiled successfully!

You can now view cloud-tycoon-frontend in the browser.
  http://localhost:3000
```

### Step 5: Test in Browser

Go to `http://localhost:3000` and you should see:
- ☁️ Cloud-Tycoon landing page
- "Register Your Team" button
- "Login to Play" button
- Training and game information

---

## 👥 Complete User Workflow

### Phase 1: Account Creation (Registration)

**Who**: Team leaders (one person per team)  
**Where**: http://localhost:3000/register

**What happens:**
1. Admin provides team leaders access to registration page
2. Team leader enters:
   - Team Name (e.g., "TechStars")
   - Team Lead Name, Email, Department
   - 3 Team Members (Name + Role):
     - CTO (Cloud Architect) - Name, Password
     - CFO (Financial Analyst) - Name, Password
     - PM (Product Manager) - Name, Password
3. System generates **Team ID** (e.g., `TT-2026-0042`)
4. Team leader shares this ID with their team members

**API Endpoint Used:**
```
POST /api/auth/register
Body: {
  teamName: "TechStars",
  teamLeadName: "John",
  teamLeadEmail: "john@college.ac.in",
  members: [
    { name: "Alice", role: "cto", password: "pwd123" },
    { name: "Bob", role: "cfo", password: "pwd123" },
    { name: "Charlie", role: "pm", password: "pwd123" }
  ]
}
Response: {
  teamId: "TT-2026-0042",
  message: "Team registered successfully"
}
```

---

### Phase 2: Team Member Login

**Who**: Each team member (CTO, CFO, PM)  
**Where**: http://localhost:3000/login

**What happens:**
1. Team member enters:
   - Team ID (from registration)
   - Member Name (must match registration)
   - Role (CTO/CFO/PM)
   - Password
2. System logs them in
3. They see training materials for their role
4. They wait for admin to start the event

**API Endpoint Used:**
```
POST /api/auth/login
Body: {
  teamId: "TT-2026-0042",
  name: "Alice",
  role: "cto",
  password: "pwd123"
}
Response: {
  token: "eyJhbGciOiJIUzI1NiIs...",
  teamId: "TT-2026-0042",
  role: "cto",
  message: "Login successful"
}
```

---

### Phase 3: Training Phase

**Who**: All team members (individually)  
**Where**: http://localhost:3000/training

**What they see:**
- "What is AWS?" overview video/slides
- Role-specific guide (CTO/CFO/PM)
- AWS Glossary (EC2, RDS, S3, CloudFront, etc.)
- Game Rules (3 years, 8-minute rounds, market events)
- Practice question with instant feedback

**Duration**: ~10-15 minutes per person

---

### Phase 4: Admin Starts Year 1

**Who**: Admin (proctors)  
**Where**: http://localhost:3000/admin (Admin Dashboard)

**What admin does:**
1. Logs in with admin credentials
2. Clicks "Start Year 1"
3. Admin dashboard shows:
   - **Status Tab**: How many teams registered, how many on Year 1/2/3
   - **Alerts Tab**: Real-time fraud detection (tab switches, fast submissions)
   - **Teams Tab**: All teams with their submission status

**What team members see:**
- Lockdown mode activates (full screen)
- 8-minute countdown timer starts
- Questions appear one at a time
- Cannot leave page, cannot copy-paste
- Each role sees DIFFERENT questions for their role

---

### Phase 5: Year 1 Exam (8 minutes per role)

**What happens inside lockdown mode:**
1. CTO sees CTO questions (3 questions about infrastructure)
2. CFO sees CFO questions (2 questions about costs/budget)
3. PM sees PM questions (2 questions about growth/product)
4. Each question has:
   - Scenario (realistic AWS problem)
   - Multiple answer types (MCQ, numerical, T/F, rating)
   - All 3 members must answer before submission
5. Timer counts down: 8:00 → 0:00
6. At 0:00, system auto-submits

**Security Features During Exam:**
- ✅ Full screen required (cannot see taskbar/other windows)
- ✅ Tab switch detection (warn 3x, auto-submit on 4th)
- ✅ Copy-paste blocked
- ✅ Right-click disabled
- ✅ F12 (DevTools) blocked
- ✅ If user leaves page, answers are auto-submitted

**API Endpoints Used:**
```
GET /api/questions/:year/:role
- CTO gets: /api/questions/1/cto (3 CTO questions)
- CFO gets: /api/questions/1/cfo (2 CFO questions)
- PM gets: /api/questions/1/pm (2 PM questions)

POST /api/submissions/:year
Body: {
  teamId: "TT-2026-0042",
  role: "cto",
  answers: { Q1: "B", Q2: 13950, Q3: false }
}
Response: {
  score: 85,
  feedback: "Good decision on downsizing!"
}
```

---

### Phase 6: Cascade Logic (Year 1 → Year 2)

**What happens automatically after Year 1:**

System calculates how Year 1 decisions affect Year 2:

**Example Cascade Rules:**
1. **If CTO chose to downsize EC2:**
   - Year 2 starting monthly bill: -15% discount
2. **If CFO committed to 3-year RIs:**
   - Year 2 locked into cheaper costs
   - Year 3: Cannot scale up flexibly
3. **If PM invested in CloudFront:**
   - Year 2 starting speed: +20% faster
   - Users happier → Lower churn

**Year-End Report shows:**
- Each role's score
- Company state (revenue, costs, profit)
- Market event impact (e.g., "Cost Shock Alert")
- How decisions cascade to Year 2

**API Endpoint Used:**
```
GET /api/submissions/:year/:teamId
Returns:
{
  year1: {
    answers: { cto: {...}, cfo: {...}, pm: {...} },
    scores: { cto: 85, cfo: 90, pm: 75 },
    companyState: { 
      revenue: 50000, 
      costs: 18000, 
      profit: 32000 
    }
  },
  year2Projected: {
    costs: 15300,  // 15% lower due to cascade
    revenue: 55000  // slightly higher
  }
}
```

---

### Phase 7: Year 2 & Year 3 (Same as Year 1)

**For Year 2:**
- Admin clicks "Start Year 2"
- Team members log in again
- Each role sees NEW questions for Year 2
- Starting company state REFLECTS Year 1 decisions
- Same 8-minute exam, same lockdown mode

**For Year 3:**
- Same process, but this time Year 2 decisions cascade
- Final cumulative profit calculated

---

### Phase 8: Final Results & Leaderboard

**After Year 3 completes:**

**Leaderboard Page shows:**
| Rank | Team Name | Year 1 | Year 2 | Year 3 | Total |
|------|-----------|--------|--------|--------|-------|
| 🥇 1 | TechStars | $32k | $28k | $45k | $105k |
| 🥈 2 | CloudNine | $30k | $25k | $40k | $95k  |
| 🥉 3 | DataDream | $28k | $23k | $38k | $89k  |

**Results Page shows:**
- Final score and ranking
- Award badge (Champion/Runner-up/Profitable/Learning)
- Year-by-year breakdown
- Key insights and teaching moments
- Next steps for learning

**API Endpoint Used:**
```
GET /api/leaderboard
Returns: [
  {
    rank: 1,
    teamName: "TechStars",
    teamId: "TT-2026-0042",
    year1Profit: 32000,
    year2Profit: 28000,
    year3Profit: 45000,
    cumulativeProfit: 105000,
    ctoScore: 87,
    cfoScore: 92,
    pmScore: 85,
    status: "completed"
  },
  ...
]
```

---

## 🔑 API Keys & External Services Required

### No API Keys Required for MVP! ✅

The platform runs COMPLETELY locally without any external API keys:

**✅ No AWS account needed** - This is just a game about AWS, not using AWS  
**✅ No external payment gateway** - It's free  
**✅ No email service** - Not used in MVP  
**✅ No third-party auth** - Uses JWT  

### Optional Services (For Production/Later)

| Service | Purpose | Cost | Required? |
|---------|---------|------|-----------|
| MongoDB Atlas | Cloud database | Free tier available | Optional (use local MongoDB for now) |
| Heroku | Backend hosting | Free tier (limited) | Optional (for deployment) |
| Vercel | Frontend hosting | Free | Optional (for deployment) |
| Gmail SMTP | Send registration emails | Free (with app password) | Optional (for real emails) |

---

## 🛠️ How to Use Admin Dashboard

### Login to Admin
```
URL: http://localhost:3000/admin
Note: For MVP, admin login is not required (anyone can access)
```

### Admin Dashboard Features

**Tab 1: Status**
```
Shows:
- Teams Registered: 15
- Teams on Year 1: 8
- Teams on Year 2: 5
- Teams on Year 3: 2
- Teams Completed: 0
- Total Event Status: 53% (in progress)
```

**Tab 2: Alerts** (Real-time Fraud Detection)
```
Fraud Types Detected:
- Tab Switch: User switched tabs (count: 2 times)
- Multi-Device Login: User logged in from 2 devices
- Fast Submission: Answered all questions in 30 seconds

Actions:
- View Details
- Flag Team
- Auto-Submit
- Disqualify
```

**Tab 3: Teams**
```
Team Dashboard:
| Team | Status | Y1 | Y2 | Y3 | Alerts |
|------|--------|----|----|----|----|
| TechStars | Submitted | ✓ | ⏳ | ⏳ | 0 |
| CloudNine | Submitting | 🔴 | ⏳ | ⏳ | 1 alert |

Actions:
- View Answers
- View Scores
- Override Score
- Resend Instructions
```

### Admin Actions Available

**Start Event:**
```
POST /api/admin/start-year
Body: { year: 1 }
Effect: Teams can now see questions for Year 1
```

**Flag Suspicious Team:**
```
POST /api/admin/flag-team
Body: { teamId: "TT-2026-0042", reason: "fast_submission" }
Effect: Team marked as suspicious, flagged in alerts
```

**View Live Progress:**
```
GET /api/admin/status
Returns: Real-time event statistics
```

**Get Fraud Alerts:**
```
GET /api/admin/alerts
Returns: List of suspicious activities detected
```

---

## 📊 Question Format (When You Add Years 2-3)

Each question needs these fields:

```javascript
{
  questionId: 'Y2_CTO_Q1',      // Unique ID
  year: 2,                       // Year 1, 2, or 3
  role: 'cto',                   // 'cto', 'cfo', or 'pm'
  type: 'mcq',                   // 'mcq', 'numerical', 'truefalse', 'rating'
  question: 'Your question here?',
  scenario: 'Context/story...',
  
  // For MCQ:
  options: [
    { optionId: 'A', text: 'Option A', value: 'A' },
    { optionId: 'B', text: 'Option B', value: 'B' }
  ],
  correctAnswer: 'B',
  
  // For Numerical:
  acceptableRange: { min: 100, max: 150 },
  correctAnswer: 125,
  
  // For T/F and Rating:
  correctAnswer: true,  // or 1-5 for rating
  
  explanation: 'Why this is the right answer...',
  difficulty: 'easy',  // or 'medium', 'hard'
  teachingMoment: 'What students should learn...',
  
  // Cascade effect (how this affects next year):
  cascadeEffect: {
    description: 'If they choose option B...',
    impactOnYear2: { monthlyBillModifier: -0.15 },  // 15% cheaper
    impactOnYear3: null
  }
}
```

---

## 🚀 Next Steps

### Immediate (Next 1 hour)
1. ✅ Backend running? Check: `npm run dev` in backend
2. ✅ Frontend running? Check: `npm start` in frontend
3. ✅ Can you see landing page? Go to http://localhost:3000
4. ✅ Can you register a test team? Create one and note the Team ID
5. ✅ Can you log in as each role? Try logging in as CTO, CFO, PM

### Short Term (Next 2-4 hours)
1. Add Year 2 questions to `backend/src/utils/seedDatabase.js` (18 questions)
2. Add Year 3 questions (18 questions)
3. Define cascade rules (how Year 1 decisions affect Year 2-3)
4. Create market events (random challenges each year)
5. Run `npm run seed` again to populate database

### Medium Term (Before Event)
1. Test with 10 real students (1-2 hours)
2. Fix any bugs found
3. Deploy to production (Heroku + Vercel + MongoDB Atlas)
4. Train proctors on admin dashboard
5. Run load test with 60+ concurrent users

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'react-scripts'"
**Solution:** Run `npm install` in frontend folder (already done!)

### Error: "EADDRINUSE: address already in use :::5000"
**Solution:** Already fixed! Port 5000 is now clear.

### Error: "Missing script: seed"
**Solution:** Already fixed! Added seed script to package.json

### Error: "MongoDB connection failed"
**Solution 1:** Start local MongoDB with `mongod`  
**Solution 2:** Update MONGODB_URI in backend/.env to MongoDB Atlas connection string

### Error: "Cannot register team - email invalid"
**Solution:** Backend validation is strict. Use college email format.

### Questions not showing in exam
**Solution:** Run `npm run seed` to populate database with questions

### Leaderboard showing no teams
**Solution:** Create and submit at least one team first

---

## 📞 Support Resources

**Files to Review:**
- `README.md` - Project overview
- `SETUP.md` - Detailed deployment guide
- `IMPLEMENTATION_STATUS.md` - Progress tracker
- `backend/src/utils/cascadeLogic.js` - How cascade rules work
- `frontend/src/pages/AdminDashboard.js` - Admin features

---

**Status:** ✅ Ready to test!  
**Next:** Start backend and frontend, then test registration flow.

Good luck! 🚀
