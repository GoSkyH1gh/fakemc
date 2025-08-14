from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from data_manager import DataManager
from wynncraft_api import (
    GetWynncraftData,
    PlayerSummary,
    GuildInfo,
    add_wynncraft_stats_to_db,
)
from online_status import get_online_status
from dotenv import load_dotenv
from wynn_data_manager import WynnDataManager
from donut_api import get_donut_stats, DonutPlayerStats
from mcci_api import MCCIPlayer, get_mcci_data
import os
from metrics_manager import get_stats, HistogramData
from donut_api import add_donut_stats_to_db

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


@app.get("/v1/players/mojang/{username}")
def get_profile(username):
    data_instance = DataManager(hypixel_api_key)
    return data_instance.get_mojang_data(username)


@app.get("/v1/players/hypixel/{uuid}")
def get_hypixel(uuid):
    data_instance = DataManager(hypixel_api_key)
    return data_instance.get_hypixel_data(uuid)


@app.get("/v1/hypixel/guilds/{uuid}")
def get_guild(uuid):
    data_instance = DataManager(hypixel_api_key)
    return data_instance.get_hypixel_guild_members(uuid)


@app.get("/v1/players/status/{uuid}")
async def get_status(uuid):
    return await get_online_status(uuid, hypixel_api_key)


# wynncraft endpoints


@app.get("/v1/players/wynncraft/{uuid}")
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
def get_donut(username, background_tasks: BackgroundTasks) -> DonutPlayerStats:
    player_data = get_donut_stats(username)
    background_tasks.add_task(add_donut_stats_to_db, player_data, username)
    return player_data


# mcci endpoint
@app.get("/v1/players/mccisland/{uuid}")
def get_mcc_island(uuid) -> MCCIPlayer:
    return get_mcci_data(uuid)


# metrics
@app.get("/v1/metrics/{metric_key}/distribution/{player_uuid}")
def get_metric(metric_key: str, player_uuid: str) -> HistogramData:
    return get_stats(metric_key, player_uuid)
