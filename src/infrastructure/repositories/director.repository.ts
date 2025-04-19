// src/infrastructure/repositories/director.repository.ts

import { IDirectorRepository } from '../../domain/repositories/director.repository.interface';
import { Director } from '../../domain/entities/director.entity';
import DirectorModel, { DirectorDocument } from '../models/director.model'; // Import Mongoose Model
import { Document } from 'mongoose'; // Import Document type

// Helper function: Converts Mongoose Document to Domain Entity
const toDirectorEntity = (doc: DirectorDocument): Director => {
    // Mongoose toJSON method already adds id, removes _id and __v
    return doc.toJSON() as Director;
};

export class DirectorRepository implements IDirectorRepository {

  async create(director: Director): Promise<Director> {
    const createdDirector = await DirectorModel.create(director);
    return toDirectorEntity(createdDirector); // Convert created document to entity
  }

  async findById(id: string): Promise<Director | null> {
     const director = await DirectorModel.findById(id).exec();
     if (!director) {
       return null;
     }
     return toDirectorEntity(director); // Convert document to entity
  }


  async delete(id: string): Promise<boolean> {
    // What happens to movies when a director is deleted?
    // This rule is not specified in requirements. At business logic level (service layer)
    // we may need to find and update/delete movies, or in Mongoose schema `ref` definition
    // there could be options like `onDelete` (Mongoose doesn't have built-in `onDelete` feature,
    // this needs to be managed either through application code or database level triggers etc.).
    // For now, we just delete the director. Additional logic for movie relationships can be added later.
    const result = await DirectorModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}