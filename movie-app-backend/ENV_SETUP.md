# Environment Variables Setup Guide

This guide explains all the environment variables needed for the Movie Database Backend API.

## Quick Setup

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual values

## Required Environment Variables

### Database Configuration

#### `DB_HOST`
- **Description**: PostgreSQL database host address
- **Default**: `localhost`
- **Example**: 
  - Local: `localhost`


#### `DB_PORT`
- **Description**: PostgreSQL database port
- **Default**: `5432`
- **Example**: `5432`

#### `DB_USERNAME`
- **Description**: PostgreSQL database username
- **Default**: `postgres`
- **Example**: `postgres` or `my_db_user`

#### `DB_PASSWORD`
- **Description**: PostgreSQL database password
- **Default**: `postgres`
- **Required**: Yes (change from default!)
- **Example**: `your_secure_password_123`

#### `DB_NAME`
- **Description**: PostgreSQL database name
- **Default**: `movie_database`
- **Example**: `movie_database`

#### `DB_SSL`
- **Description**: Enable SSL for database connection
- **Default**: `false`
- **Values**: `true` or `false`

### JWT Authentication Configuration

#### `JWT_SECRET`
- **Description**: Secret key for signing JWT tokens
- **Default**: `your-secret-key` (NOT SECURE!)
- **Required**: Yes (MUST change in production!)
- **Security**: Use a strong, random string (minimum 32 characters)
- **How to generate**:
  ```bash
  # Using Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  
  # Using OpenSSL
  openssl rand -hex 32
  ```
- **Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

#### `JWT_EXPIRES_IN`
- **Description**: JWT token expiration time
- **Default**: `24h`
- **Format**: 
  - `24h` (24 hours)
  - `7d` (7 days)
  - `1h` (1 hour)
  - `30m` (30 minutes)
- **Example**: `24h`

### Application Configuration

#### `PORT`
- **Description**: Port on which the application will run
- **Default**: `3000`
- **Example**: `3000` or `8080`

#### `NODE_ENV`
- **Description**: Application environment
- **Default**: `development`
- **Values**: 
  - `development` - Development mode (enables auto-sync, logging)
  - `production` - Production mode (disables auto-sync, optimized)
  - `test` - Testing mode
- **Example**: `development`

## Example .env File

### For Local Development
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=movie_database
DB_SSL=false

JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
```


## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong JWT_SECRET** - Generate a random 32+ character string
3. **Use strong database passwords** - Don't use default passwords
4. **Use environment-specific values** - Different values for dev/staging/prod

## Troubleshooting

### Database Connection Issues
- Verify `DB_HOST` is correct
- Check `DB_PORT` matches your PostgreSQL port
- Ensure `DB_USERNAME` and `DB_PASSWORD` are correct
- Verify database exists: `CREATE DATABASE movie_database;`

### JWT Authentication Issues
- Ensure `JWT_SECRET` is set and not empty
- Check token expiration with `JWT_EXPIRES_IN`

### Port Already in Use
- Change `PORT` to a different value (e.g., `3001`, `8080`)
- Or stop the process using port 3000

## Next Steps

After setting up your `.env` file:

1. Create the PostgreSQL database:
   ```sql
   CREATE DATABASE movie_database;
   ```

2. Start the application:
   ```bash
   npm run start:dev
   ```

3. Access Swagger documentation:
   ```
   http://localhost:3000/api
   ```





