// src/infrastructure/db/connection.ts

import mongoose from 'mongoose';
import config from '../config'; // Import the config

const connectDB = async (): Promise<void> => {
  try {
    const dbUri = config.databaseUrl;
    if (!dbUri) {
        throw new Error("Database URL is not defined in configuration.");
    }

    await mongoose.connect(dbUri);

    console.log('MongoDB connected successfully.');

    // Listen for connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    // process.exit(1);
    throw error;
  }
};

export default connectDB;