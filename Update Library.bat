@echo off
title Update Library

cd /d "%~dp0"

echo.
echo Updating library.json...
echo.

node builder.js

echo.
echo Done.
echo.

pause