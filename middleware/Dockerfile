# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose port
EXPOSE 3333

RUN npm run build

#  change directory to dist
WORKDIR /app/dist

# Start middleware
CMD ["npm", "start"]
