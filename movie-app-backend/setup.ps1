# Movie Database Backend - Setup Script (PowerShell)

Write-Host "🎬 Movie Database Backend - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-Not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ .env file created. Please update it with your database credentials." -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env file already exists." -ForegroundColor Blue
}

# Create uploads directory
Write-Host "📁 Creating uploads directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "uploads\posters" | Out-Null
Write-Host "✅ Upload directories created." -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies installed." -ForegroundColor Green

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env file with your database credentials"
Write-Host "2. Create PostgreSQL database: CREATE DATABASE movie_database;"
Write-Host "3. Run the application: npm run start:dev"
Write-Host "4. Access Swagger docs at: http://localhost:3000/api"
Write-Host ""



