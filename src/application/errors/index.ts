// src/application/errors/index.ts

// Base custom error class
export class CustomError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = this.constructor.name; // Set error name same as class name
      this.statusCode = statusCode;
      // For proper stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Resource not found error (e.g. when movie doesn't exist in GET /movies/:id request)
  export class NotFoundError extends CustomError {
    constructor(message: string = 'Resource not found') {
      super(message, 404);
    }
  }
  
  // Invalid input error (e.g. when data format is wrong in POST/PUT requests)
  export class ValidationError extends CustomError {
    constructor(message: string = 'Invalid input data') {
      super(message, 400);
    }
  }
  
  // Conflict error (e.g. when a unique field already exists)
  export class ConflictError extends CustomError {
    constructor(message: string = 'Conflict') {
      super(message, 409);
    }
  }
  
  // Authorization error (when Auth is added)
  export class UnauthorizedError extends CustomError {
      constructor(message: string = 'Unauthorized') {
          super(message, 401);
      }
  }
  
  // Forbidden error (when permission is denied)
  export class ForbiddenError extends CustomError {
      constructor(message: string = 'Forbidden') {
          super(message, 403);
      }
  }
  
  
  // We can use these custom errors in services and controllers in the application layer.