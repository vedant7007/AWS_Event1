# Cloud-Tycoon: Complete Setup & Deployment Guide

## Project Structure

```
AWS_Event1/
├── backend/                    # Node.js + Express server
│   ├── src/
│   │   ├── server.js          # Main entry point
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, error handling
│   │   └── utils/             # Helpers, cascade logic, seed data
│   ├── package.json
│   ├── .env.example           # Example environment variables
│   └── .gitignore
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── App.js             # Main app component
│   │   ├── index.js           # Entry point
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── utils/             # API client, store, helpers
│   │   └── styles/            # Global CSS & Tailwind
│   ├── public/                # Static files
│   ├── package.json
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── .env.example
│   └── .gitignore
│
└── Plan/                       # Design documents
    ├── CloudTycoon_Website_Design_Plan.md
    ├── IMPLEMENTATION_CHECKLIST.md
    ├── YEAR1_SAMPLE_QUESTIONS.md
    └── README.md
```

## Quick Start (Development)

### Prerequisites
- Node.js 14+ and npm/yarn
- MongoDB Atlas account (free tier is fine)
- Git

### 1. Backend Setup

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cloud-tycoon
# JWT_SECRET=your_secret_key_here

# Install dependencies
npm install

# Seed initial questions (Year 1 data)
npm run seed

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new team
- `POST /api/auth/login` - Team member login
- `POST /api/auth/logout` - Logout

### Questions
- `GET /api/questions/:year/:role` - Get questions for year & role
- `GET /api/questions/question/:questionId` - Get specific question

### Submissions
- `POST /api/submissions/:year` - Submit answers for a year
- `GET /api/submissions/:teamId/:year` - Get submission details

### Leaderboard
- `GET /api/leaderboard` - Get live leaderboard
- `GET /api/leaderboard/team/:teamId` - Get team's position

### Admin
- `GET /api/admin/status` - Event status overview
- `GET /api/admin/alerts` - Fraud alerts
- `GET /api/admin/teams` - All teams details
- `POST /api/admin/teams/:teamId/flag` - Flag team

## Database Schema

### Team Collection
```javascript
{
  teamId: String,           // Unique team ID
  teamName: String,
  members: [{              // 3 members
    userId: String,
    name: String,
    role: 'cto'|'cfo'|'pm',
    password: String       // Hashed
  }],
  currentYear: Number,     // 1-3
  eventStatus: String,     // registered|in-progress|completed
  gameState: {
    year1: { answers, scores, companyState, marketEvent },
    year2: { /* same */ },
    year3: { /* same */ }
  },
  finalScore: {
    cumulativeProfit: Number,
    totalScore: Number,
    rank: Number
  }
}
```

### Question Collection
```javascript
{
  questionId: String,
  year: Number,           // 1-3
  role: String,           // cto|cfo|pm
  type: String,           // mcq|numerical|truefalse|rating
  scenario: String,
  question: String,
  options: [{optionId, text, value}],
  correctAnswer: Mixed,
  explanation: String,
  difficulty: String      // easy|medium|hard
}
```

## Key Features

### 🔒 Security & Anti-Cheating
- **Lockdown Mode**: Full-screen exam mode
- **Tab-Switch Detection**: Warns on first 3 switches, auto-submits on 4th
- **Copy-Paste Prevention**: Disabled during questions
- **DevTools Prevention**: F12 and shortcuts blocked
- **Admin Fraud Alerts**: Real-time flagging of suspicious activity

### 🎮 Game Mechanics
- **3-Year Progression**: Year 1 → Year 2 → Year 3
- **Cascade Logic**: Year 1 decisions affect Year 2-3 starting state
- **Role Separation**: CTO, CFO, PM each see different questions
- **Market Events**: Dynamic challenges based on team preparedness
- **Live Leaderboard**: Real-time team rankings by profit

### 📊 Admin Dashboard
- Event status overview
- Fraud detection and alerts
- Team progress tracking
- Manual event triggering

## Deployment

### Deploy to Heroku (Backend)

```bash
cd backend

# Install Heroku CLI
# Log in to Heroku
heroku login

# Create new app
heroku create cloud-tycoon-api

# Add MongoDB addon or set MongoDB URI
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Deploy to Vercel (Frontend)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Update frontend `.env` with backend URL from Heroku.

## Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB URI in `.env`
- Ensure IP whitelist includes your server's IP

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend makes requests to correct `REACT_APP_API_URL`

### Lockdown Mode Not Working
- Check browser console for errors
- Verify event listeners are attached
- Some browsers may have restrictions on fullscreen

### Questions Not Loading
- Verify seed data ran: `npm run seed`
- Check MongoDB has questions collection
- Verify year and role values are correct

## Important Files to Review

1. **backend/src/utils/cascadeLogic.js** - Core game logic (Year 1→2→3 cascade)
2. **backend/src/utils/seedData.js** - Question data (add Years 2-3)
3. **frontend/src/components/LockdownMode.js** - Security features
4. **frontend/src/pages/QuestionPage.js** - Question UI and submission
5. **Plan/CloudTycoon_Website_Design_Plan.md** - Full specification

## Adding More Questions

Edit `backend/src/utils/seedData.js` to add Year 2 and Year 3 questions:

```javascript
// Year 2 questions
{
  questionId: 'Y2_CTO_Q1',
  year: 2,
  role: 'cto',
  // ... rest of question object
}
```

Run seed again: `npm run seed`

## Environment Variables Checklist

**Backend (.env)**
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] PORT
- [ ] FRONTEND_URL

**Frontend (.env)**
- [ ] REACT_APP_API_URL
- [ ] REACT_APP_SOCKET_URL

## Next Steps

1. **Add Years 2-3 Questions**: Update `seedData.js` with all questions
2. **Test Cascade Logic**: Create sample team paths and verify logic
3. **Load Testing**: Test with 60+ simultaneous users
4. **Admin Training**: Train proctors on dashboard
5. **Event Day Checklist**: Print and use Phase 7 checklist

## Support & Debugging

- Check browser console for frontend errors
- Check server logs: `npm run dev` shows all requests
- Verify MongoDB collections have data
- Use admin dashboard to monitor live event

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Ready for Event Day
