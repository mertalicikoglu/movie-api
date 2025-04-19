// src/api/controllers/director.controller.ts

import { Request, Response, NextFunction } from 'express';
// We will import DirectorService from application layer later
// import DirectorService from '../../application/services/director.service';

// const directorService = new DirectorService(); // Create service instance

export const createDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const directorData = req.body;

    // TODO: Data validation should be implemented

    // TODO: Create director by calling service in application layer
    // const newDirector = await directorService.createDirector(directorData);

    res.status(201).json({ message: 'Director creation requested', data: directorData });
    // In real scenario: res.status(201).json(newDirector);

  } catch (error) {
    next(error);
  }
};

export const deleteDirector = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const directorId = req.params.id;

    // TODO: Delete director by calling service in application layer
    // const success = await directorService.deleteDirector(directorId);

    res.status(200).json({ message: `Director deletion requested for ID ${directorId}` });
    // In real scenario: if (success) { res.status(200).json({ message: 'Director deleted successfully' }); } else { res.status(404).json({ message: 'Director not found' }); }

  } catch (error) {
    next(error);
  }
};

// Get director (single or all) and update operations are not included in this controller as they were not requested.
// Can be added if requirements change.