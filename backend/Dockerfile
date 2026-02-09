FROM python:3.12-slim

WORKDIR /app

# Keine .pyc-Dateien, saubere Logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Abhängigkeiten installieren
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App- und Frontend-Dateien kopieren
COPY backend/ /app/
COPY frontend/ /app/frontend/

EXPOSE 8000

CMD ["python", "app.py"]
