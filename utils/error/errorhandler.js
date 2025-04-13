const STATUS = require("../../constants/STATUS");

// errorHandler middleware to handle errors
const errorHandler = (err, req, res, next) => {    
    // Handle Zod validation errors
    if (err.name === 'ZodError') {
        const errors = err.errors.map((error) => ({
            path: error.path.join('.'),
            message: req.t(error.message),
        }));
        return res.status(STATUS.UNPROCESSABLE).json({ success: false, errors });
    }

    // Handle other types of errors    
    const statusCode = err.status ? err.status : STATUS.INTERNAL_SERVER_ERROR;
    let errorDetails = err.details && err.details.length > 0 ? err.details[0] : [];
    
    return res.status(statusCode).json({
        success: false,
        error: err.message || req.t('server.error.server_error'),
        ...errorDetails, // Return additional details if they exist
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    }); 
};

module.exports = errorHandler;
