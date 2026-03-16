@echo off
title SignBridge - Start All
color 0A

echo.
echo ==========================================
echo   SignBridge - Starting Everything
echo ==========================================
echo.

REM Check node_modules exist
IF NOT EXIST "%~dp0sign-language-backend\node_modules" (
    echo  Packages not installed. Run SETUP.bat first!
    pause
    exit /b 1
)

IF NOT EXIST "%~dp0sign-language-backend\.env" (
    echo  .env file missing. Run SETUP.bat first!
    pause
    exit /b 1
)

echo  Starting Backend in a new window...
start "SignBridge Backend" cmd /k "cd /d "%~dp0sign-language-backend" && npm run dev"

echo  Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo  Opening Frontend in browser...
start "" "%~dp0sign-language-frontend\index.html"

echo.
echo  ==========================================
echo   Both are running!
echo  ==========================================
echo   Backend:  http://localhost:5000
echo   Frontend: sign-language-frontend/index.html
echo   Health:   http://localhost:5000/health
echo  ==========================================
echo.
pause
