const mongoose = require("mongoose");
const { Notifications } = require("../../constants/NOTIFICATIONS");

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: Boolean, default: false },
    changeAllowed: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now }
});

const organizationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    personalDetails: {
        phone: { type: String, default: "" },
        website: { type: String, default: "" },
        headline: { type: String, default: "" },
        bio: { type: String,  default: "", maxlength: 5000 },
    },
    address: [
        {
            type: {
                addressLine1: { type: String, default: "" },
                addressLine2: { type: String, default: "" },
                city: { type: String, default: "" },
                state: { type: String, default: "" },
                postalCode: { type: String, default: "" },
                country: { type: String, default: "" },
                isPublic: { type: Boolean, default: false },
            },
            default: []
        }
    ],
    paymentSettings: {
        methods: { type: Array, default: [] },
        cards: { type: Array, default: [] },
        history: { type: Array, default: [] },
    },
    // notificationSettings: {
    //     emailNotifications: { type: Boolean, default: true },
    //     profileUpdates: { type: Boolean, default: false },
    //     newTemplates: { type: Boolean, default: false },
    //     marketingEmails: { type: Boolean, default: false },
    // },
    notificationSettings: {
        type: [notificationSchema],
        default: Notifications
    },
    savedCandidates: { type: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
        }
    ], default: [] },
}, { timestamps: true });

const Organization = mongoose.model("Organization", organizationSchema);
module.exports = Organization;