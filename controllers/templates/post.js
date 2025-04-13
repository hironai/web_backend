const STATUS = require("../../constants/STATUS");
const TemplateService = require("../../services/templates");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const throwError = require("../../utils/error/error");
const Template = require("../../models/templates");

// ============================== CREATE TEMPLATES CONTROLLER START =====================

// ✅ Create Templates API
const createTemplates = catchAsyncErrors(async (req, res) => {
    let { templates } = req.body;

    if (!templates || !Array.isArray(templates) || templates.length === 0) {
        throwError(req.t('templates.error.missing_input'), STATUS.NOT_FOUND);
    }

    // 🔍 Extract previewUrls from incoming templates
    const previewUrls = templates.map(t => t.previewUrl);

    // 🔍 Find existing templates with the same previewUrl
    const existingTemplates = await Template.find({ previewUrl: { $in: previewUrls } })
        .select("previewUrl")
        .lean(); // Optimize performance

    // 🔍 Extract existing previewUrls
    const existingUrls = new Set(existingTemplates.map(t => t.previewUrl));

    // 🔄 Filter out templates that already exist
    const uniqueTemplates = templates.filter(t => !existingUrls.has(t.previewUrl));

    if (uniqueTemplates.length === 0) {
        throwError(req.t('templates.error.already_exists'), STATUS.BAD_REQUEST);
    }

    // 🚀 Bulk Insert Unique Templates
    const createdTemplates = await TemplateService.createTemplates(uniqueTemplates);

    res.status(STATUS.CREATED).json({
        success: true,
        message: req.t('templates.success.created'),
        createdCount: createdTemplates.length,
        templates: createdTemplates
    });
});


// ============================== CREATE TEMPLATES CONTROLLER END =====================

// Export all endpoints
module.exports = {
    POST: {
        createTemplates
    }
};