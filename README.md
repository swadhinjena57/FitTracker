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
