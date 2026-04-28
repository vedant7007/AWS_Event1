const mongoose = require('mongoose');

const gameSettingsSchema = new mongoose.Schema({
  id: {
    type: String,
    default: 'global_settings',
    unique: true
  },
  currentRound: {
    type: Number,
    default: 0, // Year 0 = Round 1
    min: 0,
    max: 4
  },
  isRoundActive: {
    type: Boolean,
    default: false
  },
  competitionName: {
    type: String,
    default: 'Cloud Tycoon 2026'
  },
  competitionRules: {
    type: String,
    default: 'Welcome to Cloud Tycoon. Sequential rounds, role-based strategy.'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  broadcasts: [{
    message: String,
    type: { type: String, default: 'info' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('GameSettings', gameSettingsSchema);
