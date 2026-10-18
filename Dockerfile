# === STAGE 1: Build the Frontend (Node.js) ===
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# === STAGE 2: Set up the Python Backend ===
FROM python:3.11-slim
WORKDIR /app

# 1. Copy and install dependencies directly into the root context
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy the CONTENTS of the backend folder directly into /app
# This ensures main.py is sitting directly at /app/main.py
COPY backend/ .

# 3. Copy the built frontend static files into a public folder at /app/public
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 8080

# 4. Start Uvicorn directly looking for main.py in the current directory
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
