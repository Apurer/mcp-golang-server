# Stage 1: Go Builder - Get the latest Go installation
FROM golang:latest AS go-builder
# (No extra commands are needed here; we simply use the image's Go installation)

# Stage 2: Node Builder - Build the Node.js application
FROM node:18 AS node-builder
WORKDIR /app
# Copy package files and install dependencies along with TypeScript
COPY package.json package-lock.json ./
RUN npm install && npm install -g typescript
# Copy all application code and compile TypeScript to JavaScript
COPY . .
RUN npx tsc
# Ensure the built server file has executable permissions
RUN chmod +x ./dist/server.js

# Stage 3: Final image based on Ubuntu
FROM ubuntu:latest

# Copy Node.js binaries and libraries from the Node builder stage
COPY --from=node-builder /usr/local/ /usr/local/
# Copy the Go installation from the Go builder stage
COPY --from=go-builder /usr/local/go /usr/local/go

# Set Go environment variables and update PATH so both Go and Node are available
ENV GOROOT=/usr/local/go
ENV GOPATH=/go
ENV PATH="/usr/local/go/bin:/usr/local/bin:${PATH}"

# Set the working directory and copy the built application from the Node builder
WORKDIR /app
COPY --from=node-builder /app .

# Set the entrypoint to run the Node.js application
ENTRYPOINT ["node", "./dist/index.js"]
# CMD will be appended to ENTRYPOINT (allows passing arguments via docker run)
CMD []
