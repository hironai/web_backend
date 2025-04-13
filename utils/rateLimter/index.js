const rateLimit = require('express-rate-limit')

// * Impliment rate limit on API so that we can privent from unnecessary requests

exports.limiter = (requests) => {
    return rateLimit({
        windowMS: 60 * 60 * 1000,
        max: requests,
        message: {
            success: false,
            message: "Too many requests, Please try again later."
        },
        standardHeaders: true,
        legacyHeaders: false
    })
};