# SiteBuilder – Drag-and-drop Website Maker (React + Node + MongoDB + Tailwind)

## Stack
- React 19 (Vite + TS) with Tailwind, dnd-kit, React Router, Zustand, React Query
- Node.js (Express), MongoDB (Mongoose), Zod, JWT auth, Nodemailer (optional), OpenAI (optional)

## Monorepo Layout
- `server`: Express API server
- `client`: Vite React frontend

## Quick Start
1) Backend
```bash
cd server
cp .env.example .env
# edit .env for MongoDB, JWT, SMTP, OPENAI
npm run dev
```

2) Frontend
```bash
cd client
npm install
npm run dev
```

The frontend proxies `/api` to `http://localhost:4000`.

## Features
- Email/password auth with JWT
- Sites CRUD and drag-and-drop editor
- Publish to public slug `/p/:slug`
- AI content generation endpoint and UI

## Environment Variables (server/.env)
- `PORT` default 4000
- `MONGODB_URI` Mongo connection string
- `JWT_SECRET` secret for signing tokens
- `OPENAI_API_KEY` for AI generation (optional)
- `SMTP_*` for email if needed (optional)
