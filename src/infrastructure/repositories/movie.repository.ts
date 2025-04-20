// src/infrastructure/repositories/movie.repository.ts

import { IMovieRepository } from '../../domain/repositories/movie.repository.interface';
import { Movie } from '../../domain/entities/movie.entity';
import MovieModel, { MovieDocument } from '../models/movie.model'; // Import Mongoose Model
import { Document } from 'mongoose'; // Import Document type

// Helper function: Converts Mongoose Document to Domain Entity
const toMovieEntity = (doc: MovieDocument): Movie => {
    // Mongoose toJSON method already adds id, removes _id and __v
    const movie = doc.toJSON() as Movie;
    // We could check related directorId, but for now let's return the object directly
    // Director ID could be ObjectId in Mongoose Document, should be string after toJSON
    return movie;
};


export class MovieRepository implements IMovieRepository {

  async create(movie: Movie): Promise<Movie> {
    // No need to convert domain entity to Mongoose model, Mongoose accepts the object
    const createdMovie = await MovieModel.create(movie);
    return toMovieEntity(createdMovie); // Convert created document to entity
  }

  async findAll(): Promise<Movie[]> {
    try {
      // Populate director information when fetching movies
      const movies = await MovieModel.find()
        .populate('directorId', 'firstName secondName birthDate bio')
        .exec();
      
      
      // Convert to domain entities with director information
      return movies.map(movie => {
        const movieObj = movie.toJSON();
        if (movieObj.directorId) {
          // Extract director information
          const director = movieObj.directorId as any; // Type assertion for populated document
          const directorId = director._id?.toString();
          
          // Add director object
          (movieObj as Movie).director = {
            id: directorId,
            firstName: director.firstName,
            secondName: director.secondName,
            birthDate: director.birthDate,
            bio: director.bio
          };
          
          // Remove directorId
          delete movieObj.directorId;
        }
        return movieObj as Movie;
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Movie | null> {
    try {
      // Populate director information when fetching a single movie
      const movie = await MovieModel.findById(id)
        .populate('directorId', 'firstName secondName birthDate bio')
        .exec();
      
      if (!movie) {
        return null;
      }
      
      
      // Convert to domain entity with director information
      const movieObj = movie.toJSON();
      if (movieObj.directorId) {
        // Extract director information
        const director = movieObj.directorId as any;
        const directorId = director._id?.toString();
        
        // Add director object
        (movieObj as Movie).director = {
          id: directorId,
          firstName: director.firstName,
          secondName: director.secondName,
          birthDate: director.birthDate,
          bio: director.bio
        };
        
        // Remove directorId
        delete movieObj.directorId;
      }
      
      return movieObj as Movie;
    } catch (error) {
      throw error;
    }
  }

  async findByDirectorId(directorId: string): Promise<Movie[]> {
    const movies = await MovieModel.find({ directorId }).exec();
    return movies.map(toMovieEntity);
  }

  async findByImdbId(imdbId: string): Promise<Movie | null> {
    const movie = await MovieModel.findOne({ imdbId }).exec();
    if (!movie) {
      return null;
    }
    return toMovieEntity(movie);
  }

  async update(id: string, movie: Partial<Movie>): Promise<Movie | null> {
    // Mongoose findByIdAndUpdate returns non-updated object by default, use { new: true } to get updated object
    const updatedMovie = await MovieModel.findByIdAndUpdate(id, movie, { new: true }).exec();
    if (!updatedMovie) {
      return null;
    }
     return toMovieEntity(updatedMovie); // Convert updated document to entity
  }

  async delete(id: string): Promise<boolean> {
    // Can use either Mongoose deleteOne or findByIdAndDelete
    const result = await MovieModel.deleteOne({ _id: id }).exec();
    // deleteOne returns { acknowledged: boolean, deletedCount: number }
    return result.deletedCount > 0; // Success if number of deleted documents is greater than 0
  }
}