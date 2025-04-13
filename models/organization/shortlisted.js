const mongoose = require('mongoose');

const shortlistedSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: [
            {
                title: {type: String},
                round: {type: String},
                description: {type: String}
            }
        ],
        default: []
    },
    isInterviewing: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Shortlisted', shortlistedSchema);