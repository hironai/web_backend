const STATUS = require("../../constants/STATUS");
const TemplateService = require("../../services/templates");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const throwError = require("../../utils/error/error");
const Candidate = require("../../models/dashboard/candidate");

// ============================== GET ALL TEMPLATES CONTROLLER START =====================

// ✅ Get Templates (All or By ID)
const getTemplates = catchAsyncErrors(async (req, res) => {
    const { slug, profile } = req.query;

    let dashboard = {};    

    // 🔍 If slug is provided, fetch a single template
    if (slug) {
        // get template first
        const template = await TemplateService.getTemplateById(slug);
        if (!template) {
            throwError(req.t("templates.error.not_found"), STATUS.NOT_FOUND);
        }
        
        // get user data
        dashboard = await TemplateService.getProfileDashboard(profile, req, template);        
        
        return res.status(STATUS.SUCCESS).json({ 
            success: true, 
            message: req.t("templates.success.get_template"), 
            template,
            dashboard
        });
    }

    // 🔍 Otherwise, fetch all templates
    const templates = await TemplateService.getAllTemplates();
    res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("templates.success.get_templates"),
        templates
    });
});

// ============================== GET ALL TEMPLATES CONTROLLER END =====================


// Export all endpoints
module.exports = {
    GET: {
        getTemplates
    }
};