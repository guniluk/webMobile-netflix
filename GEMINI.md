# MERN Netflix Clone

A full-stack Netflix clone built using the MERN (MongoDB, Express, React, Node.js) stack. The backend API is partially implemented with core authentication and initial TMDB integration.

## Project Overview

- **Backend**: Node.js and Express. Uses ESM (`import/export`) syntax.
- **Frontend**: React (Directory initialized, UI implementation pending).
- **Database**: MongoDB via Mongoose. Connection logic implemented.
- **Authentication**: JWT based authentication with `bcryptjs` for password hashing. Signup, Login, and Logout features are functional.
- **Services**: TMDB API integration for movie and TV show data fetching.

## Directory Structure

- `backend/`: Express server and API implementation.
  - `config/`: Configuration files (e.g., database connection).
  - `controllers/`: Business logic for different routes.
  - `models/`: Mongoose schemas and models.
  - `routes/`: API route definitions.
  - `services/`: External service integrations (e.g., TMDB).
  - `utils/`: Helper functions and utilities.
  - `server.js`: Entry point for the backend.
  - `.env`: Environment variables (Secrets and configuration).
- `frontend/`: React frontend application.

## Building and Running

### Prerequisites

- Node.js installed.
- MongoDB connection string (`MONGO_URI` in `.env`).
- TMDB API Key (`TMDB_API_KEY` in `.env`).

### Commands

| Command       | Description                            |
| :------------ | :------------------------------------- |
| `npm install` | Install root dependencies.             |
| `npm run dev` | Run the backend server with `nodemon`. |
| `npm start`   | Run the backend server with `node`.    |

## Development Conventions

- **Module System**: The project uses ES Modules (`"type": "module"` in `package.json`). Always use `.js` extensions in imports (e.g., `import x from './y.js'`).
- **API Versioning**: All backend routes are prefixed with `/api/v1/` (e.g., `/api/v1/auth`).
- **Response Format**: Standardized JSON responses with `success` (boolean) and `message` or `user`/`content`.
