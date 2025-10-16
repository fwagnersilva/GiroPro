# Stage 1: Build Stage
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Production Stage
FROM node:20-slim AS production

# Set working directory
WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose the port the app runs on (Cloud Run will set the PORT env var)
EXPOSE 8080

# Command to run the application
CMD [ "npm", "start" ]
