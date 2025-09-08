from hypixel_api import HypixelPlayer, HypixelGuild, get_core_hypixel_data
from utils import check_valid_uuid
import exceptions
from sqlalchemy import Engine, Connection, text
import time
from metrics_manager import get_engine

HYPIXEL_PLAYER_TTL = 180


def get_hypixel_data(uuid, db_engine: Engine) -> HypixelPlayer:
    if not check_valid_uuid(uuid):
        raise exceptions.InvalidUserUUID()

    with db_engine.begin() as conn:
        if check_hypixel_cache(uuid, conn):
            try:
                hypixel_player = get_hypixel_cache(uuid, conn)
                return hypixel_player
            except RuntimeError:
                print("Failed getting data from hypixel cache, getting live result")
        
        return get_core_hypixel_data(uuid)


def check_hypixel_cache(uuid, conn: Connection) -> bool:
    current_time = time.time()
    cache_time = conn.execute(
        text(
            "SELECT extract(epoch from timestamp) as timestamp FROM hypixel_cache WHERE uuid = :uuid;"
        ),
        {"uuid": uuid},
    ).fetchone()

    if cache_time is None:
        return False

    epoch_cache_time = int(cache_time.timestamp)
    if current_time - epoch_cache_time < HYPIXEL_PLAYER_TTL:
        return True
    else:
        return False


def get_hypixel_cache(uuid, conn: Connection) -> HypixelPlayer:
    cache_data = conn.execute(
        text("SELECT data FROM hypixel_cache WHERE uuid = :uuid;"), {"uuid": uuid}
    ).fetchone()

    try:
        hypixel_player = HypixelPlayer(source="cache", **cache_data.data)
        return hypixel_player
    except Exception as e:
        raise RuntimeError()


def add_to_hypixel_cache(uuid: str, data: HypixelPlayer, db_engine: Engine) -> None:
    with db_engine.begin() as conn:
        conn.execute(
            text(
                """
                INSERT INTO hypixel_cache (uuid, data, timestamp) 
                VALUES (:uuid, :data, NOW())
                ON CONFLICT (uuid)
                DO UPDATE SET 
                    data = EXCLUDED.data,
                    timestamp = NOW()
                """
            ),
            {"uuid": uuid, "data": data.model_dump_json(exclude={"source"})},
        )


if __name__ == "__main__":
    db_engine = get_engine()
    data = get_hypixel_data("3ff2e63ad63045e0b96f57cd0eae708d", db_engine)
    print(data)
