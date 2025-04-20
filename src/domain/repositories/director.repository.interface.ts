// src/domain/repositories/director.repository.interface.ts

import { Director } from '../entities/director.entity';

// IDirectorRepository defines data access operations for directors.
// This interface is independent of which database technology is used.
export interface IDirectorRepository {
  create(director: Director): Promise<Director>; // Create new director
  findById(id: string): Promise<Director | null>; // Get director by ID (can be used in relationship with movies)
  delete(id: string): Promise<boolean>; // Delete director by ID (returns true if successful)
  findAll(): Promise<Director[]>;
  update(id: string, director: Partial<Director>): Promise<Director | null>;
  // Since only create and delete were requested in requirements, we didn't add find and update for now.
  // findAll(): Promise<Director[]>; // Get all directors (not in requirements)
  // update(id: string, director: Partial<Director>): Promise<Director | null>; // Update director (not in requirements)
}