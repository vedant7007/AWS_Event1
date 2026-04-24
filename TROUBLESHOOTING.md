# 🔧 Troubleshooting & Error Resolution Guide

## ✅ Errors Already Fixed

### Error 1: `react-scripts is not recognized`
**Problem:** Frontend dependencies not installed  
**Status:** ✅ FIXED  
**What was done:** Ran `npm install` in frontend folder  
**Verification:** Command `npm start` should now work

### Error 2: `Missing script: "seed"`
**Problem:** package.json didn't have seed script  
**Status:** ✅ FIXED  
**What was done:** Added `"seed": "node src/utils/seedDatabase.js"` to backend/package.json  
**Verification:** Command `npm run seed` should now work

### Error 3: `EADDRINUSE: address already in use :::5000`
**Problem:** Another process was using port 5000  
**Status:** ✅ FIXED  
**What was done:** Killed PID 19192 that was using port 5000  
**Verification:** Run `netstat -ano | findstr :5000` - should show nothing

### Error 4: `Cannot find module 'react-icons'`
**Problem:** Password visibility toggle component needs react-icons  
**Status:** ✅ FIXED  
**What was done:** Ran `npm install react-icons` in frontend  
**Verification:** Eye icons show in password fields

---

## 🔐 Authentication Troubleshooting

### Issue: "Team not found" error

**What it means:**
The Team ID doesn't exist in the database.

**Solutions:**
1. Did you register this team?
   - Go to http://localhost:3000/register
   - Fill form with 3 members
   - Copy the Team ID from success message

2. Is Team ID spelled correctly?
   ```
   Correct:   TT-2026-0042
   Incorrect: tt-2026-0042  (case-sensitive!)
   Incorrect: TT-2026-0040  (typo)
   ```

3. Check if team is in database
   - Use MongoDB Compass or Atlas UI
   - Check `cloud-tycoon` → `teams` collection
   - Search for your Team ID

---

### Issue: "Member name or role does not match"

**What it means:**
Name or role doesn't match registration.

