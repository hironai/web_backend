
// const STATUS = require("../constants/STATUS");

// const validateRequest = (req, res, next) => {
//     let allowedOrigin;
//     const requestOrigin = req.headers.origin;

//     // Determine allowed origin based on the project mode
//     if (process.env.PROJECT_MODE === "development") {
//         // allowedOrigin = process.env.DEV_ALLOW_ORIGIN + "5000"; // Ensure port is correct
//         allowedOrigin = process.env.DEV_ALLOW_ORIGIN + "3000"; // Ensure port is correct
//     } else {
//         allowedOrigin = process.env.PROD_ALLOW_ORIGIN;
//     }

//     // Check if the request origin is allowed
//     if (requestOrigin === allowedOrigin) {
//         // ✅ Set response headers to allow the request origin
//         res.setHeader("Access-Control-Allow-Origin", requestOrigin);
//         res.setHeader("Access-Control-Allow-Credentials", "true"); // ✅ Required for cookies
//         res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
//         res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

//         res.setHeader("HironAi", "Origin"); // Custom header (optional)
//         next();
//     } else {
//         // 🔴 Block the request if origin is not allowed
//         return res.status(STATUS.FORBIDDEN).json({ success: false, error: req.t('Forbidden: Access Not Allowed') });
//     }
// };

// module.exports = validateRequest;



const STATUS = require("../constants/STATUS");

const validateRequest = (req, res, next) => {
    const requestOrigin = req.headers.origin;
    const requestHost = req.headers.host;
    const requestReferer = req.headers.referer || "";

    const allowedOrigins = process.env.PROD_ALLOW_ORIGIN
        ? process.env.PROD_ALLOW_ORIGIN.split(",")
        : [];

    const isAllowed =
        allowedOrigins.includes(requestOrigin) ||
        (requestOrigin === undefined &&
            (requestHost?.includes("internal.hironai.com") ||
             requestReferer?.includes("internal.hironai.com")));

    if (isAllowed) {
        // Set CORS headers conditionally only if origin exists
        if (requestOrigin) {
            res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
        return next();
    } else {
        return res
            .status(STATUS.FORBIDDEN)
            .json({ success: false, error: req.t("Forbidden: Access Not Allowed") });
    }
};

module.exports = validateRequest;