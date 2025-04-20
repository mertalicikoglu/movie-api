// src/application/dtos/director.dto.ts

import { z } from 'zod';
// import { Director } from '../../domain/entities/director.entity'; // You can compare with the entity if needed

// Validation schema for creating a director
export const createDirectorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  secondName: z.string().min(1, "Second name is required"),
  // birthDate: We can take string and convert to Date later
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for birthDate",
  }).optional(), // Can be optional
  bio: z.string().optional(), // Can be optional
});

// Validation schema for updating a director
export const updateDirectorSchema = z.object({
  firstName: z.string().min(1, "First name must not be empty").optional(),
  secondName: z.string().min(1, "Second name must not be empty").optional(),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format for birthDate",
  }).optional(),
  bio: z.string().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Update data must contain at least one field",
});

// Director update schema (update director was not in requirements, but added for future use)
// No validation needed for delete director (only ID will be taken as param)

export type CreateDirectorDto = z.infer<typeof createDirectorSchema>;
export type UpdateDirectorDto = z.infer<typeof updateDirectorSchema>;