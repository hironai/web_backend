const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/auth/user");
const Candidate = require("../../models/dashboard/candidate");
const shortlisted = require("../../models/organization/shortlisted");
const { checkProfileCompletion, getLastActiveStatus } = require("../organization/checkProfileCompletion");


// ============================== SEARCH ORGANIZATION EMPLOYEE SERVICE START =====================

// exports.searchOrganizationEmployees = catchAsyncErrors(async (userFilter, status, page, limit) => {
//     const skip = (page - 1) * limit;

//     // 🔍 Fetch employees from User schema
//     let employees = await User.find(userFilter)
//         .skip(skip)
//         .limit(limit)
//         .lean();

//     // 🔍 Fetch related Candidate profiles
//     let userIds = employees.map(user => user._id);
//     let candidates = await Candidate.find({ user: { $in: userIds } }).lean();

//     // 🔹 Create a map for quick lookup
//     let candidateMap = new Map();
//     candidates.forEach(candidate => candidateMap.set(candidate.user.toString(), candidate));

//     // 📌 Format Employees Data
//     let formattedEmployees = employees.map(user => {
//         let candidate = candidateMap.get(user._id.toString());

//         // 🏷 Determine `profileStatus`
//         let profileStatus = "pending";
//         if (candidate) {
//             profileStatus = checkProfileCompletion(candidate) ? "complete" : "incomplete";
//         }

//         // 📌 Extract Job Title & Department from Latest Experience
//         let jobTitle = "N/A";
//         let department = "N/A";
//         if (candidate?.experience?.length > 0) {
//             let latestExperience = candidate.experience[0]; // ✅ Get first available experience
//             jobTitle = latestExperience.title || "Hiron AI User";
//             department = latestExperience.company || candidate.userName || "Active User";
//         }

//         return {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             phone: candidate?.personalDetails?.phone || "N/A",
//             jobTitle,
//             department,
//             profileStatus,
//             lastActive: getLastActiveStatus(user.lastActive),
//         };
//     });

//     // 🔍 Apply `status` filter (if provided)
//     if (status) {
//         formattedEmployees = formattedEmployees.filter(emp => emp.profileStatus === status);
//     }

//     return formattedEmployees;
// });

exports.searchOrganizationEmployees = catchAsyncErrors(async (req, res, next) => {
    // exports.searchOrganizationEmployees = catchAsyncErrors(async ( userFilter, status, search, page, limit, userId) => {
    let { userId, userFilter } = req.user;
    let { search, status, lastActive, page = 1 } = req.query;
    const limit = 100;

    const skip = (page - 1) * limit;


    // ✅ Create a search filter (if search query is provided)
    if (search) {
        const searchRegex = new RegExp(search, "i"); // Case-insensitive partial search

        userFilter.$or = [
            { name: searchRegex },               // Match `name` field in User model
            { email: searchRegex },              // Match `email` field in User model
            { "personalDetails.bio": searchRegex }, // Match `bio` field in Candidate model
            { "professionalDetails.currentTitle": searchRegex }, // Match `currentTitle`
            { "professionalDetails.skills": searchRegex },       // Match `skills` array
            { "experience.title": searchRegex }, // Match job titles in experience
            { "experience.company": searchRegex }, // Match companies in experience
            { "education.degree": searchRegex }, // Match degrees in education
            { "education.institution": searchRegex }, // Match institutions in education
            { "projects.name": searchRegex }, // Match project names
            { "projects.description": searchRegex }, // Match project descriptions
        ];
    }

    // 🔍 Fetch employees from User schema
    let employees = await User.find(userFilter)
        .skip(skip)
        .limit(limit)
        .lean();

    // 🔍 Fetch related Candidate profiles
    let userIds = employees.map(user => user._id);
    let candidates = await Candidate.find({ user: { $in: userIds } }).lean();

    // 🔹 Create a map for quick lookup
    let candidateMap = new Map();
    candidates.forEach(candidate => candidateMap.set(candidate.user.toString(), candidate));

    // 📌 Format Employees Data
    let formattedEmployees = employees.map(user => {
        let candidate = candidateMap.get(user._id.toString());

        // 🏷 Determine `profileStatus`
        let profileStatus = "pending";
        if (candidate) {
            profileStatus = checkProfileCompletion(candidate) ? "complete" : "incomplete";
        }

        // 📌 Extract Job Title & Department from Latest Experience
        let jobTitle = "Hiron AI User";
        let department = "Active User";
        // if (candidate?.experience?.length > 0) {
        //     let latestExperience = candidate.experience[0]; // ✅ Get first available experience
        //     jobTitle = latestExperience.title || "Hiron AI User";
        //     department = latestExperience.company || candidate.userName || "Active User";            
        // }

        // 🔍 Filter the `organizations` array to include only the organization making the request
        let organization = user.organizations.filter(org => org.organizationId.toString() === userId.toString());


        return {
            id: user._id,
            name: user.name,
            email: user.email,
            organization: organization[0],
            // phone: candidate?.personalDetails?.phone || "N/A",
            // jobTitle,
            // department,
            profileStatus,
            lastActive: getLastActiveStatus(user.lastActive),
            isAccepted: organization[0].isAccepted,
            invitedOn: getLastActiveStatus(organization[0].invitedOn),
            acceptedOn: getLastActiveStatus(organization[0].acceptedOn)
        };
    });

    // 🔍 Apply `status` filter (if provided)
    if (status) {
        formattedEmployees = formattedEmployees.filter(emp => emp.profileStatus === status);
    }

    return formattedEmployees;
});

