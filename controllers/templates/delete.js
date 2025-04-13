const STATUS = require("../../constants/STATUS");
const TemplateService = require("../../services/templates");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const throwError = require("../../utils/error/error");

// ============================== DELETE TEMPLATES CONTROLLER START =====================

// ✅ Delete Template by ID API
const deleteTemplate = catchAsyncErrors(async (req, res) => {
    const deletedTemplate = await TemplateService.deleteTemplate(req.query.id);
    if (!deletedTemplate) {
        throwError(req.t('templates.error.not_found'), STATUS.NOT_FOUND);
    }
    res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('templates.success.deleted')
    });
});


// ============================== DELETE TEMPLATES CONTROLLER END =====================

// Export all endpoints
module.exports = {
    DELETE: {
        deleteTemplate
    }
};