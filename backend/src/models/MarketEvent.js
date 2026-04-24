const mongoose = require('mongoose');

const marketEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    unique: true,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  description: String,
  scenario: String,
  impact: {
    ifPrepared: {
      penalty: Number,
      description: String
    },
    ifUnprepared: {
      penalty: Number,
      description: String
    }
  },
  triggerConditions: {
    type: String,
    enum: ['automatic', 'manual', 'random'],
    default: 'automatic'
  },
  triggerAt: Date,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  appliedTeams: [String]
}, { timestamps: true });

module.exports = mongoose.model('MarketEvent', marketEventSchema);
