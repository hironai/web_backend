const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {  type: String,  required: true  },
    email: { type: String, ref: "User", required: true },
    subject: {  type: String,  required: true },
    message: {  type: Array,  required: true }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