// ============================== SEARCH ORGANIZATION EMPLOYEE SERVICE END =====================



// ============================== SEARCH CANDIDATES SERVICE START =============================

// exports.SearchService = catchAsyncErrors(async (items) => {
//     let { filterConditions, page, limit, searchConditions, userId } = items;
//     const skip = (page - 1) * limit;

//     let results = [];

//     // ✅ Update Address Filters for Multiple Fields
//     if (filterConditions["address"]) {
//         filterConditions["address"] = {
//             $elemMatch: {
//                 $or: [
//                     { state: new RegExp(filterConditions["address"], "i") },
//                     { city: new RegExp(filterConditions["address"], "i") },
//                     { addressLine1: new RegExp(filterConditions["address"], "i") },
//                     { addressLine2: new RegExp(filterConditions["address"], "i") },
//                     { postalCode: new RegExp(filterConditions["address"], "i") },
//                     { country: new RegExp(filterConditions["address"], "i") }
//                 ]
//             }
//         };
//         delete filterConditions["address"]; // ✅ Remove old key
//     }


//     // ✅ Experience Filtering (Candidates with Experience >= Given Value)
//     if (filterConditions["professionalDetails.yearsOfExperience"]) {
//         filterConditions["professionalDetails"] = {
//             $elemMatch: { yearsOfExperience: { $gte: filterConditions["professionalDetails.yearsOfExperience"] } }
//         };
//         delete filterConditions["professionalDetails.yearsOfExperience"];
//     }

//     // 🔍 Step 1: Strict Search (All Filters Applied)
//     results = await Candidate.find({ ...searchConditions, ...filterConditions })
//         .select({ score: { $meta: "textScore" }, user: 1, address: 1, professionalDetails: 1 })
//         .sort({ score: { $meta: "textScore" } })
//         .skip(skip)
//         .limit(limit)
//         .populate({
//             path: "user",
//             select: "name email organizations _id lastActive",
//             populate: {
//                 path: "organizations.organizationId",
//                 model: "User",
//                 select: "name organizationType _id"
//             }
//         });

//     // 🔄 Step 2-5: Apply Flexible Search (Remove Filters If No Results)
//     if (results.length === 0) {
//         if (filterConditions["education.degree"]) {
//             delete filterConditions["education.degree"];
//         } else if (filterConditions["address"]) {
//             delete filterConditions["address"];
//         } else if (filterConditions["professionalDetails"]) {
//             delete filterConditions["professionalDetails"];
//         } else {
//             results = await Candidate.find(searchConditions)
//                 .select({ score: { $meta: "textScore" }, user: 1, address: 1, professionalDetails: 1 })
//                 .sort({ score: { $meta: "textScore" } })
//                 .skip(skip)
//                 .limit(limit)
//                 .populate({
//                     path: "user",
//                     select: "name email userName organizations _id lastActive",
//                     populate: {
//                         path: "organizations.organizationId",
//                         model: "User",
//                         select: "name organizationType _id"
//                     }
//                 });
//         }
//     }

