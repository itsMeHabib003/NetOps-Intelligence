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

# 1. Copy dependencies and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy backend files and immediately list out what got copied
COPY backend/ .
RUN ls -la /app

# 3. Copy the built frontend static files
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 8080

# 4. Invoke Uvicorn as a direct Python executable module (highly robust)
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
