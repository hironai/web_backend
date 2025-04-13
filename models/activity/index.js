const mongoose = require('mongoose');
const { ACTIVITYTYPE } = require('../../constants/APPLICATION');

const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: {  type: String, default: "" },
    type: {  type: String,  required: true, default: ACTIVITYTYPE.INFO }, // payment, update, account, info
    metadata: {  type: Object, default: {} },
    ip: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);