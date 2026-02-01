FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/web/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY apps/web .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
