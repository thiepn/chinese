@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required. Install it from https://nodejs.org/
  pause
  exit /b 1
)
echo Character Study is starting at http://127.0.0.1:4173/
node scripts\start.mjs %*
set "EXITCODE=%errorlevel%"
pause
exit /b %EXITCODE%
