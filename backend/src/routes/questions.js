const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/questions/:year/:role
 * Get all questions for a specific year and role
 */
router.get('/:year/:role', verifyToken, async (req, res) => {
  try {
    const { year, role } = req.params;

    // Validate inputs
    if (![1, 2, 3].includes(parseInt(year))) {
      return res.status(400).json({ error: 'Invalid year (1-3)' });
    }

    if (!['cto', 'cfo', 'pm'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const questions = await Question.find(
      { year: parseInt(year), role },
      '-correctAnswer -explanation -scalingEffect'
    );

    if (!questions.length) {
      return res.status(404).json({ error: 'No questions found' });
    }

    res.status(200).json({
      year: parseInt(year),
      role,
      count: questions.length,
      questions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/questions/:questionId
 * Get a specific question (for admin/preview)
 */
router.get('/question/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findOne({ questionId });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
