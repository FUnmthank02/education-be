# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .
COPY prisma ./prisma

# Expose the application port
EXPOSE 8888

# Run the NestJS application
CMD ["sh", "-c", "npm run start"]
