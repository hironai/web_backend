const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const feedback = require("../../models/feedback");
const throwError = require("../../utils/error/error");

// ============================== FEEDBACK CREATE CONTROLLER START =====================

const submitFeedback = catchAsyncErrors(async (req, res, next) => {
    const { feed, type } = req.body;
    const userId = req.user.userId;
    const validTypes = ["general", "bug", "feature"];

    if (!feed) {
        throwError(req.t('feedback.error.missing_input'), STATUS.BAD_REQUEST);
    }

    if (type && !validTypes.includes(type)) {
        throwError(req.t('feedback.error.invalid_feddback_type'), STATUS.BAD_REQUEST);
    }

    // 🔍 Create & Store Feedback
    await feedback.create({
        user: userId,
        type: type || "general",
        feed
    });

    // 🎉 Send Success Response
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('feedback.success.thanks')
    });
});


// ============================== FEEDBACK CREATE CONTROLLER END =====================

// Export all endpoints
module.exports = {
    POST: {
        submitFeedback
    }
};