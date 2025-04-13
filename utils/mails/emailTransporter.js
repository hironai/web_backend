const nodemailer = require('nodemailer');

// email transport settings
const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    host: process.env.SMPT_HOST,
    secureConnection: true,
    port: process.env.SMPT_PORT,
    auth: {
        user: "auth@hironai.com",
        pass: "#Verify@Key$1122",
        // user: process.env.SMPT_USER,
        // pass: process.env.SMPT_PASSWORD,
    },
});

module.exports = transporter;
