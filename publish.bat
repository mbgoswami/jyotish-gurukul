@echo off
title Jyotish Library Publisher
cd /d "%~dp0"

echo.
echo ==========================================
echo       JYOTISH LIBRARY PUBLISHER
echo ==========================================
echo.

:: ------------------------------------------------
:: STEP 1 - Build library
:: ------------------------------------------------

echo [1/4] Building library...
echo.

node builder.js

if errorlevel 1 (
    echo.
    echo ERROR: Library build failed.
    echo Publishing stopped.
    echo.
    pause
    exit /b 1
)

echo.
echo Library build completed successfully.
echo.


:: ------------------------------------------------
:: STEP 2 - Add changed files
:: ------------------------------------------------

echo [2/4] Checking changed files...
echo.

git add -A

if errorlevel 1 (
    echo.
    echo ERROR: Git could not stage the changes.
    echo Publishing stopped.
    echo.
    pause
    exit /b 1
)

echo.


:: ------------------------------------------------
:: STEP 3 - Create commit if needed
:: ------------------------------------------------

echo [3/4] Checking for changes...
echo.

git diff --cached --quiet

if not errorlevel 1 (
    echo.
    echo No changes to publish.
    echo Library is already up to date.
    echo.
    pause
    exit /b 0
)

echo Changes detected.
echo.

git commit -m "Library Updated"

if errorlevel 1 (
    echo.
    echo ERROR: Git commit failed.
    echo Publishing stopped.
    echo.
    pause
    exit /b 1
)

echo.
echo Commit created successfully.
echo.


:: ------------------------------------------------
:: STEP 4 - Push to GitHub
:: ------------------------------------------------

echo [4/4] Publishing to GitHub...
echo.

git push origin main

if errorlevel 1 (
    echo.
    echo ==========================================
    echo   PUBLISH FAILED
    echo ==========================================
    echo.
    echo GitHub rejected the push.
    echo Your local project is safe.
    echo No false SUCCESS message will be shown.
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   SUCCESS!
echo   Library Published Successfully.
echo ==========================================
echo.
pause