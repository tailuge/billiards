FROM node:22-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the entire repository into the container
COPY . .

# Expose the application port
EXPOSE 10000

# Command to run the application
CMD ["node", "dist/server.js"]