//     // 🔍 Find the maximum score in current results
//     const maxScore = results.length > 0 ? Math.max(...results.map(r => r._doc?.score || 1)) : 1;

//     // 📌 Format the Results
//     const formattedResults = results.map(candidate => ({
//         id: candidate._id,
//         name: candidate?.user && candidate.user?.name ? candidate.user.name : "Hiron AI User",
//         jobtitle: candidate.professionalDetails?.length > 0
//             ? candidate.professionalDetails[0]?.currentTitle || "Hiron AI User"
//             : "Hiron AI User",
//         location: candidate.address?.length > 0
//             ? `${candidate.address[0]?.city || "Unknown"}, ${candidate.address[0]?.state || "Unknown"}`
//             : "Unknown, Unknown",
//         experience: candidate.professionalDetails?.length > 0 && candidate.professionalDetails[0]?.yearsOfExperience
//             ? `${candidate.professionalDetails[0].yearsOfExperience} years`
//             : "N/A",
//         skills: candidate.professionalDetails?.length > 0
//             ? candidate.professionalDetails[0].skills || []
//             : [],
//         education: candidate.education?.length > 0
//             ? `${candidate.education[0].degree}, ${candidate.education[0].institution}`
//             : "N/A",
//         organizations: candidate?.user?.organizations?.map(org => ({
//             id: org.organizationId?._id || "N/A",
//             name: org.organizationId?.name || "N/A",
//             type: org.organizationId?.organizationType || "N/A"
//         })) || [],
//         lastActive: candidate.user?.lastActive ? getLastActiveStatus(candidate.user.lastActive) : getLastActiveStatus(new Date()),
//         match: candidate._doc?.score ? Math.round((candidate._doc.score / maxScore) * 100) : 0
//     }));

//     return formattedResults;
// });

// exports.SearchService = catchAsyncErrors(async (items) => {
//     let { filterConditions, page, limit, searchConditions, userId } = items;
//     const skip = (page - 1) * limit;

//     let results = [];

//     // ✅ Efficient Address Filtering
//     if (filterConditions["address"]) {
//         filterConditions["address"] = {
//             $elemMatch: {
//                 $or: [
//                     { state: new RegExp(filterConditions["address"], "i") },
//                     { city: new RegExp(filterConditions["address"], "i") },
//                     { addressLine1: new RegExp(filterConditions["address"], "i") },
//                     { addressLine2: new RegExp(filterConditions["address"], "i") },
//                     { postalCode: new RegExp(filterConditions["address"], "i") },
//                     { country: new RegExp(filterConditions["address"], "i") }
//                 ]
//             }
//         };
//         delete filterConditions["address"];
//     }

//     // ✅ Experience Filtering (Candidates with Experience >= Given Value)
//     if (filterConditions["professionalDetails.yearsOfExperience"]) {
//         filterConditions["professionalDetails"] = {
//             $elemMatch: { yearsOfExperience: { $gte: filterConditions["professionalDetails.yearsOfExperience"] } }
//         };
//         delete filterConditions["professionalDetails.yearsOfExperience"];
//     }

//     // Step 0: Handle general keyword search for name or email
//     if (searchConditions["$text"] && searchConditions["$text"]["$search"]) {
//         const keyword = searchConditions["$text"]["$search"];
//         delete searchConditions["$text"]; // Remove it from searchConditions

//         const regex = new RegExp(keyword, "i");

//         // Inject $or condition to match name or email
//         searchConditions["$or"] = [
//             { name: regex },
//             { email: regex }
//         ];
//     }


