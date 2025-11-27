from fastapi import FastAPI, BackgroundTasks, Request, Depends, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from wynncraft_api import (
    GetWynncraftData,
    PlayerSummary,
    GuildInfo,
    add_wynncraft_stats_to_db,
)
from online_status import get_online_status
from dotenv import load_dotenv
from wynn_data_manager import WynnDataManager
from minecraft_api import MojangData
from donut_api import get_donut_stats, DonutPlayerStats, add_donut_stats_to_db
from mcci_api import MCCIPlayer, get_mcci_data
import os
from metrics_manager import get_stats, HistogramData
from db import get_db

import exceptions
from player_tracker import subscribe, unsubscribe
import asyncio
from sqlalchemy.orm import Session
from hypixel_manager import (
    get_hypixel_data,
    HypixelFullData,
    HypixelGuildMemberFull,
    get_full_guild_members,
    HypixelGuildMemberParams,
    add_hypixel_stats_to_db,
)
from minecraft_manager import get_minecraft_data
from typing import List, Annotated
import time
from telemetry_manager import add_telemetry_event


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


@app.middleware("http")
async def telemetry_middleware(request: Request, call_next):
    start = time.time()
    status_code = 500
    try:
        response = await call_next(request)
        status_code = response.status_code
        return response
    except Exception:
        # Call_next didn't complete — still record telemetry
        raise
    finally:
        latency_ms = int((time.time() - start) * 1000)
        asyncio.create_task(
            add_telemetry_event(
                request.url.path,
                request.url.path.split("/")[-1],
                latency_ms,
                status_code,
            )
        )


@app.get("/")
def root():
    response = {"message": "hi, this is the fakemc api"}
    return response


@app.get("/healthz")
def health_check():
    return {"status": "ok"}


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
def get_profile(username, session: Session = Depends(get_db)) -> MojangData:
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
def get_hypixel(
    uuid, background_tasks: BackgroundTasks, session: Session = Depends(get_db)
) -> HypixelFullData:
    data = get_hypixel_data(uuid, session)
    background_tasks.add_task(add_hypixel_stats_to_db, data)
    return data


@app.get("/v1/hypixel/guilds/{id}")
def get_guild(
    id,
    query_params: Annotated[HypixelGuildMemberParams, Query()],
    session: Session = Depends(get_db),
) -> List[HypixelGuildMemberFull]:
    return get_full_guild_members(id, session, query_params.limit, query_params.offset)


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


# donutsmp endpoint
@app.get("/v1/players/donutsmp/{username}")
def get_donut(
    username, background_tasks: BackgroundTasks, session: Session = Depends(get_db)
) -> DonutPlayerStats:
    player_data = get_donut_stats(username)
    background_tasks.add_task(add_donut_stats_to_db, player_data, username, session)
    return player_data


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
