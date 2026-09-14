@echo off
setlocal
title Kammoun Lighting - Frontend (Vite)

cd /d "%~dp0"

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 goto :error
)

echo.
echo Starting frontend at http://localhost:5173
echo The browser will open in a few seconds.
echo Close this window or press Ctrl+C to stop.
echo.

start "" /b powershell -NoProfile -Command "Start-Sleep -Seconds 5; Start-Process 'http://localhost:5173'"
call npm run dev

goto :eof

:error
echo.
echo Setup failed. Check the messages above.
pause