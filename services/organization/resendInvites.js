const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/auth/user");
const { addEmailsToQueue } = require("../email/emailQueueService");

// ============================== RESEND INVITE SERVICE CONTROLLER START =====================

exports.resendInviteService = catchAsyncErrors(async (req, res, next) => {
    let { employees } = req.body;
    let organizationId = req.user.userId;
    const BATCH_SIZE = 10000;

    let OrganisationInfo = await User.findById(organizationId).select("name");

    // 🔍 Step 1: Remove Duplicates
    const uniqueEmployees = Array.from(new Map(employees.map(emp => [emp.email, emp])).values());

    let totalUpdatedUsers = 0;
    let totalEmailsSent = 0;

    // 🔄 Process in Chunks to Handle Large Data Efficiently
    for (let i = 0; i < uniqueEmployees.length; i += BATCH_SIZE) {
        const batch = uniqueEmployees.slice(i, i + BATCH_SIZE);
        const employeeEmails = batch.map(emp => emp.email);

        // 🔍 Step 2: Find Existing Users Who Haven't Accepted Yet
        const existingUsers = await User.find({
            email: { $in: employeeEmails },
            "organizations.organizationId": organizationId,
            "organizations.isAccepted": false
        }).select("_id email name organizations");

        if (existingUsers.length === 0) continue; // No valid users in this batch

        totalUpdatedUsers += existingUsers.length;

        // 🔍 Step 3: Update `invitedOn` Timestamp for Matching Users
        const bulkUpdateOperations = existingUsers.map(user => ({
            updateOne: {
                filter: { _id: user._id, "organizations.organizationId": organizationId },
                update: { $set: { "organizations.$.invitedOn": new Date() } } // ✅ Update only `invitedOn`
            }
        }));

        if (bulkUpdateOperations.length > 0) {
            await User.bulkWrite(bulkUpdateOperations);
        }

        // 🔍 Step 4: Prepare Emails for Users in This Batch
        const emails = existingUsers.map(emp => ({
            name: emp.name,
            email: emp.email,
            emailTitle: `Hey ${emp.name} 👋, ${OrganisationInfo.name} invited you to join Hiron AI.`,
            emailBody: `Hey ${emp.name} 👋, ${OrganisationInfo.name} invited you to join Hiron AI.`,
        }));

        // 🔍 Step 5: Send Emails in Bulk
        await addEmailsToQueue(emails, "sendInvitation");
        totalEmailsSent += emails.length;
    }

    // ✅ Final Response
    return { totalUpdatedUsers, totalEmailsSent };
});

// ============================== RESEND INVITE SERVICE CONTROLLER END =====================
