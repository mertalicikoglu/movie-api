# Movie API

A TypeScript-based REST API for managing movies and directors, built with Node.js, Express, MongoDB, Redis and Clean Architecture.

## Features

- Movie and Director management with CRUD operations 
- Clean Architecture design (Domain, Application, Infrastructure layers)
- TypeScript for type safety
- MongoDB for data persistence
- Redis for caching
- Docker and Docker Compose support
- Swagger API documentation
- Input validation with Zod
- Centralized error handling
- Unit testing with Jest

## Architecture

The project follows Clean Architecture principles to separate responsibilities and manage dependencies:

- **Domain Layer (`src/domain`):** Defines core business entities and repository interfaces, not dependent on any technology or framework
- **Application Layer (`src/application`):** Contains business logic, services and use cases
- **Infrastructure Layer (`src/infrastructure`):** Manages external dependencies (databases, caching, configuration)
- **API Layer (`src/api`):** Express controllers, routes and middleware

## Technologies Used

- **Backend:** Node.js
- **Language:** TypeScript
- **Web Framework:** Express
- **Database:** MongoDB
- **ORM/ODM:** Mongoose
- **Caching:** Redis
- **Containerization:** Docker
- **Input Validation:** Zod
- **Error Handling:** Custom Error Classes and Central Middleware
- **Testing:** Jest, ts-jest, Mocking
- **Version Control:** Git

## Prerequisites

- Node.js v14+ 
- Docker and Docker Compose (for containerized setup)
- MongoDB (included in Docker setup)
- Redis (included in Docker setup)

## Setup and Installation

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/mertalicikoglu/movie-api.git
   cd movie-api
   ```

2. Create a `.env` file in the project root (or use the provided .env.example):
   ```
   PORT=3000
   DATABASE_URL=mongodb://mongo:27017/movie-director-db
   REDIS_HOST=redis
   REDIS_PORT=6379
   ```

3. Start the application with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. The API will be available at http://localhost:3000 and the Swagger documentation at http://localhost:3000/api-docs

### Without Docker (Manual Setup)

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/mertalicikoglu/movie-api.git
   cd movie-api
   npm install
   ```

2. Create a `.env` file with the following content:
   ```
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/movie-director-db
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

3. Start MongoDB and Redis (must be installed separately)

4. Build and run the application:
   ```bash
   npm run build
   npm start
   ```

5. For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| GET    | /movies                | Get all movies               |
| GET    | /movies/:id            | Get movie by ID              |
| POST   | /movies                | Create a new movie           |
| PUT    | /movies/:id            | Update a movie               |
| DELETE | /movies/:id            | Delete a movie               |
| GET    | /directors             | Get all directors            |
| GET    | /directors/:id         | Get director by ID           |
| POST   | /directors             | Create a new director        |
| PUT    | /directors/:id         | Update a director            |
| DELETE | /directors/:id         | Delete a director            |

## Data Models

* **Movie:** Title, Description, Release Date, Genre, Rating, IMDb ID, Director (Reference)
* **Director:** First Name, Second Name, Birth Date, Bio

## Docker Commands

- Build and start all services:
  ```bash
  docker-compose up -d --build
  ```

- View logs:
  ```bash
  docker-compose logs -f api
  ```

- Stop all services:
  ```bash
  docker-compose down
  ```

- Reset data and volumes:
  ```bash
  docker-compose down -v
  ```

## Cache Management

The API uses Redis for caching:

- Director and Movie data is cached automatically
- Cache is invalidated when entities are created, updated or deleted
- Cache TTL is set to 1 hour by default

To manually clear Redis cache:
```bash
docker exec -it movie-api-redis-1 redis-cli FLUSHALL
```

## API Example Requests

* **Create Movie:**
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
      "directorId": "60f5e8a7d4b5e7c8a9b0c1d2"
    }'
    ```

* **Create Director:**
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

## Testing

Run the unit tests using:

```bash
npm test
```

## License

MIT