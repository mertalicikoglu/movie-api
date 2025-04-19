// src/api/routes/director.routes.ts

import { Router } from 'express';
import {
    createDirector,
    deleteDirector
} from '../controllers/director.controller'; // Import controller functions
import { validate } from '../middlewares/validateRequest'; // Import validate middleware
import { createDirectorSchema } from '../../application/dtos/director.dto'; // Import schema

const router = Router();

// Routes for directors

/**
 * @swagger
 * /directors:
 * post:
 * summary: Create new director
 * tags: [Directors]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CreateDirectorDto' # Reference to schema in server.ts
 * responses:
 * 201:
 * description: Director created successfully
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Director' # Schema of created director object
 * 400:
 * description: Invalid input (Validation error)
 * 500:
 * description: Server error
 */
router.post('/', validate(createDirectorSchema), createDirector); // POST /api/directors -> Execute createDirector function

/**
 * @swagger
 * /directors/{id}:
 * delete:
 * summary: Delete a specific director
 * tags: [Directors]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: Director ID (in ObjectId string format)
 * example: 60f5e8a7d4b5e7c8a9b0c1d2
 * responses:
 * 200:
 * description: Director deleted successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Director deleted successfully
 * 400:
 * description: Invalid ID format
 * 404:
 * description: Director not found
 * 409:
 * description: Director has associated movies (Cannot be deleted due to business rule)
 * 500:
 * description: Server error
 */
router.delete('/:id', deleteDirector); // DELETE /api/directors/:id -> Execute deleteDirector function

export default router;