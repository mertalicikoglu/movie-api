// src/api/controllers/director.controller.ts

import { Request, Response, NextFunction } from 'express';
import { DirectorService } from '../../application/services/director.service'; // Import DirectorService
import { DirectorRepository } from '../../infrastructure/repositories/director.repository'; // Import repository implementation
import { MovieRepository } from '../../infrastructure/repositories/movie.repository'; // Import Movie Repository (required for DirectorService)
import { NotFoundError } from '../../application/errors'; // Import NotFoundError


// Create Repository and Service instances
// NOTE: In larger projects, these instances can be managed with a dependency injection container
const directorRepository = new DirectorRepository();
const movieRepository = new MovieRepository(); // Required for DirectorService
const directorService = new DirectorService(directorRepository, movieRepository);

export const createDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const directorData = req.body;

        // TODO: Data validation should be implemented

        // Create director by calling service in application layer
        const newDirector = await directorService.createDirector(directorData);

        // Return created director
        res.status(201).json(newDirector);

    } catch (error) {
        // Catch errors thrown from service and pass to error handling middleware
        next(error);
    }
};

export const deleteDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const directorId = req.params.id;

        // Delete director by calling service in application layer
        const success = await directorService.deleteDirector(directorId);

        if (!success) {
            // If service returns false (director not found or has movies), throw NotFoundError
            throw new NotFoundError(`Director with ID ${directorId} not found.`);
        }


        res.status(200).json({ message: 'Director deleted successfully' }); // Success deletion message

    } catch (error) {
        // Catch errors thrown from service and pass to error handling middleware
        next(error);
    }
};

export const getAllDirectors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const directors = await directorService.getAllDirectors();
        res.status(200).json(directors);
    } catch (error) {
        next(error);
    }
};

export const updateDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const directorId = req.params.id;
        const updateData = req.body;

        const updatedDirector = await directorService.updateDirector(directorId, updateData);
        if (!updatedDirector) {
            throw new NotFoundError(`Director with ID ${directorId} not found.`);
        }

        res.status(200).json(updatedDirector);
    } catch (error) {
        next(error);
    }
};

// Get director (single or all) and update operations are not included in this controller as they were not requested.
// Can be added if requirements change.