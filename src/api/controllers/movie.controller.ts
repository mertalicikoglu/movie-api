// src/api/controllers/movie.controller.ts

import { Request, Response, NextFunction } from 'express';
import { MovieService } from '../../application/services/movie.service';
import { MovieRepository } from '../../infrastructure/repositories/movie.repository'; // Import repository implementation
import { DirectorRepository } from '../../infrastructure/repositories/director.repository'; // Import Director Repository
import { NotFoundError } from '../../application/errors'; // Import NotFoundError
import { RedisCacheService } from '../../infrastructure/cache/redis.service';

// Create Repository and Service instances
// NOTE: In larger projects, these instances can be managed with a dependency injection container
const movieRepository = new MovieRepository();
const directorRepository = new DirectorRepository(); // Required for MovieService
const cacheService = new RedisCacheService();
const movieService = new MovieService(movieRepository, directorRepository, cacheService);

export const createMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get movie data from request body
        const movieData = req.body;

        // Create movie by calling service in application layer
        const newMovie = await movieService.createMovie(movieData);

        // Return created movie
        res.status(201).json(newMovie);

    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

export const getAllMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get all movies by calling service in application layer
        const movies = await movieService.getAllMovies();

        // Return movies
        res.status(200).json(movies);

    } catch (error) {
        next(error);
    }
};

export const updateMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const movieId = req.params.id;
        const updateData = req.body;

        // Update movie by calling service in application layer
        const updatedMovie = await movieService.updateMovie(movieId, updateData);

        if (!updatedMovie) {
            throw new NotFoundError(`Movie with ID ${movieId} not found.`);
        }

        // Return update result
        res.status(200).json(updatedMovie);

    } catch (error) {
        next(error);
    }
};

export const deleteMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const movieId = req.params.id;

        // Delete movie by calling service in application layer
        const success = await movieService.deleteMovie(movieId);

        if (!success) {
            throw new NotFoundError(`Movie with ID ${movieId} not found.`);
        }   

        // Return deletion result
        res.status(200).json({ message: `Movie with ID ${movieId} deleted successfully` });


    } catch (error) {
        next(error);
    }
};

// Note: Controllers typically just receive the request, validate data, call the application layer and return the response.
// Complex business logic and database operations should not be in controllers.