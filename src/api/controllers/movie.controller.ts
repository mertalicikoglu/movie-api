// src/api/controllers/movie.controller.ts

import { Request, Response, NextFunction } from 'express';
// We will import MovieService from application layer later
// import MovieService from '../../application/services/movie.service';

// const movieService = new MovieService(); // Create service instance

export const createMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get movie data from request body
    const movieData = req.body;

    // TODO: Data validation should be implemented (e.g. using Joi or Zod)

    // TODO: Create movie by calling service in application layer
    // const newMovie = await movieService.createMovie(movieData);

    // For now, just return success message
    res.status(201).json({ message: 'Movie creation requested', data: movieData });
    // In real scenario: res.status(201).json(newMovie);

  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

export const getAllMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // TODO: Get all movies by calling service in application layer
    // const movies = await movieService.getAllMovies();

    // For now, return empty list
    res.status(200).json({ message: 'Get all movies requested', data: [] });
    // In real scenario: res.status(200).json(movies);

  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const movieId = req.params.id;
    const updateData = req.body;

    // TODO: Data validation should be implemented

    // TODO: Update movie by calling service in application layer
    // const updatedMovie = await movieService.updateMovie(movieId, updateData);

    // Return update result (updated object or success message)
    res.status(200).json({ message: `Movie update requested for ID ${movieId}`, data: updateData });
    // In real scenario: if (updatedMovie) { res.status(200).json(updatedMovie); } else { res.status(404).json({ message: 'Movie not found' }); }

  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const movieId = req.params.id;

    // TODO: Delete movie by calling service in application layer
    // const success = await movieService.deleteMovie(movieId);

    // Return deletion result
     res.status(200).json({ message: `Movie deletion requested for ID ${movieId}` });
    // In real scenario: if (success) { res.status(200).json({ message: 'Movie deleted successfully' }); } else { res.status(404).json({ message: 'Movie not found' }); }


  } catch (error) {
    next(error);
  }
};

// Note: Controllers typically just receive the request, validate data, call the application layer and return the response.
// Complex business logic and database operations should not be in controllers.