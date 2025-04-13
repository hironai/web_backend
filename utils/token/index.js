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

const validateToken = catchAsyncErrors(async (req, res, next) => {
    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        let token = cookies.access_token;
        const ref_token = cookies.refresh_token;

        let decoded;

        // 1. If access token is present, try verifying it
        if (token) {
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                // If token expired or invalid, try refresh token
                if (ref_token) {
                    try {
                        const refDecoded = jwt.verify(ref_token, process.env.JWT_REFRESH_SECRET);
                        
                        // Check refresh token exists in DB
                        const savedToken = await RefreshToken.findOne({ userId: refDecoded.userId, token: ref_token });
                        if (!savedToken) {
                            return res.status(STATUS.UNAUTHORIZED).json({
                                success: false,
                                error: req.t("token.error.invalid_refresh"),
                            });
                        }

                        // Generate new access token
                        const newAccessToken = generateToken(refDecoded.userId, refDecoded.role, "accessToken", process.env.JWT_ACCESS_EXPIRES_IN);

                        // Set new access token in cookies
                        res.setHeader("Set-Cookie", cookie.serialize("access_token", newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "strict",
                            path: "/",
                            maxAge: 60 * 60 * 24, // 1 day
                        }));

                        decoded = jwt.decode(newAccessToken); // decode new token for user info
                        token = newAccessToken; // replace old token with new one
                    } catch (refreshErr) {
                        return res.status(STATUS.UNAUTHORIZED).json({
                            success: false,
                            error: req.t("token.error.invalid_refresh"),
                        });
                    }
                } else {
                    return res.status(STATUS.UNAUTHORIZED).json({
                        success: false,
                        error: req.t("token.error.missing"),
                    });
                }
            }
        } else {
            // 2. No access token: check refresh token
            if (ref_token) {
                try {
                    const refDecoded = jwt.verify(ref_token, process.env.JWT_REFRESH_SECRET);

                    const savedToken = await RefreshToken.findOne({ userId: refDecoded.userId, token: ref_token });
                    if (!savedToken) {
                        return res.status(STATUS.UNAUTHORIZED).json({
                            success: false,
                            error: req.t("token.error.invalid_refresh"),
                        });
                    }

                    // Generate new access token
                    const newAccessToken = generateToken(refDecoded.userId, refDecoded.role, "accessToken", process.env.JWT_ACCESS_EXPIRES_IN);

                    // Set access token in cookies
                    res.setHeader("Set-Cookie", cookie.serialize("access_token", newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        path: "/",
                        maxAge: 60 * 60 * 24, // 1 day
                    }));

                    decoded = jwt.decode(newAccessToken);
                    token = newAccessToken;
                } catch (refreshErr) {
                    return res.status(STATUS.UNAUTHORIZED).json({
                        success: false,
                        error: req.t("token.error.invalid_refresh"),
                    });
                }
            } else {
                // No access or refresh token
                return res.status(STATUS.UNAUTHORIZED).json({
                    success: false,
                    error: req.t("token.error.missing"),
                });
            }
        }

        // ✅ Assign user and update last active time
        req.user = decoded;
        await User.findByIdAndUpdate(decoded.userId, { lastActive: Date.now() });

        // Proceed
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
