const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const throwError = require("../../utils/error/error");
const { tokenGenerater } = require("../../utils/token");

// =============================== Health Check API Start ===========================

const health = catchAsyncErrors(async (req, res) => {
    // return success response
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("health.success"),
    });
});

// ============================== Health Check API End ===============================


// ============================== ACCESS TOKEN CONTROLLER START =====================

const accessAuthToken = catchAsyncErrors(async (req, res, next) => {

    // Verify the refresh token using jsonwebtoken
    // let decodedToken = await validateToken(req);
    let decodedToken = req.user;

    let id = decodedToken.userId;
    let role = decodedToken.role;

    // generate new access token 
    let accessToken = await tokenGenerater(id, role, false);

    // send new auth token
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('token.success.generate'),
        ...accessToken
    });
});

// ============================== ACCESS TOKEN CONTROLLER END =======================

// ============================== REFRESH TOKEN CONTROLLER START =====================

const refreshAuthToken = catchAsyncErrors(async (req, res, next) => {
    let id = req.query.userId;
    let role = req.query.role;

    if (!role || !id) {
        throwError(req.t("token.error.missing_inputs"), STATUS.BAD_REQUEST);
    }

    // generate new REFRESH TOKEN 
    let Tokens = await tokenGenerater(id, role, true);

    // send new auth token
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('token.success.generate'),
        ...Tokens
    });
});

// ============================== ACCESS TOKEN CONTROLLER END =======================

// Export all endpoints
module.exports = {
    GET: {
        health,
        accessAuthToken,
        refreshAuthToken
    }
};