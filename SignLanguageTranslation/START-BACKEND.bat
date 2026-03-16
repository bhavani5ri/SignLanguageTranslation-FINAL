@echo off
title SignBridge - Backend Server
color 0B

echo.
echo ==========================================
echo   SignBridge Backend - Starting...
echo ==========================================
echo.

cd /d "%~dp0sign-language-backend"

IF NOT EXIST ".env" (
    echo  ERROR: .env file not found!
    echo  Please run SETUP.bat first.
    echo  Then fill in your MONGO_URI in .env
    echo.
    pause
    exit /b 1
)

IF NOT EXIST "node_modules" (
    echo  node_modules not found. Running npm install...
    npm install
)

echo  Starting backend on http://localhost:5000
echo  Press Ctrl+C to stop the server
echo.
npm run dev
pause
