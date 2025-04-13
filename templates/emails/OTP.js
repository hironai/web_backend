exports.OTPEmail = (otp) => {
    return `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
</head>
<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Your verification code for
    Nectar
    <div>
    </div>
</div>

<body
    style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
        style="max-width:560px;margin:0 auto;padding:20px 0 48px">
        <tbody>
            <tr style="width:100%">
                <td><img alt="Nectar" height="50" src="https://workforwin.com/icon.svg"
                        style="display:block;text-decoration:none; border:2px gainsboro dashed; border-radius: 100%; padding: 4px;"
                        width="52" />
                    <h1
                        style="font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#484848;padding:17px 0 0">
                        Your verification code</h1>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
                        style="padding:20px 0 27px; margin-bottom:12px">
                        <tbody>
                            <tr>
                                <td><code
                                        style="font-family:monospace;font-weight:700;padding:1px 4px;background-color:#dfe1e4;letter-spacing:-0.3px;font-size:21px;border-radius:4px;color:#3c4149">${otp}</code>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="font-size:15px;line-height:1.4;margin:0 0 15px;color:#3c4149">This verification code will
                        only be valid for the next 5 minutes. If this expires you can request a new OTP at any time</p>
                    <p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br />Nectar Auth</p>
                    <hr
                        style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
                    <p style="font-size:12px;line-height:24px;margin:16px 0;color:#8898aa">123 Broadway, New York, NY 10013, USA<br />+1 (555) 123-4567</p>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`;
};
