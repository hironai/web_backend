const jwt = require('jsonwebtoken');
const RefreshToken = require('../../models/auth/refreshToken');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const STATUS = require('../../constants/STATUS');
const User = require('../../models/auth/user');
const cookie = require("cookie");

// Generate the tokens
const generateToken = (userId, role, type, expiresIn = '1d') => {
    // Create payload
    const payload = {
        userId,
        role: role,
        type,
        iss: process.env.JWT_ISSUER,
        iat: Math.floor(Date.now() / 1000),
        aud: process.env.APPLICATION_AUDIENCE,
    };

    let secrets = type === 'accessToken' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
    // Generate Access Token
    return jwt.sign(payload, secrets, { expiresIn });
};

// const validateToken = catchAsyncErrors(async (req, res, next) => {
//     try {
//         // ✅ Read cookies from the request
//         const cookies = cookie.parse(req.headers.cookie || "");
//         const token = cookies.access_token; // Get access token from cookies
//         const ref_token = cookie.refresh_token; // Get refresh token from

//         if (!token) {
//             return res.status(STATUS.UNAUTHORIZED).json({
//                 success: false,
//                 error: req.t("token.error.missing"),
//             });
//         }

//         // 🔐 Verify JWT Token
//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.JWT_SECRET);
//         } catch (err) {
//             if (err.name === "TokenExpiredError") {
//                 return res.status(STATUS.UNAUTHORIZED).json({
//                     success: false,
//                     error: req.t("token.error.expired"),
//                 });
//             } else {
//                 return res.status(STATUS.UNAUTHORIZED).json({
//                     success: false,
//                     error: req.t("token.error.invalid"),
//                 });
//             }
//         }

//         // ✅ Assign User Info to `req.user`
//         req.user = decoded;

//         // ✅ Update `lastActive` field correctly
//         await User.findByIdAndUpdate(decoded.userId, { lastActive: Date.now() });

//         // ✅ Proceed to Next Middleware
//         next();
//     } catch (error) {
//         console.error("Token Validation Error:", error);
//         return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             error: req.t("server.error.server_error"),
//         });
//     }
// });

const validateToken = catchAsyncErrors(async (req, res, next) => {
    try {
        // ✅ Read cookies from the request
        const cookies = cookie.parse(req.headers.cookie || "");
        const token = cookies.access_token; // Get access token from cookies
        const ref_token = cookies.refresh_token; // Get refresh token from

        if (!token) {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                error: req.t("token.error.missing"),
            });
        }

        // 🔐 Verify JWT Token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(STATUS.UNAUTHORIZED).json({
                    success: false,
                    error: req.t("token.error.expired"),
                });
            } else {
                return res.status(STATUS.UNAUTHORIZED).json({
                    success: false,
                    error: req.t("token.error.invalid"),
                });
            }
        }

        // ✅ Assign User Info to `req.user`
        req.user = decoded;

        // ✅ Update `lastActive` field correctly
        await User.findByIdAndUpdate(decoded.userId, { lastActive: Date.now() });

        // ✅ Proceed to Next Middleware
        next();
    } catch (error) {
        console.error("Token Validation Error:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: req.t("server.error.server_error"),
        });
    }
});

const tokenGenerater = async (id, role, res, generateBoth = true) => {
    console.log(res, id, role);
    
    // Generate access token
    const accessToken = generateToken(id, role, "accessToken", process.env.JWT_ACCESS_EXPIRES_IN);

    // Generate refresh token if needed
    let refreshToken = null;
    if (generateBoth) {
        refreshToken = generateToken(id, role, "refreshToken", process.env.JWT_REFRESH_EXPIRES_IN);

        // Store refresh token in the database
        await RefreshToken.findOneAndUpdate(
            { userId: id },
            { token: refreshToken, userId: id },
            { upsert: true, new: true }
        );
    }

    // ✅ Store both access and refresh tokens in HTTP-only cookies
    res.setHeader("Set-Cookie", [
        cookie.serialize("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day expiry
        }),
        cookie.serialize("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days expiry
        }),
        cookie.serialize("userId", id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        })
    ]);

    return { success: true, message: "Tokens set in cookies" };
};




module.exports = {
    validateToken,
    tokenGenerater
};
