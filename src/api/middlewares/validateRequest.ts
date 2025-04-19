// src/api/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod'; // Import ZodSchema
import { ValidationError } from '../../application/errors'; // Import our custom validation error

// Middleware factory: Takes a Zod schema and returns a middleware function
// Using more general ZodSchema<any> instead of AnyZodObject because operations like .refine()
// can transform ZodObject type into other types like ZodEffects
export const validate = (schema: ZodSchema<any>) => // Changed type from AnyZodObject to ZodSchema<any>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Using schema.safeParse(req.body) instead of schema.parse(req.body)
      // provides validation result in a more structured object
      const validationResult = schema.safeParse(req.body);

      // If validation fails
      if (!validationResult.success) {
        // Convert ZodError to our custom ValidationError
        const errorMessages = validationResult.error.errors.map(issue => `${issue.path.join('.')} is invalid: ${issue.message}`).join('; ');
         // Throwing our custom validation error
         next(new ValidationError(`Validation failed: ${errorMessages}`));
         return; // To prevent function from continuing after next() is called
      }

      // Optional but good practice: We can assign cleaned/transformed data to req.body
      // req.body = validationResult.data;

      // If validation is successful, proceed to next middleware or route handler
      next();

    } catch (error: any) {
      // If there's an unexpected error other than ZodError
      next(error);
    }
  };

// Note: Similar functions can be written for req.params or req.query validation if needed.
// For now, we only implemented req.body validation.