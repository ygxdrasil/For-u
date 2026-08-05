@echo off
rem ---------------------------------------------------------------------------
rem  Laptop Optimizer launcher.
rem  Double-click this. It asks for administrator rights, then opens the app.
rem ---------------------------------------------------------------------------

setlocal

net session >nul 2>&1
if %errorlevel% equ 0 goto :elevated

echo Requesting administrator rights...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs" >nul 2>&1
exit /b

:elevated
powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -File "%~dp0Optimize.ps1"

if %errorlevel% neq 0 (
    echo.
    echo The app exited with an error. The message above explains why.
    pause
)

exit /b
