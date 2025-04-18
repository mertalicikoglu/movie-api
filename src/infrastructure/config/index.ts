// src/infrastructure/config/index.ts

import dotenv from 'dotenv';
import path from 'path';

// Load the .env file from the application root directory
// process.cwd() returns the directory where the Node.js application is running
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Read environment variables and export them as an object for the application to use
const config = {
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/movie-director-db', // You can add default values
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000 // Convert port to number
};

// Check if required variables are loaded
if (!config.databaseUrl || isNaN(config.port)) {
    console.error("FATAL ERROR: DATABASE_URL or PORT is not defined or invalid in .env file.");
    // process.exit(1); // You can stop the application if critical at startup
}


export default config;