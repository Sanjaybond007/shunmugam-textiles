# Multi-stage build for production
FROM node:18-alpine as backend

# Set working directory for backend
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/ ./server/

# Install backend dependencies
RUN npm install --only=production

# Expose port
EXPOSE 10000

# Start the server
CMD ["npm", "start"]
