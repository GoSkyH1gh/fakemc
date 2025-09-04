FROM python:3.14

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# This copies ALL files in your folder (except those in .dockerignore)
COPY . .

EXPOSE 8000

# If your FastAPI app is called "app" inside main.py:
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]