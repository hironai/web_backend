const { ACTIVITYTYPE } = require("../../constants/APPLICATION");
const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const activity = require("../../models/activity");
const { resendInviteService } = require("../../services/organization/resendInvites");
const { uploadEmployees } = require("../../services/organization/uploadEmployees");
const throwError = require("../../utils/error/error");

// ============================== UPOAD EMPLOYEES CONTROLLER START =====================

const onboardEmployee = catchAsyncErrors(async (req, res, next) => {
    let { employees } = req.body;
    let organizationId = req.user.userId;

    if (!employees || employees.length === 0) {
        throwError(req.t('dashboard.organization.error.invalid_employee_list'), STATUS.BAD_REQUEST);
    }

    // 🔍 Step 1: Onboard Employees
    const onboardedResult = await uploadEmployees(organizationId, employees);    

    // 📌 Step 2: Log Activity Only If Employees Were Onboarded
    if (onboardedResult.totalProcessed > 0) {
        await activity.create({
            user: organizationId,
            type: ACTIVITYTYPE.INVITATION,
            title: `You onboarded ${onboardedResult.totalProcessed} ${onboardedResult.totalProcessed === 1 ? "employee" : "employees"} on Hiron AI`,
            metadata: {
                query: "Onboard employees to Hiron AI",
                result: onboardedResult
            }
        });
    }

    // 🎉 Step 3: Send Response
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("dashboard.organization.success.employees_uploaded"),
        onboardedResult
    });
});


// ============================== UPOAD EMPLOYEES CONTROLLER END =====================

// ============================== INVITE EMPLOYEES CONTROLLER START =====================

const resendInviteEmployee = catchAsyncErrors(async (req, res, next) => {
    let { employees } = req.body;

    if (!employees || employees.length === 0) {
        throwError(req.t('dashboard.organization.error.invalid_employee_list'), STATUS.BAD_REQUEST);
    }

    // ✅ send ivites via email service
    let emailSent = await resendInviteService(req, res, next);

    // ✅ Save activity in database
    await activity.create({
        user: req.user.userId,
        type: ACTIVITYTYPE.EMAIL,
        title: `Invitation sent to ${emailSent.totalEmailsSent} ${emailSent.totalEmailsSent == 0 || 1 ? "employee" : "employees"}`,
        metadata: {
            query: "Send invites to users",
            result: emailSent
        }, // Store meta
    });

    // ✅ Final Response
    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("dashboard.organization.success.invites_resent"),
        totalUpdatedUsers: emailSent.totalUpdatedUsers,
        totalEmailsSent: emailSent.totalEmailsSent
    });
});

// ============================== INVITE EMPLOYEES CONTROLLER END =====================


// Export all endpoints
module.exports = {
    POST: {
        onboardEmployee,
        resendInviteEmployee
    }
};