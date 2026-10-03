# In Paris — backend

FastAPI API that serves Paris events from the [Que faire à Paris ?](https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/) Open Data dataset (no API key needed).

## Requirements

- Python 3.12+

## Run

From the `backend/` folder:

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload
```

The API runs on http://localhost:8000. Interactive docs: http://localhost:8000/docs.

## Tests

```bash
pytest
```

The tests mock the Paris API, so they run without network access.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/events?date=YYYY-MM-DD&category=concert&arrondissement=5&arrondissement=11&limit=30&offset=0` | Events with a session on that day (default: today, Paris time), sorted by time |
| GET | `/events/{id}` | One event with all its sessions |
| GET | `/health` | Health check |

`category` is one of `concert`, `theatre`, `danse`, `expo`, `sport`, `enfants`, `atelier`, `autre`. `arrondissement` (1–20) can be repeated to select several.

## Configuration

Settings are read from `.env` in development and `.env.prod` in production (both git-ignored, copied from `.env.example`):

| Variable | Description |
|---|---|
| `PARIS_API_BASE_URL` | Opendatasoft API base URL |
| `PARIS_API_DATASET` | Dataset id |
| `PARIS_API_TIMEOUT` | Request timeout in seconds |
| `ENVIRONMENT` | `development` or `production` (production hides `/docs`) |

## Structure

```
app/
├── main.py            app setup, shared HTTP client, error handler
├── api/events.py      routes and parameter validation
├── services/events.py day/category filtering, sorting, pagination
├── clients/paris_api.py  calls to the Paris Open Data API
├── utils/mappers.py   raw API record -> Event (the only place that knows the API field names)
├── schemas/event.py   Pydantic models returned by the API
└── core/config.py     settings
```
