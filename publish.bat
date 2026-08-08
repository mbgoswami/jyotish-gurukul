@echo off
title Jyotish Library Publisher

cd /d "%~dp0"

echo.
echo ==========================================
echo      Jyotish Library Publisher
echo ==========================================
echo.

echo [1/4] Building library...
node builder.js

echo.
echo [2/4] Adding changed files...
git add .

echo.
echo [3/4] Creating commit...
git commit -m "Library Updated"

echo.
echo [4/4] Publishing to GitHub...
git push

echo.
echo ==========================================
echo   SUCCESS!
echo   Library Published Successfully.
echo ==========================================
echo.
pause