**Solutions:**
1. Check name spelling (case doesn't matter)
   ```
   Registered as:  Alice
   Can login with: alice, ALICE, AlIcE (all work)
   Cannot login with: Alise, Aleesa (different spelling)
   ```

2. Check role is correct
   ```
   Valid roles: CTO, CFO, PM (case-insensitive)
   Invalid: CEO, CFT, Manager
   ```

3. View backend logs during registration
   - Terminal should show: "Members registered successfully"
   - Lists all 3 members with names and roles

---

### Issue: "Incorrect password" error

**What it means:**
Password doesn't match what was registered.

**Solutions:**
1. Password is case-sensitive
   ```
   Registered:     CloudTycoon@123
   Login attempt:  cloudtycoon@123
   Result:         ❌ INCORRECT (lowercase @'s don't match)
   ```

2. Check for extra spaces
   ```
   Registered:     CloudTycoon@123
   Login attempt:  " CloudTycoon@123 " (spaces before/after)
   Result:         ❌ INCORRECT
   ```

3. Verify password meets requirements
   ```
   Must have:
   ✓ 8+ characters
   ✓ 1 UPPERCASE letter
   ✓ 1 lowercase letter
   ✓ 1 NUMBER
   ✓ 1 SPECIAL character (!@#$%^&*...)
   ```

---

### Issue: "Password validation failed"

**What it means:**
Password doesn't meet security requirements.

**Valid passwords:**
```
✅ CloudTycoon@123
✅ MyAWS#2024Game
✅ VIT2026@Cloud$
✅ SecurePass$99
```

**Invalid passwords:**
```
❌ password        (no uppercase, number, or special char)
❌ Pass123        (too short, missing special char)
❌ PASSWORD123!  (no lowercase)
❌ Pass!23       (only 7 characters)
```

**Solution:**
Use a strong password with all 5 requirements.

---

### Issue: Eye icon not showing in password field

**What it means:**
react-icons not installed or component not rendering.

**Solutions:**
1. Install react-icons
   ```bash
   cd frontend
   npm install react-icons
   npm start
   ```

2. Verify component
   - Check `frontend/src/components/PasswordInput.js` exists
   - Should use `AiOutlineEye` and `AiOutlineEyeInvisible`

3. Check imports
   - Should have: `import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';`

---

### Issue: Profile page doesn't load after login

**What it means:**
Team data endpoint not working or token not sent.

**Solutions:**
1. Check backend endpoint exists
   - File: `backend/src/routes/auth.js`
   - Should have: `router.get('/team/:teamId', ...)`

2. Check backend is running
   - Terminal should show: `🚀 Cloud-Tycoon Backend running on port 5000`

3. Check browser Network tab (F12)
   - Request to `GET /api/auth/team/TT-2026-XXXX`
   - Should return 200 OK with team data
   - If 401, token not being sent

4. Check token in browser
   - Open console (F12)
   - Type: `localStorage.getItem('token')`
   - Should show JWT token (long string starting with "eyJ...")

5. Check CORS
   - Verify backend allows frontend origin
   - In `backend/src/server.js`:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true
   }));
   ```

---

## 📋 Current Status Check

### What's Working Now ✅

1. **Frontend Dependencies**
   - All npm packages installed
   - react-scripts available
   - react-icons installed
   - `npm start` will work

2. **Backend Configuration**
   - package.json has correct scripts
   - Seed script ready: `npm run seed`
   - .env file created with all variables
   - Port 5000 is available
   - Authentication endpoints configured

3. **Database**
   - seedDatabase.js script ready
   - Question models defined
   - 8 Year 1 questions ready to seed
   - Teams collection ready

4. **Authentication**
   - Password validation implemented
   - JWT tokens working
   - MongoDB Atlas configured
   - Protected routes configured

---

## 🚀 Getting Started NOW

### Step-by-Step Instructions

#### Prerequisites
- Windows PowerShell or Command Prompt
- Node.js 14+ installed
- MongoDB (local or Atlas)

#### Execution

**Step 1: Open PowerShell and navigate to project**
```powershell
cd "c:\Users\Jaswanth Reddy\OneDrive\Desktop\Projects\AWS_Event1"
```

**Step 2: Start MongoDB**
```powershell
# Option A: If you have local MongoDB installed
mongod

# Option B: Use MongoDB Atlas (cloud)
# Edit backend/.env: Update MONGODB_URI
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cloud-tycoon
```

**Step 3: Start Backend (Terminal 1)**
```powershell
cd backend
npm run dev
```

Wait for this message:
```
✓ Connected to MongoDB
🚀 Cloud-Tycoon Backend running on port 5000
```

**Step 4: Seed Database (Terminal 2)**
```powershell
cd backend
npm run seed
```

Wait for this message:
```
✅ Database seeding completed successfully!
```

**Step 5: Start Frontend (Terminal 3)**
```powershell
cd frontend
npm start
```

Wait for browser to open at http://localhost:3000

---

## 🧪 Testing the Platform

### Test Checklist

After all servers are running, verify each step:

```
[ ] Browser shows http://localhost:3000
[ ] Landing page displays with "Register Your Team" button
[ ] Can click "Register Your Team" button
[ ] Registration form loads correctly
[ ] Can enter team name and 3 members
[ ] Registration succeeds and shows Team ID
[ ] Can copy Team ID
[ ] Can go to Login page
[ ] Can log in with Team ID, member name, and password
[ ] After login, Training page displays
[ ] Training page shows role-specific content
[ ] Can see practice question
[ ] Can submit practice question
[ ] No errors in browser console (F12 → Console tab)
[ ] No errors in terminal where `npm run dev` is running
```

---

## 🐛 Common Issues & Solutions

### Issue: Backend doesn't start

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Another process is using port 5000
   ```powershell
   # Find and kill the process
   Get-NetTCPConnection -LocalPort 5000 | Stop-Process -Force
   ```

2. Change port in backend/.env
   ```
   PORT=5001
   ```

3. Wait a few seconds and try again
   ```powershell
   npm run dev
   ```

---

### Issue: Frontend doesn't start

**Error Message:**
```
'react-scripts' is not recognized as an internal or external command
```

**Solutions:**
1. Install dependencies
   ```powershell
   npm install
   ```

2. Clear npm cache and reinstall
   ```powershell
   npm cache clean --force
   npm install
   ```

3. Check Node.js version (must be 14+)
   ```powershell
   node --version  # Should show v14.0.0 or higher
   ```

---

### Issue: MongoDB connection fails

**Error Message:**
```
MongooseError: Cannot connect to mongodb://localhost:27017/cloud-tycoon
```

**Solutions:**

1. Start MongoDB locally
   ```powershell
   mongod
   # Should show: waiting for connections on port 27017
   ```

2. Use MongoDB Atlas instead
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account
   - Create free cluster
   - Get connection string
   - Update backend/.env:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cloud-tycoon
     ```

