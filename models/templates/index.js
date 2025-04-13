const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    premium: { type: Boolean, default: false },
    price: { type: String, default: "Free" }, // Only applicable for premium templates
    popular: { type: Boolean, default: false },
    previewUrl: { type: String, required: true }
}, { timestamps: true });

const Template = mongoose.model("Template", templateSchema);
module.exports = Template;
