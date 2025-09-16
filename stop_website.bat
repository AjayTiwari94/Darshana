@echo off
title Darshana - Stop Services

echo.
echo ========================================
echo    STOPPING DARSHANA SERVICES
echo ========================================
echo.

echo Stopping Frontend (Port 3000)...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3000') do taskkill /PID %%i /F >nul 2>&1

echo Stopping Backend API (Port 5000)...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr :5000') do taskkill /PID %%i /F >nul 2>&1

echo Stopping AI Service (Port 8000)...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr :8000') do taskkill /PID %%i /F >nul 2>&1

echo.
echo ✓ All Darshana services stopped!
echo.
echo To restart, run: start_local.bat
echo.
pause