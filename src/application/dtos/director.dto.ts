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

// Director update schema (update director was not in requirements, but added for future use)
// No validation needed for delete director (only ID will be taken as param)

export type CreateDirectorDto = z.infer<typeof createDirectorSchema>;