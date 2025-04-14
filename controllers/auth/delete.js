const { ACTIVITYTYPE } = require("../../constants/APPLICATION");
const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { i18nextInstance } = require("../../middlewares/i18n");
const activity = require("../../models/activity");
const DeletedUser = require("../../models/auth/deletedUser");
const User = require("../../models/auth/user");
const { addEmailsToQueue } = require("../../services/email/emailQueueService");
const { DeleteAccountEmail } = require("../../templates/emails/DeleteAccount");
const throwError = require("../../utils/error/error");

// =============================== Delete Account API Start ===========================

// const deleteAccount = catchAsyncErrors(async (req, res) => {
//     let { userId } = req.user;

//     throwError(i18nextInstance.t("auth.error.invalid_user"), STATUS.NOT_FOUND);

//     if (!userId) {
//         throwError(i18nextInstance.t("auth.error.invalid_user"), STATUS.NOT_FOUND);
//     }

//     // 🔍 Step 1: Find the User (Including Their Organizations)
//     let deletedAccount = await User.findByIdAndDelete(userId).lean(); // Use `.lean()` for performance

//     if (!deletedAccount) {
//         throwError(i18nextInstance.t("auth.error.invalid_user"), STATUS.NOT_FOUND);
//     }

//     // 🔍 Step 2: Store Deleted User Info in `DeletedUser`
//     await DeletedUser.create({ user: deletedAccount });

//     // 🔍 Step 3: Extract Organizations Where User Was a Member
//     const organizationIds = deletedAccount.organizations
//         .filter(org => org.organizationId) // Ensure valid organization IDs
//         .map(org => org.organizationId); // Extract organization IDs

//     if (organizationIds.length > 0) {
//         // 🔍 Step 4: Create Activity Log for Each Organization
//         const bulkActivities = organizationIds.map(orgId => ({
//             insertOne: {
//                 document: {
//                     user: orgId, // Organization receiving the activity log
//                     type: ACTIVITYTYPE.DELETE,
//                     title: `${deletedAccount.name} deleted account`,
//                     metadata: {
//                         query: "Delete account",
//                         result: deletedAccount
//                     },
//                     createdAt: new Date()
//                 }
//             }
//         }));

//         // ✅ Use `bulkWrite()` for optimal performance (Batch Insert)
//         await activity.bulkWrite(bulkActivities);
//     }

//     // ✅ Step 5: Return Success Response
//     return res.status(STATUS.SUCCESS).json({
//         success: true,
//         message: req.t("auth.success.account_deleted"),
//     });
// });

const deleteAccount = catchAsyncErrors(async (req, res) => {
    let { userId } = req.user;

    if (!userId) {
        throwError(i18nextInstance.t("auth.error.invalid_user"), STATUS.NOT_FOUND);
    }

    // 🔍 Step 1: Find the User (Including Their Organizations)
    let deletedAccount = await User.findByIdAndDelete(userId).lean();

    if (!deletedAccount) {
        throwError(i18nextInstance.t("auth.error.invalid_user"), STATUS.NOT_FOUND);
    }

    // 🔍 Step 2: Store Deleted User Info in `DeletedUser`
    await DeletedUser.create({ user: deletedAccount });

    // 🔍 Step 3: Extract Organization IDs Where User Was a Member
    const organizationIds = deletedAccount.organizations.map(org => org.organizationId);

    if (organizationIds.length > 0) {
        // ✅ Step 4: Remove This User from All Other Users' Organizations
        await User.updateMany(
            { "organizations.organizationId": userId }, // Find users where this user is an organization
            { $pull: { organizations: { organizationId: userId } } } // Remove only this organization entry
        );

        // ✅ Step 5: Log Activity for Affected Organizations
        const bulkActivities = organizationIds.map(orgId => ({
            insertOne: {
                document: {
                    user: orgId, // Organization receiving the activity log
                    type: ACTIVITYTYPE.DELETE,
                    title: `${deletedAccount.name} deleted account`,
                    metadata: {
                        query: "Delete account",
                        result: deletedAccount
                    },
                    createdAt: new Date()
                }
            }
        }));

        if (bulkActivities.length > 0) {
            await activity.bulkWrite(bulkActivities); // ✅ Use `bulkWrite()` for efficient inserts
        }
    }

    // send email
    // send welcome emai
    const emails = [{
        username: deletedAccount.name,
        email: deletedAccount.email,
        emailTitle: 'Account Deleted - Hiron AI',
        emailBody: DeleteAccountEmail(deletedAccount.name, deletedAccount.email),
    }];

    await addEmailsToQueue(emails, "sendInvitation");

    // ✅ Step 6: Return Success Response
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("auth.success.account_deleted"),
    });
});



// ============================== Delete Account API End ===============================

// Export all endpoints
module.exports = {
    DELETE: {
        deleteAccount
    }
};