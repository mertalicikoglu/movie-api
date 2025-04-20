// src/api/routes/director.routes.ts

import { Router } from 'express';
import {
    createDirector,
    deleteDirector,
    getAllDirectors,
    updateDirector
} from '../controllers/director.controller'; // Import controller functions
import { validate } from '../middlewares/validateRequest'; // Import validate middleware
import { createDirectorSchema, updateDirectorSchema } from '../../application/dtos/director.dto'; // Import schema

const router = Router();

// Routes for directors

/**
 * @swagger
 * /directors:
 *   post:
 *     summary: Create a new director
 *     tags: [Directors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDirectorDto'
 *     responses:
 *       201:
 *         description: Director created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', validate(createDirectorSchema), createDirector);

/**
 * @swagger
 * /directors:
 *   get:
 *     summary: Get all directors
 *     tags: [Directors]
 *     responses:
 *       200:
 *         description: List of directors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Director'
 *       500:
 *         description: Server error
 */
router.get('/', getAllDirectors);

/**
 * @swagger
 * /directors/{id}:
 *   put:
 *     summary: Update a director
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Director ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDirectorDto'
 *     responses:
 *       200:
 *         description: Director updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Director not found
 *       500:
 *         description: Server error
 */
router.put('/:id', validate(updateDirectorSchema), updateDirector);

/**
 * @swagger
 * /directors/{id}:
 *   delete:
 *     summary: Delete a director
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Director ID
 *     responses:
 *       200:
 *         description: Director deleted successfully
 *       404:
 *         description: Director not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteDirector);

export default router;