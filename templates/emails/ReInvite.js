exports.ReInvitationEmail = (name, inviter_name, organization, email) => {
    let year = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reminder: Join Your Team on Hiron AI</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset styles */
        body, table, td, div, p {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
        }
        /* Responsive container */
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
        /* Button styles */
        .button {
            display: inline-block;
            padding: 16px 32px;
            background-color: #074b34;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 24px 0;
        }
        /* Info box */
        .info-box {
            background-color: #f8f9fa;
            padding: 24px;
            border-radius: 6px;
            margin: 24px 0;
            border-left: 4px solid #074b34;
        }
        /* Responsive images */
        img {
            max-width: 100%;
            height: auto;
        }
        /* Dark mode support */
        /* @media (prefers-color-scheme: dark) {
            .dark-mode {
                background-color: #1a1a1a !important;
                color: #ffffff !important;
            }
            .dark-mode-text {
                color: #ffffff !important;
            }
            .dark-mode-border {
                border-color: #333333 !important;
            }
            .info-box {
                background-color: #333333 !important;
            }
        } */
        /* Mobile responsiveness */
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .mobile-padding {
                padding: 20px !important;
            }
            .button {
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6;" class="dark-mode">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table class="container" border="0" cellspacing="0" cellpadding="0" role="presentation">
                    <tr>
                        <td class="mobile-padding dark-mode" style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <!-- Logo -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td align="center" style="padding-bottom: 12px;">
                                        <img src="https://hironai.com/icon.png" alt="Hiron AI" style="width: 50px; height: auto;">
                                    </td>
                                </tr>
                            </table>

                            <!-- Title -->
                            <h1 style="color: #333333; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 24px;" class="dark-mode-text">
                                Reminder: Complete Your Team Registration
                            </h1>

                            <!-- Main Content -->
                            <p style="color: #666666; font-size: 16px; margin-bottom: 24px; text-align: center;" class="dark-mode-text">
                                Hi ${name},
                            </p>

                            <p style="color: #666666; font-size: 16px; margin-bottom: 24px; text-align: center;" class="dark-mode-text">
                                This is a friendly reminder that ${inviter_name} has invited you to join ${organization} on Hiron AI. Your invitation is still pending.
                            </p>

                            <!-- Info Box -->
                            <div class="info-box">
                                <p style="color: #666666; font-size: 14px; margin: 0;" class="dark-mode-text">
                                    📧 Use your email address (${email}) to access your account. If you need to reset your password, you can do so on the login page.
                                </p>
                            </div>

                            <!-- CTA Button -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td align="center">
                                        <a href="https://hironai.com/login" class="button" style="font-family: inherit;">
                                            Complete Registration
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Expiry Notice -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin: 32px 0;">
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 24px; border-radius: 6px;" class="dark-mode">
                                        <p style="color: #666666; font-size: 14px; margin: 0;" class="dark-mode-text">
                                            ⏰ Please note that this invitation will expire in 48 hours. If you need a new invitation after it expires, please contact ${inviter_name}.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Help Text -->
                            <p style="color: #666666; font-size: 16px; text-align: center;" class="dark-mode-text">
                                Having trouble? <a href="https://hironai.com/help-center" style="color: #074b34; text-decoration: none;">Contact Support</a>
                            </p>

                            <!-- Footer -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin-top: 40px; border-top: 1px solid #eaeaea;" class="dark-mode-border">
                                <tr>
                                    <td style="padding-top: 24px;">
                                        <p style="color: #999999; font-size: 14px; text-align: center;" class="dark-mode-text">
                                            © ${year} Hiron AI. All rights reserved.
                                        </p>
                                        <p style="color: #999999; font-size: 14px; text-align: center;" class="dark-mode-text">
                                            Buckingham Palace Road, London SW1W 9SR, UK
                                        </p>
                                        <p style="color: #999999; font-size: 14px; text-align: center; margin-top: 16px;" class="dark-mode-text">
                                            <a href="https://hironai.com/privacy" style="color: #999999; text-decoration: underline; margin: 0 8px;">Privacy Policy</a>
                                            <a href="https://hironai.com/terms" style="color: #999999; text-decoration: underline; margin: 0 8px;">Terms of Service</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
