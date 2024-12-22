FROM node:22-alpine

WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the entire repository into the container
COPY . .

# Expose the application port
EXPOSE 8888

# Command to run the application
CMD ["nodemon", "src/network/server/server.ts"]

