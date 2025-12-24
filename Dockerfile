# Use an official Node.js runtime as the base image
FROM node:24

# Create and set the working directory in the container
WORKDIR /app

# Copy only the necessary files for dependency installation
COPY package.json yarn.lock ./

# Install project dependencies using Yarn
RUN yarn install  --check-files

# Copy the rest of the application files
COPY . .

# Build your Next.js / React.js application
RUN yarn build

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
