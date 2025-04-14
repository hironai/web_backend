
// ✅ Helper Functions to Check if Section is Completed
// const checkObject = (obj) => obj && Object.values(obj).some(value => value && value !== "");
// const checkArray = (arr) => Array.isArray(arr) && arr.length > 0;

const { default: mongoose } = require("mongoose");
const User = require("../../models/auth/user");
const shortlisted = require("../../models/organization/shortlisted");
const Candidate = require("../../models/dashboard/candidate");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

const checkObject = (obj) => {
    if (!obj || typeof obj !== "object") return false; // Ensure obj is valid
    return Object.values(obj).every(value => value !== null && value !== ""); // ✅ Check all fields
};

// ✅ Helper Function to Check if an Object Has All Values Filled
const isObjectComplete = (obj) => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).every(value => value !== null && value !== "");
};

// ✅ Updated Function to Check if at Least One Object in Array is Complete
const checkArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    return arr.some(isObjectComplete); // ✅ At least one object must be complete
};

exports.getCandidateStats = async (candidate) => {

    try {
        // 🔍 Define Sections & Check Completion
        return profileSections = [
            { name: "Personal Details", key: "personal", icon: "User", completed: checkObject(candidate.personalDetails) },
            { name: "Professional Details", key: "professional", icon: "Briefcase", completed: checkArray(candidate.professionalDetails) },
            { name: "Experience", key: "experience", icon: "FileText", completed: checkArray(candidate.experience) },
            { name: "Education", key: "education", icon: "BookOpen", completed: checkArray(candidate.education) },
            { name: "Certifications", key: "certifications", icon: "Award", completed: checkArray(candidate.certifications) },
            { name: "Projects", key: "projects", icon: "FileText", completed: checkArray(candidate.projects) },
            { name: "Links", key: "links", icon: "LinkIcon", completed: checkArray(candidate.links) },
            { name: "Address", key: "address", icon: "MapPin", completed: checkArray(candidate.address) },
            { name: "Achievements", key: "achievements", icon: "Trophy", completed: checkArray(candidate.achievements) },
            { name: "Skills", key: "skills", icon: "Brain", completed: checkArray(candidate.skills) },
            { name: "Research", key: "research", icon: "Microscope", completed: checkArray(candidate.research) },
            { name: "Languages", key: "languages", icon: "Languages", completed: checkArray(candidate.languages) },
        ];

        // 📌 Count Completed Sections
        // const completedSections = profileSections.filter(section => section.completed).length;

        // return {
        //     completedSections,
        //     profileSections
        // };

    } catch (error) {
        console.error("Error fetching candidate stats:", error);
        throw error;
    }
};

exports.getCandidateDashboardData = async (userId) => {
            let dashboard = await Candidate.findOne({ user: userId }).populate({
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

                const profileSections = await this.getCandidateStats(dashboard);
                const completedSections = profileSections.filter(section => section.completed).length;
            
                dashboard['isPorfileCompleted'] = completedSections === profileSections.length;

            return dashboard;
}

exports.getCandidateDetails = async (candidateId) => {
    try {
        // 🔍 Step 1: Fetch Candidate Details
        const candidate = await User.findById(candidateId)
            .select("name userName email") // Only required fields
            .lean(); // Optimizes query performance

        if (!candidate) return null; // Return null if candidate not found

        // 🔍 Step 2: Fetch Organizations Who Have Saved This Candidate
        const organizations = await shortlisted.aggregate([
            { $match: { candidate: new mongoose.Types.ObjectId(candidateId) } }, // Filter by candidateId
            {
                $lookup: {
                    from: "users", // Collection to join (User Model)
                    localField: "user", // Organization ID in Shortlisted
                    foreignField: "_id", // Match with User ID
                    as: "organizationDetails"
                }
            },
            { $unwind: "$organizationDetails" }, // Flatten organization details
            {
                $project: {
                    _id: 0, // Hide shortlist entry ID
                    organizationName: "$organizationDetails.name",
                    organizationType: "$organizationDetails.organizationType",
                    dateSaved: "$createdAt"
                }
            }
        ]);

        return { candidate, organizations };

    } catch (error) {
        console.error("Error fetching candidate details:", error);
        throw error;
    }
};



exports.updateCandidateDashboard = catchAsyncErrors(async (req, res, next) => {
    let dashboard = await Candidate.findOneAndUpdate(
        { user: req.user.userId },
        { $set: req.body }, // ✅ Dynamically update only provided fields
        { new: true, runValidators: true }
    ).populate({
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

    return dashboard;
}); 