const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, ref: "User", required: true },
    feature: {  type: String, default: ""}
}, { timestamps: true });

module.exports = mongoose.model('Newsletter', newsletterSchema);
