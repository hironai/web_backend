const STATUS = require("../../constants/STATUS");
const TemplateService = require("../../services/templates");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const throwError = require("../../utils/error/error");

// ============================== UPDATE TEMPLATES CONTROLLER START =====================

// ✅ Update Template by ID API
const updateTemplate = catchAsyncErrors(async (req, res) => {
    const updatedTemplate = await TemplateService.updateTemplate(req.query.id, req.body);
    if (!updatedTemplate) {
        throwError(req.t('templates.error.not_found'), STATUS.NOT_FOUND);
    }
    res.status(200).json({
        success: true,
        message: req.t('templates.success.updated'),
        template: updatedTemplate
    });
});

// ============================== UPDATE TEMPLATES CONTROLLER END =====================

// Export all endpoints
module.exports = {
    PUT: {
        updateTemplate
    }
};