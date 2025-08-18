import asyncio
from typing import Dict, Set, Optional
import json
from pydantic import BaseModel
import aiohttp
import os
from dotenv import load_dotenv
from utils import dashify_uuid

load_dotenv()

wynn_token = os.getenv("WYNN_TOKEN")
hypixel_api_key = os.getenv("hypixel_api_key")

if not wynn_token:
    raise RuntimeError("Wynncraft Token not set in environment variables.")

if not hypixel_api_key:
    raise RuntimeError("Hypixel Api key not set in environment vairables.")

trackers: Dict[str, asyncio.Task] = {}  # uuid, poller
subscribers: Dict[str, Set[asyncio.Queue]] = {}  # uuid, queue


class PlayerStatus(BaseModel):
    wynncraft_restricted: bool
    wynncraft_online: bool
    wynncraft_server: Optional[str]
    hypixel_online: bool
    hypixel_game_type: Optional[str]
    hypixel_mode: Optional[str]


async def poller(uuid: str):
    counter = 0
    print(f"poller started for {uuid}")
    try:
        while True:
            data = await get_status(uuid)
            message = f"event: data\ndata: {data.model_dump_json()}\n\n"
            counter += 1

            for subscriber in list(subscribers.get(uuid, [])):
                await subscriber.put(message)

            await asyncio.sleep(20)
    except asyncio.CancelledError:
        print(f"poller for uuid {uuid} stopped")
    except Exception as e:
        print(f"something went wrong in poller: {e}")


async def subscribe(uuid: str):
    queue = asyncio.Queue()

    if uuid not in subscribers:
        subscribers[uuid] = set()

    subscribers[uuid].add(queue)

    if uuid not in trackers:
        task = asyncio.create_task(poller(uuid))
        trackers[uuid] = task

    return queue


def unsubscribe(uuid: str, queue: asyncio.Queue):
    if uuid not in subscribers:
        return

    subscribers[uuid].discard(queue)

    if len(subscribers[uuid]) == 0:
        del subscribers[uuid]

        if uuid in trackers:
            task = trackers[uuid]
            task.cancel()
            del trackers[uuid]


async def get_status(uuid):

    async with aiohttp.ClientSession() as session:
        results = await asyncio.gather(
            get_wynncraft_status(session, uuid), get_hypixel_status(session, uuid)
        )

    wynncraft_response = results[0]
    hypixel_response = results[1]
    print(hypixel_response)

    wynncraft_online = wynncraft_response.get("online")
    wynncraft_server = wynncraft_response.get("server")
    wynncraft_restricted = wynncraft_response.get("restrictions", {}).get(
        "onlineStatus", True
    )

    hypixel_data: dict = hypixel_response.get("session", {})
    hypixel_online = hypixel_data.get("online", False)

    hypixel_game_type = hypixel_data.get("gameType")  # eg SKYBLOCK, PROTOTYPE, BEDWARS
    if isinstance(hypixel_game_type, str):
        hypixel_game_type = hypixel_game_type.capitalize()

    hypixel_mode = hypixel_data.get("mode")  # eg LOBBY, hub
    if isinstance(hypixel_mode, str):
        hypixel_mode = hypixel_mode.capitalize()

    player_status = PlayerStatus(
        wynncraft_restricted=wynncraft_restricted,
        wynncraft_online=wynncraft_online,
        wynncraft_server=wynncraft_server,
        hypixel_online=hypixel_online,
        hypixel_game_type=hypixel_game_type,
        hypixel_mode=hypixel_mode,
    )
    print(player_status)
    return player_status


async def get_wynncraft_status(session, uuid):
    dashed_uuid = dashify_uuid(uuid)
    async with session.get(
        f"https://api.wynncraft.com/v3/player/{dashed_uuid}",
        headers={"Authorization": f"Bearer {wynn_token}"},
    ) as response:
        response.raise_for_status()
        response: dict = await response.json()
        return response


async def get_hypixel_status(session, uuid):
    headers = {"API-Key": hypixel_api_key}
    params = {"uuid": uuid}
    async with session.get(
        "https://api.hypixel.net/v2/status", params=params, headers=headers
    ) as response:
        response.raise_for_status()
        return await response.json()


if __name__ == "__main__":
    asyncio.run(get_status("3ff2e63ad63045e0b96f57cd0eae708d"))
