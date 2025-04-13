// const mongoose = require('mongoose');
// const { SUBSCRIPTION } = require('../../constants/APPLICATION');

// const subscriptionSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     paymentMethod: { type: String, required: true },
//     amount: { type: String, required: true },
//     subscription: { type: String, required: true, enum: SUBSCRIPTION },
//     status: { type: String, required: true }, // failure, success
// }, { timestamps: true });

// module.exports = mongoose.model('Subscription', subscriptionSchema);



const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: String,              // Transaction ID
  type: {                         // 'subscription', 'template', 'service', etc.
    type: String,
    enum: ['subscription', 'template', 'service'],
    required: true,
  },
  amount: Number,
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
  date: { type: Date, default: Date.now },
  method: String,                 // e.g., 'stripe', 'paypal'
  details: mongoose.Schema.Types.Mixed, // Any gateway-specific info
});

const subscriptionSchema = new mongoose.Schema({
  model: {
    type: String,                 // e.g., 'Free', 'Starter', 'Pro', 'Enterprise'
    default: 'Free',
  },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  features: {
    candidateSearch: { type: Boolean, default: true },
    aiRecommendations: { type: Boolean, default: false },
    resumeFreeHiring: { type: Boolean, default: true },
    accessToTemplates: { type: Boolean, default: false },
    supportLevel: { type: String, enum: ['none', 'basic', 'priority'], default: 'basic' },
  },
  renewsAutomatically: { type: Boolean, default: true },
  isComplementary: { type: Boolean, default: false }, // e.g., for free trials or special offers
});

const userSubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  currentSubscription: subscriptionSchema,

  subscriptionHistory: [subscriptionSchema],

  paymentHistory: [paymentSchema],

  totalPaymentsMade: { type: Number, default: 0 }
}, { timestamps: true });


module.exports = mongoose.model('Subscription', userSubscriptionSchema);