@echo off
title Jyotish Study Library

:: Go to current folder
cd /d "%~dp0"

echo.
echo ==========================================
echo      JYOTISH LIBRARY SERVER
echo ==========================================
echo.
echo Starting Local Server...
echo.

:: Start Server in a new window
start "" cmd /k "title Jyotish Library Server && npx serve ."


echo Waiting for server...
timeout /t 3 /nobreak >nul

echo Opening Library...
start http://localhost:3000

echo.
echo Library Started Successfully.
echo.
exit