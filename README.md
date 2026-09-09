# FitTrack

A modernized MERN fitness tracking app.

## Stack

- React 19 + Vite 8
- React Router 7
- Material UI 9 + MUI X Charts/Date Pickers
- Redux Toolkit + React Redux
- Styled Components
- Axios + Day.js
- Node.js + Express 5
- MongoDB + Mongoose 9
- bcrypt 6 + JWT

## Requirements

Use a current Node.js release. Vite 8 requires Node.js 20.19+ or 22.12+.

## Run locally

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env and set MONGODB_URL and JWT
npm run dev
```

The API runs on `http://localhost:8080`.

### 2. Frontend

The frontend runs on `http://localhost:3000`.

## Production build

```bash
cd client
npm run build
npm run preview
```

## Important

Before deploying, set:

- `server/.env`: `MONGODB_URL`, `JWT`, `CLIENT_URL`
- `client/.env`: `VITE_API_URL`

## Deploy the backend on Render

This repository includes a `render.yaml` blueprint for the backend only. In Render, create a new Blueprint and select this repository. The service uses:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

Set these environment variables on the Render service:

- `MONGODB_URL`: a MongoDB Atlas connection string. `127.0.0.1` refers to the Render container, not your computer.
- `JWT`: a long random secret
- `CLIENT_URL`: the URL where your local frontend is served, normally `http://localhost:3000`

If Node reports `querySrv ECONNREFUSED` while MongoDB Compass connects successfully, use Atlas's standard `mongodb://` driver connection string instead of the `mongodb+srv://` string. Keep the same username, password, database name, TLS option, `authSource`, and replica set values.

To run the frontend locally against the deployed backend, create `client/.env` with:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Do not commit either `.env` file or production secrets. `VITE_API_URL` is read when Vite starts, so restart the local frontend after changing it.
