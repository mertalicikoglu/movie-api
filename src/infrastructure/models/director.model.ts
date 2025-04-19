// src/infrastructure/models/director.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { Director } from '../../domain/entities/director.entity'; // Import the domain entity

// Additional properties for Mongoose Document
export interface DirectorDocument extends Omit<Director, 'id'>, Document {
  // Fields added by Mongoose
}

const DirectorSchema: Schema<DirectorDocument> = new Schema({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  birthDate: { type: Date, required: false }, // Optional
  bio: { type: String, required: false } // Optional
});

// Map the id field from domain entity to MongoDB's _id field
DirectorSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

const DirectorModel = mongoose.model<DirectorDocument>('Director', DirectorSchema);

export default DirectorModel;