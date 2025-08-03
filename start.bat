@echo off

echo launching FastAPI server...
SET VENV_PYTHON=.venv\Scripts\python.exe
.venv\Scripts\uvicorn.exe main:app --reload

echo finished
pause