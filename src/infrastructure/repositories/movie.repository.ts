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
    // We could use populate('directorId') to get director information with movies
    // Since requirements only mention "Director" field, it's not clear if we should get the whole related object
    // or just keep the ID. For now, we just store the ID reference in the model.
    // You can add .populate('directorId') here to get the director object if needed.
    const movies = await MovieModel.find().exec();
    return movies.map(toMovieEntity); // Convert document array to entity array
  }

  async findById(id: string): Promise<Movie | null> {
    const movie = await MovieModel.findById(id).exec();
    if (!movie) {
      return null;
    }
    return toMovieEntity(movie); // Convert document to entity
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