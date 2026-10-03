# In Paris — frontend

React + TypeScript + Vite app: events in Paris by day and category, with a list and a map.

## Requirements

- Node.js 20+
- The backend running on http://localhost:8000 (see [`../backend/README.md`](../backend/README.md))

## Run

From the `frontend/` folder:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

In development, requests to `/api/*` are proxied to the backend (`/api/events` → `http://localhost:8000/events`), so no CORS setup is needed.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |

## Configuration

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | Backend base URL (set it when the backend is not behind the dev proxy) |

## Stack

Tailwind CSS v4 (design tokens in `src/index.css`), react-leaflet for the map (Esri tiles, no key), date-fns for dates.

## Structure

```
src/
├── App.tsx              page layout and UI state (day, category, selected event)
├── api.ts               fetchEvents (the only place that calls the backend)
├── types.ts             API types, mirroring the backend schema
├── config.ts            settings: API URL, page size, map centre/zoom/tiles
├── texts.ts             all UI copy (French)
├── categories.ts        category labels and colours
├── hooks/useEvents.ts   loading, errors, pagination ("load more")
├── utils/
│   ├── format.ts        dates, session times, durations, prices
│   └── location.ts      venue, address, coordinates
└── components/
    ├── ui/              Pill, Icon, CopyButton, StatusMessage
    ├── layout/          Header, Footer, MobileViewToggle
    ├── events/          DayPicker, CategoryBar, CategoryTag, EventList, EventCard, EventListSkeleton
    └── map/             EventMap, EventMarker, MapPopupCard, MapControls
```
