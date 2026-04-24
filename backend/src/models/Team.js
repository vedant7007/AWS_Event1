const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  teamLead: {
    name: String,
    email: String,
    phone: String
  },
  members: [
    {
      userId: String,
      name: String,
      role: {
        type: String,
        enum: ['cto', 'cfo', 'pm'],
        required: true
      },
      password: String,
      lastLogin: Date
    }
  ],
  college: String,
  department: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  eventStatus: {
    type: String,
    enum: ['registered', 'in-progress', 'completed'],
    default: 'registered'
  },
  currentYear: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  fraudFlags: {
    tabSwitches: { type: Number, default: 0 },
    multiDeviceLogin: { type: Boolean, default: false },
    fastSubmissions: { type: Number, default: 0 },
    lastFlaggedAt: Date
  },
  gameState: {
    year1: {
      answers: {
        cto: {},
        cfo: {},
        pm: {}
      },
      scores: {
        cto: Number,
        cfo: Number,
        pm: Number,
        roundAvg: Number
      },
      companyState: {
        monthlyBill: Number,
        monthlyRevenue: Number,
        runwayMonths: Number,
        cumulativeProfit: Number
      },
      marketEvent: {
        name: String,
        penalty: Number,
        description: String
      },
      submittedAt: Date
    },
    year2: {
      answers: {
        cto: {},
        cfo: {},
        pm: {}
      },
      scores: {
        cto: Number,
        cfo: Number,
        pm: Number,
        roundAvg: Number
      },
      companyState: {
        monthlyBill: Number,
        monthlyRevenue: Number,
        runwayMonths: Number,
        cumulativeProfit: Number
      },
      marketEvent: {
        name: String,
        penalty: Number,
        description: String
      },
      submittedAt: Date
    },
    year3: {
      answers: {
        cto: {},
        cfo: {},
        pm: {}
      },
      scores: {
        cto: Number,
        cfo: Number,
        pm: Number,
        roundAvg: Number
      },
      companyState: {
        monthlyBill: Number,
        monthlyRevenue: Number,
        runwayMonths: Number,
        cumulativeProfit: Number
      },
      marketEvent: {
        name: String,
        penalty: Number,
        description: String
      },
      submittedAt: Date
    }
  },
  finalScore: {
    cumulativeProfit: Number,
    totalScore: Number,
    rank: Number,
    finishedAt: Date
  }
}, { timestamps: true });

// Index for fast leaderboard queries
teamSchema.index({ 'finalScore.cumulativeProfit': -1 });
teamSchema.index({ 'finalScore.rank': 1 });
teamSchema.index({ eventStatus: 1, currentYear: 1 });

module.exports = mongoose.model('Team', teamSchema);
