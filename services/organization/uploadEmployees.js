// Import required modules
const mongoose = require("mongoose");
const { emailQueue } = require("../queue/emailQueue");
const User = require("../../models/auth/user");
const { addEmailsToQueue } = require("../email/emailQueueService");
const bcrypt = require("bcryptjs");
const throwError = require("../../utils/error/error");
const STATUS = require("../../constants/STATUS");
const generateUniqueUserName = require("../../utils/math/generateUniqueName");
const Organization = require("../../models/dashboard/organization");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { getActivity } = require("./checkProfileCompletion");
const { InvitationEmail } = require("../../templates/emails/Invitation");

const CHUNK_SIZE = 10000; // Process 10,000 users at a time



// async function generateDummyPassword() {
//     const plainPassword = Math.random().toString(36).slice(-8); // Generate random password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(plainPassword, salt);
//     return { plainPassword, hashedPassword }; // Return both plain and hashed passwords
// }

async function generateDummyPassword() {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "@";

    // Generate password components
    const firstChar = upper[Math.floor(Math.random() * upper.length)]; // Uppercase letter
    const lowerChars = Array.from({ length: 5 }, () => lower[Math.floor(Math.random() * lower.length)]).join(""); // 5 lowercase letters
    const numberChars = Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join(""); // 4 digits

    // Final password: UPPER + lower + @ + numbers
    const plainPassword = firstChar + lowerChars + special + numberChars;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return { plainPassword, hashedPassword }; // Return both plain and hashed passwords
}

exports.uploadEmployees = async (organizationId, employees) => {
    try {
        let OrganisationInfo = await User.findById(organizationId);
        
        // Step 1: Remove duplicate emails
        const uniqueEmployees = Array.from(new Map(employees.map(emp => [emp.email, emp])).values());

        let totalExistingUsersUpdated = 0;
        let totalNewUsersInserted = 0;

        for (let i = 0; i < uniqueEmployees.length; i += CHUNK_SIZE) {
            const batch = uniqueEmployees.slice(i, i + CHUNK_SIZE);

            // Fetch existing users in batch
            const employeeEmails = batch.map(emp => emp.email);
            const existingUsers = await User.find({ email: { $in: employeeEmails } });

            const existingUsersMap = {};
            existingUsers.forEach(user => {
                existingUsersMap[user.email] = user;
            });

            const newEmployees = batch.filter(emp => !existingUsersMap[emp.email]);

            let organizationDetails = {
                organizationId,
                invitedOn: Date.now(),
                acceptedOn: Date.now(),
                isAccepted: true
            };

            let organizationDetailsNew = {
                organizationId,
                invitedOn: Date.now(),
                acceptedOn: Date.now(),
                isAccepted: false
            };

            const updateOperations = existingUsers
                .filter(user => !user.organizations.some(org => org.organizationId.toString() === organizationId))
                .map(user => {
            let orgDetails = user.isWelcomeSent ? organizationDetails : organizationDetailsNew;

            return {
                updateOne: {
                    filter: { _id: user._id },
                    update: { $addToSet: { organizations: orgDetails } }
                }
            };
            });

            if (updateOperations.length > 0) {
                await User.bulkWrite(updateOperations);
                totalExistingUsersUpdated += updateOperations.length;
            }

            // Bulk insert new employees
            const bulkInsertData = [];
            const emailsToSend = [];
            

            for (let emp of newEmployees) {
                const { plainPassword, hashedPassword } = await generateDummyPassword();
                const userName = await generateUniqueUserName(emp.name);

                bulkInsertData.push({
                    email: emp.email,
                    name: emp.name,
                    password: hashedPassword,
                    isVerified: true,
                    isPasswordSet: false,
                    role: "Candidate",
                    organizations: [organizationDetailsNew],
                    userName
                });
                
                // Prepare email notification
                // emailsToSend.push({
                //     name: emp.name,
                //     email: emp.email,
                //     emailTitle: `${OrganisationInfo.name} invitation to join Hiron AI, ${emp.name}!`,
                //     emailBody: `Hey ${emp.name} 👋,\n\n${OrganisationInfo.name} invited you to join Hiron AI.\n\nYour temporary password: ${plainPassword}\n\nPlease reset your password upon login.`
                // });
                emailsToSend.push({
                    name: emp.name,
                    email: emp.email,
                    emailTitle: `${OrganisationInfo.name} Invited you to Join on Hiron AI!`,
                    emailBody: InvitationEmail(OrganisationInfo.name, emp.name, OrganisationInfo.contactPerson, emp.email, plainPassword)
                });
            }

            if (bulkInsertData.length > 0) {
                await User.insertMany(bulkInsertData);
                totalNewUsersInserted += bulkInsertData.length;
            }

            // Send Emails
            await addEmailsToQueue(emailsToSend, "sendInvitation");
        }

        let activityData = await getActivity(organizationId);

        return {
            existingUsersUpdated: totalExistingUsersUpdated,
            newUsersInserted: totalNewUsersInserted,
            totalProcessed: totalExistingUsersUpdated + totalNewUsersInserted,
            userActivity: activityData
        };
    } catch (error) {
        console.error("Error onboarding employees:", error);
        throwError(error, STATUS.INTERNAL_SERVER_ERROR);
    }
};







exports.updateOrganizationDashboard = catchAsyncErrors(async (req, res, next) => {
    return await Organization.findOneAndUpdate(
        { user: req.user.userId },
        { $set: req.body }, // ✅ Dynamically update only provided fields
        { new: true, runValidators: true }
    ).populate({
        path: 'user',
        select: 'name email userName role'
    }).lean();
});