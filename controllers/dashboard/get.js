const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/auth/user");
const Candidate = require("../../models/dashboard/candidate");
const Organization = require("../../models/dashboard/organization");
const { getCandidateStats, getCandidateDetails } = require("../../services/candidates");
const { getOrganizationStats, countRefers, getActivity } = require("../../services/organization/checkProfileCompletion");
const { searchOrganizationEmployees } = require("../../services/search");
const throwError = require("../../utils/error/error");
const { fetchshortlistCandidates } = require("../../services/organization/shortListService");
const { QUICKACTIONS } = require("../../constants/DASHBOARD");
const { valideSearchLimit } = require("../../validator/search");
const feedback = require("../../models/feedback");

// ============================== GET DASHBOARD CONTROLLER START =====================

const getDashboardById = catchAsyncErrors(async (req, res, next) => {
    let { userId, role } = req.user
    let dashboard;

    if (role === "Candidate" || role === "Admin") {
        dashboard = await Candidate.findOne({ user: userId }).populate({
            path: 'user',
            select: 'name email userName role'
        }).populate({
            path: 'templates.templateId',
            model: 'Template',
        }).lean();

        // Merge templateId fields into each template object
        if (dashboard?.templates?.length) {
            dashboard.templates = dashboard.templates.map(template => {
                const { templateId, ...rest } = template;
                if (templateId && typeof templateId === 'object') {
                    return {
                        ...rest,
                        templateId: templateId._id,
                        ...templateId,
                    };
                }
                return template;
            });
        }

        // dashboard.updatedAt = getLastActiveStatus(dashboard.updatedAt);

        dashboard['stats'] = await getCandidateStats(dashboard);
    }
    else if (role === "Organization") {
        
        dashboard = await Organization.findOne({ user: userId }).populate({
            path: 'user',
            select: 'name email userName role contactPerson organizationType'
        }).lean();

        dashboard['stats'] = await getOrganizationStats(userId);
        
        
        // dashboard['employees'] = await getOrganizationEmployees(userId);
        dashboard['quickactions'] = QUICKACTIONS;

        let isSearchAllowed = await valideSearchLimit(userId);
        dashboard['remainingAISearches'] = 10 - isSearchAllowed.todayAISearchCount;
        dashboard['remainingFreeSearches'] = 20 - isSearchAllowed.todaySearchCount;

    }
    else {
        throwError(req.t('dashboard.candidate.error.invalid_role'), STATUS.BAD_GATEWAY);
    }

    // Fetch user activity
    dashboard["activity"] = await getActivity(userId);

    // fetch user refers count
    dashboard["refers"] = await countRefers(userId);

    // 🔍 Find the most recent feedback from this user
    const lastFeedback = await feedback.findOne({ user: userId })
        .sort({ createdAt: -1 }) // most recent first
        .select("createdAt");    // we only need createdAt

    // 🧠 Logic to decide whether to ask for feedback
    if (!lastFeedback) {
        dashboard['askFeedback'] = true;
    } else {
        const lastDate = new Date(lastFeedback.createdAt);
        const now = new Date();
        const diffInDays = (now - lastDate) / (1000 * 60 * 60 * 24);

        dashboard['askFeedback'] = diffInDays >= 5;
    }

    // send new auth token
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('dashboard.candidate.success.get_dashboard'),
        dashboard
    });
});

// ============================== GET DASHBOARD CONTROLLER END =====================

// ============================== GET DATABSE EMPLOYEES CONTROLLER START =====================

const getOrganizationEmployees = catchAsyncErrors(async (req, res, next) => {
    let { userId } = req.user;
    let { search, status, lastActive, page = 1 } = req.query;
    const limit = 100; // Employees per page


    let userFilter = { 'organizations.organizationId': userId };

    // 🔍 Apply `lastActive` filter (if provided)
    if (lastActive) {
        let dateFilter = new Date();
        if (lastActive === "today") {
            dateFilter.setHours(0, 0, 0, 0);
        } else if (lastActive === "week") {
            dateFilter.setDate(dateFilter.getDate() - 7);
        } else if (lastActive === "month") {
            dateFilter.setDate(dateFilter.getDate() - 30);
        } else if (lastActive === "quarter") {
            dateFilter.setDate(dateFilter.getDate() - 90);
        }
        userFilter.lastActive = { $gte: dateFilter };
    }

    req.user.userFilter = userFilter;


    let employees = await searchOrganizationEmployees(req, res, next, userFilter)
    // let employees = await searchOrganizationEmployees(userFilter, status, search, page, limit, userId)

    userFilter = { 'organizations.organizationId': userId };


    // 📊 Get total count for pagination
    const totalEmployees = await User.countDocuments(userFilter);
    const totalPages = search || status || lastActive ? Math.ceil(employees.length / limit) : Math.ceil(totalEmployees / limit);

    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("dashboard.candidate.success.get_employee"),
        employees,
        pagination: {
            currentPage: Number(page),
            totalPages,
            totalEmployees,
            employeesPerPage: limit,
            nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
            prevPage: Number(page) > 1 ? Number(page) - 1 : null,
            result: `${totalPages === 0 ? 0 : Number(page)} of ${totalPages} row(s) | ${employees.length * Number(page)} of ${totalEmployees} employee(s)`
        }
    });
});

// ============================== GET DATABSE EMPLOYEES CONTROLLER END =====================


// ============================== GET SHORTLIST CANDITATES CONTROLLER START =====================

const getshortlistCandidate = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.userId;

    // 🔍 Step 1: Fetch all shortlisted candidates with details and organizations who saved them
    const candidates = await fetchshortlistCandidates(userId);


    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("dashboard.organization.success.get_candidate"),
        candidates
    });
});


// ============================== GET SHORTLIST CANDITATES CONTROLLER END =====================

// ============================== GET SHORTLIST CANDITATES INFO CONTROLLER START =====================

const getCandidateInfo = catchAsyncErrors(async (req, res, next) => {
    const candidate = req.query.candidate;

    if (!candidate) {
        throwError(req.t("dashboard.organization.error.invlid_canidate_id"), STATUS.BAD_REQUEST);
    }

    // ✅ Fetch Candidate Information with Organizations
    const candidateData = await getCandidateDetails(candidate);

    if (!candidateData) {
        return res.status(STATUS.NOT_FOUND).json({
            success: false,
            message: req.t("dashboard.organization.error.candidate_not_found"),
        });
    }

    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("dashboard.organization.success.get_candidate"),
        candidate: candidateData.candidate,
        savedByOrganizations: candidateData.organizations
    });
});

// ============================== GET SHORTLIST CANDITATES INFO CONTROLLER END =====================


// Export all endpoints
module.exports = {
    GET: {
        getDashboardById,
        getOrganizationEmployees,
        getshortlistCandidate,
        getCandidateInfo
    }
};