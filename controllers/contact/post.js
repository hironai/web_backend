const STATUS = require("../../constants/STATUS");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const contact = require("../../models/contact/contact");
const Newsletter = require("../../models/contact/Newsletter");
const { addEmailsToQueue } = require("../../services/email/emailQueueService");
const throwError = require("../../utils/error/error");
const { contactSchema, newsletterSchema } = require("../../validator/contact");

// ============================== CONTACT CONTROLLER START =====================

const ContactUs = catchAsyncErrors(async (req, res) => {
    // Validate input with Zod
    contactSchema.parse(req.body);

    let { name, email, subject, message } = req.body;

    // ✅ Step 1: Save the message in the database
    await contact.create({ name, email, subject, message });

    // ✅ Step 2: Send an email
    const emails = [
        {
            email: process.env.SMPT_USER,
            emailTitle: "Contact Query Recienved From Hiron AI",
            emailBody: `Someone contected you via contact form \n\n ${name}, ${email}, ${subject}, ${message}`,
        }, // email to admin
        {
            email: email,
            emailTitle: `${name} Thanks for connecting Hiron AI`,
            emailBody: `Thanks for contacting us, this is an system mail to tell we have recienve your query. Our team will contetn you soon. \n\n Here is your query: \n ${name}, ${email}, ${subject}, ${message}`,
        } // email to user (auto response)
    ];

    await addEmailsToQueue(emails, "contact");

    // ✅ Step 3: Send response
    res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("contact.success.message_sent"),
    });
});

// ============================== CONTACT CONTROLLER END =====================

// ============================== NEWSLETTER CONTROLLER START =====================

const Subscribe = catchAsyncErrors(async (req, res) => {
    // Validate input with Zod
    newsletterSchema.parse(req.body);

    let { name, email } = req.body;

    // 🔍 Step 1: Check if the user is already subscribed
    const existingSubscription = await Newsletter.findOne({ email });

    if (existingSubscription) {
        throwError(req.t("newsletter.error.already_subscribed"), STATUS.CONFLICT);
    }

    // ✅ Step 2: Create a new subscription
    await Newsletter.create({ name, email });

    // ✅ Step 3: Send success response
    res.status(STATUS.SUCCESS).json({
        success: true,
        message: req.t("newsletter.success.subscribed"),
    });
});

// ============================== NEWSLETTER CONTROLLER END =====================

// Export all endpoints
module.exports = {
    POST: {
        ContactUs,
        Subscribe
    }
};