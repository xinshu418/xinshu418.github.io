@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
    echo Python was not found. Please install Python or run another local web server.
    pause
    exit /b 1
)

echo Starting the homepage preview at http://127.0.0.1:8000/
start "Homepage Preview Server" /min python -m http.server 8000 --bind 127.0.0.1
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:8000/"

echo The preview server is running in a minimized window.
echo Close that window when you finish previewing the site.
pause
