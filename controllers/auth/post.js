const STATUS = require("../../constants/STATUS");
const cookie = require("cookie");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { i18nextInstance } = require("../../middlewares/i18n");
const User = require("../../models/auth/user");
const { createUser, validateuser, verifyOTP, setAccountPassword } = require("../../services/auth");
const throwError = require("../../utils/error/error");
const { otpSender } = require("../../utils/mails/otpSender");
const { signinSchema, emailSchema, otpvrifySchema, userSignupSchema, organizationSignupSchema } = require("../../validator/auth");

// ============================== SIGNUP CONTROLLER START ============================

const signUp = catchAsyncErrors(async (req, res, next) => {
    // Validate input with Zod    
    let validatedData = req.body.role && (req.body.role === "Candidate" || req.body.role === "Admin") ? userSignupSchema.parse(req.body)
        : req.body.role && req.body.role === "Organization" ? organizationSignupSchema.parse(req.body)
            : throwError(i18nextInstance.t("auth.validation.role_invalid"), STATUS.BAD_REQUEST);

    // Check if the user already exists
    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) {
        // Throw an error if the user already exists
        throwError(i18nextInstance.t("auth.validation.email_exists"), STATUS.CONFLICT);
    }

    // Create a new user
    await createUser(req, res, next);

    // Send success response
    return res.status(STATUS.CREATED).json({
        success: true,
        message: i18nextInstance.t("auth.success.user_created"),
    });
});


// ============================== SIGNUP CONTROLLER END ==============================

// ============================== SIGNIN CONTROLLER START ============================

const signIn = catchAsyncErrors(async (req, res, next) => {
    // Validate input with Zod
    signinSchema.parse(req.body);

    // validate user service
    let validateduser = await validateuser(req, res, next);

    if (validateduser) {
        // Send success response
        return res.status(STATUS.SUCCESS).json({
            success: true,
            message: i18nextInstance.t("auth.success.login"),
            isPasswordSet: validateduser.isPasswordSet,
            role: validateduser.role
        });
    }
});

// ============================== SIGNIN CONTROLLER END ==============================

// ============================== SEND EMAIL CONTROLLER START ======================

const sendOTP = catchAsyncErrors(async (req, res, next) => {
    // Validate input with Zod
    const validatedData = emailSchema.parse(req.body);
    let email = validatedData.email;

    // Check if the user exists and Validating user
    const user = await User.findOne({ email });

    if (!user) {
        throwError(i18nextInstance.t("auth.validation.email_not_exists"), STATUS.BAD_REQUEST);
    }

    // call otpSender to send otp
    let username = user.name;
    await otpSender(email, username, next);

    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: i18nextInstance.t('auth.success.otp_sent')
    });
});

// ============================== SEND EMAIL CONTROLLER END ========================

// ============================== VERIFY ACCOUNT CONTROLLER START ======================

const verifyAccount = catchAsyncErrors(async (req, res, next) => {
    // Validate input with Zod
    otpvrifySchema.parse(req.body);
    const type = req.body.type;

    // validate account
    let accountVerified = await verifyOTP(req, res, next);

    // send success response
    if (accountVerified) {        
        return res.status(200).json({
            success: true,
            message: type && type === "login" ? i18nextInstance.t('auth.success.account_verified'): i18nextInstance.t('auth.success.otp_verified'),
            isPasswordSet: accountVerified.isPasswordSet,
            role: accountVerified.role
        });
    }
});

// ============================== LOGOUT TOKEN CONTROLLER START ======================

const logout = catchAsyncErrors(async (req, res, next) => {

    res.setHeader("Set-Cookie", [
        cookie.serialize("access_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), // Expire immediately
        }),
        cookie.serialize("refresh_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), // Expire immediately
        }),
        cookie.serialize("userId", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), // Expire immediately
        })
    ]);

    return res.status(STATUS.SUCCESS).json({
        message: i18nextInstance.t('auth.success.logout')
    });
});


// ============================== LOGOUT TOKEN CONTROLLER END =======================

// ============================== SET ACCOUNT PASSWORD CONTROLLER START ======================

const setPassword = catchAsyncErrors(async (req, res, next) => {
    let { password } = req.body;

    // Check if the Authorization header is present
    if (!password || password.length < 6) {
        throwError(i18nextInstance.t("profile.user.validation.password_min_length"), STATUS.BAD_REQUEST);
    }

    let passwordSet = await setAccountPassword(req, res);

    if (passwordSet) {
        // Send success response
        return res.status(STATUS.SUCCESS).json({
            success: true,
            message: i18nextInstance.t("auth.success.password_set"),
            // accessToken: passwordSet.accessToken,
            isPasswordSet: passwordSet.isPasswordSet,
            role: passwordSet.role
        });
    }
});

// ============================== SET ACCOUNT PASSWORD CONTROLLER END ========================


// Export all endpoints
module.exports = {
    POST: {
        signUp,
        signIn,
        sendOTP,
        verifyAccount,
        logout,
        setPassword
    }
};