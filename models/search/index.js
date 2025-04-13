const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isAISearch: { 
        type: Boolean,
        default: false,
    },
    query: { 
        type: Object
    },
    result: { 
        type: Array
    },
}, { timestamps: true });

module.exports = mongoose.model('Search', searchSchema);