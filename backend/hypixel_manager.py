from hypixel_api import (
    HypixelPlayer,
    HypixelGuild,
    HypixelFullData,
    get_core_hypixel_data,
    get_guild_data,
)
from utils import check_valid_uuid
import exceptions
from sqlalchemy import Engine, Connection, text
from sqlalchemy.orm import Session
import time
from metrics_manager import get_engine
from typing import Tuple, Optional, Union
from fastapi import HTTPException

# in seconds
HYPIXEL_TTL = 180

# TODO move caching here from background tasks


def get_hypixel_data(uuid, session: Session) -> HypixelFullData:
    if not check_valid_uuid(uuid):
        raise exceptions.InvalidUserUUID()

    player_data = None
    guild_data = None
    guild_id = None

    hypixel_cache_valid = check_hypixel_cache(uuid, session)
    if hypixel_cache_valid:
        try:
            player_data, guild_id = get_hypixel_cache(uuid, session)
        except RuntimeError:
            print("Failed getting data from hypixel cache, getting live result")

    if player_data is None:
        player_data = get_core_hypixel_data(uuid)

    if guild_id is not None:
        guild_data = get_hypixel_guild_cache(guild_id, session)

    if (
        hypixel_cache_valid and guild_id == None
    ):  # handles if a cached player has no guild
        guild_data == None
    elif guild_data is None or guild_data == False:
        try:
            guild_data = get_guild_data(uuid)
        except exceptions.NotFound:
            guild_data = None

    hypixel_data = HypixelFullData(player=player_data, guild=guild_data)
    # caching
    if hypixel_data.player.source == "hypixel_api":
        if hypixel_data.guild is not None:
            add_to_hypixel_cache(uuid, hypixel_data.player, hypixel_data.guild.id, session)
        else:
            add_to_hypixel_cache(uuid, hypixel_data.player, None, session)
    if hypixel_data.guild is not None:
        if hypixel_data.guild.source == "hypixel_api" and hypixel_data.guild.id:
            add_to_hypixel_guild_cache(hypixel_data.guild.id, hypixel_data.guild, session)

    return hypixel_data


def check_hypixel_cache(uuid, session: Session) -> bool:
    current_time = time.time()
    cache_time = session.execute(
        text(
            "SELECT extract(epoch from timestamp) as timestamp FROM hypixel_cache WHERE uuid = :uuid;"
        ),
        {"uuid": uuid},
    ).fetchone()
    if cache_time is None:
        return False

    epoch_cache_time = int(cache_time.timestamp)
    if current_time - epoch_cache_time < HYPIXEL_TTL:
        return True
    else:
        return False


def get_hypixel_cache(uuid, session: Session) -> Tuple[HypixelPlayer, Optional[str]]:
    cache_data = session.execute(
        text("SELECT data, guild_id FROM hypixel_cache WHERE uuid = :uuid;"),
        {"uuid": uuid},
    ).fetchone()

    try:
        hypixel_player = HypixelPlayer(source="cache", **cache_data.data)
        guild_id: str = cache_data.guild_id
        return hypixel_player, guild_id
    except Exception as e:
        raise RuntimeError()


def get_hypixel_guild_cache(id, session: Session) -> Union[HypixelGuild, False]:
    cache_data = session.execute(
        text(
            "SELECT data, extract(epoch from timestamp) as timestamp FROM hypixel_guild_cache WHERE id = :id"
        ),
        {"id": id},
    ).fetchone()

    if cache_data.data is None:
        print(f"no cache data found for guild {id}")
        return False

    epoch_cache_time = int(cache_data.timestamp)
    current_time = time.time()
    if current_time - epoch_cache_time < HYPIXEL_TTL:
        try:
            return HypixelGuild(source="cache", **cache_data.data)
        except Exception as e:
            print(f"Coudn't validate HypixelGuild from cache: {e}")

    return False


def add_to_hypixel_cache(
    uuid: str, data: HypixelPlayer, guild_id: str, session: Session
) -> None:
    session.execute(
        text(
            """
            INSERT INTO hypixel_cache (uuid, data, timestamp, guild_id) 
            VALUES (:uuid, :data, NOW(), :guild_id)
            ON CONFLICT (uuid)
            DO UPDATE SET 
                data = EXCLUDED.data,
                timestamp = NOW(),
                guild_id = EXCLUDED.guild_id
            """
        ),
        {
            "uuid": uuid,
            "data": data.model_dump_json(exclude={"source"}),
            "guild_id": guild_id,
        },
    )
    session.commit()


def add_to_hypixel_guild_cache(id: str, data: HypixelGuild, session: Session) -> None:
    session.execute(
        text(
            """
            INSERT INTO hypixel_guild_cache (id, data, timestamp) 
            VALUES (:id, :data, NOW())
            ON CONFLICT (id)
            DO UPDATE SET 
                data = EXCLUDED.data,
                timestamp = NOW()
            """
        ),
        {"id": id, "data": data.model_dump_json(exclude={"source"})},
    )
    session.commit()


if __name__ == "__main__":
    db_engine = get_engine()
    hypixel_data = get_hypixel_data("3ff2e63ad63045e0b96f57cd0eae708d", db_engine)
    print(hypixel_data)
