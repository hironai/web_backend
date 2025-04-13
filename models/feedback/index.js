const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, default: "general", enum: ["general", "bug", "feature"] },
        feed: { type: mongoose.Schema.Types.Mixed }
    },{ timestamps: true, }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
