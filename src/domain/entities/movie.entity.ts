export interface Movie {
    id?: string;
    title: string;
    description: string;
    releaseDate: Date;
    genre: string;
    rating?: number;
    imdbId?: string;
    // The Director relationship may not be stored directly as an entity here,
    // in the domain it could just be an ID or other reference.
    // The infrastructure layer (Mongoose) will manage this relationship.
    // For now let's just store it as an ID, we'll set up the relationship in the Mongoose model.
    directorId?: string;
}
