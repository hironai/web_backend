const generateUniqueReferId = require('../../utils/math/generateUniqueReferId');
const STATUS = require("../../constants/STATUS");
const User = require("../../models/auth/user");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const throwError = require("../../utils/error/error");
const { otpSender } = require("../../utils/mails/otpSender");
const OTP = require('../../models/auth/otp');
const { WelcomeUser } = require("../../templates/emails/WelcomeUser");
const { tokenGenerater } = require("../../utils/token");
const { addEmailsToQueue } = require("../email/emailQueueService");
const Candidate = require("../../models/dashboard/candidate");
const Organization = require("../../models/dashboard/organization");
const bcrypt = require('bcryptjs');
const activity = require("../../models/activity");
const { ACTIVITYTYPE } = require("../../constants/APPLICATION");
const generateUniqueUserName = require("../../utils/math/generateUniqueName");
const subscription = require('../../models/subscription');

// ============================== CREATE USER SERVICE START ============================

exports.createUser = catchAsyncErrors(async (req, res, next) => {
    // Generate a unique referral code
    let referId = await generateUniqueReferId(req.body.name);

    let userName = await generateUniqueUserName(req.body.name);

    // Create the new user
    const newUser = await User.create({ ...req.body, userName, referId });
    // const newUser = await User.create({ ...req.body, userName, referId, organizations: [organization] });

    // ✅ Save activity in database
    await activity.create({
        user: newUser._id,
        type: ACTIVITYTYPE.CREATE,
        title: `Hey, ${newUser.name}! You created account`,
        metadata: {
            query: "Create account",
            result: newUser
        }, // Store meta
    });

    return newUser;
});

// ============================== CREATE USER SERVICE END ============================

// ============================== VALIDATE USER SERVICE START ============================

exports.validateuser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if the user exists and Validating user
    const user = await User.findOne({ email }).select('+password +isPasswordSet'); // Include password for comparison

    if (!user) {
        // Throw an error if the user not exists
        throwError(req.t("auth.validation.user_not_exists"), STATUS.NOT_FOUND);
    }

    // Creds validation
    if (!(await user.comparePassword(password))) {
        // if (!user || !(await user.comparePassword(password))) {
        // Throw an error if credentials are invalid
        throwError(req.t("auth.error.invalid_credentials"), STATUS.BAD_REQUEST);
    }

    // if (!user.isPasswordSet || !user.isVerified) {
    //     // ask user to set password first and call otpSender
    //     let username = user.name;
    //     await otpSender(email, username);

    //     // Throw an error if the user not varified or if the user has not set password
    //     throwError(req.t("auth.validation.user_not_verified"), STATUS.UNAUTHORIZED,
    //         { isPasswordSet: user.isPasswordSet });
    // }

    if (!user.isVerified) {
        // ask user to set password first and call otpSender
        let username = user.name;
        await otpSender(email, username);

        // Throw an error if the user not varified or if the user has not set password
        throwError(req.t("auth.validation.user_not_verified"), STATUS.UNAUTHORIZED,
            { isPasswordSet: user.isPasswordSet });
    }

    if (!user.isPasswordSet) {
        // ask user to set password first and call otpSender
        let username = user.name;
        await otpSender(email, username);

        // Throw an error if the user not varified or if the user has not set password
        throwError(req.t("auth.validation.password_not_set"), STATUS.UNAUTHORIZED,
            { isPasswordSet: user.isPasswordSet });
    }

    // ✅ Save activity in database
    await activity.create({
        user: user._id,
        type: ACTIVITYTYPE.INFO,
        title: `LoggedIn as ${user.name} in Hiron AI Dashboard`,
        metadata: {
            query: "Account Access",
            result: user
        }, // Store meta
    });

    // Generate tokens for the user and return the user
    // let tokens = await tokenGenerater(user._id, user.role);    
    await tokenGenerater(user._id, user.role, res, true);
    return { isPasswordSet: user.isPasswordSet, role: user.role };
});

// ============================== VALIDATE USER SERVICE END ============================

// ============================== VERIFY OTP SERVICE START ============================

exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;    

    // Check if otp exists and validate
    const userOTP = await OTP.findOne({ email });
    
    if (!userOTP) {
        throwError(req.t("auth.otp.error.otp_expired"), STATUS.BAD_REQUEST);
    } else if (userOTP.otp !== otp) {
        throwError(req.t("auth.otp.error.otp_invalid"), STATUS.BAD_REQUEST);
    }
    else {
        // remove otp from db
        await OTP.findOneAndDelete({ email });

        const user = await User.findOneAndUpdate(
            { email }, // Search criteria
            { $set: { isVerified: true } }, // Update operation
            { new: true } // Return the updated document
        ).select('+isPasswordSet');

        // let tokens = await tokenGenerater(user._id, user.role);
        await tokenGenerater(user._id, user.role, res, true);

        if (!user.isWelcomeSent) {
            if (user.role === 'Candidate' || user.role === "Admin") {

                // create candidate profile
                await Candidate.findOneAndUpdate(
                    { user: user._id }, // Query to find the user profile
                    { $set: { user: user._id, name: user.name, email: user.email } }, // Update or create the document
                    {
                        upsert: true, // Create if not exists
                        new: true,    // Return updated document
                    }
                );

                // 🔍 Step 3: Extract Organizations Where User Was a Member
                const organizationIds = user.organizations
                    .filter(org => org.organizationId) // Ensure valid organization IDs
                    .map(org => org.organizationId); // Extract organization IDs

                if (organizationIds.length > 0) {

                    // 🔍 Step 4: Create Activity Log for Each Organization
                    const bulkActivities = organizationIds.map(orgId => ({
                        insertOne: {
                            document: {
                                user: orgId, // Organization receiving the activity log
                                type: ACTIVITYTYPE.INVITATION,
                                title: `${user.name} accepted your invitation to join Hiron AI`,
                                metadata: {
                                    query: "Invitation Accepted",
                                    result: user
                                },
                                createdAt: new Date()
                            }
                        }
                    }));

                    // ✅ Use `bulkWrite()` for optimal performance (Batch Insert)
                    await activity.bulkWrite(bulkActivities);
                }

            } else {
                // create Organization profile
                await Organization.findOneAndUpdate(
                    { user: user._id }, // Query to find the user profile
                    { $set: { user: user._id } }, // Update or create the document
                    {
                        upsert: true, // Create if not exists
                        new: true,    // Return updated document
                    }
                );
            }


            // send welcome emai
            const emails = [{
                username: user.name,
                email: user.email,
                emailTitle: req.t('email.welcome.subject'),
                emailBody: WelcomeUser(user.name),
            }];

            await addEmailsToQueue(emails, "sendInvitation");

            await User.updateOne(
                { email }, // Search for user by email
                {
                    $set: {
                        "organizations.$[elem].isAccepted": true,  // Update `isAccepted` for each object
                        "organizations.$[elem].acceptedOn": new Date(),
                        isWelcomeSent: true // Update `acceptedOn` for each object
                    }
                },
                {
                    arrayFilters: [{ "elem.isAccepted": false }], // Only update objects where isAccepted is false
                    new: true // Return updated document
                }
            );


            const existingSub = await subscription.findOne({ userId: user._id });

            if (!existingSub) {
                await subscription.create({
                    userId: user._id,
                    currentSubscription: {
                        model: 'Free',
                        isActive: true,
                        startDate: new Date(),
                        endDate: null,
                        isComplementary: true,
                        features: {
                            candidateSearch: true,
                            aiRecommendations: false,
                            resumeFreeHiring: true,
                            accessToTemplates: false,
                            supportLevel: 'basic',
                        },
                    },
                    subscriptionHistory: [],
                    paymentHistory: [],
                });
            }

        }

        return { isPasswordSet: user.isPasswordSet, role: user.role };
    }
});

// ============================== VERIFY OTP SERVICE END ============================


// ============================== SET PASSWORD START ============================
// set user password
exports.setAccountPassword = async (req, res, next) => {
    let { password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);

    try {
        let user = await User.findOneAndUpdate(
            { email }, // Search criteria
            { $set: { password: hashPassword, isPasswordSet: true } }, // Update operation
            { new: true } // Return the updated document
        ).select('+isPasswordSet +referId +name');

        if (!user) {
            throwError(req.t("auth.error.invalid_user"), STATUS.UNAUTHORIZED);
        }

        if (!user.referId) {
            const newReferId = await generateUniqueReferId(user.name);
        
            // Atomically update only if referId is still missing (to avoid race conditions)
            user = await User.findOneAndUpdate(
                { _id: user._id, referId: { $exists: false } },
                { $set: { referId: newReferId } },
                { new: true }
            );
        }

        // ✅ Save activity in database
        await activity.create({
            user: user._id,
            type: ACTIVITYTYPE.ALERT,
            title: `Password set for ${user.name} account.`,
            metadata: {
                query: "Account Password Set",
                result: user
            }, // Store meta
        });

        // Generate tokens for the user and return the user
        // let tokens = await tokenGenerater(user._id, user.role);
        // ✅ Generate and set tokens in cookies
        let tokens = await tokenGenerater(user._id, user.role, res, true);
        return { ...tokens, isPasswordSet: user.isPasswordSet, role: user.role };

    } catch (error) {
        throwError(req.t("auth.error.server_error"), STATUS.INTERNAL_SERVER_ERROR);
    }
};

// ============================== SET PASSWORD END ============================

// ============================== RESET PASSWORD START ============================
// resetset user password
exports.resetAccountPassword = catchAsyncErrors(async (req, res, next) => {
    const { newPassword, currentPassword } = req.body;
    const userId = req.user.userId;


    // 🔍 Step 1: Fetch user with password
    const user = await User.findById(userId).select("+password"); // ✅ Ensure password is fetched
 
    if (!user) {
        throwError(req.t("auth.error.invalid_user"), STATUS.UNAUTHORIZED);
    }

    // 🔑 Step 2: Validate Old Password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
        throwError(req.t("profile.user.validation.password_mismatch"), STATUS.BAD_REQUEST);
    }

    // 🔒 Step 3: Hash New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ✅ Step 4: Update Password Using `findByIdAndUpdate`
    await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true, runValidators: true }
    );

    // ✅ Save activity in database
    await activity.create({
        user: user._id,
        type: ACTIVITYTYPE.ALERT,
        title: `Password changed for ${user.name} account.`,
        metadata: {
            query: "Account Password Changed",
            result: user
        }, // Store meta
    });

    // 🎉 Step 5: Send Response
    return true;
});


// ============================== RESET PASSWORD END ============================