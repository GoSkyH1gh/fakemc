from minecraft_api import GetMojangAPIData, MojangData
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, Union
import exceptions
import time

MINECRAFT_TTL = 180


def get_minecraft_data(search_term: str, session: Session) -> MojangData:
    data = None
    try:
        data = get_minecraft_cache(search_term, session)
    except exceptions.InvalidCache:
        pass

    if data is None:
        if len(search_term) < 16:
            mojang_instance = GetMojangAPIData(search_term)
        else:
            mojang_instance = GetMojangAPIData(None, search_term)
        data = mojang_instance.get_data()

    add_to_minecraft_cache(data.uuid, data, session)

    return data


def get_minecraft_cache(search_term: str, session: Session) -> MojangData:
    """Gets cache from either uuid or username"""
    if search_term is None:
        raise exceptions.InvalidCache()

    if len(search_term) < 16:
        cache_data = session.execute(
            text(
                """
                SELECT data, extract(epoch from timestamp) as timestamp FROM minecraft_cache
                WHERE LOWER(data->>'username') = LOWER(:search_term)"""
            ),
            {"search_term": search_term},
        ).fetchone()
    else:
        cache_data = session.execute(
            text(
                """
                SELECT data, extract(epoch from timestamp) as timestamp FROM minecraft_cache
                WHERE uuid = :uuid"""
            ),
            {"uuid": search_term},
        ).fetchone()

    if cache_data is None:
        raise exceptions.InvalidCache()

    current_time = time.time()
    epoch_cache_time = int(cache_data.timestamp)
    if current_time - epoch_cache_time < MINECRAFT_TTL:
        try:
            return MojangData(source="cache", **cache_data.data)
        except Exception as e:
            print(f"Coudn't validate MojangData from cache: {e}")

    raise exceptions.InvalidCache()


def add_to_minecraft_cache(uuid: str, data: MojangData, session: Session):
    if data.source == "mojang_api":
        session.execute(
            text(
                """
                INSERT INTO minecraft_cache (uuid, data, timestamp) 
                VALUES (:uuid, :data, NOW())
                ON CONFLICT (uuid)
                DO UPDATE SET 
                    data = EXCLUDED.data,
                    timestamp = NOW()
                """
            ),
            {"uuid": uuid, "data": data.model_dump_json(exclude={"source"})},
        )
        session.commit()
