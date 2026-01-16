# Project Structure

This document describes the structure of the Movie Database Backend API.

## Directory Structure

```
Backend-Test-task/
├── src/                          # Source code
│   ├── auth/                     # Authentication module
│   │   ├── dto/                  # Data Transfer Objects
│   │   │   ├── login.dto.ts      # Login request DTO
│   │   │   └── register.dto.ts  # Registration request DTO
│   │   ├── guards/               # Authentication guards
│   │   │   ├── jwt-auth.guard.ts # JWT authentication guard
│   │   │   └── local-auth.guard.ts # Local strategy guard
│   │   ├── strategies/           # Passport strategies
│   │   │   ├── jwt.strategy.ts   # JWT strategy
│   │   │   └── local.strategy.ts # Local strategy
│   │   ├── auth.controller.ts    # Auth endpoints
│   │   ├── auth.service.ts       # Auth business logic
│   │   └── auth.module.ts        # Auth module definition
│   ├── users/                    # Users module
│   │   ├── entities/             # Database entities
│   │   │   └── user.entity.ts    # User entity
│   │   ├── users.controller.ts   # User endpoints
│   │   ├── users.service.ts      # User business logic
│   │   └── users.module.ts       # User module definition
│   ├── movies/                   # Movies module
│   │   ├── dto/                  # Data Transfer Objects
│   │   │   ├── create-movie.dto.ts    # Create movie DTO
│   │   │   ├── update-movie.dto.ts    # Update movie DTO
│   │   │   └── pagination.dto.ts      # Pagination DTO
│   │   ├── entities/             # Database entities
│   │   │   └── movie.entity.ts   # Movie entity
│   │   ├── movies.controller.ts  # Movie endpoints
│   │   ├── movies.service.ts     # Movie business logic
│   │   └── movies.module.ts      # Movie module definition
│   ├── config/                   # Configuration files
│   │   └── database.config.ts    # Database configuration
│   ├── common/                   # Shared utilities
│   │   └── decorators/           # Custom decorators
│   │       └── user.decorator.ts # Current user decorator
│   ├── filters/                  # Exception filters
│   │   └── http-exception.filter.ts # Global exception filter
│   ├── utils/                    # Utility functions
│   │   └── create-upload-dirs.ts # Directory creation utility
│   ├── app.module.ts             # Root application module
│   └── main.ts                   # Application entry point
├── uploads/                      # Uploaded files directory
│   └── posters/                  # Movie poster images
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── nest-cli.json                 # NestJS CLI configuration
├── package.json                  # NPM dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── setup.sh                      # Setup script (Linux/Mac)
├── setup.ps1                     # Setup script (Windows)
├── README.md                     # Project documentation
└── PROJECT_STRUCTURE.md          # This file

```

## Module Architecture

### Authentication Module (`auth/`)
Handles user authentication and authorization:
- **Strategies**: JWT and Local (email/password)
- **Guards**: Protect routes requiring authentication
- **Endpoints**: `/auth/register`, `/auth/login`

### Users Module (`users/`)
Manages user data:
- **Entity**: User with email and hashed password
- **Endpoints**: `/users/profile` (protected)

### Movies Module (`movies/`)
Manages movie CRUD operations:
- **Entity**: Movie with title, publishingYear, poster, and user relationship
- **Endpoints**: 
  - `GET /movies` - List movies (paginated)
  - `GET /movies/:id` - Get single movie
  - `POST /movies` - Create movie (with file upload)
  - `PATCH /movies/:id` - Update movie (with optional file upload)
  - `DELETE /movies/:id` - Delete movie

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

### Movies Table
```sql
CREATE TABLE movies (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  publishing_year INTEGER NOT NULL,
  poster VARCHAR,
  user_id UUID REFERENCES users(id),
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);
```

## Key Features

### Security
- Password hashing with bcrypt
- JWT token authentication
- Input validation
- File upload validation

### API Documentation
- Swagger/OpenAPI at `/api`
- Interactive testing interface
- Request/response schemas

### Error Handling
- Global exception filter
- Standardized error responses
- Validation error messages

### File Management
- Multer for file uploads
- Image validation (type and size)
- Unique file naming with UUID
- Static file serving

## Technology Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport.js + JWT
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer

## Development Workflow

1. **Setup**: Run setup script
2. **Configure**: Update `.env` with database credentials
3. **Database**: Create PostgreSQL database
4. **Run**: `npm run start:dev`
5. **Test**: Use Swagger UI at `http://localhost:3000/api`


## Best Practices Implemented

✅ Modular architecture
✅ Separation of concerns (Controller/Service/Entity)
✅ DTOs for data validation
✅ Dependency injection
✅ Environment-based configuration
✅ Error handling
✅ API documentation
✅ Type safety with TypeScript
✅ Database migrations support
✅ Security best practices





