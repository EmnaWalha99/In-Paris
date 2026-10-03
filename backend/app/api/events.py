from datetime import date, datetime
from typing import Annotated
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Request

from app.clients.paris_api import ParisApiClient
from app.schemas.event import Event, EventList
from app.services import events as service

router = APIRouter(prefix="/events", tags=["events"])


def get_paris_client(request: Request) -> ParisApiClient:
    return request.app.state.paris_client


ClientDep = Annotated[ParisApiClient, Depends(get_paris_client)]


@router.get("", response_model=EventList)
async def list_events(
    client: ClientDep,
    day: Annotated[date | None, Query(alias="date", description="Defaults to today (Paris time)")] = None,
    category: str | None = None,
    limit: Annotated[int, Query(ge=1, le=30)] = 30,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> EventList:
    day = day or datetime.now(ZoneInfo("Europe/Paris")).date()
    return await service.list_events(client, day, category, limit, offset)


@router.get("/{event_id}", response_model=Event)
async def get_event(
    client: ClientDep,
    event_id: Annotated[str, Path(pattern=r"^[A-Za-z0-9_-]+$")],
) -> Event:
    event = await service.get_event(client, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event
