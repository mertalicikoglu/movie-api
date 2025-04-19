// src/application/services/movie.service.ts

import { Movie } from '../../domain/entities/movie.entity';
import { IMovieRepository } from '../../domain/repositories/movie.repository.interface';
import { Director } from '../../domain/entities/director.entity'; // We might need Director entity (for relationship checks)
import { IDirectorRepository } from '../../domain/repositories/director.repository.interface'; // We might need Director repository

// Import error classes (will be used in error handling middleware later)
//import { NotFoundError, ValidationError } from '../errors'; // Not created yet, will create soon

export class MovieService {
  // Dependency injection of repositories in constructor
  // This ensures our service is not tied to a specific repository implementation (e.g. not just Mongoose, could be another DB)
  constructor(
    private movieRepository: IMovieRepository,
    private directorRepository: IDirectorRepository // For director validation
    ) {}

  async createMovie(movieData: Movie): Promise<Movie> {
    // Business Rule: If director ID is provided when creating a movie, check if that director exists
    if (movieData.directorId) {
        const directorExists = await this.directorRepository.findById(movieData.directorId);
        if (!directorExists) {
             // TODO: Throw our custom error class
             // throw new ValidationError('Director with provided ID does not exist.');
             // For now, let's throw a simple Error:
             throw new Error('Director with provided ID does not exist.');
        }
    }

    // TODO: More detailed data validation can be done here or in the controller

    const newMovie = await this.movieRepository.create(movieData);
    return newMovie;
  }

  async getAllMovies(): Promise<Movie[]> {
    const movies = await this.movieRepository.findAll();
    return movies;
  }

  async getMovieById(id: string): Promise<Movie | null> {
      const movie = await this.movieRepository.findById(id);
      // Business Rule: Throw special error if movie is not found
      // if (!movie) {
      //     throw new NotFoundError(`Movie with ID ${id} not found.`);
      // }
      return movie; // We can return null so controller can return 404
  }


  async updateMovie(id: string, updateData: Partial<Movie>): Promise<Movie | null> {
       // Business Rule: Check if movie to update exists
       const existingMovie = await this.movieRepository.findById(id);
       if (!existingMovie) {
           return null; // Controller can return 404
           // Or throw new NotFoundError(`Movie with ID ${id} not found.`);
       }

       // Business Rule: If director ID is being updated, check if new director exists
        if (updateData.directorId && updateData.directorId !== existingMovie.directorId) {
            const directorExists = await this.directorRepository.findById(updateData.directorId);
            if (!directorExists) {
                // throw new ValidationError('Director with provided new ID does not exist.');
                 throw new Error('Director with provided new ID does not exist.');
            }
        }

      const updatedMovie = await this.movieRepository.update(id, updateData);
      return updatedMovie;
  }

  async deleteMovie(id: string): Promise<boolean> {
      // Business Rule: Check if movie to delete exists
      const existingMovie = await this.movieRepository.findById(id);
       if (!existingMovie) {
           return false; // Controller can return 404
           // Or throw new NotFoundError(`Movie with ID ${id} not found.`);
       }
      const success = await this.movieRepository.delete(id);
      return success; // Returns true if deletion was successful
  }
}

// NOTE: Services in the application layer contain business logic.
// Tasks like data formatting (using DTOs), validation, error throwing can be done here.