from datetime import date, timedelta

from app.clients.paris_api import ParisApiClient
from app.schemas.event import Event, EventList
from app.utils.mappers import map_event


async def list_events(
    client: ParisApiClient,
    day: date,
    category: str | None = None,
    limit: int = 30,
    offset: int = 0,
) -> EventList:
    """Events with a session on `day`, sorted by time, each with only that day's sessions."""
    # The API can't filter on an exact session day, so it returns the candidates
    # (dated events whose range covers the day, ±1 day for UTC/Paris offsets)
    # and the exact filtering is done here.
    where = (
        "occurrences is not null"
        f' and date_start <= "{day + timedelta(days=1)}"'
        f' and date_end >= "{day - timedelta(days=1)}"'
    )
    events = [map_event(record) for record in await client.query(where)]

    matches = []
    for event in events:
        sessions = [s for s in event.sessions if s.start.date() == day]
        if sessions and (not category or event.category == category):
            matches.append(event.model_copy(update={"sessions": sessions}))
    matches.sort(key=lambda event: event.sessions[0].start)

    return EventList(total=len(matches), items=matches[offset : offset + limit])


async def get_event(client: ParisApiClient, event_id: str) -> Event | None:
    # event_id is validated by the route (alphanumeric only), so it is safe to inline.
    records = await client.query(f'id = "{event_id}"', limit=1)
    return map_event(records[0]) if records else None
