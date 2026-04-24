const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Question = require('../models/Question');
const GameSettings = require('../models/GameSettings');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

/**
 * GET /api/admin/settings
 * Get global game settings
 */
router.get('/settings', verifyToken, async (req, res) => {
  try {
    let settings = await GameSettings.findOne({ id: 'global_settings' });
    if (!settings) {
      settings = new GameSettings({ id: 'global_settings' });
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/settings
 * Update active round or start/stop round
 */
router.post('/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { currentRound, isRoundActive } = req.body;
    const settings = await GameSettings.findOneAndUpdate(
      { id: 'global_settings' },
      { currentRound, isRoundActive, lastUpdated: new Date() },
      { new: true, upsert: true }
    );
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/teams
 */
router.get('/teams', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const teams = await Team.find(
      { teamId: { $ne: 'ADMIN-EVENT-2026' } },
      'teamId teamName members currentYear eventStatus points finalScore gameState'
    );

    res.status(200).json({
      total: teams.length,
      teams: teams.map(team => ({
        teamId: team.teamId,
        teamName: team.teamName,
        members: team.members ? team.members.map(m => ({ name: m.name, role: m.role })) : [],
        status: team.eventStatus,
        currentYear: team.currentYear,
        points: team.points || 0,
        cumulativeProfit: team.finalScore?.cumulativeProfit || 0,
        gameState: team.gameState
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/reset-game
 */
router.post('/reset-game', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { resetType } = req.body;
    if (resetType === 'total') {
      await Team.deleteMany({ teamId: { $ne: 'ADMIN-EVENT-2026' } });
    } else {
      await Team.updateMany({}, { 
        currentYear: 0, 
        points: 0, 
        eventStatus: 'registered',
        gameState: {} 
      });
    }
    await GameSettings.findOneAndUpdate(
      { id: 'global_settings' },
      { currentRound: 0, isRoundActive: false, lastUpdated: new Date() }
    );
    res.status(200).json({ message: 'Game re-initialized.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Question Management (CRUD)
 */
router.get('/questions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const questions = await Question.find().sort({ year: 1, role: 1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/questions', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { year, role, question, options, correctAnswer, points } = req.body;
    const questionId = `Q-${year}-${role}-${Date.now()}`;
    const newQuestion = new Question({
      questionId,
      year,
      role,
      question,
      options,
      correctAnswer,
      type: 'mcq',
      scenario: 'AWS Operational Event',
      scoringRubric: { full: points || 10, incorrect: 0 }
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/questions/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/questions/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Question eliminated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Create Admin
 */
const bcrypt = require('bcryptjs');

router.post('/create-admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { teamId, memberName, password } = req.body;
    if (await Team.findOne({ teamId })) return res.status(400).json({ error: 'Admin ID exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminTeam = new Team({
      teamId, teamName: 'Admin Control',
      members: [{ name: memberName, role: 'admin', password: hashedPassword, userId: `admin-${Date.now()}` }],
      currentYear: 0, eventStatus: 'registered'
    });
    await adminTeam.save();
    res.status(201).json({ message: 'Admin created successfully', teamId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
