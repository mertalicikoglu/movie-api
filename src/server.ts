//server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './infrastructure/config'; // Configuration settings
import connectDB from './infrastructure/db/connection'; // Database connection function



const app = express();
const PORT = config.port; // Get port from config file

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('uploads'));

//create a route for the server
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

// Async function to start the server
const startServer = async () => {
    try {
      // 1. Connect to database
      await connectDB();
  
      // 2. Start Express application
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access URL: http://localhost:${PORT}`);
      });
  
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1); // Exit application if error occurs
    }
  };
  
  // Start the server
  startServer();

