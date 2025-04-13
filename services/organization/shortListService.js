const { default: mongoose } = require("mongoose");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const shortlisted = require("../../models/organization/shortlisted");

// ============================== SHORTLIST / DELIST CANDITATES SERVICE START =====================

exports.deleteCandidate = catchAsyncErrors(async (userId, candidateId) => {
    return await shortlisted.findOneAndDelete({ user: userId, candidate: candidateId })
    .populate({
        path: "candidate",  // ✅ Ensure correct population
        select: "name email" // ✅ Select only needed fields
    })
    .lean();
});

exports.addCandidate = catchAsyncErrors(async (userId, candidateId) => {
        // ✅ Step 1: If Not Exists, Add to Shortlist
        let newShortlistEntry = await shortlisted.create({
            user: userId,
            candidate: candidateId,
            status: [] // Default status array
        });

        // ✅ Populate candidate name after creation
        return await shortlisted.findById(newShortlistEntry._id)
            .populate({
                path: "candidate",  // ✅ Ensure correct population
                select: "name email" // ✅ Select only needed fields
            })
            .lean();
});


// ============================== SHORTLIST / DELIST CANDITATES SERVICE END =====================


// ============================== GET SHORTLIST CANDITATES SERVICE START =====================

exports.fetchshortlistCandidates = catchAsyncErrors(async (userId) => {

    // 🔍 Step 1: Fetch all shortlisted candidates with details and organizations who saved them
    return await shortlisted.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Get candidates saved by this organization
        {
            $lookup: {
                from: "users", // Join with User collection to get candidate details
                localField: "candidate",
                foreignField: "_id",
                as: "candidateDetails"
            }
        },
        { $unwind: "$candidateDetails" }, // Flatten the candidate details
        {
            $lookup: {
                from: "shortlisteds", // Join with Shortlisted collection to find all organizations that saved this candidate
                localField: "candidate",
                foreignField: "candidate",
                as: "otherOrganizations"
            }
        },
        {
            $lookup: {
                from: "users", // Join with User collection to get organization details
                localField: "otherOrganizations.user",
                foreignField: "_id",
                as: "organizationDetails"
            }
        },
        {
            $project: {
                _id: 1,
                "candidate._id": "$candidateDetails._id",
                "candidate.name": "$candidateDetails.name",
                "candidate.userName": "$candidateDetails.userName",
                "candidate.email": "$candidateDetails.email",
                savedByOrganizations: {
                    $map: {
                        input: "$otherOrganizations",
                        as: "org",
                        in: {
                            organizationName: {
                                $arrayElemAt: [
                                    "$organizationDetails.name",
                                    { $indexOfArray: ["$organizationDetails._id", "$$org.user"] }
                                ]
                            },
                            organizationType: {
                                $arrayElemAt: [
                                    "$organizationDetails.organizationType",
                                    { $indexOfArray: ["$organizationDetails._id", "$$org.user"] }
                                ]
                            },
                            dateSaved: "$$org.createdAt"
                        }
                    }
                }
            }
        }
    ]);
});

// ============================== GET SHORTLIST CANDITATES SERVICE END =====================
