const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { i18nextInstance } = require("../../middlewares/i18n");
const { resetAccountPassword } = require("../../services/auth");
const throwError = require("../../utils/error/error");

// ============================== SET ACCOUNT PASSWORD CONTROLLER START ======================

const resetSetPassword = catchAsyncErrors(async (req, res, next) => {
    let { currentPassword, newPassword } = req.body;

    console.log(currentPassword, currentPassword.length, newPassword, newPassword.length);
    

    // Check if the Authorization header is present
    if (!currentPassword || !newPassword || currentPassword.length < 6 || newPassword.length < 6) {
        throwError(i18nextInstance.t("profile.user.validation.password_min_length"), STATUS.BAD_REQUEST);
    }

    let passwordSet = await resetAccountPassword(req, res, next);

    if (passwordSet) {
        // send success resp
        return res.status(STATUS.SUCCESS).json({
            message: i18nextInstance.t('profile.user.success.update_password')
        });
    }
});

// ============================== SET ACCOUNT PASSWORD CONTROLLER END ========================


// Export all endpoints
module.exports = {
    PUT: {
        resetSetPassword
    }
};