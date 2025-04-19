// src/application/dtos/movie.dto.ts

import { z } from 'zod';
// import { Movie } from '../../domain/entities/movie.entity'; // You can compare with the entity if needed

// Validation schema for creating a movie
// Created according to the fields in requirements
export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  // releaseDate can come as string and be converted to Date, or can be expected as Date
  // Usually comes in ISO 8601 string format in API. Taking it as string and converting to Date in service is more flexible
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), { // should come as string and be a valid date format
    message: "Invalid date format for releaseDate",
  }),
  genre: z.string().min(1, "Genre is required"),
  rating: z.number().min(0).max(10).optional(), // Can be optional, min 0 max 10
  imdbId: z.string().optional(), // Can be optional
  // directorId: Let's expect the relationship as string (in MongoDB ObjectId string format)
  directorId: z.string().length(24, "Invalid Director ID format").optional(), // MongoDB ObjectId is usually 24 characters, optional
});

// Validation schema for updating a movie
// Using Partial to make all fields optional, only sent fields are validated
export const updateMovieSchema = z.object({
    title: z.string().min(1, "Title must not be empty").optional(),
    description: z.string().min(1, "Description must not be empty").optional(),
    releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format for releaseDate",
      }).optional(),
    genre: z.string().min(1, "Genre must not be empty").optional(),
    rating: z.number().min(0).max(10).optional(),
    imdbId: z.string().optional(),
    directorId: z.string().length(24, "Invalid Director ID format").optional(),
}).refine(data => Object.keys(data).length > 0, { // Update object should not be empty
    message: "Update data must contain at least one field",
});

// Export schema types so we can use them in controllers and services
export type CreateMovieDto = z.infer<typeof createMovieSchema>;
export type UpdateMovieDto = z.infer<typeof updateMovieSchema>;

// NOTE: Defining DTOs separate from domain entities separates API layer concerns like
// validation and data formatting from the domain.