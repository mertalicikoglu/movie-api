// src/application/services/movie.service.ts

import { Movie } from '../../domain/entities/movie.entity';
import { IMovieRepository } from '../../domain/repositories/movie.repository.interface';
import { IDirectorRepository } from '../../domain/repositories/director.repository.interface';
import { ICacheService } from '../../domain/repositories/cache.interface';
import { Director } from '../../domain/entities/director.entity'; // We might need Director entity (for relationship checks)

// Import error classes
import { NotFoundError, ValidationError } from '../errors'; // Not created yet, will create soon

export class MovieService {
    // Dependency injection of repositories in constructor
    // This ensures our service is not tied to a specific repository implementation (e.g. not just Mongoose, could be another DB)
    private readonly CACHE_TTL = 3600; // 1 hour in seconds
    constructor(
        private movieRepository: IMovieRepository,
        private directorRepository: IDirectorRepository, // For director validation
        private cacheService: ICacheService
    ) { }


    private getCacheKey(id: string): string {
        return `movie:${id}`;
    }

    async createMovie(movieData: Movie): Promise<Movie> {
        // Business Rule: If director ID is provided when creating a movie, check if that director exists
        if (movieData.directorId) {
            const directorExists = await this.directorRepository.findById(movieData.directorId);
            if (!directorExists) {
                // Throw our custom error class
                throw new ValidationError('Director with provided ID does not exist.');
            }
        }


        const newMovie = await this.movieRepository.create(movieData);
        await this.cacheService.delByPattern('movie:*');
        return newMovie;
    }

    async getAllMovies(): Promise<Movie[]> {
        const cachedMovies = await this.cacheService.get<Movie[]>('movies:all');
        if (cachedMovies) {
            return cachedMovies;
        }
        const movies = await this.movieRepository.findAll();
        await this.cacheService.set('movies:all', movies, this.CACHE_TTL);
        return movies;
    }

    async getMovieById(id: string): Promise<Movie | null> {
        const cacheKey = this.getCacheKey(id);
        const cachedMovie = await this.cacheService.get<Movie>(cacheKey);
        if (cachedMovie) {
            return cachedMovie;
        }
        const movie = await this.movieRepository.findById(id);
        // Business Rule: Throw special error if movie is not found
        if (!movie) {
            throw new NotFoundError(`Movie with ID ${id} not found.`);
        }
        await this.cacheService.set(cacheKey, movie, this.CACHE_TTL);
        return movie; // We can return null so controller can return 404
    }


    async updateMovie(id: string, updateData: Partial<Movie>): Promise<Movie | null> {
        // Business Rule: Check if movie to update exists
        const existingMovie = await this.movieRepository.findById(id);
        if (!existingMovie) {
            throw new NotFoundError(`Movie with ID ${id} not found.`);
        }

        // Business Rule: If director ID is being updated, check if new director exists
        if (updateData.directorId && updateData.directorId !== existingMovie.directorId) {
            const directorExists = await this.directorRepository.findById(updateData.directorId);
            if (!directorExists) {
                throw new ValidationError('Director with provided new ID does not exist.');
            }
        }

        const cacheKey = this.getCacheKey(id);
        await this.cacheService.del(cacheKey);

        const updatedMovie = await this.movieRepository.update(id, updateData);
        await this.cacheService.delByPattern('movie:*');
        return updatedMovie;
    }

    async deleteMovie(id: string): Promise<boolean> {
        // Business Rule: Check if movie to delete exists
        const existingMovie = await this.movieRepository.findById(id);
        if (!existingMovie) {
            // Throw our custom error class
            throw new NotFoundError(`Movie with ID ${id} not found.`);
        }

        const cacheKey = this.getCacheKey(id);
        await this.cacheService.del(cacheKey);

        const success = await this.movieRepository.delete(id);
        await this.cacheService.delByPattern('movie:*');
        return success; // Returns true if deletion was successful
    }
}

// NOTE: Services in the application layer contain business logic.
// Tasks like data formatting (using DTOs), validation, error throwing can be done here.