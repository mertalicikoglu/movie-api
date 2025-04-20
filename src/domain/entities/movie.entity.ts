import { Director } from "./director.entity";

export interface Movie {
    id?: string; // Database ID, can be optional at domain entity level
    title: string;
    description: string;
    releaseDate: Date;
    genre: string;
    rating?: number; // optional
    imdbId?: string; // optional
    // The Director relationship may not be stored directly as an entity here,
    // in the domain it could just be an ID or other reference.
    // The infrastructure layer (Mongoose) will manage this relationship.
    // For now let's just store it as an ID, we'll set up the relationship in the Mongoose model.
    directorId?: string;
    director?: Director;
}
