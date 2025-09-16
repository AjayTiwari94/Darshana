REM =======================================================
REM Darshana Platform - Start with Atlas Configuration
REM =======================================================

@echo off
title Darshana - Atlas Development Environment

echo.
echo ==========================================
echo    DARSHANA - ATLAS DEVELOPMENT
echo ==========================================
echo.
echo Starting Darshana platform with:
echo   - MongoDB Atlas database (cloud)
echo   - Google Gemini AI service
echo   - Next.js frontend
echo.

REM Check if local .env files exist
if not exist "backend\.env" (
    echo Creating backend environment file...
    copy "backend\.env.example" "backend\.env"
    echo ✓ Backend .env created from example
)

if not exist "ai-service\.env" (
    echo Creating AI service environment file...
    copy "ai-service\.env.example" "ai-service\.env"
    echo ✓ AI service .env created from example
    echo.
    echo ⚠️  IMPORTANT: Please add your Gemini API key to ai-service\.env
    echo    See GEMINI_API_SETUP.md for instructions
    echo.
)

echo Starting all services...
echo.

REM Start all services using the main package.json script
REM MongoDB Atlas connection will be handled by the backend

timeout /t 3 /nobreak > nul

start "Darshana Backend" cmd /k "cd backend && npm run dev"
start "Darshana AI Service" cmd /k "cd ai-service && python app.py"  
start "Darshana Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✓ All services started!
echo.
echo Access your application:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:5000  
echo   - AI Service: http://localhost:8000
echo.
echo 📚 Setup guides:
echo   - MongoDB Atlas: MONGODB_ATLAS_DIRECT.md
echo   - Gemini AI: GEMINI_API_SETUP.md
echo.

pause