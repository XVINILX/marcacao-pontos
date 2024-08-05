# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /src/

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install the Yarn package manager
RUN corepack enable

# Install the dependencies specified in package.json
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .



# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Expose the port the app runs on
EXPOSE 8000

# Define environment variable for production
ENV NODE_ENV=production

# Start the Node.js application
CMD ["sh", "-c", "yarn migrate && yarn start"]
