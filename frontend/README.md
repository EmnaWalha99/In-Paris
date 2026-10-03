# In Paris — frontend

React + TypeScript + Vite.

```bash
npm install
npm run dev     # http://localhost:5173
```

In dev, requests to `/api/*` are proxied to the FastAPI backend on `http://localhost:8000`
(e.g. `fetch('/api/events')` → `GET http://localhost:8000/events`), so start the backend first.
