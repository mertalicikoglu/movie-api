// __tests__/api/controllers/director.controller.test.ts

import { Request, Response, NextFunction } from 'express';
// Import controller functions to test
import { createDirector, deleteDirector } from '../../../src/api/controllers/director.controller';

// Mock the Service class that the controller depends on
jest.mock('../../../src/application/services/director.service');
// MovieService also needs to be mocked since DirectorService depends on it
jest.mock('../../../src/application/services/movie.service');


// Get the mock version of DirectorService class
import { DirectorService } from '../../../src/application/services/director.service';
// Get the mock version of MovieService class (used in DirectorService constructor)
import { MovieService } from '../../../src/application/services/movie.service';

// Import custom error classes (if thrown in controller)
import { NotFoundError, ConflictError, ValidationError } from '../../../src/application/errors';


// Describe block defining test scenarios
describe('Director Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock<NextFunction>;

    // Mocked instances of DirectorService and MovieService
    let mockDirectorService: jest.Mocked<DirectorService>;
    let mockMovieService: jest.Mocked<MovieService>;


    beforeEach(() => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockRequest = {}; // Request body and parameters will be filled based on test scenarios

        nextFunction = jest.fn();

        // Access to mock DirectorService instance
        // DirectorService constructor takes DirectorRepository and MovieRepository.
        // Since the `new DirectorService(...)` call in controller is mocked,
        // we don't need actual repository classes.
        // However, jest.mock() only mocks the class, to mock instance methods we need to
        // either access through `DirectorService.prototype` or set mock constructor return value.
        // Common approach is to mock through prototype:
         mockDirectorService = DirectorService.prototype as jest.Mocked<DirectorService>;
         mockMovieService = MovieService.prototype as jest.Mocked<MovieService>; // May be needed for DirectorService constructor, we'll mock in tests
         // NOTE: If controller has `new DirectorService(new DirectorRepository(), new MovieRepository())`
         // jest.mock() mocks the DirectorService class itself.
         // Need to set what mocked class constructor returns:
         // (DirectorService as jest.Mock).mockImplementation(() => ({
         //    createDirector: jest.fn(),
         //    deleteDirector: jest.fn(),
         //    // ... other service methods
         // }));
         // However mocking through prototype is usually simpler.

        jest.clearAllMocks();
    });

    // --- createDirector Tests ---
    describe('createDirector', () => {
        it('should create a director and return it with status 201', async () => {
            // Sample director data in request body
            const directorData = { firstName: 'Quentin', secondName: 'Tarantino', birthDate: '1963-03-27' };
            // Created director object to be returned from service
            const createdDirector = { id: 'dir1', ...directorData };

            mockRequest.body = directorData;

            // Set mock DirectorService createDirector method to return successfully
            mockDirectorService.createDirector.mockResolvedValue(createdDirector as any); // any cast may be needed

            // Call controller function
            await createDirector(mockRequest as Request, mockResponse as Response, nextFunction);

            // Verify expectations:
            // 1. Service createDirector method was called with correct data
            expect(mockDirectorService.createDirector).toHaveBeenCalledWith(directorData);
            // 2. Response status is 201
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            // 3. Response body is created director object
            expect(mockResponse.json).toHaveBeenCalledWith(createdDirector);
            // 4. next function wasn't called (no error)
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should call next with error if service throws an error', async () => {
            // Request body
            const directorData = { firstName: 'Quentin', secondName: 'Tarantino' };
            // Sample error to be thrown from service
            const serviceError = new Error('Service layer failed'); // Or custom error class

            mockRequest.body = directorData;

            // Set mock DirectorService createDirector method to throw error
            mockDirectorService.createDirector.mockRejectedValue(serviceError);

            // Call controller function
            await createDirector(mockRequest as Request, mockResponse as Response, nextFunction);

            // Verify expectations:
            // 1. Service was called
            expect(mockDirectorService.createDirector).toHaveBeenCalledWith(directorData);
            // 2. next function was called with error
            expect(nextFunction).toHaveBeenCalledWith(serviceError);
            // 3. Response methods weren't called
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });

        // TODO: Other createDirector error scenarios not caught by validation middleware
    });

    // --- deleteDirector Tests ---
    describe('deleteDirector', () => {
        it('should delete a director and return success message with status 200', async () => {
            const directorId = 'dir1';

            mockRequest.params = { id: directorId };

            // Set mock DirectorService deleteDirector method to return success (true)
            mockDirectorService.deleteDirector.mockResolvedValue(true);

            // Call controller function
            await deleteDirector(mockRequest as Request, mockResponse as Response, nextFunction);

            // Verify expectations:
            // 1. Service deleteDirector method was called with correct ID
            expect(mockDirectorService.deleteDirector).toHaveBeenCalledWith(directorId);
            // 2. Response status is 200
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            // 3. Response body is success message
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Director deleted successfully' });
            // 4. next function wasn't called
            expect(nextFunction).not.toHaveBeenCalled();
        });

         it('should call next with NotFoundError if director not found', async () => {
             const directorId = 'non-existent-id';

             mockRequest.params = { id: directorId };

             // Set mock DirectorService deleteDirector method to return false when director not found
             // Controller should throw NotFoundError in this case
             mockDirectorService.deleteDirector.mockResolvedValue(false);

             // Call controller function
             await deleteDirector(mockRequest as Request, mockResponse as Response, nextFunction);

             // Verify expectations:
             // 1. Service deleteDirector method was called
             expect(mockDirectorService.deleteDirector).toHaveBeenCalledWith(directorId);
             // 2. next function was called with NotFoundError
             expect(nextFunction).toHaveBeenCalled();
             const errorArg = nextFunction.mock.calls[0][0];
             expect(errorArg).toBeInstanceOf(NotFoundError); // Check custom error class
             // expect(errorArg.message).toBe(`Director with ID ${directorId} not found.`); // Check error message

             // 3. Response methods weren't called
             expect(mockResponse.status).not.toHaveBeenCalled();
             expect(mockResponse.json).not.toHaveBeenCalled();
         });


        it('should call next with ConflictError if director has associated movies', async () => {
             const directorId = 'dir-with-movies';
             // DirectorService throws ConflictError if director has associated movies
             const conflictError = new ConflictError(`Cannot delete director with ID ${directorId} because movies are associated.`);

             mockRequest.params = { id: directorId };

             // Set mock DirectorService deleteDirector method to throw ConflictError
             mockDirectorService.deleteDirector.mockRejectedValue(conflictError);

             // Call controller function
             await deleteDirector(mockRequest as Request, mockResponse as Response, nextFunction);

             // Verify expectations:
             // 1. Service deleteDirector method was called
             expect(mockDirectorService.deleteDirector).toHaveBeenCalledWith(directorId);
             // 2. next function was called with ConflictError
             expect(nextFunction).toHaveBeenCalledWith(conflictError); // Expect the thrown error directly

             // 3. Response methods weren't called
             expect(mockResponse.status).not.toHaveBeenCalled();
             expect(mockResponse.json).not.toHaveBeenCalled();
         });


        it('should call next with generic error if service throws an unexpected error', async () => {
             const directorId = 'some-id';
             // Unexpected error to be thrown from service
             const unexpectedError = new Error('Database issue');

             mockRequest.params = { id: directorId };

             // Set mock DirectorService deleteDirector method to throw unexpected error
             mockDirectorService.deleteDirector.mockRejectedValue(unexpectedError);

             // Call controller function
             await deleteDirector(mockRequest as Request, mockResponse as Response, nextFunction);

             // Verify expectations:
             // 1. Service deleteDirector method was called
             expect(mockDirectorService.deleteDirector).toHaveBeenCalledWith(directorId);
             // 2. next function was called with unexpected error
             expect(nextFunction).toHaveBeenCalledWith(unexpectedError);

             // 3. Response methods weren't called
             expect(mockResponse.status).not.toHaveBeenCalled();
             expect(mockResponse.json).not.toHaveBeenCalled();
         });
    });

});