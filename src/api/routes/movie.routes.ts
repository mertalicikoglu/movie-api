// src/api/routes/movie.routes.ts

import { Router } from 'express';
import {
  createMovie,
  getAllMovies,
  updateMovie,
  deleteMovie
} from '../controllers/movie.controller'; // Import controller functions
import { validate } from '../middlewares/validateRequest'; // validate middleware'ini import et
import { createMovieSchema, updateMovieSchema } from '../../application/dtos/movie.dto'; // Şemaları import et

const router = Router();

// Routes for movies
router.post('/', validate(createMovieSchema), createMovie); // POST /api/movies -> Execute createMovie function
router.get('/', getAllMovies); // GET /api/movies -> Execute getAllMovies function
router.put('/:id', validate(updateMovieSchema), updateMovie); // PUT /api/movies/:id -> Execute updateMovie function
router.delete('/:id', deleteMovie); // DELETE /api/movies/:id -> Execute deleteMovie function

export default router;