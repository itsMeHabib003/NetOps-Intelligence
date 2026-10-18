# Step 1: Build the app using Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the static files using Nginx
FROM nginx:alpine
# NOTE: If using Vite, use /app/dist. If using Create React App, use /app/build.
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
