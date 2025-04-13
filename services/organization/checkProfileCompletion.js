const activity = require("../../models/activity");
const User = require("../../models/auth/user");
const Candidate = require("../../models/dashboard/candidate");
const { valideSearchLimit } = require("../../validator/search");

exports.checkProfileCompletion = (candidate) => {
    return (
        candidate.personalDetails.phone &&
        candidate.personalDetails.dateOfBirth &&
        candidate.personalDetails.bio &&
        candidate.professionalDetails.currentTitle &&
        candidate.professionalDetails.currentCompany &&
        candidate.professionalDetails.skills.length > 0 &&
        candidate.experience.length > 0 &&
        candidate.education.length > 0
    );
}


exports.getLastActiveStatus = (lastActive) => {
    const now = new Date();
    const diffTime = Math.abs(now - lastActive);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays <= 7) return "last 7 days";
    if (diffDays <= 30) return "last 30 days";
    if (diffDays <= 90) return "last 90 days";
    return `inactive for ${diffDays} days`;
}

exports.getLastActiveStatus = (lastActiveDate) => {

    const diff = Date.now() - new Date(lastActiveDate);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // if (minutes < 5) return "Active";
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
};

exports.countRefers = async (userId) => {

    // 🔍 Count total referred users
    const totalRefers = await User.countDocuments({ referBY: userId });

    // 🔍 Count total active referred users (those who have `isWelcomeSent: true`)
    const totalActiveRefers = await User.countDocuments({ referBY: userId, isWelcomeSent: true });

    // 🔍 Fetch latest 5 active referred users (sorted by `createdAt`)
    const latestActiveRefers = await User.find({ referBY: userId, isWelcomeSent: true })
        .sort({ createdAt: -1 }) // Latest first
        .limit(10) // Get 10 latest active referred users
        .select("name email createdAt") // Select required fields only
        .lean(); // Optimize performance

    return {
        totalRefers,
        totalActiveRefers,
        latestActiveRefers: latestActiveRefers.map(user => ({
            name: user.name,
            email: user.email,
            date: user.createdAt.toISOString() // Format as ISO string
        }))
    };
};

function calculatePercentageChange(current, previous) {
    if (previous === 0) {
        return `${current} new employee(s)`; // ✅ Show new additions instead of N/A
    }
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(2)}% increase from last month`;
}


exports.getOrganizationStats = async (organizationId) => {
    try {
        // 📅 Get the timestamp for one month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // 🔍 Count total employees
        const totalEmployees = await User.countDocuments({ "organizations.organizationId": organizationId });

        // 🔍 Count total employees last month
        const lastMonthTotalEmployees = await User.countDocuments({
            "organizations.organizationId": organizationId,
            createdAt: { $lte: oneMonthAgo } // Users created before last month
        });

        // 🔍 Count employees with pending status
        const pendingEmployees = await User.countDocuments({
            "organizations.organizationId": organizationId,
            "organizations.isAccepted": false
        });

        // 🔍 Count pending employees last month
        const lastMonthPendingEmployees = await User.countDocuments({
            "organizations.organizationId": organizationId,
            "organizations.isAccepted": false,
            createdAt: { $lte: oneMonthAgo }
        });

        // 🔍 Fetch active employees (Accepted users)
        const activeUsers = await User.find({
            "organizations.organizationId": organizationId,
            "organizations.isAccepted": true
        }).select("_id");

        // Get user IDs of active employees
        const activeUserIds = activeUsers.map(user => user._id);

        // 🔍 Fetch Candidate profiles to determine profile completion
        const candidates = await Candidate.find({ user: { $in: activeUserIds } }).select("user personalDetails professionalDetails experience education");

        let completedProfiles = 0;
        let incompleteProfiles = 0;

        candidates.forEach(candidate => {
            if (this.checkProfileCompletion(candidate)) {
                completedProfiles++;
            } else {
                incompleteProfiles++;
            }
        });

        const activeEmployees = completedProfiles + incompleteProfiles; // ✅ Active = Complete + Incomplete

        // 🔍 Count active employees last month
        const lastMonthActiveEmployees = await Candidate.countDocuments({
            user: { $in: activeUserIds },
            createdAt: { $lte: oneMonthAgo }
        });

        // 📊 Calculate percentage changes for each category
        const totalEmployeesChange = calculatePercentageChange(totalEmployees, lastMonthTotalEmployees);
        const pendingEmployeesChange = calculatePercentageChange(pendingEmployees, lastMonthPendingEmployees);
        const activeEmployeesChange = calculatePercentageChange(activeEmployees, lastMonthActiveEmployees);

        let isSearchAllowed = await valideSearchLimit(organizationId);

        return stats = [
            { name: "Total Employees", value: totalEmployees, icon: "Users", change: totalEmployeesChange },
            { name: "Active Profiles", value: activeEmployees, icon: "UserCheck", change: activeEmployeesChange },
            { name: "Pending Invitations", value: pendingEmployees, icon: "Mail", change: pendingEmployeesChange },
            { name: "Searches Today", value: `${isSearchAllowed.todaySearchCount}/20`, icon: "Search", change: `& ${10 - isSearchAllowed.todayAISearchCount} AI searches remaining` }
        ];

        // return {
        //     totalEmployees: {
        //         count: totalEmployees,
        //         change: totalEmployeesChange
        //     },
        //     pendingEmployees: {
        //         count: pendingEmployees,
        //         change: pendingEmployeesChange
        //     },
        //     activeEmployees: {
        //         count: activeEmployees,
        //         change: activeEmployeesChange
        //     },
        //     search: {
        //         count: isSearchAllowed.todaySearchCount,
        //         change: `& ${10 - isSearchAllowed.todayAISearchCount} AI searches remaining`
        //     }
        // };

    } catch (error) {
        console.error("Error fetching organization stats:", error);
        throw error;
    }
};


exports.getActivity = async (userId) => {

    return await activity
        .find({ user: userId })
        .sort({ createdAt: -1 }) // ✅ Get latest activities first
        .limit(5) // ✅ Limit to 5 activities
        .select("-metadata") // ✅ Exclude metadata field
        .populate("user", "name email") // ✅ Populate user with name & email
        .lean() // ✅ Improve performance by skipping Mongoose conversion
        .then(results => results.map(act => ({
            ...act,
            createdAt: this.getLastActiveStatus(act.createdAt) // ✅ Format `createdAt`
        })));
};