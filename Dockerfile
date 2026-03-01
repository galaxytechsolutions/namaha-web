# Use official Node.js LTS image
FROM node:20-alpine

# Disable husky in Docker to avoid errors
ENV HUSKY=0

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (including dev if needed)
RUN npm install

# Copy the rest of the application
COPY . .

# Expose app port
EXPOSE 3000

# Start the server
CMD ["node", "src/server.js"]
