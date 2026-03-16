@echo off
title SignBridge - Setup Script
color 0A

echo.
echo ==========================================
echo   SignBridge - Auto Setup Script
echo ==========================================
echo.

REM ── Check Node.js ─────────────────────────────────────────
echo [1/4] Checking Node.js...
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: Node.js is NOT installed!
    echo  Please download and install it from:
    echo  https://nodejs.org  (click the LTS button)
    echo.
    echo  After installing Node.js, run this script again.
    echo.
    pause
    start https://nodejs.org
    exit /b 1
) ELSE (
    for /f "tokens=*" %%i in ('node --version') do echo  Node.js found: %%i
)

REM ── Check npm ─────────────────────────────────────────────
echo.
echo [2/4] Checking npm...
npm --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  ERROR: npm not found. Please reinstall Node.js.
    pause
    exit /b 1
) ELSE (
    for /f "tokens=*" %%i in ('npm --version') do echo  npm found: %%i
)

REM ── Install VS Code Extensions ─────────────────────────────
echo.
echo [3/4] Installing VS Code extensions...
code --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo  VS Code not found in PATH - skipping extensions.
    echo  You can install them manually from Extensions panel.
) ELSE (
    echo  Installing Live Server...
    code --install-extension ritwickdey.LiveServer --force
    echo  Installing REST Client...
    code --install-extension humao.rest-client --force
    echo  Installing Prettier...
    code --install-extension esbenp.prettier-vscode --force
    echo  Installing MongoDB for VS Code...
    code --install-extension mongodb.mongodb-vscode --force
    echo  Installing ESLint...
    code --install-extension dbaeumer.vscode-eslint --force
    echo  Done installing extensions!
)

REM ── Install Backend Dependencies ──────────────────────────
echo.
echo [4/4] Installing backend npm packages...
cd /d "%~dp0sign-language-backend"

IF NOT EXIST ".env" (
    echo.
    echo  Creating .env file from template...
    copy .env.example .env
    echo.
    echo  ============================================
    echo   ACTION REQUIRED - Edit .env file
    echo  ============================================
    echo   Open sign-language-backend\.env and set:
    echo   MONGO_URI = your MongoDB Atlas connection string
    echo   JWT_SECRET = any long random string
    echo  ============================================
)

npm install
IF %ERRORLEVEL% NEQ 0 (
    echo  ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   SETUP COMPLETE!
echo ==========================================
echo.
echo   Next Steps:
echo   1. Edit sign-language-backend\.env
echo      Set your MONGO_URI from MongoDB Atlas
echo.
echo   2. Run START-BACKEND.bat  to start server
echo   3. Run START-FRONTEND.bat to open website
echo.
echo   Or just run START-ALL.bat to do both!
echo.
pause
