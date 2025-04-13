const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });


const connectMongoDB = async () => {
    try {
        // connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: process.env.MONGO_CONNECT_TIMEOUT,
            retryWrites: true,
            maxPoolSize: process.env.MONGO_MAX_POOL_SIZE
        });

        // log connection success message
        console.log(`MongoDB connected successfully for service on port ${process.env.PORT}`);
    } catch (err) {
        // log connection failure message
        console.error(`Error: ${err.message}`);
        // exit connection immediately 
        process.exit(1);
    }
};

module.exports = connectMongoDB;