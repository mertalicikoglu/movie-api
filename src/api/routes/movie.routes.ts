// src/api/routes/movie.routes.ts

import { Router } from 'express';
import {
  createMovie,
  getAllMovies,
  updateMovie,
  deleteMovie
} from '../controllers/movie.controller'; // Import controller functions
import { validate } from '../middlewares/validateRequest'; // Import validate middleware
import { createMovieSchema, updateMovieSchema } from '../../application/dtos/movie.dto'; // Import schemas

const router = Router();

// Routes for movies
/**
 * @swagger
 * /movies:
 * post:
 * summary: Create new movie
 * tags: [Movies]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CreateMovieDto' # Reference to schema in server.ts
 * responses:
 * 201:
 * description: Movie created successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Movie' # Schema of created movie object
 * 400:
 * description: Invalid input (Validation error)
 * 500:
 * description: Server error
 */
router.post('/', validate(createMovieSchema), createMovie); // POST /api/movies -> Execute createMovie function


/**
 * @swagger
 * /movies:
 * get:
 * summary: Get all movies
 * tags: [Movies]
 * responses:
 * 200:
 * description: Movies retrieved successfully
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Movie' # List of movie objects
 * 500:
 * description: Server error
 */
router.get('/', getAllMovies); // GET /api/movies -> Execute getAllMovies function


/**
 * @swagger
 * /movies/{id}:
 * put:
 * summary: Update a specific movie
 * tags: [Movies]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: Movie ID (in ObjectId string format)
 * example: 60f5e8a7d4b5e7c8a9b0c1d2
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UpdateMovieDto' # Reference to schema in server.ts
 * responses:
 * 200:
 * description: Movie updated successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Movie' # Schema of updated movie object
 * 400:
 * description: Invalid input or ID format
 * 404:
 * description: Movie not found
 * 500:
 * description: Server error
 */
router.put('/:id', validate(updateMovieSchema), updateMovie); // PUT /api/movies/:id -> Execute updateMovie function


/**
 * @swagger
 * /movies/{id}:
 * delete:
 * summary: Delete a specific movie
 * tags: [Movies]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: Movie ID (in ObjectId string format)
 * example: 60f5e8a7d4b5e7c8a9b0c1d2
 * responses:
 * 200:
 * description: Movie deleted successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Movie deleted successfully
 * 400:
 * description: Invalid ID format
 * 404:
 * description: Movie not found
 * 500:
 * description: Server error
 */
router.delete('/:id', deleteMovie); // DELETE /api/movies/:id -> Execute deleteMovie function

export default router;