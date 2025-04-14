const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const { addEmailsToQueue } = require("../../services/email/emailQueueService");
const { OTPEmail } = require("../../templates/emails/OTP");

// Generates a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generates and Send OTP to email queue service
exports.otpSender = catchAsyncErrors(async (email, username, next) => {
    
    // Generate the OTP
    let otp = generateOTP();

    // Create the OTP email job
    const emails = [{
        username,
        email,
        otp,
        emailTitle: 'Account Verification Code From Hiron AI',
        emailBody: OTPEmail(username, otp),
    }];

    // Add the OTP email job to the queue
    await addEmailsToQueue(emails, "sendOtp");
});