//     // 🔍 Step 1: Strict Search (All Filters Applied)
//     results = await Candidate.find({ ...searchConditions, ...filterConditions })
//         .select({ score: { $meta: "textScore" }, user: 1, address: 1, professionalDetails: 1 })
//         .sort({ score: { $meta: "textScore" } })
//         .skip(skip)
//         .limit(limit)
//         .populate({
//             path: "user",
//             select: "name email organizations _id lastActive",
//             populate: {
//                 path: "organizations.organizationId",
//                 model: "User",
//                 select: "name organizationType _id"
//             }
//         });

//     // 🔄 Step 2-5: Flexible Search (Remove Filters If No Results)
//     if (results.length === 0) {
//         if (filterConditions["education.degree"]) {
//             delete filterConditions["education.degree"];
//         } else if (filterConditions["address"]) {
//             delete filterConditions["address"];
//         } else if (filterConditions["professionalDetails"]) {
//             delete filterConditions["professionalDetails"];
//         } else {
//             results = await Candidate.find(searchConditions)
//                 .select({ score: { $meta: "textScore" }, user: 1, address: 1, professionalDetails: 1 })
//                 .sort({ score: { $meta: "textScore" } })
//                 .skip(skip)
//                 .limit(limit)
//                 .populate({
//                     path: "user",
//                     select: "name email userName organizations _id lastActive",
//                     populate: {
//                         path: "organizations.organizationId",
//                         model: "User",
//                         select: "name organizationType _id"
//                     }
//                 });
//         }
//     }

//     // ✅ Find candidates already saved by the organization (Efficient Approach)
//     const candidateIds = results.map(c => c.user._id); // Extract candidate IDs
//     const savedCandidates = await shortlisted.find({
//         user: userId, // Organization ID
//         candidate: { $in: candidateIds }
//     }).select("candidate").lean();

//     const savedCandidateSet = new Set(savedCandidates.map(sc => sc.candidate.toString()));


//     // 🔍 Find the maximum score in current results
//     const maxScore = results.length > 0 ? Math.max(...results.map(r => r._doc?.score || 1)) : 1;

//     // 📌 Format the Results with `isSaved` Field
//     const formattedResults = results.map(candidate => ({
//         id: candidate.user._id,
//         name: candidate?.user?.name || "Hiron AI User",
//         jobtitle: candidate.professionalDetails?.length > 0
//             ? candidate.professionalDetails[0]?.currentTitle || "Hiron AI User"
//             : "Hiron AI User",
//         location: candidate.address?.length > 0
//             ? `${candidate.address[0]?.city || "Unknown"}, ${candidate.address[0]?.state || "Unknown"}`
//             : "Unknown, Unknown",
//         experience: candidate.professionalDetails?.length > 0 && candidate.professionalDetails[0]?.yearsOfExperience
//             ? `${candidate.professionalDetails[0].yearsOfExperience} years`
//             : "N/A",
//         skills: candidate.professionalDetails?.length > 0
//             ? candidate.professionalDetails[0].skills || []
//             : [],
//         education: candidate.education?.length > 0
//             ? `${candidate.education[0].degree}, ${candidate.education[0].institution}`
//             : "N/A",
//         organizations: candidate?.user?.organizations?.map(org => ({
//             id: org.organizationId?._id || "N/A",
//             name: org.organizationId?.name || "N/A",
//             type: org.organizationId?.organizationType || "N/A"
//         })) || [],
//         lastActive: candidate.user?.lastActive ? getLastActiveStatus(candidate.user.lastActive) : getLastActiveStatus(new Date()),
//         match: candidate._doc?.score ? Math.round((candidate._doc.score / maxScore) * 100) : 0,
//         isSaved: savedCandidateSet.has(candidate.user._id.toString()) // ✅ Efficient check if candidate is saved
//     }));

//     return formattedResults;
// });


