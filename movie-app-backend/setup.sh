#!/bin/bash

echo "🎬 Movie Database Backend - Setup Script"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your database credentials."
else
    echo "ℹ️  .env file already exists."
fi

# Create uploads directory
echo "📁 Creating uploads directories..."
mkdir -p uploads/posters
echo "✅ Upload directories created."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed."

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Create PostgreSQL database: CREATE DATABASE movie_database;"
echo "3. Run the application: npm run start:dev"
echo "4. Access Swagger docs at: http://localhost:3000/api"
echo ""



