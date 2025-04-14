exports.OTPEmail = (name, otp) => {
    let year = new Date().getFullYear();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Hiron AI</title>
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
        /* OTP code styles */
        .otp-code {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 4px;
            color: #074b34;
            background-color: #f8f9fa;
            padding: 16px 32px;
            border-radius: 6px;
            margin: 24px 0;
            text-align: center;
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
            .otp-code {
                background-color: #333333 !important;
                color: #ffffff !important;
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
            .otp-code {
                font-size: 28px;
                padding: 12px 24px;
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
                                Verify Your Email
                            </h1>

                            <!-- Main Content -->
                           <!-- <p style="color: #666666; font-size: 16px; margin-bottom: 24px; text-align: center;" class="dark-mode-text">
                                Hi ${name},
                            </p> -->


                            <p style="color: #666666; font-size: 16px; margin-bottom: 24px; text-align: center;" class="dark-mode-text">
                                Please use the verification code below to complete your email verification:
                            </p>

                            <!-- OTP Code -->
                            <div class="otp-code">
                                ${otp}
                            </div>

                            <!-- Security Notice -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation" style="margin: 32px 0;">
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 24px; border-radius: 6px;" class="dark-mode">
                                        <p style="color: #666666; font-size: 14px; margin: 0;" class="dark-mode-text">
                                            🔒 This code will expire in 5 minutes and can only be used once. If you didn't request this code, please ignore this email.
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
