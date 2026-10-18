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

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy Python backend code
COPY backend/ ./backend/

# Copy the built frontend static files directly into the backend public folder
# (If your frontend framework uses 'build' instead of 'dist', change 'dist' to 'build' below)
COPY --from=frontend-build /app/frontend/dist ./backend/public

EXPOSE 8080

# Command to start your Python server (assuming FastAPI/Uvicorn, adjust if using Flask)
ENV PYTHONPATH=/app
CMD ["uvicorn", "main:app", "--app-dir", "backend", "--host", "0.0.0.0", "--port", "8080"]
