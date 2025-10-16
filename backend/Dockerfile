# Stage 1: Build Stage
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm install -g pnpm
RUN pnpm install --prod

# Copy source code
COPY . .

# Build the TypeScript application
RUN pnpm run build

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
# Cloud Run requires the application to listen on the port specified by the PORT environment variable.
# The default start script is "start": "node dist/server.js"
CMD [ "npm", "start" ]
