from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_manager import DataManager
from wynncraft_api import GetWynncraftData, PlayerSummary, GuildInfo
from online_status import get_online_status
from dotenv import load_dotenv
from wynn_data_manager import WynnDataManager
from donut_api import get_donut_stats, DonutPlayerStats
from mcci_api import MCCIPlayer, get_mcci_data
import os

load_dotenv()

hypixel_api_key = os.getenv("hypixel_api_key")

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # List of allowed origins
    allow_credentials=True,      # Allow cookies, authorization headers, etc.
    allow_methods=["*"],         # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],         # Allow all headers
)

@app.get("/")
async def root():
    response = {
        "message": "hi, this is the fakemc api"
    }
    return response

@app.get("/v1/players/mojang/{username}")
async def get_profile(username):
    data_instance = DataManager(hypixel_api_key)
    return data_instance.get_mojang_data(username)

@app.get("/v1/players/hypixel/{uuid}")
async def get_hypixel(uuid):
    data_instance = DataManager(hypixel_api_key)
    return data_instance.get_hypixel_data(uuid)

@app.get("/v1/hypixel/guilds/{uuid}")
async def get_guild(uuid):
    data_instance = DataManager(hypixel_api_key)
    return data_instance.get_hypixel_guild_members(uuid)

@app.get("/v1/players/status/{uuid}")
async def get_status(uuid):
    return await get_online_status(uuid, hypixel_api_key)

# wynncraft endpoints

@app.get('/v1/players/wynncraft/{uuid}')
async def get_wynncraft(uuid) -> PlayerSummary:
    data_instance = GetWynncraftData()
    return data_instance.get_player_data(uuid)

@app.get('/v1/wynncraft/guilds/{prefix}')
async def get_wynncraft_guild(prefix) -> GuildInfo:
    data_instance = GetWynncraftData()
    return data_instance.get_guild_data(prefix)

@app.get('/v1/wynncraft/guild-list')
async def get_wynncraft_guild_list():
    wynn_data_manager = WynnDataManager()
    guild_list = wynn_data_manager.get_guild_list()
    return guild_list

# donutsmp endpoint
@app.get('/v1/players/donutsmp/{username}')
async def get_donut(username) -> DonutPlayerStats:
    return get_donut_stats(username)

# mcci endpoint
@app.get('/v1/players/mccisland/{uuid}')
async def get_mcc_island(uuid) -> MCCIPlayer:
    return get_mcci_data(uuid)