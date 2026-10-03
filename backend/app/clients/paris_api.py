import httpx

from app.core.config import settings


class ParisApiError(Exception):
    """The Paris Open Data API is unreachable or returned an error."""


class ParisApiClient:
    """Fetches raw records from the 'Que faire à Paris ?' dataset."""

    def __init__(self, http_client: httpx.AsyncClient | None = None) -> None:
        self._http = http_client or httpx.AsyncClient(
            base_url=settings.paris_api_base_url,
            timeout=settings.paris_api_timeout,
        )
        # The export endpoint returns every match in one call (no 100-record page limit).
        self._path = f"/catalog/datasets/{settings.paris_api_dataset}/exports/json"

    async def query(self, where: str, limit: int | None = None) -> list[dict]:
        params = {"where": where}
        if limit:
            params["limit"] = limit
        try:
            response = await self._http.get(self._path, params=params)
            response.raise_for_status()
        except httpx.HTTPError as exc:
            raise ParisApiError(f"Paris API request failed: {exc}") from exc
        return response.json()

    async def close(self) -> None:
        await self._http.aclose()
