# Stage 1: Build the React app
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the correct subdirectory
COPY package*.json ./

# Accept build-time ARG for the API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Install dependencies

# Copy the entire application files from the frontend folder
COPY  . .

RUN npm install -g serve
RUN npm install

# Build the React app
RUN npm run build

EXPOSE 8080

CMD ["serve", "-s", "-l", "8080", "./build"]

