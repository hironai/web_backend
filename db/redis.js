const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://127.0.0.1:6379', // Use IPv4 localhost
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
};

module.exports = { redisClient, connectRedis };
