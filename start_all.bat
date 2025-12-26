@echo off
:: This moves the script's focus to the folder it is currently in
cd /d "%~dp0"

echo Starting backend...
:: We use the path relative to the script location
cd "backend"
start "Backend" cmd /c "uv run fastapi dev"

echo Starting frontend...
:: Go back to the script location, then into frontend
cd /d "%~dp0"
cd "frontend"
start "Frontend" cmd /c "pnpm run dev"