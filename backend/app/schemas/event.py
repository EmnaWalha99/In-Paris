from datetime import datetime

from pydantic import BaseModel


class Session(BaseModel):
    start: datetime
    end: datetime | None = None


class Location(BaseModel):
    name: str | None = None
    address: str | None = None
    # None when the API has no position: the frontend skips the map marker.
    lat: float | None = None
    lon: float | None = None


class Event(BaseModel):
    id: str
    title: str
    description: str | None = None
    category: str = "autre"  # concert | theatre | danse | expo | sport | enfants | atelier | autre
    tags: list[str] = []
    sessions: list[Session] = []
    location: Location
    price_type: str | None = None  # "gratuit" | "payant" | "gratuit sous condition"
    price_detail: str | None = None
    is_free: bool = False
    image_url: str | None = None
    url: str | None = None
    ticket_url: str | None = None


class EventList(BaseModel):
    total: int
    items: list[Event]
