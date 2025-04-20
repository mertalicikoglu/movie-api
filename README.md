# Movie and Director Management API

This project is a RESTful API developed for managing movie and director information.

### API Features

* Create Movie (`POST /api/movies`)
* Get All Movies (`GET /api/movies`) 
* Delete Movie (`DELETE /api/movies/:id`)
* Update Movie (`PUT /api/movies/:id`)
* Create Director (`POST /api/directors`)
* Delete Director (`DELETE /api/directors/:id`)

### Data Models

* **Movie:** Title, Description, Release Date, Genre, Rating, IMDb ID, Director (Reference)
* **Director:** First Name, Second Name, Birth Date, Bio

### Key Points

* Working RESTful API
* Docker usage
* Logic layer design
* Error Handling (Centralized)
* Comments and Documentation (In-code and API)
* Database Management (MongoDB / Mongoose)
* Input Validation
* Coding unit tests of endpoints

## Architecture

The project follows Clean Architecture principles to separate responsibilities and manage dependencies. The layers are as follows:

* **Presentation Layer (`src/api`):** Handles incoming HTTP requests, processes requests through controllers, performs validation and calls the application layer. Formats responses.
* **Application Layer (`src/application`):** Contains the core business logic (use cases) of the application. Uses entities and repository interfaces from the domain layer. Calls repository implementations from the infrastructure layer.
* **Domain Layer (`src/domain`):** Defines the core business entities and business rules of the application. Not dependent on any technology or framework. Repository interfaces are defined in this layer.
* **Infrastructure Layer (`src/infrastructure`):** Manages external dependencies (database, external services, configuration). Contains concrete implementations of repository interfaces (using Mongoose) defined in the domain layer.

## Technologies Used

* **Backend:** Node.js
* **Language:** TypeScript
* **Web Framework:** Express
* **Database:** MongoDB
* **ORM/ODM:** Mongoose
* **Containerization:** Docker
* **Input Validation:** Zod
* **Error Handling:** Custom Error Classes and Central Middleware
* **Testing:** Jest, ts-jest, Mocking
* **Version Control:** Git

## Setup

### Prerequisites

* Node.js (v14 or higher recommended)
* npm (comes with Node.js)
* Docker
* MongoDB (Local or cloud instance)

### Steps

1.  Clone the project:
    ```bash
    git clone <your-repo-address>
    cd movie-director-api
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create environment variables file. Copy the `.env.example` file in the project root directory to create a `.env` file and update the `DATABASE_URL` variable with your MongoDB connection string:
    ```bash
    cp .env.example .env
    ```
    Edit the `.env` file:
    ```dotenv
    DATABASE_URL=mongodb://<your-mongo-host>:<port>/<db-name>
    PORT=3000 # Port where the application will run
    ```
    Make sure you **don't add** the `.env` file to Git (should have controlled `.gitignore` file).

## Running the Application

### Direct Run with Node.js (For Development)

1.  Compile TypeScript code:
    ```bash
    npm run build
    ```
2.  Run the application:
    ```bash
    npm start
    ```
    Or for development if you're using `nodemon` and `ts-node` (if dev script is defined in package.json):
    ```bash
    npm run dev
    ```
    The application will start on the port specified in your `.env` file (default 3000).

### Running with Docker

1.  Build Docker image:
    ```bash
    docker build -t movie-director-api .
    ```
2.  Run Docker container. Use the `.env` file to pass environment variables to the container and publish the port:
    ```bash
    docker run -p 3000:3000 --env-file .env movie-director-api
    ```
    The application will start inside the Docker container and will be accessible from port 3000 on your host machine.

## API Endpoint Usage

You can use tools like `curl` or Postman to send requests to API endpoints.

**Examples:**

* **Create Movie (POST /api/movies):**
    ```bash
    curl -X POST http://localhost:3000/api/movies \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Inception",
      "description": "A thief who steals corporate secrets...",
      "releaseDate": "2010-07-16",
      "genre": "Sci-Fi",
      "rating": 8.8,
      "imdbId": "tt1375666",
      "directorId": "60f5e8a7d4b5e7c8a9b0c1d2" # Existing director ID
    }'
    ```

* **Get All Movies (GET /api/movies):**
    ```bash
    curl http://localhost:3000/api/movies
    ```

* **Create Director (POST /api/directors):**
    ```bash
    curl -X POST http://localhost:3000/api/directors \
    -H "Content-Type: application/json" \
    -d '{
      "firstName": "Christopher",
      "secondName": "Nolan",
      "birthDate": "1970-07-30",
      "bio": "Known for mind-bending films."
    }'
    ```

* **Delete Movie (DELETE /api/movies/:id):**
    ```bash
    curl -X DELETE http://localhost:3000/api/movies/60f5e8a7d4b5e7c8a9b0c1d2 # ID of movie to delete
    ```
    *(IDs will be assigned by MongoDB, replace the example ID with the ID of the object you created)*

## API Documentation (Swagger UI)

Detailed information about API endpoints (parameters, request bodies, responses, examples) is provided through an interactive Swagger UI. The documentation is automatically generated from comments in your code.

http://localhost:<PORT>/api-docs

(`<PORT>` is the port number you set in your `.env` file or the default, usually 3000)

You can examine endpoints, try them out, and see how to use the API through the Swagger UI.

## Error Handling

The API uses a central error handling middleware to convert custom errors thrown from the application layer (e.g., Resource Not Found - 404, Invalid Input - 400, Conflict - 409) into appropriate HTTP status codes and messages. Unexpected errors are returned as 500 Internal Server Error.

## Input Validation

Request bodies (POST/PUT) coming to the API are validated according to schemas defined using the Zod library. If validation fails, the client receives a 400 Bad Request status code and a response containing error details.

## Testing

To ensure the quality and reliability of the API, automated tests have been implemented.

Unit tests are specifically written for the **API controllers** to verify that they correctly process incoming requests, interact with the application layer (services), and format the outgoing HTTP responses.

* **Framework:** Jest is used as the test runner.
* **TypeScript Support:** `ts-jest` allows running tests written in TypeScript.
* **Isolation:** Mocking is utilized to isolate the controllers from their dependencies, ensuring that only the controller's logic is tested in isolation.

You can run the unit tests using the following command in the project root directory:

```bash
npm test