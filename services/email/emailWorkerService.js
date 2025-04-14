const STATUS = require('../../constants/STATUS');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');
const OTP = require('../../models/auth/otp');
const transporter = require('../../utils/mails/emailTransporter');
const throwError = require('../../utils/error/error');

const processEmailJob = catchAsyncErrors(async ({ type, email, emailBody, emailTitle, username, otp }) => {
    // Supported email types and their handlers
    const emailHandlers = {
        sendOtp: async () => {
            await OTP.findOneAndUpdate(
                { email }, // Search criteria
                { otp, email }, // Fields to update or insert
                { upsert: true, new: true } // Create if not exists
            );
        },
        sendInvitation: async () => { },
        contact: async () => { },
    };

    // Validate email type and execute the corresponding handler
    const handler = emailHandlers[type];
    if (!handler) {
        throwError("Invalid email type", STATUS.UNPROCESSABLE);
    }

    await handler(); // Execute the specific handler logic

    // Send the email
    await transporter.sendMail({
        // from: process.env.SMTP_USER,
        from: '"Hiron AI" <auth@hironai.com>',
        to: email,
        subject: emailTitle,
        html: emailBody,
    });
});

module.exports = { processEmailJob };