const { Queue } = require('bullmq');
const redisConfig = require('../../db/redis');

// Create a new queue for emails
const emailQueue = new Queue('emailQueue', { connection: redisConfig });

module.exports = emailQueue;
