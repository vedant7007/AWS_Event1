const mongoose = require('mongoose');

const cascadeRuleSchema = new mongoose.Schema({
  ruleId: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  description: String,
  triggerCondition: {
    year: Number,
    role: String,
    questionId: String,
    answerValue: mongoose.Schema.Types.Mixed
  },
  effect: {
    targetYear: Number,
    stateChanges: {
      monthlyBillModifier: Number,
      revenueModifier: Number,
      runwayModifier: Number
    },
    metadata: mongoose.Schema.Types.Mixed
  },
  priority: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('CascadeRule', cascadeRuleSchema);
