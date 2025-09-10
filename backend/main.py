from fastapi import FastAPI, BackgroundTasks, Request, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

# from data_manager import DataManager
from wynncraft_api import (
    GetWynncraftData,
    PlayerSummary,
    GuildInfo,
    add_wynncraft_stats_to_db,
)
from online_status import get_online_status
from dotenv import load_dotenv
from wynn_data_manager import WynnDataManager

# from donut_api import get_donut_stats, DonutPlayerStats
from mcci_api import MCCIPlayer, get_mcci_data
import os
from metrics_manager import get_stats, HistogramData
from db import get_db

# from donut_api import add_donut_stats_to_db
import exceptions
from player_tracker import subscribe, unsubscribe
import asyncio
from sqlalchemy.orm import Session
from hypixel_manager import get_hypixel_data, HypixelFullData
from minecraft_manager import get_minecraft_data

load_dotenv()

hypixel_api_key = os.getenv("hypixel_api_key")

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies, authorization headers, etc.
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
def root():
    response = {"message": "hi, this is the fakemc api"}
    return response


@app.get(
    "/v1/players/mojang/{username}",
    responses={
        400: {"model": exceptions.ErrorResponse, "description": "Bad Request"},
        404: {"model": exceptions.ErrorResponse, "description": "Not Found"},
        500: {
            "model": exceptions.ErrorResponse,
            "description": "Internal Server Error",
        },
        502: {"model": exceptions.ErrorResponse, "description": "Upstream Error"},
        504: {
            "model": exceptions.ErrorResponse,
            "description": "Upstream Timeout Error",
        },
    },
)
def get_profile(username, session: Session = Depends(get_db)):
    return get_minecraft_data(username, session)


@app.get(
    "/v1/players/hypixel/{uuid}",
    responses={
        400: {"model": exceptions.ErrorResponse, "description": "Bad Request"},
        404: {"model": exceptions.ErrorResponse, "description": "Not Found"},
        500: {
            "model": exceptions.ErrorResponse,
            "description": "Internal Server Error",
        },
        502: {"model": exceptions.ErrorResponse, "description": "Upstream Error"},
        504: {
            "model": exceptions.ErrorResponse,
            "description": "Upstream Timeout Error",
        },
    },
)
def get_hypixel(uuid, session: Session = Depends(get_db)) -> HypixelFullData:
    data = get_hypixel_data(uuid, session)
    return data


"""
@app.get("/v1/hypixel/guilds/{uuid}")
def get_guild(uuid):
    data_instance = DataManager(hypixel_api_key)
    return data_instance.get_hypixel_guild_members(uuid)
"""


@app.get("/v1/players/status/{uuid}")
async def get_status(uuid):
    return await get_online_status(uuid, hypixel_api_key)


# wynncraft endpoints


@app.get(
    "/v1/players/wynncraft/{uuid}",
    responses={404: {"model": exceptions.ErrorResponse, "description": "Not found"}},
)
def get_wynncraft(uuid: str, background_tasks: BackgroundTasks) -> PlayerSummary:
    data_instance = GetWynncraftData()
    player_data = data_instance.get_player_data(uuid)
    background_tasks.add_task(add_wynncraft_stats_to_db, player_data)
    return player_data


@app.get("/v1/wynncraft/guilds/{prefix}")
def get_wynncraft_guild(prefix) -> GuildInfo:
    data_instance = GetWynncraftData()
    return data_instance.get_guild_data(prefix)


@app.get("/v1/wynncraft/guild-list")
def get_wynncraft_guild_list():
    wynn_data_manager = WynnDataManager()
    guild_list = wynn_data_manager.get_guild_list()
    return guild_list


"""
# donutsmp endpoint
@app.get("/v1/players/donutsmp/{username}")
def get_donut(username, background_tasks: BackgroundTasks) -> DonutPlayerStats:
    player_data = get_donut_stats(username)
    background_tasks.add_task(add_donut_stats_to_db, player_data, username)
    return player_data
"""


# mcci endpoint
@app.get("/v1/players/mccisland/{uuid}")
def get_mcc_island(uuid) -> MCCIPlayer:
    return get_mcci_data(uuid)


# metrics
@app.get("/v1/metrics/{metric_key}/distribution/{player_uuid}")
def get_metric(metric_key: str, player_uuid: str) -> HistogramData:
    return get_stats(metric_key, player_uuid)


# player tracker
@app.get("/v1/tracker/{uuid}/status")
async def track_player(uuid: str, request: Request):
    queue = await subscribe(uuid)

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    message = await asyncio.wait_for(queue.get(), timeout=25)
                    yield message
                except asyncio.TimeoutError:
                    yield "event: heartbeat\ndata: {}\n\n"
        finally:
            unsubscribe(uuid, queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
