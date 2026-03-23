---
title: AI Career Platform
emoji: "🚀"
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# AI Career Platform

## Features
- Career suggestion using AI
- Roadmap visualization
- Dashboard with progress tracking
- AI mentor chat
- Interview preparation
- Skill gap analyzer
- Career comparison
- Resume analyzer
- Dark mode, PDF download, copy actions, and local persistence

## Tech Stack
React, Tailwind CSS, Node.js, Express, Gemini API, Hugging Face fallback, LocalStorage

## Local Setup
1. Install root dependencies if needed: `npm install`
2. Install frontend dependencies: `cd client && npm install`
3. Install backend dependencies: `cd server && npm install`
4. Create environment files from the examples below
5. Start backend: `cd server && npm start`
6. Start frontend: `cd client && npm run dev`

## Environment Variables

### Frontend: `client/.env`
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend: `server/.env`
```env
GEMINI_API_KEY=your_gemini_api_key
HF_API_KEY=your_huggingface_api_key
CLIENT_URL=https://your-app.vercel.app
PORT=5000
```

## AI Fallback Strategy
1. Gemini is used as the primary provider
2. If Gemini fails or hits limits, Hugging Face is used as backup
3. If both fail, the backend returns built-in static fallback responses

## Single Server Production Run
```bash
npm run build
npm start
```

## Deploy

### Frontend on Hugging Face Spaces
This repository includes a Docker setup for Hugging Face Spaces. The Space builds the `client` app and serves the static output on port `7860`.

### Backend on Render
Use your Render backend for API requests. In production the frontend points to:
`https://ai-career-platformm.onrender.com/api`
