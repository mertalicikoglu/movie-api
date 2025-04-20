// src/application/services/director.service.ts

import { Director } from '../../domain/entities/director.entity';
import { ICacheService } from '../../domain/repositories/cache.interface';
import { IDirectorRepository } from '../../domain/repositories/director.repository.interface';
import { IMovieRepository } from '../../domain/repositories/movie.repository.interface'; // For checking movies when deleting a director

import { NotFoundError, ConflictError } from '../errors'; // Error classes

export class DirectorService {
    constructor(
        private directorRepository: IDirectorRepository,
        private movieRepository: IMovieRepository, // For relationship checks
        private cacheService: ICacheService
    ) { }

    private readonly CACHE_TTL = 3600; // 1 hour in seconds

    private getCacheKey(id: string): string {
        return `director:${id}`;
    }

    async createDirector(directorData: Director): Promise<Director> {
        const newDirector = await this.directorRepository.create(directorData);
        await this.cacheService.delByPattern('director:*'); // Cache invalidation
        return newDirector;
    }

    async deleteDirector(id: string): Promise<boolean> {
        const cacheKey = this.getCacheKey(id);
        await this.cacheService.del(cacheKey);

        // Business Rule: Check if director to delete exists
        const existingDirector = await this.directorRepository.findById(id);
        if (!existingDirector) {
            throw new NotFoundError(`Director with ID ${id} not found.`);
        }

        // Business Rule: Check if there are movies associated with this director. If yes, don't allow deletion.
        const moviesByDirector = await this.movieRepository.findAll(); // Getting all movies and filtering is inefficient, could add findByDirectorId method to repository
        const relatedMovies = moviesByDirector.filter(movie => movie.directorId === id);

        if (relatedMovies.length > 0) {
            throw new ConflictError(`Cannot delete director with ID ${id} because ${relatedMovies.length} movies are associated with them.`);
        }

        await this.cacheService.delByPattern('director:*'); // Cache invalidation for all director related keys

        const success = await this.directorRepository.delete(id);
        return success;
    }

    async getAllDirectors(): Promise<Director[]> {
        // Try to get from cache first
        const cachedDirectors = await this.cacheService.get<Director[]>('directors:all');
        if (cachedDirectors) {
            return cachedDirectors;
        }

        // If not in cache, get from repository and cache it
        const directors = await this.directorRepository.findAll();
        await this.cacheService.set('directors:all', directors, this.CACHE_TTL);
        return directors;
    }

    async updateDirector(id: string, updateData: Partial<Director>): Promise<Director | null> {
        // Delete specific director cache
        const cacheKey = this.getCacheKey(id);
        await this.cacheService.del(cacheKey);

        const existingDirector = await this.directorRepository.findById(id);
        if (!existingDirector) {
            return null;
        }

        const updatedDirector = await this.directorRepository.update(id, updateData);
        await this.cacheService.delByPattern('director:*'); // Invalidate all director related caches
        return updatedDirector;
    }

    async getDirectorById(id: string): Promise<Director | null> {
        // Try to get from cache first
        const cacheKey = this.getCacheKey(id);
        const cachedDirector = await this.cacheService.get<Director>(cacheKey);
        if (cachedDirector) {
            return cachedDirector;
        }

        // If not in cache, get from repository and cache it
        const director = await this.directorRepository.findById(id);
        if (director) {
            await this.cacheService.set(cacheKey, director, this.CACHE_TTL);
        }
        return director;
    }
}

// NOTE: Director deletion business rule (don't delete if has movies) is managed in application layer (service).
// This is an example of Clean Architecture principle where business logic is kept separate from database implementation.