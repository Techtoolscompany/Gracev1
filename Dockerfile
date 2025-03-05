# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install dependencies with the legacy peer deps flag to avoid conflicts
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on (default for Next.js is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
