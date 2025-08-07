from cache_manager import CacheManager
from hypixel_api import GetHypixelData
from minecraft_api import GetMojangAPIData
from fastapi import HTTPException
from utils import load_base64_to_pillow
import logging
import os
from dotenv import load_dotenv


logger = logging.getLogger(__name__)

class DataManager:
    def __init__(self, hypixel_api_key: str, cache_enabled: bool = True, cache_time: int = 300):
        self.hypixel_api_key = hypixel_api_key
        self.cache_instance = CacheManager()
        self.cache_time = cache_time
        self.cache_enabled = cache_enabled

    def get_mojang_data(self, search_term: str) -> dict:
        """
        Fetches Mojang data for a given username or UUID.
        returns a dictionary with the following keys
        - status: "success", "lookup_failed", or "failed"
        - source: "mojang_api" or "cache"
        - uuid: the UUID of the player
        - username: the formatted username of the player
        - has_cape: boolean indicating if the player has a cape
        - cape_name: the name of the cape if the player has one, otherwise None
        - skin_showcase_b64: base64 encoded string of the player's skin showcase
        - cape_showcase_b64: base64 encoded string of the player's cape showcase
        - cape_back_b64: base64 encoded string of the player's cape back image
        - skin_url
        - cape_url
        """

        status = "error"
        source = None
        
        valid_cache = self.cache_instance.check_mojang_cache(search_term, self.cache_time)
        logger.info(f"valid cache for {search_term}: {valid_cache}")
        if valid_cache and self.cache_enabled: # if cache is valid, get data from cache
            logger.info(f"using cache for {search_term}")
            data_from_cache = self.cache_instance.get_data_from_mojang_cache(search_term)
            try:
                uuid = data_from_cache["uuid"]
                formated_username = data_from_cache["username"]
                has_cape = data_from_cache["has_cape"]
                cape_id = data_from_cache["cape_name"]
                skin_showcase_b64 = data_from_cache["skin_showcase_b64"]
                cape_showcase_b64 = data_from_cache["cape_front_b64"]
                cape_back_b64 = data_from_cache["cape_back_b64"]
                skin_url = data_from_cache["skin_url"]
                cape_url = data_from_cache["cape_url"]
                status = "success"
                source = "cache"
            except KeyError as e:
                logger.error(f"KeyError while getting data from cache: {e}")
                raise HTTPException(404, {"message": "player not found"})
                
            logger.debug(f"data from cache: {data_from_cache}")

        else: # if cache is not valid, get data from mojang api
            if len(search_term) <= 16: # if text inputted is less than 16 chars (max username length) search is treated as a name
                mojang_instance = GetMojangAPIData(search_term)
            else:
                mojang_instance = GetMojangAPIData(None, search_term)
            player_data = mojang_instance.get_data()
            if player_data is not None:
                logger.info(f"added cache for {player_data.username}")
                status = "success"
                source = "mojang_api"

                uuid = player_data.uuid
                formated_username = player_data.username
                has_cape = player_data.has_cape
                cape_id = player_data.cape_name
                skin_showcase_b64 = player_data.skin_showcase_b64
                cape_showcase_b64 = player_data.cape_front_b64
                cape_back_b64 = player_data.cape_back_b64
                skin_url = player_data.skin_url
                cape_url = player_data.cape_url

                if self.cache_enabled:
                    self.cache_instance.add_mojang_cache(
                        player_data.uuid, player_data.username, player_data.has_cape, player_data.cape_name,
                        player_data.skin_showcase_b64, player_data.cape_front_b64, player_data.cape_back_b64,
                        player_data.skin_url, player_data.cape_url
                        )
                else:
                    logger.info(f"result is valid for {player_data.username}, but cache is disabled")
            else:
                logger.info(f"lookup failed for {search_term}, not adding to cache")
                status = "lookup_failed"
                source = "mojang_api"
                raise HTTPException(404, {"message": "player not found"})
        
        response = {
            "status": status,
            "source": source,
            "uuid": uuid,
            "username": formated_username,
            "has_cape": bool(has_cape),
            "cape_name": cape_id,
            "skin_showcase_b64": skin_showcase_b64,
            "cape_showcase_b64": cape_showcase_b64,
            "cape_back_b64": cape_back_b64,
            "skin_url": skin_url,
            "cape_url": cape_url
        }

        return response


    
    def get_hypixel_data(self, uuid, guild_members_to_fetch: int = 100) -> dict:
        """
        Fetches Hypixel data for a given UUID.
        returns a dictionary with the following keys
        - status: "success", "date_error", or "failed"
        - source: "cache" or "hypixel_api"
        - first_login: the first login date of the player in a formatted string
        - player_rank: the rank of the player
        - guild_members: a list of UUIDs of the guild members
        - guild_name: the name of the guild
        - guild_id: the ID of the guild
        """

        valid_cache = self.cache_instance.check_hypixel_player_cache(uuid, self.cache_time)
        logger.info(f"valid cache for {uuid}: {valid_cache}")

        if valid_cache and self.cache_enabled:
            logger.info(f"using cache for {uuid}")
            data_from_cache = self.cache_instance.get_hypixel_player_cache(uuid)
            if data_from_cache:
                data_from_cache["source"] = "cache"
                response = {
                    "status": "incomplete",
                    "source": "cache",
                    "first_login": data_from_cache["first_login"],
                    "last_login": data_from_cache["last_login"],
                    "player_rank": data_from_cache["rank"],
                    "guild_id": data_from_cache["guild_id"],
                }
                logger.info(f"data from cache for {uuid}: {data_from_cache}")
                if data_from_cache["guild_id"]:
                    logger.info(f"guild id found in cache for player {uuid}: {data_from_cache['guild_id']}")
                    data_from_guild_cache = self.cache_instance.get_hypixel_guild_cache(data_from_cache["guild_id"])

                    guild_cache_valid = self.cache_instance.check_hypixel_guild_cache(data_from_cache["guild_id"], self.cache_time)
                        
                    if data_from_guild_cache and guild_cache_valid:

                        resolved_guild_members = self._resolve_guild_member_names(data_from_guild_cache["member_uuids"])

                        response["status"] = "success"
                        response["guild_members"] = resolved_guild_members
                        response["guild_name"] = data_from_guild_cache["guild_name"]
                        return response
                    else:
                        logger.info(f"No guild cache found for {data_from_cache['guild_id']}, fetching new data")
                        return self._fetch_hypixel_data(uuid, guild_members_to_fetch)
                else:
                    logger.info(f"No guild id found in cache for player {uuid}")
                    response["status"] = "success"
                    response["guild_members"] = []
                    response["guild_name"] = None
                    return response
            else:
                logger.info(f"No valid cache found for {uuid}, fetching new data")
                return self._fetch_hypixel_data(uuid, guild_members_to_fetch)
        else:
            logger.info(f"cache not valid for {uuid}, fetching new data")
            return self._fetch_hypixel_data(uuid, guild_members_to_fetch)
            
    
    def _fetch_hypixel_data(self, uuid: str, guild_members_to_fetch: int) -> dict:
        """
        Fetches Hypixel data for a given UUID.
        Returns a dictionary with the Hypixel data.
        """
        hypixel_data_instance = GetHypixelData(uuid, self.hypixel_api_key, guild_members_to_fetch)
        first_login, player_rank, last_login, hypixel_request_status = hypixel_data_instance.get_basic_data()

        guild_members = []
        guild_members, guild_name, guild_id = hypixel_data_instance.get_guild_info()

        # Prepare data to cache, only store raw uuids
        data_to_cache = {
            "status": hypixel_request_status,
            "source": "hypixel_api",
            "first_login": first_login,
            "last_login": last_login,
            "player_rank": player_rank,
            "guild_name": guild_name,
            "guild_id": guild_id,
            "member_uuids": guild_members
        }

        # Only add to cache if the request was successful
        if hypixel_request_status == "success" and self.cache_enabled:
            self.cache_instance.add_hypixel_cache(uuid, data_to_cache)

        if hypixel_request_status == "date_error":
            raise HTTPException(404, {"message": "Player not found"})
        if hypixel_request_status in ["invalid_api_key", "http_error", "request_error", "unkown_error"]:
            raise HTTPException(502, {"error": hypixel_request_status})

        # resolved_guild_members = self._resolve_guild_member_names(guild_members)
        # "guild_members": resolved_guild_members,
        response = {
            "status": hypixel_request_status,
            "source": "hypixel_api",
            "first_login": first_login,
            "last_login": last_login,
            "player_rank": player_rank,
            "guild_uuids": guild_members,
            "guild_name": guild_name,
            "guild_id": guild_id
        }

        return response
    
    def _resolve_guild_member_names(self, member_uuids: list[str]) -> list[dict]:
        """
        Takes a list of UUIDs and returns a list of resolved members
        (e.g., [{"uuid": ..., "name": ..., "skin_showcase_b64": ...}]),
        using the cache intelligently. If a user is in the cache but their data is
        incomplete (missing username or skin), it will be re-fetched from the API.
        """
        if not member_uuids:
            return []

        logger.info(f"Attempting to resolve {len(member_uuids)} member details.")

        resolved_members = {}
        uuids_to_fetch_from_api = []

        if self.cache_enabled:
            # This function now returns {uuid: {"username": ..., "skin_showcase_b64": ...}}
            cached_data = self.cache_instance.get_usernames_for_uuids_from_cache(member_uuids)
            logger.info(f"Found {len(cached_data)} potential members in cache.")
            
            for uuid in member_uuids:
                if uuid in cached_data:
                    member_info = cached_data[uuid]
                    # Check if the cached data is complete (has both username and skin)
                    if member_info.get("username") and member_info.get("skin_showcase_b64"):
                        resolved_members[uuid] = member_info
                    else:
                        # Data is incomplete, mark for re-fetching from API
                        uuids_to_fetch_from_api.append(uuid)
                else:
                    # Not in cache, mark for fetching from API
                    uuids_to_fetch_from_api.append(uuid)
        else:
            logger.info("Cache is disabled, fetching all guild member details from API.")
            uuids_to_fetch_from_api = list(member_uuids)

        if not uuids_to_fetch_from_api:
            logger.info("All member details were resolved from cache.")
        else:
            logger.info(f"Fetching {len(uuids_to_fetch_from_api)} missing/incomplete member details from Mojang API.")
            # Fetch missing or incomplete data from Mojang API
            for uuid in uuids_to_fetch_from_api:
                mojang_data = self.get_mojang_data(uuid)

                if isinstance(mojang_data, HTTPException): # skip if its an exception
                    continue

                if mojang_data and mojang_data["status"] == "success":
                    resolved_members[uuid] = {
                        "username": mojang_data["username"],
                        "skin_showcase_b64": mojang_data["skin_showcase_b64"]
                    }
                else: # also skip if its not successful
                    continue

        # Create the final list of dictionaries, maintaining the original order
        final_list = []
        for uuid in member_uuids:
            member_data = resolved_members.get(uuid, {"username": "N/A", "skin_showcase_b64": None})
            final_list.append({
                "uuid": uuid,
                "name": member_data.get("username", "N/A"),
                "skin_showcase_b64": member_data.get("skin_showcase_b64")
            })

        return final_list

    def get_hypixel_guild_members(self, uuid):
        hypixel_data_instance = GetHypixelData(uuid, self.hypixel_api_key)

        guild_members, guild_name, guild_id = hypixel_data_instance.get_guild_info()

        if guild_members:
            resolved_guild_members = self._resolve_guild_member_names(guild_members)
            guild_response = {
                "guild_members": resolved_guild_members,
                "guild_name": guild_name,
                "guild_id": guild_id
            }
            return guild_response
        else:
            return HTTPException(404, {"message": "guild not found"})

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    load_dotenv()
    hypixel_api_key = os.getenv("HYPIXEL_API_KEY")
    data_manager = DataManager(hypixel_api_key)
    search_term = "3ff2e63ad63045e0b96f57cd0eae708d"
    response = data_manager.get_hypixel_data(search_term, 15)
    print(response)
    for member in response["guild_members"]:
        print(f"UUID: {member['uuid']}, Name: {member['name']}")