exports.SearchService = catchAsyncErrors(async (items) => {
    let { filterConditions, page, limit, searchConditions, userId } = items;
    const skip = (page - 1) * limit;

    let results = [];

    // 🔍 Address Filter (match any address field using a keyword)
    if (filterConditions.address) {
        const keyword = filterConditions.address;
        filterConditions.address = {
            $elemMatch: {
                $or: [
                    { state: new RegExp(keyword, "i") },
                    { city: new RegExp(keyword, "i") },
                    { addressLine1: new RegExp(keyword, "i") },
                    { addressLine2: new RegExp(keyword, "i") },
                    { postalCode: new RegExp(keyword, "i") },
                    { country: new RegExp(keyword, "i") }
                ]
            }
        };
    }

    // 💼 Experience Filter (candidates with >= X years)
    if (filterConditions["professionalDetails.yearsOfExperience"] !== undefined) {
        const minExperience = filterConditions["professionalDetails.yearsOfExperience"];
        filterConditions.professionalDetails = {
            $elemMatch: { yearsOfExperience: { $gte: minExperience } }
        };
    }

    // 🔎 Text Search (name or email)
    if (searchConditions?.$text?.$search) {
        const keyword = searchConditions.$text.$search;
        delete searchConditions.$text;

        const regex = new RegExp(keyword, "i");
        searchConditions.$or = [
            { name: regex },
            { email: regex }
        ];
    }

    // 🔍 Step 1: Strict Search
    results = await Candidate.find({ ...searchConditions, ...filterConditions })
        .select({ score: { $meta: "textScore" }, user: 1, address: 1, professionalDetails: 1 })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit)
        .populate({
            path: "user",
            select: "name email organizations _id lastActive",
            populate: {
                path: "organizations.organizationId",
                model: "User",
                select: "name organizationType _id"
            }
        });        

    // 🔄 Step 2: Flexible Search if No Results
    if (results.length === 0) {
        const softFilter = { ...filterConditions };

        // Try removing filters one-by-one for fallback
        if (softFilter?.education?.degree) {
            delete softFilter.education.degree;
        } else if (softFilter.address) {
            delete softFilter.address;
        } else if (softFilter.professionalDetails) {
            delete softFilter.professionalDetails;
        }

        results = await Candidate.find({ ...searchConditions, ...softFilter })
            .select({ score: { $meta: "textScore" }, user: 1, address: 1, professionalDetails: 1, research: 1, publications: 1 })
            .sort({ score: { $meta: "textScore" } })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "user",
                select: "name email userName organizations _id lastActive",
                populate: {
                    path: "organizations.organizationId",
                    model: "User",
                    select: "name organizationType _id"
                }
            });
    }

    // ✅ Find candidates already saved by the organization
    const candidateIds = results.map(c => c.user._id);
    const savedCandidates = await shortlisted.find({
        user: userId,
        candidate: { $in: candidateIds }
    }).select("candidate").lean();

    const savedCandidateSet = new Set(savedCandidates.map(sc => sc.candidate.toString()));

    // 🔢 Score Normalization
    const maxScore = results.length > 0 ? Math.max(...results.map(r => r._doc?.score || 1)) : 1;

    // 🧾 Format Results
    const formattedResults = results.map(candidate => ({
        id: candidate.user._id,
        name: candidate?.user?.name || "Hiron AI User",
        jobtitle: candidate.professionalDetails?.[0]?.currentTitle || "Hiron AI User",
        location: candidate.address?.[0]
            ? `${candidate.address[0]?.city || "Unknown"}, ${candidate.address[0]?.state || "Unknown"}`
            : "Unknown, Unknown",
        experience: candidate.professionalDetails?.[0]?.yearsOfExperience
            ? `${candidate.professionalDetails[0].yearsOfExperience} years`
            : "N/A",
        skills: candidate.professionalDetails?.[0]?.skills || [],
        education: candidate.education?.[0]
            ? `${candidate.education[0].degree}, ${candidate.education[0].institution}`
            : "N/A",
        organizations: candidate?.user?.organizations?.map(org => ({
            id: org.organizationId?._id || "N/A",
            name: org.organizationId?.name || "N/A",
            type: org.organizationId?.organizationType || "N/A"
        })) || [],
        lastActive: candidate.user?.lastActive
            ? getLastActiveStatus(candidate.user.lastActive)
            : getLastActiveStatus(new Date()),
        match: candidate._doc?.score
            ? Math.round((candidate._doc.score / maxScore) * 100)
            : 0,
        isSaved: savedCandidateSet.has(candidate.user._id.toString())
    }));

    return formattedResults;
});



// ============================== SEARCH CANDIDATES SERVICE END =============================