3. Restart backend after changing .env
   ```powershell
   npm run dev
   ```

---

### Issue: Seed script fails

**Error Message:**
```
Error: Cannot find module 'Question'
```

**Solutions:**
1. Ensure backend is installed
   ```powershell
   npm install
   ```

2. Check that Models folder exists
   ```powershell
   ls src/models/
   # Should show: Team.js, Question.js, Submission.js, etc.
   ```

3. Run from backend folder
   ```powershell
   cd backend  # Make sure you're in backend folder
   npm run seed
   ```

---

### Issue: Questions not appearing in exam

**Error Message:**
No questions show when you try to start Year 1

**Solutions:**
1. Seed the database
   ```powershell
   npm run seed
   ```

2. Verify questions were seeded
   - Use MongoDB Compass or Atlas UI
   - Check `cloud-tycoon` database
   - Collection `questions` should have 8 documents

3. Restart frontend
   ```powershell
   npm start
   ```

---

### Issue: Lockdown mode not working

**Problem:** Lockdown mode doesn't activate, or copy-paste still works

**Solutions:**
1. Chrome/Edge/Firefox browser required (not IE)

2. Try incognito/private window
   ```
   Ctrl+Shift+N (Chrome) or Ctrl+Shift+P (Firefox)
   ```

3. Allow fullscreen when prompted
   - Browser should ask for fullscreen permission
   - Click "Allow"

4. Check browser extensions
   - Extensions might block fullscreen
   - Try disabling extensions temporarily

---

### Issue: Admin dashboard not working

**Problem:** Can't access admin dashboard or see live updates

**Solutions:**
1. Verify Socket.io is connected
   - Open browser console: F12 → Console
   - You should see Socket.io connection messages
   - No errors should appear

2. Restart both backend and frontend
   ```powershell
   # Terminal 1: Stop backend (Ctrl+C) and restart
   npm run dev
   
   # Terminal 2: Stop frontend (Ctrl+C) and restart
   npm start
   ```

3. Clear browser cache
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies
   - Try again

---

### Issue: CORS errors

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
1. Verify FRONTEND_URL in backend/.env
   ```
   FRONTEND_URL=http://localhost:3000
   ```

2. Verify REACT_APP_API_URL in frontend/.env
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Restart backend after changing .env
   ```powershell
   npm run dev
   ```

---

### Issue: Registration fails

**Error Message:**
```
Error: Team registration failed
```

**Solutions:**
1. Check that all 3 members have unique names
   - CTO, CFO, PM must have different names

2. Use strong passwords (4+ characters)
   - Each member needs a password

3. Use valid email format for team lead
   - Example: john@vit.ac.in

