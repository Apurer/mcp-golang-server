# Stage 1: Go Builder - Get the latest Go installation
FROM golang:latest AS go-builder

# Stage 2: Python Builder - Install Python and dependencies
FROM python:3.10-slim AS python-builder
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code and test files
COPY . .

# Run tests during the build process
RUN python -m unittest discover -s . -p "test_*.py"

# Stage 3: Final image based on Python base
FROM python:3.10-slim

# Install additional dependencies
RUN apt-get update && apt-get install -y git

# Copy Go installation from the Go builder stage
COPY --from=go-builder /usr/local/go /usr/local/go

# Copy Python dependencies from the Python builder stage
COPY --from=python-builder /usr/local/lib/python3.10 /usr/local/lib/python3.10
COPY --from=python-builder /usr/local/bin /usr/local/bin

# Set Go environment variables and update PATH
ENV GOROOT=/usr/local/go
ENV GOPATH=/go
ENV PATH="/usr/local/go/bin:/usr/local/bin:${PATH}"

# Set the working directory and copy the Python application
WORKDIR /app
COPY . .

# Set the entrypoint to run the Python application
ENTRYPOINT ["python3.10", "server.py"]
CMD []