// src/infrastructure/models/movie.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { Movie } from '../../domain/entities/movie.entity'; // Import the domain entity

// Additional properties for Mongoose Document (e.g. _id, __v)
export interface MovieDocument extends Omit<Movie, 'id'>, Document {
  // Additional fields added by Mongoose can go here
}

const MovieSchema: Schema<MovieDocument> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: false }, // Optional
  imdbId: { type: String, required: false, unique: true, sparse: true }, // Optional, unique
  // Director relationship: ObjectId type referencing the 'Director' model
  directorId: { type: Schema.Types.ObjectId, ref: 'Director', required: false } // What happens to the movie when director is deleted depends on business rules (null, cascade)
});

// Map the id field from domain entity to MongoDB's _id field
MovieSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};


const MovieModel = mongoose.model<MovieDocument>('Movie', MovieSchema);

export default MovieModel;