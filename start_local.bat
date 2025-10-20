@echo off
echo ========================================
echo    DARSHANA HERITAGE PLATFORM
echo    Manual Website Startup Script
echo ========================================
echo.

echo [1/5] Checking for running processes on required ports...
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo WARNING: Port 3000 is in use. Killing process...
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3000') do taskkill /PID %%i /F >nul 2>&1
)

netstat -ano | findstr :5000 >nul
if %errorlevel% == 0 (
    echo WARNING: Port 5000 is in use. Killing process...
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :5000') do taskkill /PID %%i /F >nul 2>&1
)

netstat -ano | findstr :5004 >nul
if %errorlevel% == 0 (
    echo WARNING: Port 5004 is in use. Killing process...
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :5004') do taskkill /PID %%i /F >nul 2>&1
)

netstat -ano | findstr :8000 >nul
if %errorlevel% == 0 (
    echo WARNING: Port 8000 is in use. Killing process...
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :8000') do taskkill /PID %%i /F >nul 2>&1
)

echo.
echo [2/5] Starting Backend API Service (Port 5000)...
start "Backend API" cmd /k "cd /d backend && npm run dev"
timeout /t 3 >nul

echo [3/5] Starting WhatsApp Ticket Service (Port 5004)...
start "WhatsApp Service" cmd /k "cd /d backend && node whatsapp-test-server.js"
timeout /t 3 >nul

echo [4/5] Starting AI Service (Port 8000)...
start "AI Service" cmd /k "cd /d ai-service && python app.py"
timeout /t 3 >nul

echo [5/5] Starting Frontend Website (Port 3000)...
start "Frontend" cmd /k "cd /d Frontend && npm run dev"
timeout /t 5 >nul

echo.
echo ========================================
echo    DARSHANA WEBSITE STARTED!
echo ========================================
echo.
echo Your website is now available at:
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 🎫 WhatsApp Service: http://localhost:5004
echo 🤖 AI Service: http://localhost:8000
echo.
echo Press any key to open website in browser...
pause >nul
start http://localhost:3000