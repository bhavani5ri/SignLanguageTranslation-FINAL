@echo off
title SignBridge - Frontend
color 0E

echo.
echo ==========================================
echo   SignBridge Frontend - Opening...
echo ==========================================
echo.

REM Open index.html directly in default browser
start "" "%~dp0sign-language-frontend\index.html"

echo  Website opened in your browser!
echo.
echo  If it shows a blank page or file path in address bar,
echo  use VS Code Live Server instead:
echo    1. Open VS Code
echo    2. File > Open Folder > select sign-language-frontend
echo    3. Right-click index.html
echo    4. Click "Open with Live Server"
echo.
timeout /t 3
