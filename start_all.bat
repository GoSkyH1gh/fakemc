@echo off
echo Starting backend...
cd backend
start "Backend" cmd /c "uv run fastapi dev"

echo Starting frontend...
cd ..
cd frontend
start "Frontend" cmd /c "pnpm run dev"
