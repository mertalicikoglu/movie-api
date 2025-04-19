//server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc'; // Import swagger-jsdoc
import swaggerUi from 'swagger-ui-express'; // Import swagger-ui-express


// Import config and database connection
import config from './infrastructure/config'; // Configuration settings
import connectDB from './infrastructure/db/connection'; // Database connection function
// Import routes
import movieRoutes from './api/routes/movie.routes'; // Movie routes
import directorRoutes from './api/routes/director.routes'; // Director routes
import errorHandler from './api/middlewares/errorHandler'; // Error handling middleware



const app = express();
const PORT = config.port; // Get port from config file

// Swagger settings and Specification Definition (OpenAPI 3.0)
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Movie and Director Management API',
    version: '1.0.0',
    description: 'API for managing movies and directors, built with Node.js, Express, MongoDB, and Clean Architecture.',
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api`, // Base URL of your API
      description: 'Development server',
    },
    // Additional URLs can be added for production or other environments
  ],
  components: {
    schemas: {
      // Reusable Schema Definitions (DTOs and Response Models)
      CreateMovieDto: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Inception' },
          description: { type: 'string', example: 'A thief who steals corporate secrets...' },
          releaseDate: { type: 'string', format: 'date', example: '2010-07-16', description: 'Date in ISO 8601 format' },
          genre: { type: 'string', example: 'Sci-Fi' },
          rating: { type: 'number', format: 'float', example: 8.8, description: 'Rating between 0-10' },
          imdbId: { type: 'string', example: 'tt1375666' },
          directorId: { type: 'string', example: '60f5e8a7d4b5e7c8a9b0c1d2', description: 'Optional Director ID (in ObjectId string format)' }
        },
        required: ['title', 'description', 'releaseDate', 'genre']
      },
      UpdateMovieDto: {
         type: 'object',
         properties: {
           title: { type: 'string', example: 'Interstellar' },
           description: { type: 'string', example: 'A team of explorers travel...' },
           releaseDate: { type: 'string', format: 'date', example: '2014-11-07', description: 'Date in ISO 8601 format' },
           genre: { type: 'string', example: 'Sci-Fi' },
           rating: { type: 'number', format: 'float', example: 8.6, description: 'Rating between 0-10' },
           imdbId: { type: 'string', example: 'tt0816692' },
           directorId: { type: 'string', example: '60f5e8a7d4b5e7c8a9b0c1d2', description: 'Optional Director ID (in ObjectId string format)' }
         }
      },
       Movie: { // Movie object representation for API responses
         type: 'object',
         properties: {
           id: { type: 'string', example: '60f5e8a7d4b5e7c8a9b0c1d2', description: 'MongoDB ObjectId string' },
           title: { type: 'string', example: 'Inception' },
           description: { type: 'string', example: 'A thief who steals corporate secrets...' },
           releaseDate: { type: 'string', format: 'date', example: '2010-07-16' },
           genre: { type: 'string', example: 'Sci-Fi' },
           rating: { type: 'number', format: 'float', example: 8.8 },
           imdbId: { type: 'string', example: 'tt1375666' },
           directorId: { type: 'string', example: '60f5e8a7d4b5e7c8a9b0c1d2', description: 'Director ID' }
         },
         required: ['id', 'title', 'description', 'releaseDate', 'genre']
       },
       CreateDirectorDto: {
        type: 'object',
        properties: {
          firstName: { type: 'string', example: 'Christopher' },
          secondName: { type: 'string', example: 'Nolan' },
          birthDate: { type: 'string', format: 'date', example: '1970-07-30', description: 'Date in ISO 8601 format' },
          bio: { type: 'string', example: 'Known for mind-bending films.' }
        },
        required: ['firstName', 'secondName']
       },
       Director: { // Director object representation for API responses
         type: 'object',
         properties: {
           id: { type: 'string', example: '60f5e8a7d4b5e7c8a9b0c1d2', description: 'MongoDB ObjectId string' },
           firstName: { type: 'string', example: 'Christopher' },
           secondName: { type: 'string', example: 'Nolan' },
           birthDate: { type: 'string', format: 'date', example: '1970-07-30' },
           bio: { type: 'string', example: 'Known for mind-bending films.' }
         },
         required: ['id', 'firstName', 'secondName']
       }
    },
     // Optional: Security definitions (API Key, OAuth2 etc.)
     // securitySchemes: {
     //    bearerAuth: {
     //      type: 'http',
     //      scheme: 'bearer',
     //      bearerFormat: 'JWT',
     //    }
     //  }
  },
  // security: [ // If there's a global security scheme
  //   {
  //     bearerAuth: []
  //   }
  // ]
};

// swagger-jsdoc options
const options = {
  swaggerDefinition,
  // Paths to files containing API documentation comments
  apis: [
      './dist/api/routes/*.js', // Compiled JS files
      './src/api/routes/*.ts', // TypeScript source files (can be used during development)
    ],
};

// Create Swagger specification
const swaggerSpec = swaggerJsdoc(options);

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

// Add Swagger UI route
// API documentation will be accessible at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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
        console.log(`API Docs (TODO): http://localhost:${PORT}/api-docs`); // Swagger UI will be available at /api-docs
      });
  
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1); // Exit application if error occurs
    }
  };
  
  // Start the server
  startServer();

