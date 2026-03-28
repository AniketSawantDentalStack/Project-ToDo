FROM node:20-alpine AS todo-interactive-frontend-build
WORKDIR /app/todo-interactive-frontend

ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS todo-interactive-frontend
WORKDIR /usr/share/nginx/html

COPY --from=todo-interactive-frontend-build /app/todo-interactive-frontend/dist ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
