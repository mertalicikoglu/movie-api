// src/api/routes/director.routes.ts

import { Router } from 'express';
import {
  createDirector,
  deleteDirector
} from '../controllers/director.controller'; // Import controller functions

const router = Router();

// Routes for directors
router.post('/', createDirector); // POST /api/directors -> Execute createDirector function
router.delete('/:id', deleteDirector); // DELETE /api/directors/:id -> Execute deleteDirector function

export default router;