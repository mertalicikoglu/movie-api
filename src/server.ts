//server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './infrastructure/config'; // Configuration settings
import connectDB from './infrastructure/db/connection'; // Database connection function
// Import routes
import movieRoutes from './api/routes/movie.routes'; // Movie routes
import directorRoutes from './api/routes/director.routes'; // Director routes
import errorHandler from './api/middlewares/errorHandler'; // Error handling middleware



const app = express();
const PORT = config.port; // Get port from config file

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('uploads'));


// Use routes
app.use('/api/movies', movieRoutes); // Requests starting with /api/movies will be handled by movieRoutes
app.use('/api/directors', directorRoutes); // Requests starting with /api/directors will be handled by directorRoutes


// Error handling middleware must be defined after all routes
app.use(errorHandler);


// Async function to start the server
const startServer = async () => {
    try {
      // 1. Connect to database
      await connectDB();
  
      // 2. Start Express application
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access URL: http://localhost:${PORT}`);
        console.log(`API Docs (TODO): http://localhost:${PORT}/api-docs`); // Swagger/Postman Collection URL
      });
  
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1); // Exit application if error occurs
    }
  };
  
  // Start the server
  startServer();

