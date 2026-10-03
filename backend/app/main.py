from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.events import router as events_router
from app.clients.paris_api import ParisApiClient, ParisApiError
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # One shared HTTP client (connection pooling) for the whole app lifetime.
    app.state.paris_client = ParisApiClient()
    yield
    await app.state.paris_client.close()


# The interactive docs are only exposed outside production.
docs = {} if not settings.is_production else {"docs_url": None, "redoc_url": None, "openapi_url": None}
app = FastAPI(title="Paris Events API", version="1.0.0", lifespan=lifespan, **docs)
app.include_router(events_router)


@app.exception_handler(ParisApiError)
async def paris_api_error_handler(request: Request, exc: ParisApiError) -> JSONResponse:
    return JSONResponse(status_code=502, content={"detail": "Upstream events provider unavailable"})


@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
