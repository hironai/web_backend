const emailQueue = require('../queue/emailQueue');

// Add emails to the queue
const addEmailsToQueue = async (emails, type) => {
    const jobs = emails.map(({ email, username, otp, emailBody, emailTitle }) => ({
        name: `${type}Email`,
        data: { type, email, username, otp, emailBody, emailTitle },
        options: {
            priority: type === 'sendOtp' ? 1 : 5,
            attempts: 3,
            backoff: 3000,
            removeOnComplete: true,
        },
    }));
    
    // Add emails to the queue in bulk
    await emailQueue.addBulk(jobs);
    
};

module.exports = { addEmailsToQueue };
