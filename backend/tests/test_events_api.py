import httpx

from tests.conftest import make_record


def respond_with(records, seen=None):
    def handler(request: httpx.Request) -> httpx.Response:
        if seen is not None:
            seen.update(request.url.params)
        return httpx.Response(200, json=records)

    return handler


def test_list_events_keeps_only_sessions_on_that_day(api_client_factory):
    records = [
        make_record("late", "2026-10-05T21:00:00+02:00_2026-10-05T23:00:00+02:00"),
        make_record("early", "2026-10-04T10:00:00+02:00_;2026-10-05T09:00:00+02:00_"),
        make_record("other-day", "2026-10-06T20:00:00+02:00_2026-10-06T22:00:00+02:00"),
    ]
    seen = {}
    client = api_client_factory(respond_with(records, seen))

    body = client.get("/events", params={"date": "2026-10-05"}).json()

    assert body["total"] == 2
    assert [e["id"] for e in body["items"]] == ["early", "late"]  # sorted by time
    assert len(body["items"][0]["sessions"]) == 1  # only the 2026-10-05 session
    assert "occurrences is not null" in seen["where"]


def test_list_events_filters_by_category(api_client_factory):
    records = [make_record("concert"), make_record("expo", qfap_tags="Expo")]
    client = api_client_factory(respond_with(records))

    body = client.get("/events", params={"date": "2026-10-05", "category": "expo"}).json()

    assert [e["id"] for e in body["items"]] == ["expo"]


def test_list_events_filters_by_arrondissements(api_client_factory):
    records = [
        make_record("5e", address_zipcode="75005"),
        make_record("11e", address_zipcode="75011"),
        make_record("18e", address_zipcode="75018"),
    ]
    client = api_client_factory(respond_with(records))

    body = client.get("/events", params={"date": "2026-10-05", "arrondissement": [5, 11]}).json()

    assert sorted(e["id"] for e in body["items"]) == ["11e", "5e"]


def test_list_events_pagination(api_client_factory):
    records = [make_record(str(i), f"2026-10-05T{10 + i}:00:00+02:00_") for i in range(5)]
    client = api_client_factory(respond_with(records))

    body = client.get("/events", params={"date": "2026-10-05", "limit": 2, "offset": 2}).json()

    assert body["total"] == 5
    assert [e["id"] for e in body["items"]] == ["2", "3"]


def test_list_events_rejects_invalid_params(api_client_factory):
    client = api_client_factory(respond_with([]))

    assert client.get("/events", params={"limit": 31}).status_code == 422
    assert client.get("/events", params={"date": "not-a-date"}).status_code == 422


def test_get_event(api_client_factory):
    seen = {}
    client = api_client_factory(respond_with([make_record("105493")], seen))

    response = client.get("/events/105493")

    assert response.status_code == 200
    assert response.json()["id"] == "105493"
    assert seen["where"] == 'id = "105493"'


def test_get_event_not_found(api_client_factory):
    assert api_client_factory(respond_with([])).get("/events/999").status_code == 404


def test_get_event_rejects_unsafe_id(api_client_factory):
    assert api_client_factory(respond_with([])).get('/events/1" OR "1"="1').status_code == 422


def test_upstream_error_returns_502(api_client_factory):
    client = api_client_factory(lambda request: httpx.Response(500))

    response = client.get("/events")

    assert response.status_code == 502
    assert response.json()["detail"] == "Upstream events provider unavailable"
