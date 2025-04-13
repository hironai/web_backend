const { ACTIVITYTYPE } = require("../../constants/APPLICATION");
const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const activity = require("../../models/activity");
const User = require("../../models/auth/user");
const throwError = require("../../utils/error/error");

// ============================== DELETE ORGANIZATION EMPLOYEE CONTROLLER START =====================

const deleteOrganizationEmployee = catchAsyncErrors(async (req, res, next) => {
    let { userId } = req.user; 
    let { employeeId } = req.query;

    if (!employeeId) {
        throwError(req.t('dashboard.organization.error.employeeId_missing'), STATUS.BAD_REQUEST);
    }

    // 🔍 Find employee in the database
    let employee = await User.findById(employeeId);

    if (!employee) {
        throwError(req.t('dashboard.organization.error.employee_not_found'), STATUS.NOT_FOUND);
    }

    // ✅ Filter out only the organization that matches `userId`
    let updatedOrganizations = employee.organizations.filter(
        org => org.organizationId.toString() !== userId.toString()
    );

    // 🔄 Update the employee with the filtered organizations
    await User.findByIdAndUpdate(employeeId, { organizations: updatedOrganizations });

        // ✅ Save activity in database
        await activity.create({
            user: req.user.userId,
            type: ACTIVITYTYPE.DELETE,
            title: `You removed ${employee.name} form your organization`,
            metadata: {
                query: "Employee deleted",
                result: employee
            }, // Store meta
        });

    return res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t('dashboard.organization.success.employee_removed'),
    });
});


// ============================== DELETE ORGANIZATION EMPLOYEE CONTROLLER END =====================


// Export all endpoints
module.exports = {
    DELETE: {
        deleteOrganizationEmployee,
    }
};