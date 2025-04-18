export interface Director {
    id?: string; // Database ID, can be optional at domain entity level
    firstName: string;
    secondName: string;
    birthDate?: Date; // optional
    bio?: string; // optional
}