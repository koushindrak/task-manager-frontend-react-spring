# Use Node.js 10 as the base image
FROM node:10

# Install qemu-user-static for emulation support
RUN apt-get update && \
    apt-get install -y qemu-user-static && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .
# Generate the DLL manifest file
RUN npm run build:dll

# Build the ReactJS application
RUN npm run build
# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
