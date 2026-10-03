import httpx
import pytest
from fastapi.testclient import TestClient

from app.api.events import get_paris_client
from app.clients.paris_api import ParisApiClient
from app.main import app


def make_record(id="1", occurrences="2026-10-05T20:00:00+02:00_2026-10-05T22:00:00+02:00", **fields) -> dict:
    """A raw Paris API record with sensible defaults."""
    return {
        "id": id,
        "title": f"Event {id}",
        "lead_text": "Une soirée jazz.",
        "occurrences": occurrences,
        "qfap_tags": "Concert;Festival",
        "address_name": "Le Son de la Terre",
        "address_street": "2 Port de Montebello",
        "address_zipcode": "75005",
        "address_city": "Paris 05",
        "lat_lon": {"lat": 48.851503, "lon": 2.351091},
        "price_type": "payant",
        "price_detail": "<p>Billetterie&nbsp;: 25 EUR</p>",
        "access_link": "https://tickets.example/1",
        **fields,
    }


@pytest.fixture
def api_client_factory():
    """Build a TestClient whose Paris API calls are answered by `handler` (no network)."""

    def make_client(handler) -> TestClient:
        http = httpx.AsyncClient(base_url="https://paris.test", transport=httpx.MockTransport(handler))
        app.dependency_overrides[get_paris_client] = lambda: ParisApiClient(http_client=http)
        return TestClient(app)

    yield make_client
    app.dependency_overrides.clear()
