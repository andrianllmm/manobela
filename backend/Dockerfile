FROM python:3.12-slim

# Set working dir
WORKDIR /app

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Ensure stdout/stderr are unbuffered
ENV PYTHONUNBUFFERED=1

# Default port (fallback if not provided)
ENV PORT=8000

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Expose dynamic port
EXPOSE ${PORT}

# Run the app
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
