const { z } = require('zod');
const { i18nextInstance } = require('../../middlewares/i18n');

// Signup validation schema for candidate
const userSignupSchema = z.object({
    name: z.string().min(3, i18nextInstance.t('auth.validation.name')),
    email: z.string().email(i18nextInstance.t('auth.validation.email')),
    password: z
        .string()
        .min(6, i18nextInstance.t('auth.validation.password_min_length', { length: 6 })),
    role: z.string().optional(),
});

// Signup validation schema for organization
const organizationSignupSchema = z.object({
    name: z.string().min(3, i18nextInstance.t('auth.validation.name')),
    email: z.string().email(i18nextInstance.t('auth.validation.email')),
    organizationType: z.string().min(3, i18nextInstance.t('auth.validation.organization_type')),
    contactPerson: z.string().min(3, i18nextInstance.t('auth.validation.contact_person')),
    password: z
        .string()
        .min(6, i18nextInstance.t('auth.validation.password_min_length', { length: 6 })),
    role: z.string().optional(),
});

// Signin validation schema
const signinSchema = z.object({
    email: z.string().email(i18nextInstance.t('auth.validation.email')),
    password: z
        .string()
        .min(6, i18nextInstance.t('auth.validation.password_min_length', { length: 6 })),
});

// email validation schema
const emailSchema = z.object({
    email: z.string().email(i18nextInstance.t('auth.validation.email'))
});

// email validation schema
const otpvrifySchema = z.object({
    email: z.string().email(i18nextInstance.t('auth.validation.email')),
    otp: z.number().refine(
        (otp) => otp.toString().length === 6, // Ensure the number has exactly 6 digits
        {
            message: i18nextInstance.t('auth.otp.error.otp_invalid', { length: 6 }),
        }
    ),
});


module.exports = { userSignupSchema, organizationSignupSchema, signinSchema, emailSchema, otpvrifySchema };
