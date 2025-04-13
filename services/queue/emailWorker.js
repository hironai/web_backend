const { Worker } = require('bullmq');
const redisConfig = require('../../db/redis');
const { processEmailJob } = require('../email/emailWorkerService');

// Create a worker to process email jobs
const emailWorker = new Worker(
    'emailQueue',
    async (job) => {
        console.log(`Processing job: ${job.id}, Type: ${job.data.type}`);
        await processEmailJob(job.data);
    },
    {
        connection: redisConfig,
        concurrency: 5,
    }
);

emailWorker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Job failed: ${job.id}, Error: ${err.message}`);
});

module.exports = emailWorker;