4. Check backend console for detailed error
   - Look at Terminal 1 (npm run dev output)

5. Verify database is connected
   - Backend should show: ✓ Connected to MongoDB

---

### Issue: Login always fails

**Error Message:**
```
Error: Invalid credentials
```

**Solutions:**
1. Use exact Team ID from registration
   - Example: TT-2026-0042
   - Case sensitive

2. Use exact member name from registration
   - Must match exactly (case sensitive)
   - Don't add spaces

3. Verify password is correct
   - Passwords are case sensitive
   - No spaces allowed

4. Make sure team was registered
   - Go to /register and create a new team if needed

---

## 🔍 Debugging Tips

### Enable Debug Logs

Edit backend/.env:
```
ENABLE_DEBUG_LOGS=true
```

This will show detailed logs in Terminal 1 when backend runs.

### Check Browser Console

```
1. Open browser (http://localhost:3000)
2. Press F12 to open Developer Tools
3. Click "Console" tab
4. Look for errors (red) or warnings (yellow)
5. Take note of error messages
```

### Check Backend Logs

```
Terminal 1 (where npm run dev is running):
- Look for any [ERROR] messages
- Look for MongoDB connection status
- Look for API request logs
```

### Use MongoDB Compass

Download MongoDB Compass to visualize your database:
```
1. Go to https://www.mongodb.com/products/compass
2. Download and install
3. Connect to mongodb://localhost:27017
4. Browse the cloud-tycoon database
5. Check if questions are there
```

---

## 📞 Getting Help

If you encounter an error not listed here:

1. **Copy the exact error message**
   - From browser console (F12)
   - Or from terminal output

2. **Note what you were doing**
   - Example: "Trying to login as CTO"

3. **Check this file first**
   - Search for the error keyword

4. **Check other documentation**
   - README.md - Project overview
   - SETUP.md - Detailed setup
   - WORKFLOW_AND_SETUP.md - Workflow explanation

5. **Review code comments**
   - All code files have detailed comments
   - Backend: src/routes/*.js
   - Frontend: src/pages/*.js

---

## ✅ Verification Checklist

Before considering setup complete, verify:

```
[ ] Backend running: Terminal shows "🚀 Cloud-Tycoon Backend running on port 5000"
[ ] Frontend running: Browser shows landing page with Cloud-Tycoon branding
[ ] Database connected: Backend console shows "✓ Connected to MongoDB"
[ ] Questions seeded: `npm run seed` completes successfully
[ ] Registration works: Can create a test team and get Team ID
[ ] Login works: Can login with Team ID + member name + password
[ ] Training loads: Training page shows after login
[ ] No errors: Browser console (F12) shows no red errors
```

Once all checkboxes are done, your platform is ready! 🎉

---

## 🎓 What to Do Next

1. **Test the full flow** (30 minutes)
   - Register a team
   - Login as CTO, CFO, and PM
   - Complete Year 1 practice questions
   - Check Year-end report
   - View leaderboard

2. **Add more questions** (2-3 hours)
   - Edit `backend/src/utils/seedDatabase.js`
   - Add Year 2 questions (18 questions)
   - Add Year 3 questions (18 questions)
   - Run `npm run seed` again

3. **Define cascade rules** (1-2 hours)
   - Edit `backend/src/utils/cascadeLogic.js`
   - Define how Year 1 decisions affect Year 2-3
   - Test with sample team data

4. **User testing** (1-2 hours)
   - Have 5-10 students test the platform
   - Collect feedback on question clarity
   - Note any bugs or UX issues
   - Fix issues found

5. **Deploy to production** (1-2 hours)
   - Deploy backend to Heroku
   - Deploy frontend to Vercel
   - Set up MongoDB Atlas
   - Update environment variables

---

**Last Updated:** April 24, 2026  
**Status:** Ready for Testing ✅

Good luck! 🚀 If you need help with any errors, come back to this guide!
