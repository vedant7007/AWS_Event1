const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

/**
 * GET /api/leaderboard
 * Get live leaderboard
 */
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find(
      { eventStatus: { $in: ['registered', 'in-progress', 'completed'] }, teamId: { $ne: 'ADMIN-EVENT-2026' } },
      'teamId teamName gameState finalScore points createdAt'
    )
      .sort({ 'finalScore.cumulativeProfit': -1, createdAt: 1 })
      .limit(100);

    const leaderboard = teams.map((team, idx) => ({
      rank: team.finalScore?.rank || idx + 1,
      teamId: team.teamId,
      teamName: team.teamName,
      currentYear: team.currentYear,
      year1Profit: team.gameState?.year1?.companyState?.cumulativeProfit || 0,
      year2Profit: team.gameState?.year2?.companyState?.cumulativeProfit || 0,
      year3Profit: team.gameState?.year3?.companyState?.cumulativeProfit || 0,
      status: team.eventStatus,
      cumulativeProfit: team.finalScore?.cumulativeProfit || 0
    }));

    res.status(200).json({
      timestamp: new Date().toISOString(),
      totalTeams: leaderboard.length,
      leaderboard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/leaderboard/:teamId
 * Get specific team's leaderboard position
 */
router.get('/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const position = await Team.countDocuments({
      eventStatus: { $in: ['in-progress', 'completed'] },
      'finalScore.cumulativeProfit': { $gt: team.finalScore?.cumulativeProfit || 0 }
    });

    res.status(200).json({
      teamId,
      teamName: team.teamName,
      rank: position + 1,
      cumulativeProfit: team.finalScore?.cumulativeProfit || 0,
      currentYear: team.currentYear,
      status: team.eventStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
