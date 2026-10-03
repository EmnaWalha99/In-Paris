"""Map raw 'Que faire à Paris ?' records to our Event model.

This is the only module that knows the Paris API field names.
"""

import html
import re
from datetime import datetime

from app.schemas.event import Event, Location, Session

# Main category -> Paris API tags. Order matters: the first match wins.
CATEGORIES = {
    "concert": {"Concert"},
    "theatre": {"Théâtre", "Humour"},
    "danse": {"Danse", "Spectacle musical", "Cirque"},
    "expo": {"Expo", "Art contemporain", "Peinture", "Photo", "Street-art", "BD"},
    "sport": {"Sport"},
    "enfants": {"Enfants"},
    "atelier": {"Atelier", "Loisirs", "Balade urbaine", "Gourmand", "Brocante"},
}


def _text(value) -> str | None:
    """Strip strings and turn empty values into None."""
    if value is None:
        return None
    return str(value).strip() or None


def _strip_html(value) -> str | None:
    """'<p>Tarif&nbsp;: 12 €</p>' -> 'Tarif : 12 €'."""
    if not value:
        return None
    text = html.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"<br\s*/?>|</p>", "\n", value)))
    lines = (" ".join(line.split()) for line in text.splitlines())
    return "\n".join(line for line in lines if line) or None


def _datetime(value) -> datetime | None:
    try:
        return datetime.fromisoformat(value)
    except (TypeError, ValueError):
        return None


def _sessions(occurrences: str | None) -> list[Session]:
    """'2026-10-05T20:00+02:00_2026-10-05T22:00+02:00;...' -> [Session, ...]."""
    sessions = []
    for part in (occurrences or "").split(";"):
        start, _, end = part.partition("_")
        if start_dt := _datetime(start):
            sessions.append(Session(start=start_dt, end=_datetime(end)))
    return sessions


def _category(tags: list[str]) -> str:
    for category, category_tags in CATEGORIES.items():
        if category_tags.intersection(tags):
            return category
    return "autre"


def _arrondissement(zipcode: str | None) -> int | None:
    """'75005' -> 5, '75116' -> 16 (the 16th has two zip codes), anything outside Paris -> None."""
    if not zipcode or not zipcode.isdigit() or not zipcode.startswith("75"):
        return None
    number = int(zipcode[2:]) % 100
    return number if 1 <= number <= 20 else None


def _location(record: dict) -> Location:
    zipcode = _text(record.get("address_zipcode"))
    city = " ".join(filter(None, [zipcode, _text(record.get("address_city"))]))
    address = ", ".join(filter(None, [_text(record.get("address_street")), city]))
    # Some events (street markets...) only have a free-text place in `locations`.
    locations = record.get("locations") or [{}]
    lat_lon = record.get("lat_lon") or {}
    return Location(
        name=_text(record.get("address_name")),
        address=address or _strip_html(locations[0].get("text")),
        arrondissement=_arrondissement(zipcode),
        lat=lat_lon.get("lat"),
        lon=lat_lon.get("lon"),
    )


def map_event(record: dict) -> Event:
    tags = [tag.strip() for tag in (record.get("qfap_tags") or "").split(";") if tag.strip()]
    return Event(
        id=str(record["id"]),
        title=_text(record.get("title")) or "Sans titre",
        description=_text(record.get("lead_text")),
        category=_category(tags),
        tags=tags,
        sessions=_sessions(record.get("occurrences")),
        location=_location(record),
        price_type=_text(record.get("price_type")),
        price_detail=_strip_html(record.get("price_detail")),
        is_free=record.get("price_type") == "gratuit",
        image_url=_text(record.get("cover_url")),
        url=_text(record.get("url")),
        ticket_url=_text(record.get("access_link")),
    )
