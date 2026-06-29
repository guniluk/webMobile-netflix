# AGENTS

This file is intended for AI coding agents working in the `mern-netflix` repository.

## What this repo is
- Full-stack MERN Netflix clone.
- Backend: Node.js + Express + MongoDB/Mongoose using ES Modules.
- Frontend: React + Vite + Zustand + Tailwind CSS under `frontend/`.
- Auth: JWT cookie-based authentication.
- External service: TMDB API integration for movie/TV data.

## Important docs
- `PROJECT_ANALYSIS.md` — detailed architecture and implementation notes.
- `GEMINI.md` — project overview, build scripts, and high-level conventions.
- `frontend/README.md` — frontend-specific Vite/React information.

## Key commands
- `npm install` — install root dependencies.
- `npm run dev` — run backend and frontend concurrently.
- `npm start` — run backend only.
- `npm run dev:frontend` — run frontend only.
- `npm run dev:backend` — run backend only.

## Backend conventions
- Backend entry point: `backend/server.js`.
- All backend routes are mounted under `/api/v1/`.
- Protected routes use `protectRoute` middleware in `backend/middleware/protectRoute.js`.
- The backend is ESM; import paths must include `.js` extensions.
- `backend/config/db.js`, `backend/utils/generateToken.js`, and `.env` are central configuration points.
- Common backend folders:
  - `backend/controllers/`
  - `backend/routes/`
  - `backend/models/`
  - `backend/services/`
  - `backend/utils/`

## Frontend conventions
- Frontend app lives in `frontend/`.
- `frontend/vite.config.js` proxies `/api` requests to backend port `5000`.
- Global state uses Zustand stores in `frontend/src/store/`.

## How to use this guidance
Follow the existing repository architecture and preserve the backend/frontend separation. Prefer working within the current backend and frontend patterns, and consult `PROJECT_ANALYSIS.md` and `GEMINI.md` for architecture reasoning and conventions.

## Notes for AI agents
- Ensure robust error handling for all API routes, including appropriate HTTP status codes and error messages.
- If a JWT token is invalid or missing, respond with a 401 Unauthorized status and a clear error message.
- The frontend relies on the backend for auth checks and TMDB-backed content.
- Keep changes compatible with Vite proxy setup and ESM imports.