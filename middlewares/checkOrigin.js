// // Middleware to validate the request origin
// const validateRequest = (req, res, next) => {
//     let allowedOrigin;
//     const requestOrigin = req.headers.origin;

const STATUS = require("../constants/STATUS");

//     // Determine allowed origin based on the project mode
//     if (process.env.PROJECT_MODE === "development") {
//         allowedOrigin = process.env.DEV_ALLOW_ORIGIN + 3000;
//         // allowedOrigin = process.env.DEV_ALLOW_ORIGIN + process.env.PORT;
//     } else {
//         allowedOrigin = process.env.PROD_ALLOW_ORIGIN;
//     }

//     // Check if the request origin is allowed
//     if (requestOrigin === allowedOrigin) {
//         // Set response headers to allow the request origin
//         res.setHeader("Access-Control-Allow-Origin", requestOrigin);
//         res.setHeader("HironAi", "Origin");
//         next();
//     } else {
//         // Render a 404 page if the origin is not allowed
//         res.render(`404`);
//     }
// };

// module.exports = validateRequest;


const validateRequest = (req, res, next) => {
    let allowedOrigin;
    const requestOrigin = req.headers.origin;

    // Determine allowed origin based on the project mode
    if (process.env.PROJECT_MODE === "development") {
        // allowedOrigin = process.env.DEV_ALLOW_ORIGIN + "5000"; // Ensure port is correct
        allowedOrigin = process.env.DEV_ALLOW_ORIGIN + "3000"; // Ensure port is correct
    } else {
        allowedOrigin = process.env.PROD_ALLOW_ORIGIN;
    }

    // Check if the request origin is allowed
    if (requestOrigin === allowedOrigin) {
        // ✅ Set response headers to allow the request origin
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        res.setHeader("Access-Control-Allow-Credentials", "true"); // ✅ Required for cookies
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

        res.setHeader("HironAi", "Origin"); // Custom header (optional)
        next();
    } else {
        // 🔴 Block the request if origin is not allowed
        return res.status(STATUS.FORBIDDEN).json({ success: false, error: req.t('Forbidden: Access Not Allowed') });
    }
};

module.exports = validateRequest;
