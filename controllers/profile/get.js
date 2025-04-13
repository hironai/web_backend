const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const User = require("../../models/auth/user");
const Candidate = require("../../models/dashboard/candidate");
const throwError = require("../../utils/error/error");


// ============================== GET USER PROFILE CONTROLLER START =====================

const userProfile = catchAsyncErrors(async (req, res, next) => {
    let { userName } = req.query;

    let user = await User.findOne({ userName });

    if(!user) {
        throwError(req.t('profile.user.error.invalid_user'), STATUS.NOT_FOUND);
    }

    let profile = await Candidate.findOne({ user: user._id }).populate({
        path: 'user',
        select: 'name email userName role'
    });

    // send new auth token
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('profile.user.success.get_profile'),
        profile
    });
});

// ============================== GET USER PROFILE CONTROLLER END =====================


// Export all endpoints
module.exports = {
    GET: {
        userProfile
    }
};