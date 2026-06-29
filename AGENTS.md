# AGENTS

This file is intended for AI coding agents working in the `mern-netflix` repository.

## What this repo is

- Full-stack MERN Netflix clone.
- **Backend**: Node.js + Express + MongoDB/Mongoose using ES Modules. Serves both Web and Mobile client requests.
- **Frontend (Web)**: React + Vite + Zustand + Tailwind CSS under `frontend/`.
- **Frontend (Mobile)**: Expo (React Native) + TypeScript + Expo Router + Zustand + AsyncStorage under `mobile/`.
- **Auth**: JWT-based authentication. Supports both cookie-based authentication (for web) and Authorization Header (`Bearer <token>`) authentication (for mobile).
- **External service**: TMDB API integration for movie/TV data.

## Important docs

- `PROJECT_ANALYSIS.md` — detailed architecture, file structures, and implementation notes.
- `GEMINI.md` — project overview, build scripts, and high-level conventions.
- `README.md` — guide on how to setup and run the web, backend, and mobile applications.

## Key commands

### Root level
- `npm install` — install root dependencies.
- `npm run dev` — run backend and web frontend concurrently.
- `npm run dev:frontend` — run web frontend only.
- `npm run dev:backend` — run backend only.

### Mobile level (under `mobile/`)
- `npm install` — install mobile dependencies.
- `npm start` / `npx expo start` — start Metro bundler for Expo.
- `npm run android` — start Expo and open in Android emulator.
- `npm run ios` — start Expo and open in iOS simulator.
- `npm run lint` — check for TypeScript & React Native linting errors.

## Backend conventions

- Backend entry point: `backend/server.js`.
- All backend routes are mounted under `/api/v1/`.
- Protected routes use `protectRoute` middleware in `backend/middleware/protectRoute.js`. It retrieves JWT token from cookie `jwt-netflix` (Web) or `Authorization: Bearer <token>` header (Mobile).
- The backend is ESM; import paths must include `.js` extensions.
- `backend/config/db.js`, `backend/utils/generateToken.js`, and `backend/.env` are central configuration points.
- Common backend folders:
  - `backend/controllers/`
  - `backend/routes/`
  - `backend/models/`
  - `backend/services/`
  - `backend/utils/`

## Frontend (Web) conventions

- Frontend app lives in `frontend/`.
- `frontend/vite.config.js` proxies `/api` requests to backend port `5000`.
- Global state uses Zustand stores in `frontend/src/store/`.

## Frontend (Mobile) conventions

- Mobile app lives in `mobile/`. It utilizes Expo SDK 54 and Expo Router for file-based navigation.
- Global state uses Zustand stores in `mobile/store/`.
- Dynamic backend IP detection is set up in `mobile/store/api.ts` utilizing `Constants.expoConfig?.hostUri` to seamlessly connect local Expo Go devices with the backend running on the developer's PC.
- Common mobile folders:
  - `mobile/app/` — Expo Router screens.
  - `mobile/components/` — Reusable UI components.
  - `mobile/store/` — Zustand stores and api configs.

## How to use this guidance

Follow the existing repository architecture. Preserve the separation of concerns between backend, web frontend, and mobile app. Consult `PROJECT_ANALYSIS.md` for architecture details and `README.md` for local run setups.

## Notes for AI agents

- Ensure robust error handling for all API routes, returning appropriate HTTP status codes and JSON formats.
- Auth endpoints (`signupController` and `loginController`) must set the JWT cookie AND return the `token` string in the response body so that the mobile app can store it.
- Keep changes compatible with both Vite proxy setup and React Native fetch requests.
