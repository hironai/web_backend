exports.DeleteAccountEmail = (name, email) => {
    let year = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deleted - Hiron AI</title>
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
        /* Notice box */
        .notice-box {
            background-color: #fff4f4;
            padding: 24px;
            border-radius: 6px;
            margin: 24px 0;
            border-left: 4px solid #dc2626;
        }
        /* Data retention box */
        .data-box {
            background-color: #f8f9fa;
            padding: 24px;
            border-radius: 6px;
            margin: 24px 0;
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
            .notice-box {
                background-color: #2d1f1f !important;
            }
            .data-box {
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
                                Your Account Has Been Deleted
                            </h1>

                            <!-- Main Content -->
                            <p style="color: #666666; font-size: 16px; margin-bottom: 24px; text-align: center;" class="dark-mode-text">
                                Hi ${name},
                            </p>

                            <p style="color: #666666; font-size: 16px; margin-bottom: 24px; text-align: center;" class="dark-mode-text">
                                We're confirming that your Hiron AI account (${email}) has been successfully deleted as requested.
                            </p>

                            <!-- Notice Box -->
                            <div class="notice-box">
                                <p style="color: #666666; font-size: 14px; margin: 0;" class="dark-mode-text">
                                    ⚠️ This action is permanent and cannot be undone. If you wish to use our services again in the future, you'll need to create a new account.
                                </p>
                            </div>

                            <!-- Data Retention Info -->
                            <div class="data-box">
                                <h2 style="color: #333333; font-size: 18px; margin-bottom: 16px;" class="dark-mode-text">
                                    What Happens Next?
                                </h2>
                                <ul style="color: #666666; margin-left: 24px; padding: 0;" class="dark-mode-text">
                                    <li style="margin-bottom: 12px;">Your account and personal information have been removed from our active systems</li>
                                    <li style="margin-bottom: 12px;">Any remaining data will be permanently deleted from our backups within 30 days</li>
                                    <li style="margin-bottom: 12px;">You will no longer receive any communications from us</li>
                                </ul>
                            </div>

                            <!-- Feedback Section -->
                            <p style="color: #666666; font-size: 16px; text-align: center; margin-top: 32px;" class="dark-mode-text">
                                We're sorry to see you go. If you'd like to share feedback about your experience, please <a href="https://hironai.com/feedback" style="color: #074b34; text-decoration: none;">let us know</a>.
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
