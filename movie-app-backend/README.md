	# Movie Database Backend API

A robust NestJS backend API for managing a movie database with authentication, CRUD operations, file uploads, and comprehensive API documentation.

## Features

- ✅ **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Protected routes with guards

- ✅ **Movie Management**
  - Create, read, update, and delete movies
  - Movie entity with title, publishing year, and poster image
  - File upload for movie posters
  - Pagination support

- ✅ **Database**
  - PostgreSQL database with TypeORM
  - Proper entity relationships
  - Database migrations support

- ✅ **API Documentation**
  - Swagger/OpenAPI documentation
  - Interactive API testing interface

- ✅ **Validation & Error Handling**
  - Input validation with class-validator
  - Comprehensive error handling
  - Form validation for email/password

- ✅ **Best Practices**
  - Clean architecture with modules, services, and controllers
  - DTOs for data transfer
  - Environment configuration
  - CORS enabled
  - File upload with size and type validation

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### Quick Setup (Recommended)

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Backend-Test-task
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=movie_database
DB_SSL=false

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
```

5. Create the PostgreSQL database:
```sql
CREATE DATABASE movie_database;
```

6. Create uploads directory:
```bash
mkdir -p uploads/posters
```

7. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Movies (Protected - Requires JWT Token)

- `GET /movies` - Get all movies (with pagination: `?page=1&limit=10`)
- `GET /movies/:id` - Get a movie by ID
- `POST /movies` - Create a new movie (multipart/form-data)
- `PATCH /movies/:id` - Update a movie (multipart/form-data)
- `DELETE /movies/:id` - Delete a movie

### Users (Protected - Requires JWT Token)

- `GET /users/profile` - Get current user profile

## Request Examples

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Movie (with poster)
```bash
curl -X POST http://localhost:3000/movies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=The Matrix" \
  -F "publishingYear=1999" \
  -F "poster=@/path/to/poster.jpg"
```

### Get Movies with Pagination
```bash
curl -X GET "http://localhost:3000/movies?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Movies Table
- `id` (UUID, Primary Key)
- `title` (String)
- `publishingYear` (Integer)
- `poster` (String, nullable)
- `userId` (UUID, Foreign Key to Users)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## File Upload

- Supported formats: JPG, JPEG, PNG, GIF
- Maximum file size: 5MB
- Files are stored in `uploads/posters/` directory
- Files are served statically at `/uploads/posters/`

## Validation Rules

### User Registration/Login
- Email must be a valid email format
- Password must be at least 6 characters long

### Movie
- Title is required
- Publishing year must be between 1888 and 2100
- Poster is optional (image file if provided)

## Error Handling

The API returns standardized error responses:
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/movies",
  "message": "Validation error message"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- CORS configuration
- File upload validation (type and size)

## Development

### Running in development mode
```bash
npm run start:dev
```

### Building for production
```bash
npm run build
npm run start:prod
```

### Running tests
```bash
npm run test
npm run test:e2e
npm run test:cov
```

### Linting
```bash
npm run lint
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Auth guards
│   ├── strategies/      # Passport strategies
│   └── auth.service.ts
├── users/               # Users module
│   ├── entities/        # User entity
│   └── users.service.ts
├── movies/              # Movies module
│   ├── dto/             # Movie DTOs
│   ├── entities/        # Movie entity
│   └── movies.service.ts
├── config/              # Configuration files
├── common/              # Shared utilities
├── filters/             # Exception filters
└── main.ts              # Application entry point
```

## License

MIT

## Author

Senior Backend Developer

