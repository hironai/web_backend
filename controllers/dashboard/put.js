const { ACTIVITYTYPE } = require("../../constants/APPLICATION");
const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const activity = require("../../models/activity");
const User = require("../../models/auth/user");
const shortlisted = require("../../models/organization/shortlisted");
const { updateCandidateDashboard, getCandidateStats } = require("../../services/candidates");
const { getActivity } = require("../../services/organization/checkProfileCompletion");
const { deleteCandidate, addCandidate } = require("../../services/organization/shortListService");
const { updateOrganizationDashboard } = require("../../services/organization/uploadEmployees");
const throwError = require("../../utils/error/error");

// ============================== PUT DASHBOARD CONTROLLER START =====================

const updateDashboard = catchAsyncErrors(async (req, res, next) => {
    let { role, userId } = req.user;
    let updateData = req.body; // Get only the provided fields

    if (!updateData || Object.keys(updateData).length === 0) {
        throwError(req.t('dashboard.candidate.error.empty_update'), STATUS.BAD_REQUEST);
    }

    let dashboard;

    if (req.body.name) {
        await User.findOneAndUpdate(
            { _id: userId },
            { $set: updateData }, // ✅ Dynamically update only provided fields
            { new: true, runValidators: true }
        );
    }

    if (role === "Candidate" || role === "Admin") {
        dashboard = await updateCandidateDashboard(req, res, next);
        dashboard['stats'] = await getCandidateStats(dashboard);
        // dashboard.updatedAt = getLastActiveStatus(dashboard.updatedAt);
    }
    else if (role === "Organization") {
        dashboard = await updateOrganizationDashboard(req, res, next);
        // dashboard.updatedAt = getLastActiveStatus(dashboard.updatedAt);
    }
    else {
        throwError(req.t('dashboard.candidate.error.invalid_role'), STATUS.BAD_GATEWAY);
    }

    // ✅ Save activity in database
    await activity.create({
        user: userId,
        type: ACTIVITYTYPE.UPDATE,
        title: `${req.body.notificationSettings ? "Email preferences updated in dashboard" : req.body.name? "You updated your profile via dashboard" : "You updated your dashboard information"}`,
        metadata: {
            query: req.body,
            result: dashboard
        },
    });

    // Fetch user activity
        dashboard["activity"] = await getActivity(userId);

    // send new auth token
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('dashboard.candidate.success.updated_dashboard'),
        dashboard
    });
});


// ============================== PUT DASHBOARD CONTROLLER END =====================


// ============================== SHORTLIST CANDITATES CONTROLLER START =====================

const shortlistCandidate = catchAsyncErrors(async (req, res, next) => {
    const candidateId = req.query.candidate;
    const userId = req.user.userId;
    let deletedCandidate = null;
    let shortlistedCandidate = null;

    if (!candidateId) {
        throwError(req.t('dashboard.organization.error.invalid_candidate_id'), STATUS.BAD_REQUEST);
    }

    // 🔍 Step 1: Check if Candidate is Already Shortlisted
    const existingEntry = await shortlisted.findOne({ user: userId, candidate: candidateId });
    

    if (existingEntry) {
        // 🗑️ Step 2: If Exists, Remove It
        deletedCandidate = await deleteCandidate(userId, candidateId);

    } else {
        // ✅ creation the candidate
        shortlistedCandidate = await addCandidate(userId, candidateId);
        
    }
    
    await activity.create({
        user: userId,
        type: ACTIVITYTYPE.INFO,
        title: deletedCandidate ? `You delisted ${deletedCandidate.candidate.name} from shortlisted candidates` : `${shortlistedCandidate.candidate.name} added to shortlisted collection`,
        metadata: {
            query: deletedCandidate? "Delist Candidate" : "Shortlist Candidate",
            result: deletedCandidate? deletedCandidate : shortlistedCandidate
        }
    });


    let userActivity = await getActivity(userId);

    return res.status(STATUS.SUCCESS).json({
        success: true,
        userActivity,
        message: deletedCandidate? req.t("dashboard.organization.success.candidate_removed") : req.t("dashboard.organization.success.candidate_saved")
    });
});


// ============================== SHORTLIST CANDITATES CONTROLLER END =====================


// Export all endpoints
module.exports = {
    PUT: {
        updateDashboard,
        shortlistCandidate
    }
};