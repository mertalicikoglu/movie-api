// src/application/services/director.service.ts

import { Director } from '../../domain/entities/director.entity';
import { IDirectorRepository } from '../../domain/repositories/director.repository.interface';
import { IMovieRepository } from '../../domain/repositories/movie.repository.interface'; // For checking movies when deleting a director
import { NotFoundError, ConflictError } from '../errors'; // Error classes

export class DirectorService {
   constructor(
       private directorRepository: IDirectorRepository,
       private movieRepository: IMovieRepository // For relationship checks
       ) {}

   async createDirector(directorData: Director): Promise<Director> {
       // TODO: Data validation should be implemented
       const newDirector = await this.directorRepository.create(directorData);
       return newDirector;
   }

   async deleteDirector(id: string): Promise<boolean> {
       // Business Rule: Check if director to delete exists
       const existingDirector = await this.directorRepository.findById(id);
        if (!existingDirector) {
           throw new NotFoundError(`Director with ID ${id} not found.`);
        }

        // Business Rule: Check if there are movies associated with this director. If yes, don't allow deletion.
        // (Not specified in requirements but could be important in real scenarios)
        const moviesByDirector = await this.movieRepository.findAll(); // Getting all movies and filtering is inefficient, could add findByDirectorId method to repository
        const relatedMovies = moviesByDirector.filter(movie => movie.directorId === id);

        if (relatedMovies.length > 0) {
             // Throw our custom error class
             throw new ConflictError(`Cannot delete director with ID ${id} because ${relatedMovies.length} movies are associated with them.`);
        }

       const success = await this.directorRepository.delete(id);
       return success; // Returns true if deletion was successful
   }

   async getAllDirectors(): Promise<Director[]> {
       return await this.directorRepository.findAll();
   }

   async updateDirector(id: string, updateData: Partial<Director>): Promise<Director | null> {
       const existingDirector = await this.directorRepository.findById(id);
       if (!existingDirector) {
           return null;
       }

       const updatedDirector = await this.directorRepository.update(id, updateData);
       return updatedDirector;
   }

    // Get director (single or all) or update operations were not requested, so not added to this service.
    // Can be added if requirements change. findById was added above for relationship checks.
}

// NOTE: Director deletion business rule (don't delete if has movies) is managed in application layer (service).
// This is an example of Clean Architecture principle where business logic is kept separate from database implementation.