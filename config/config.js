const mongoose = require('mongoose');
require('dotenv').config(); // Ensure this is loaded before using environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {

            // useCreateIndex: true,
        });
        console.log('MongoDB connected...')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
