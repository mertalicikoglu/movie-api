// __tests__/api/controllers/movie.controller.test.ts

import { Request, Response, NextFunction } from 'express';
// Import controller functions to test
import { createMovie, getAllMovies, updateMovie, deleteMovie } from '../../../src/api/controllers/movie.controller';

// Mock the Service class that the controller depends on
// Using jest.mock() to mock the src/application/services/movie.service module.
// This ensures that when `new MovieService(...)` is called in the controller, it uses the mock version instead of the real class.
jest.mock('../../../src/application/services/movie.service');

// Get the mock version of MovieService class
// In TypeScript, we typically use cast like '(MovieService as jest.Mock)' or jest.Mocked to access mocked types
import { MovieService } from '../../../src/application/services/movie.service';

// Describe block defining test scenarios
describe('Movie Controller', () => {
    // Reset mock Request, Response and Next functions before each test
    let mockRequest: Partial<Request>; // Using Partial<Request> allows us to define only the parts we'll use
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock<NextFunction>;

    // For type-safe usage of the mocked MovieService instance
    let mockMovieService: jest.Mocked<MovieService>;


    beforeEach(() => {
        // Define mock Response object: mock status and json methods
        // jest.fn() creates a mock function. .mockReturnThis() is needed for chained calls (e.g. res.status(200).json(...))
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Define mock Request object: body, params, query can be added based on test scenario
        mockRequest = {};

        // Define mock Next function
        nextFunction = jest.fn();

        // Access to MovieService mock instance
        // jest.Mocked maintains the original type while providing access to mock methods
        mockMovieService = MovieService.prototype as jest.Mocked<MovieService>;

        // Clear call history of all mock functions before each test
        jest.clearAllMocks();
    });

    // --- getAllMovies Tests ---
    describe('getAllMovies', () => {
        it('should return all movies with status 200', async () => {
            // Define example movies list that service will return
            const mockMovies = [
                { id: '1', title: 'Movie 1', description: 'Desc 1', releaseDate: new Date(), genre: 'Action' },
                { id: '2', title: 'Movie 2', description: 'Desc 2', releaseDate: new Date(), genre: 'Comedy' },
            ];

            // Make mock MovieService's getAllMovies method return this list
            // .mockResolvedValue() sets the value that async functions will resolve to
            mockMovieService.getAllMovies.mockResolvedValue(mockMovies);

            // Call the controller function
            await getAllMovies(mockRequest as Request, mockResponse as Response, nextFunction);

            // Verify expectations:
            // 1. That service's getAllMovies method was called
            expect(mockMovieService.getAllMovies).toHaveBeenCalledTimes(1);
            // 2. That response object's status method was called with 200
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            // 3. That response object's json method was called with mock movies list
            expect(mockResponse.json).toHaveBeenCalledWith(mockMovies);
            // 4. That there was no error (next function wasn't called)
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should call next with error if service throws an error', async () => {
            // Define example error that service will throw
            const serviceError = new Error('Database connection failed');

            // Make mock MovieService's getAllMovies method throw this error
            // .mockRejectedValue() sets the value that async functions will reject with
            mockMovieService.getAllMovies.mockRejectedValue(serviceError);

            // Call the controller function
            await getAllMovies(mockRequest as Request, mockResponse as Response, nextFunction);

            // Verify expectations:
            // 1. That service's getAllMovies method was called
            expect(mockMovieService.getAllMovies).toHaveBeenCalledTimes(1);
            // 2. That response object's status method wasn't called (controller doesn't respond in error case, forwards to next)
            expect(mockResponse.status).not.toHaveBeenCalled();
            // 3. That response object's json method wasn't called
            expect(mockResponse.json).not.toHaveBeenCalled();
            // 4. That error was forwarded to error handling middleware (next function was called with error)
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
        });
    });

    // --- createMovie Tests ---
    describe('createMovie', () => {
        it('should create a movie and return it with status 201', async () => {
            // Define example movie data in request body
            const movieData = { title: 'New Movie', description: '...', releaseDate: '2023-01-01', genre: 'Drama' };
            // Define example created movie object (what service will return)
            const createdMovie = { id: '3', ...movieData };

            // Add movie data to mock Request's body
            mockRequest.body = movieData;

            // Make mock MovieService's createMovie method return the created movie
            mockMovieService.createMovie.mockResolvedValue(createdMovie as any); // Cast to any because Date format might differ slightly

            // Call the controller function
            await createMovie(mockRequest as Request, mockResponse as Response, nextFunction);

            // Verify expectations:
            // 1. That service's createMovie method was called with correct data
            // Note: When checking data passed to mocked service,
            // whether Date field is string or Date object is controller's responsibility.
            // Our validate middleware passes string, service should convert to Date.
            // In test, we can verify that object passed from controller to service has expected structure.
            expect(mockMovieService.createMovie).toHaveBeenCalledWith(movieData); // Controller forwards body directly to service
            // 2. That response object's status method was called with 201
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            // 3. That response object's json method was called with created movie
            expect(mockResponse.json).toHaveBeenCalledWith(createdMovie);
            // 4. That there was no error
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should call next with ValidationError if service throws ValidationError', async () => {
            // Define example movie data in request body
            const movieData = { title: 'New Movie', description: '...', releaseDate: '2023-01-01', genre: 'Drama', directorId: 'invalid-id' };
            const serviceError = new Error('Director with provided ID does not exist.'); // Default error thrown by service

            mockRequest.body = movieData;

            // Make mock MovieService's createMovie method throw this error
             mockMovieService.createMovie.mockRejectedValue(serviceError);


            // Call the controller function
            await createMovie(mockRequest as Request, mockResponse as Response, nextFunction);

            // Verify expectations:
            // 1. That service's createMovie method was called
            expect(mockMovieService.createMovie).toHaveBeenCalledWith(movieData);
             // 2. That next function was called with thrown error
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            // 3. That response methods weren't called
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        // TODO: Other createMovie error scenarios (e.g. if validation middleware passed but another error occurred)
    });

    // --- updateMovie Tests ---
    describe('updateMovie', () => {
         it('should update a movie and return it with status 200', async () => {
             const movieId = 'some-movie-id';
             const updateData = { title: 'Updated Title' };
             const updatedMovie = { id: movieId, ...updateData };

             mockRequest.params = { id: movieId };
             mockRequest.body = updateData;

             mockMovieService.updateMovie.mockResolvedValue(updatedMovie as any);

             await updateMovie(mockRequest as Request, mockResponse as Response, nextFunction);

             expect(mockMovieService.updateMovie).toHaveBeenCalledWith(movieId, updateData);
             expect(mockResponse.status).toHaveBeenCalledWith(200);
             expect(mockResponse.json).toHaveBeenCalledWith(updatedMovie);
             expect(nextFunction).not.toHaveBeenCalled();
         });

          it('should return 404 if movie not found during update', async () => {
             const movieId = 'non-existent-id';
             const updateData = { title: 'Updated Title' };

             mockRequest.params = { id: movieId };
             mockRequest.body = updateData;

              // Service may return null if not found
             mockMovieService.updateMovie.mockResolvedValue(null);

              // We expect NotFoundError to be thrown
              // Controller throws error itself if null is returned
             // import { NotFoundError } from '../../application/errors'; // Should be imported in controller

              // Controller will forward NotFoundError to next if null is returned
             await updateMovie(mockRequest as Request, mockResponse as Response, nextFunction);


              expect(mockMovieService.updateMovie).toHaveBeenCalledWith(movieId, updateData);
              // Check that controller caught null and forwarded NotFoundError to next
              expect(nextFunction).toHaveBeenCalled();
              const errorArg = nextFunction.mock.calls[0][0]; // Get first argument passed to next
              expect(errorArg).toBeInstanceOf(Error); // Or check for NotFoundError instance if imported
              // expect(errorArg.message).toBe(`Movie with ID ${movieId} not found.`); // Check error message
              // expect(errorArg.statusCode).toBe(404); // Check custom error class status code

              expect(mockResponse.status).not.toHaveBeenCalled();
              expect(mockResponse.json).not.toHaveBeenCalled();
         });

         // TODO: Other updateMovie scenarios (e.g. invalid directorId)
    });


     // --- deleteMovie Tests ---
    describe('deleteMovie', () => {
         it('should delete a movie and return success message with status 200', async () => {
             const movieId = 'some-movie-id';

             mockRequest.params = { id: movieId };

             // Service returns true on success
             mockMovieService.deleteMovie.mockResolvedValue(true);

             await deleteMovie(mockRequest as Request, mockResponse as Response, nextFunction);

             expect(mockMovieService.deleteMovie).toHaveBeenCalledWith(movieId);
             expect(mockResponse.status).toHaveBeenCalledWith(200);
             expect(mockResponse.json).toHaveBeenCalledWith({ message: `Movie with ID ${movieId} deleted successfully` });
             expect(nextFunction).not.toHaveBeenCalled();
         });

          it('should return 404 if movie not found during deletion', async () => {
             const movieId = 'non-existent-id';

             mockRequest.params = { id: movieId };

              // Service may return false or throw error if not found
              // Controller throws NotFoundError if false is returned
             mockMovieService.deleteMovie.mockResolvedValue(false);

              await deleteMovie(mockRequest as Request, mockResponse as Response, nextFunction);

              expect(mockMovieService.deleteMovie).toHaveBeenCalledWith(movieId);
               // Check that controller caught false and forwarded NotFoundError to next
              expect(nextFunction).toHaveBeenCalled();
              const errorArg = nextFunction.mock.calls[0][0];
              expect(errorArg).toBeInstanceOf(Error); // Or check for NotFoundError instance
              // expect(errorArg.message).toBe(`Movie with ID ${movieId} not found.`);
              // expect(errorArg.statusCode).toBe(404);

              expect(mockResponse.status).not.toHaveBeenCalled();
              expect(mockResponse.json).not.toHaveBeenCalled();
         });

         it('should call next with error if service throws an error during deletion', async () => {
              const movieId = 'some-movie-id';
              const serviceError = new Error('Cannot delete movie due to constraint');

              mockRequest.params = { id: movieId };

              mockMovieService.deleteMovie.mockRejectedValue(serviceError);

              await deleteMovie(mockRequest as Request, mockResponse as Response, nextFunction);

              expect(mockMovieService.deleteMovie).toHaveBeenCalledWith(movieId);
              expect(nextFunction).toHaveBeenCalledWith(serviceError);
              expect(mockResponse.status).not.toHaveBeenCalled();
              expect(mockResponse.json).not.toHaveBeenCalled();
         });
    });

});