const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Question = require('../models/Question');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

/**
 * GET /api/admin/status
 * Get real-time event status
 */
router.get('/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();
    const registeredTeams = await Team.countDocuments({ eventStatus: 'registered' });
    const inProgressTeams = await Team.countDocuments({ eventStatus: 'in-progress' });
    const completedTeams = await Team.countDocuments({ eventStatus: 'completed' });

    const year1Teams = await Team.countDocuments({ currentYear: 1 });
    const year2Teams = await Team.countDocuments({ currentYear: 2 });
    const year3Teams = await Team.countDocuments({ currentYear: 3 });

    res.status(200).json({
      timestamp: new Date().toISOString(),
      teams: {
        total: totalTeams,
        registered: registeredTeams,
        inProgress: inProgressTeams,
        completed: completedTeams
      },
      currentYear: {
        year1: year1Teams,
        year2: year2Teams,
        year3: year3Teams
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/alerts
 * Get fraud and suspicious activity alerts
 */
router.get('/alerts', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const teamsWithFlags = await Team.find(
      { 'fraudFlags.tabSwitches': { $gt: 0 } },
      'teamId teamName fraudFlags gameState'
    );

    const alerts = teamsWithFlags.map(team => ({
      teamId: team.teamId,
      teamName: team.teamName,
      tabSwitches: team.fraudFlags.tabSwitches,
      multiDeviceLogin: team.fraudFlags.multiDeviceLogin,
      fastSubmissions: team.fraudFlags.fastSubmissions,
      lastFlaggedAt: team.fraudFlags.lastFlaggedAt,
      currentYear: team.currentYear
    }));

    res.status(200).json({
      totalAlerts: alerts.length,
      alerts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/teams/:teamId/flag
 * Flag a team for suspicious activity
 */
router.post('/teams/:teamId/flag', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { reason } = req.body;

    await Team.updateOne(
      { teamId },
      { 
        $inc: { 'fraudFlags.tabSwitches': 1 },
        'fraudFlags.lastFlaggedAt': new Date()
      }
    );

    res.status(200).json({ message: 'Team flagged successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/events/:eventId/trigger
 * Manually trigger a market event
 */
router.post('/events/:eventId/trigger', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Trigger market event for all teams in a specific year
    res.status(200).json({ message: 'Event triggered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/teams
 * Get all teams with detailed information
 */
router.get('/teams', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const teams = await Team.find(
      {},
      'teamId teamName currentYear eventStatus finalScore gameState.year1.submittedAt gameState.year2.submittedAt gameState.year3.submittedAt'
    );

    res.status(200).json({
      total: teams.length,
      teams: teams.map(team => ({
        teamId: team.teamId,
        teamName: team.teamName,
        status: team.eventStatus,
        currentYear: team.currentYear,
        rank: team.finalScore?.rank,
        cumulativeProfit: team.finalScore?.cumulativeProfit,
        year1Completed: !!team.gameState?.year1?.submittedAt,
        year2Completed: !!team.gameState?.year2?.submittedAt,
        year3Completed: !!team.gameState?.year3?.submittedAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
