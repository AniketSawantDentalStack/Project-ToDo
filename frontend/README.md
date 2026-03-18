# Momentum ToDo Frontend

Interactive React frontend for an existing Spring Boot ToDo backend.

## Features

- Create, edit, delete, and toggle todo items through your `/api/todos` API
- Fast search and status filters
- Live progress ring and summary cards
- Responsive, animated dashboard UI
- Vite dev proxy for a backend running on `http://localhost:8080`

## Run locally

1. Open a terminal in `frontend/`
2. Install dependencies with `npm install`
3. Start the frontend with `npm run dev`

## Backend connection

- Default development mode assumes your backend is already running on `http://localhost:8080`
- If you want to call a different backend URL directly, copy `.env.example` to `.env` and update `VITE_API_BASE_URL`

## Expected API

- `GET /api/todos`
- `POST /api/todos`
- `PUT /api/todos/{id}`
- `DELETE /api/todos/{id}`
