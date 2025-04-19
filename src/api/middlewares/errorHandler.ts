// src/api/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../application/errors'; // Import our custom error classes

// Error Handling Middleware function
// Middleware functions with 4 arguments are considered error handling middleware in Express.
const errorHandler = (
  err: Error, // Captured error object (CustomError or built-in Error)
  req: Request,
  res: Response,
  next: NextFunction // If another error handler exists, pass it to it, typically not called in the last error handler
): void => {

  // Check the type of the error
  if (err instanceof CustomError) {
    // If error is one of our custom error classes
    console.error(`[ERROR] Custom Error: ${err.name} - ${err.message} (Status: ${err.statusCode})`, err.stack);
    res.status(err.statusCode).json({
      message: err.message,
      // Optional: Add error name as well
      // errorType: err.name
    });
  } else {
    // If error is not a CustomError, it's an unexpected error (e.g. database connection error, programming error, etc.)
    console.error('[ERROR] Unexpected Error:', err.message, err.stack);
    const statusCode = 500; // Internal Server Error
    const message = 'An unexpected error occurred.';

    res.status(statusCode).json({
      message: message,
      // In development environment, more details can be shown:
      // ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

};

export default errorHandler;