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

if not wynn_token:
    raise RuntimeError("Wynncraft Token not set in environment variables.")

trackers: Dict[str, asyncio.Task] = {}  # uuid, poller
subscribers: Dict[str, Set[asyncio.Queue]] = {}  # uuid, queue


class PlayerStatus(BaseModel):
    wynncraft_restricted: bool
    wynncraft_online: bool
    wynncraft_server: Optional[str]
    hypixel_online: bool


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
    dashed_uuid = dashify_uuid(uuid)
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"https://api.wynncraft.com/v3/player/{dashed_uuid}"
        ) as response:
            response: dict = await response.json()

    online = response.get("online")
    server = response.get("server")
    restricted = response.get("restrictions", {}).get("onlineStatus", True)
    player_status = PlayerStatus(
        wynncraft_restricted=restricted,
        wynncraft_online=online,
        wynncraft_server=server,
        hypixel_online=False
    )
    print(player_status)
    return player_status


if __name__ == "__main__":
    asyncio.run(get_status("3ff2e63ad63045e0b96f57cd0eae708d"))
