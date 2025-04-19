// src/api/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../../application/errors'; // Import our custom validation error

// Middleware factory: Takes a Zod schema and returns a middleware function
export const validate = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body according to the given schema
      // Using schema.safeParse(req.body) instead of schema.parse(req.body) might be better
      // for more controlled error handling.
      // However, since we'll throw the error to the error handler here, we can use parse.
      schema.parse(req.body);

      // If validation is successful, proceed to next middleware or route handler
      next();

    } catch (error: any) {
      // If validation fails, a ZodError is thrown
      if (error instanceof ZodError) {
        // Convert ZodError to our custom ValidationError
        // We can add ZodError details (invalid fields, messages) to the error message
        const errorMessages = error.errors.map(issue => `${issue.path.join('.')} is invalid: ${issue.message}`).join('; ');
        // console.error('[VALIDATION ERROR]:', errorMessages); // Log to server
        next(new ValidationError(`Validation failed: ${errorMessages}`)); // Throw our custom error class
      } else {
        // If there's another unexpected error, pass it to the error handler
        next(error);
      }
    }
  };

// Note: Similar functions can be written for req.params or req.query validation if needed.
// For now, we only implemented req.body validation.