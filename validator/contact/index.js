const { z } = require("zod");
const { i18nextInstance } = require('../../middlewares/i18n');

// Contact validation schema for candidate
const contactSchema = z.object({
    name: z.string().min(3, i18nextInstance.t('contact.validation.name')),
    email: z.string().email(i18nextInstance.t('contact.validation.email')),
    subject: z.string().min(5, i18nextInstance.t('contact.validation.subject')),
    message: z.array(z.string())
        .min(1, i18nextInstance.t('contact.validation.message'))
});

// Newsletter validation schema for candidate
const newsletterSchema = z.object({
    name: z.string().min(3, i18nextInstance.t('newsletter.validation.name')),
    email: z.string().email(i18nextInstance.t('newsletter.validation.email')),
    // feature: z.string().min(3, i18nextInstance.t('newsletter.validation.feature'))
});

module.exports = { contactSchema, newsletterSchema };