// src/domain/repositories/movie.repository.interface.ts

import { Movie } from '../entities/movie.entity';

// IMovieRepository defines data access operations for movies.
// This interface is independent of which database technology is used.
export interface IMovieRepository {
  create(movie: Movie): Promise<Movie>; // Create new movie
  findAll(): Promise<Movie[]>; // Get all movies
  findById(id: string): Promise<Movie | null>; // Get movie by ID
  findByDirectorId(directorId: string): Promise<Movie[]>; // Get movies by director ID
  findByImdbId(imdbId: string): Promise<Movie | null>;
  update(id: string, movie: Partial<Movie>): Promise<Movie | null>; // Update movie (Partial makes all object fields optional)
  delete(id: string): Promise<boolean>; // Delete movie by ID (returns true if successful)
}