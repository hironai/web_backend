const STATUS = require("../constants/STATUS");
const throwError = require("../utils/error/error");

module.exports = (theFunc) => async (req, res, next) => {
    try {
        return await theFunc(req, res, next); // Return the resolved value
    } catch (error) {
        // console.log(error);
        
        next(error)
    }
};