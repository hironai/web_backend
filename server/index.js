// Load environment variables from the .env file located in the config folder
require('dotenv').config({ path: './config/.env' });
// Add email workers to send emails
require('../services/queue/emailWorker');

// Import application and necessary modules
const app = require('../app');
const { Templates } = require('../constants/TEMPLATES');
const connectMongoDB = require("../db/mongo");
const { connectRedis } = require('../db/redis');
const { initializeTemplates } = require('../services/templates');

// Handle uncaught exceptions (e.g., synchronous code errors)
process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    // Exit the process to avoid inconsistent application state
    process.exit(1);
});

// Set up server port
const PORT = process.env.PORT || 5000;

// Initialize Redis connection
(async () => {
    try {
        await connectRedis(); // Attempt to connect to Redis
        console.log(`Redis connected successfully for service on port ${PORT}`);

        // Connect to MongoDB
        await connectMongoDB();

        // ✅ Initialize templates (runs once when server starts)
        await initializeTemplates(Templates);
    } catch (err) {
        console.error('Error:', err.message);
        // Optionally, you could terminate the server here if Redis is critical
        // process.exit(1);
    }
})();


// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running successfully for service on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., failed async calls)
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    console.error(err.stack);
    // Gracefully shut down the server to handle cleanup
    server.close(() => {
        process.exit(1);
    });
});