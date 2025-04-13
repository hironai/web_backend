// utils/error/error.js
const throwError = (message, statusCode, ...additionalInfo) => {
    const error = new Error(message);    
    error.status = statusCode;
    error.details = additionalInfo;
    
    throw error;
};

module.exports = throwError;
