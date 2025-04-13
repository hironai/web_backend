const ROLES = ['Admin', 'Candidate', 'Guest', 'Organization'];
const ORGANIZATIONTYPE = ["Company", "University", "Government Agency", "Other"];

const REFER_BETCH_COUNT = 10;

const SUBSCRIPTION = ["Bloom(Bronze) 🌿", "Glow(Silver) ✨", "Flourish(Gold) 🌟",  "Thrive(Diamond) 💎"];

const ACTIVITYTYPE = {
    INFO: "Info",
    SUCCESS: "Success",
    WARNING: "Warning",
    ALERT: "Alert",
    INVITATION: "Invitation",
    SEARCH: "Search",
    EMAIL: "Email",
    UPLOAD: "Upload",
    DELETE: "Delete",
    CREATE: "Create",
    UPDATE: "Update",
    PAYMENT: "Payment",
    SUBSCRIPTION: "Subscription",
    PROFILE: "Profile",
    SETTINGS: "Settings",
    NOTIFICATION: "Notification"
}

module.exports = { ROLES, REFER_BETCH_COUNT, SUBSCRIPTION, ORGANIZATIONTYPE, ACTIVITYTYPE };
