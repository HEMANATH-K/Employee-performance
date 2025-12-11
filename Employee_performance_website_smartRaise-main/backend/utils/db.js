const mongoose = require('mongoose');
const config = require('../config/database');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoURI, config.options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Function to disconnect from MongoDB
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    } catch (error) {
        console.error(`Error disconnecting from MongoDB: ${error.message}`);
    }
};

// Function to check connection status
const isConnected = () => {
    return mongoose.connection.readyState === 1;
};

module.exports = {
    connectDB,
    disconnectDB,
    isConnected
}; 