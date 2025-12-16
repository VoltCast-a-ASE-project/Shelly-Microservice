FROM node:20-bullseye AS build

WORKDIR /app

# Install build tools for native modules
RUN apt-get update && apt-get install -y \
    python3 make g++ sqlite3 libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy project files
COPY service.js .
COPY VMC/controllers/ VMC/controllers/
COPY VMC/models/ VMC/models/
COPY VMC/routes/ VMC/routes/
COPY database/ database/
COPY swagger.js .

# Generate swagger docs
RUN npm run swagger


FROM node:20-bullseye

WORKDIR /app

# Copy from build stage
COPY --from=build /app ./

# Set environment
ENV NODE_ENV=production

# Make database persistent
VOLUME ["/app/database"]

# Non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser

# Expose port
EXPOSE 8083

# Start service
CMD ["node", "service.js"]
