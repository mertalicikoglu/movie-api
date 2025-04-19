// src/api/routes/movie.routes.ts

import { Router } from 'express';
import {
  createMovie,
  getAllMovies,
  updateMovie,
  deleteMovie
} from '../controllers/movie.controller'; // Import controller functions

const router = Router();

// Routes for movies
router.post('/', createMovie); // POST /api/movies -> Execute createMovie function
router.get('/', getAllMovies); // GET /api/movies -> Execute getAllMovies function
router.put('/:id', updateMovie); // PUT /api/movies/:id -> Execute updateMovie function
router.delete('/:id', deleteMovie); // DELETE /api/movies/:id -> Execute deleteMovie function

export default router;