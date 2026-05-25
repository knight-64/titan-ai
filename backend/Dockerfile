# Dockerfile for Titan Backend

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Run server
CMD ["npm", "start"]
