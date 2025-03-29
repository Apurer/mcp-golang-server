# Use an official Node.js image as the base image
FROM node:18

# Install Golang
RUN apt-get update && apt-get install -y golang && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install && npm install -g typescript

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Ensure the server file has executable permissions
RUN chmod +x ./dist/server.js

# Set the entrypoint to node with the path to the JS file
ENTRYPOINT ["node", "./dist/index.js"]

# CMD will be appended to ENTRYPOINT
# This allows passing arguments to the MCP server through docker run
CMD []