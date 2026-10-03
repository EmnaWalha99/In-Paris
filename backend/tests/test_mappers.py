from app.utils.mappers import map_event
from tests.conftest import make_record


def test_map_event():
    event = map_event(make_record())

    assert event.id == "1"
    assert event.description == "Une soirée jazz."
    assert event.tags == ["Concert", "Festival"]
    assert event.price_detail == "Billetterie : 25 EUR"
    assert event.is_free is False
    assert event.location.name == "Le Son de la Terre"
    assert event.location.address == "2 Port de Montebello, 75005 Paris 05"
    assert (event.location.lat, event.location.lon) == (48.851503, 2.351091)


def test_map_event_sessions():
    occurrences = (
        "2026-10-05T20:00:00+02:00_2026-10-05T22:00:00+02:00;"
        "2026-10-12T20:00:00+02:00_2026-10-12T22:00:00+02:00"
    )
    sessions = map_event(make_record(occurrences=occurrences)).sessions

    assert [s.start.isoformat() for s in sessions] == ["2026-10-05T20:00:00+02:00", "2026-10-12T20:00:00+02:00"]
    assert sessions[0].end.isoformat() == "2026-10-05T22:00:00+02:00"


def test_map_event_address_falls_back_to_free_text():
    record = make_record(address_street=None, address_zipcode=None, address_city=None)
    record["locations"] = [{"text": "Rue de la Perle, Paris 3e"}]

    assert map_event(record).location.address == "Rue de la Perle, Paris 3e"


def test_map_event_missing_fields():
    event = map_event({"id": 7})

    assert event.title == "Sans titre"
    assert event.tags == []
    assert event.sessions == []
    assert event.location.address is None
    assert event.location.lat is None


def test_map_event_category():
    assert map_event(make_record(qfap_tags="Concert;Festival")).category == "concert"
    assert map_event(make_record(qfap_tags="Atelier;Enfants")).category == "enfants"
    assert map_event(make_record(qfap_tags="Conférence")).category == "autre"
