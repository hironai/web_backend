const { ACTIVITYTYPE } = require("../../constants/APPLICATION");
const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const activity = require("../../models/activity");
const Candidate = require("../../models/dashboard/candidate");
const search = require("../../models/search");
const { getActivity } = require("../../services/organization/checkProfileCompletion");
const { SearchService } = require("../../services/search");
const { valideSearchLimit } = require("../../validator/search");

// ============================== GET Simple Search CONTROLLER START =====================

// const Search = catchAsyncErrors(async (req, res) => {    
//     let { query, filters, isAIsearch, page, limit } = req.body;
//     const userId = req.user?.userId;
//     let searchConditions = { isSearchEnable: true };

//     // 🔍 Full-Text Search Condition
//     if (query) {
//         searchConditions.$text = { $search: query };
//     }
    

//     let isSearchAllowed = await valideSearchLimit(userId);
//     let todayAISearchCount = isSearchAllowed.todayAISearchCount;
//     let todaySearchCount = isSearchAllowed.todaySearchCount;   

//     // ✅ Enforce Search Limits
//     if (isAIsearch && todayAISearchCount >= 10) {
//         return res.status(STATUS.FORBIDDEN).json({
//             success: false,
//             message: req.t('search.error.ai_search_limit_exceeded'),
//             remainingAISearches: 0,
//             remainingFreeSearches: 20 - todaySearchCount
//         });
//     } 
//     if (!isAIsearch && todaySearchCount >= 50) {
        
//         return res.status(STATUS.FORBIDDEN).json({
//             success: false,
//             message: req.t('search.error.search_limit_exceeded'),
//             remainingAISearches: 10 - todayAISearchCount,
//             remainingFreeSearches: 0
//         });
//     }

//     // 🏙 **Updated Filter Setup**
//     let filterConditions = {};
//     if (filters) {
//         if (filters.location) {
//             filterConditions["address"] = { 
//                 $elemMatch: { state: new RegExp(filters.location, "i") } 
//             }; // ✅ Search in any address object
//         }
//         if (filters.education) {
//             filterConditions["education.degree"] = new RegExp(filters.education, "i");
//         }
//         if (filters.experience) {
//             filterConditions["professionalDetails"] = { 
//                 $elemMatch: { yearsOfExperience: { $gte: filters.experience } } 
//             }; // ✅ Search in any professionalDetails object
//         }
//     }

//     // ✅ Implement Pagination
//     // const page = parseInt(req.query.page) || 1;
//     // const limit = parseInt(req.query.limit) || 50;

//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 50;
    
//     let filtersSearch = await SearchService({ filterConditions, page, limit, searchConditions, userId });    

//     // ✅ Get Total Count for Pagination
//     const totalResults = await Candidate.countDocuments({ ...searchConditions, ...filterConditions });
//     const totalPages = Math.ceil(totalResults / limit);

//     // ✅ Save search in database before responding
//     await search.create({
//         user: userId,
//         isAISearch: isAIsearch || false,
//         query: req.body,
//         result: filtersSearch
//     });

//     // ✅ Save activity in database
//     await activity.create({
//         user: userId,
//         type: ACTIVITYTYPE.SEARCH,
//         title: `Search for employees, returned ${totalResults} results ${isAIsearch ? "(AI Power Search)" : ""}`,
//         metadata: {
//             query: query,
//             result: filtersSearch
//         }
//     });

//     let userActivity = await getActivity(userId);

//     // ✅ Send paginated response
//     res.status(STATUS.SUCCESS).json({
//         success: true,
//         message: req.t('search.success.search_success'),
//         results: filtersSearch,
//         pagination: {
//             currentPage: page,
//             totalPages: totalPages,
//             totalResults: totalResults,
//             nextPage: page < totalPages ? page + 1 : null,
//             prevPage: page > 1 ? page - 1 : null
//         },
//         userActivity,
//         remainingFreeSearches: isAIsearch 
//             ? 20 - todaySearchCount 
//             : 20 - todaySearchCount - 1,

//         remainingAISearches: isAIsearch 
//             ? 10 - todayAISearchCount - 1 
//             : 10 - todayAISearchCount
//     });
// });

const Search = catchAsyncErrors(async (req, res) => {
    let { query, filters, isAIsearch, page, limit } = req.body;
    const userId = req.user?.userId;
    let searchConditions = { isSearchEnable: true };

    // 🔍 Full-Text Search Condition
    if (query) {
        searchConditions.$text = { $search: query };
    }

    let isSearchAllowed = await valideSearchLimit(userId);
    let todayAISearchCount = isSearchAllowed.todayAISearchCount;
    let todaySearchCount = isSearchAllowed.todaySearchCount;   

    // ✅ Enforce Search Limits
    if (isAIsearch && todayAISearchCount >= 10) {
        return res.status(STATUS.FORBIDDEN).json({
            success: false,
            message: req.t('search.error.ai_search_limit_exceeded'),
            remainingAISearches: 0,
            remainingFreeSearches: 20 - todaySearchCount
        });
    } 
    if (!isAIsearch && todaySearchCount >= 50) {
        
        return res.status(STATUS.FORBIDDEN).json({
            success: false,
            message: req.t('search.error.search_limit_exceeded'),
            remainingAISearches: 10 - todayAISearchCount,
            remainingFreeSearches: 0
        });
    }

    // 🏙 **Updated Filter Setup**
    let filterConditions = {};
    if (filters) {
        if (filters.location) {
            filterConditions["address"] = { 
                $elemMatch: { state: new RegExp(filters.location, "i") } 
            }; // ✅ Search in any address object
        }
        if (filters.education) {
            filterConditions["education.degree"] = new RegExp(filters.education, "i");
        }
        if (filters.experience) {
            filterConditions["professionalDetails"] = { 
                $elemMatch: { yearsOfExperience: { $gte: filters.experience } } 
            }; // ✅ Search in any professionalDetails object
        }
    }

    // ✅ Implement Pagination
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 50;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 50;

    let filtersSearch = await SearchService({ filterConditions, page, limit, searchConditions, userId });
    

    // ✅ Get Total Count for Pagination
    const totalResults = await Candidate.countDocuments({ ...searchConditions, ...filterConditions });
    const totalPages = Math.ceil(totalResults / limit);

    // ✅ Save search in database before responding
    await search.create({
        user: userId,
        isAISearch: isAIsearch || false,
        query: req.body,
        result: filtersSearch
    });

    // ✅ Save activity in database
    await activity.create({
        user: userId,
        type: ACTIVITYTYPE.SEARCH,
        title: `Search for employees, returned ${totalResults} results ${isAIsearch ? "(AI Power Search)" : ""}`,
        metadata: {
            query: query,
            result: filtersSearch
        }
    });

    let userActivity = await getActivity(userId);

    // ✅ Send paginated response
    res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('search.success.search_success'),
        results: filtersSearch,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalResults: totalResults,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        },
        userActivity,
        remainingFreeSearches: isAIsearch 
            ? 20 - todaySearchCount 
            : 20 - todaySearchCount - 1,

        remainingAISearches: isAIsearch 
            ? 10 - todayAISearchCount - 1 
            : 10 - todayAISearchCount
    });
});


// ============================== GET Simple Search CONTROLLER END =====================

// Export all endpoints
module.exports = {
    POST: {
        Search
    }
};