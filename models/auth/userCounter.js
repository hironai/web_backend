const mongoose = require("mongoose");

const userCounterSchema = new mongoose.Schema({
    baseName: { type: String, unique: true }, // Example: "ankit"
    counter: { type: Number, default: 1 } // Counter for each name
});

const UserCounter = mongoose.model("UserCounter", userCounterSchema);
module.exports = UserCounter;
