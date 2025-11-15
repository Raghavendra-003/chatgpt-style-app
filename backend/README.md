# Backend (Express + Mock JSON)

## Setup
1. npm install
2. npm run start  (or npm run dev)

Runs on http://localhost:4000

## Endpoints
- POST /api/sessions → { sessionId }
- GET  /api/sessions → { sessions: [...] }
- GET  /api/sessions/:id → { session }
- POST /api/sessions/:id/question → { answer }
- POST /api/sessions/:sessionId/answers/:answerId/feedback → { ok: true }
- GET  /api/health → { ok: true }

Data is persisted in data/sessions.json (mock file).