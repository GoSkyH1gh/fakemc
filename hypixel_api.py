import requests
import datetime
from dotenv import load_dotenv
import os
import json
import logging
import time

logger = logging.getLogger(__name__)

load_dotenv()
rank_map = {
    "VIP": "VIP",
    "VIP_PLUS": "VIP+",
    "MVP": "MVP",
    "MVP_PLUS": "MVP+",
    "YOUTUBER": "YouTube"
}


class GetHypixelData:
    def __init__(self, uuid, hypixel_api_key, guild_members_to_fetch = 100):
        self.uuid = uuid
        self.api_key = hypixel_api_key
        self.guild_members_to_fetch = guild_members_to_fetch

    def get_basic_data(self):
        """
        requires uuid and api key
        returns first login date (in ISO) and player rank and last_login_date_iso (in ISO) and request_status 
        returns None, None, None, None if player is not found
        """
        payload = {
            "uuid": self.uuid
        }

        try:
            player_data = requests.get(
                url = "https://api.hypixel.net/v2/player",
                params = payload,
                headers = {"API-Key": self.api_key}
                )
            
            player_data.raise_for_status()

            json_player_data = player_data.json()

            first_login_iso = None
            player_rank = None
            last_login_timestamp = None
            last_login_iso = "Unknown"

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                logger.error(f"Invalid API key: {e}")
                request_status = "invalid_api_key"
            else:
                logger.error(f"HTTP error occurred: {e}")
                request_status = "http_error"
            return None, None, None, request_status
        except requests.exceptions.RequestException as e:
            logger.error(f"Request exception occurred: {e}")
            request_status = "request_error"
            return None, None, None, request_status
        except Exception as e:
            logger.warning(f"something went wrong while getting Hypixel player data: {e}")
            request_status = "unkown_error"
            return None, None, None, request_status

        #try:
        #    with open("hypixel_player_data.json", "w", encoding="utf-8") as file:
        #        json.dump(json_player_data, file, indent = 4)
        #
        #except Exception as e:
        #    logger.error(f"Something went wrong while processing Hypixel data: {e}")
        #    return None, None,
        
        try:
            first_login = json_player_data["player"]["firstLogin"] / 1000 # transforms to standard (non milliseconds) UNIX time
            first_login_iso = datetime.datetime.fromtimestamp(first_login).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
            
        except Exception as e:
            logger.warning(f"something went wrong with first login date: {e}")
            request_status = "date_error"
            return None, None, None, request_status
        
        try:
            last_login_timestamp = json_player_data["player"]["lastLogin"] // 1000
            last_login_iso = datetime.datetime.fromtimestamp(last_login_timestamp).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        except Exception as e:
            logger.warning(f"Last login could not be converted to ISO: {e}")

        try:
            player_rank = json_player_data["player"]["rank"]
        except:
            try:
                player_rank = json_player_data["player"]["newPackageRank"]
            except KeyError:
                logger.info("player has no rank")
                request_status = "success"
                return first_login_iso, "No rank", last_login_iso, request_status
        
        try:
            player_rank_formatted = rank_map[player_rank]
            logger.info(f"player rank: {player_rank_formatted}")
            request_status = "success"
        except KeyError:
            player_rank_formatted = player_rank
            logging.warning(f"rank not identified: {player_rank_formatted}")
            request_status = "success"
        return first_login_iso, player_rank_formatted, last_login_iso, request_status
        

    def get_guild_info(self):
        """
        requires uuid and api key
        returns a list with a specified number of guild members, a guild_name and guild id
        return None, None, None if it fails
        """
        try:
            payload = {"player": self.uuid}

            guild_response = requests.get(
                url = "https://api.hypixel.net/v2/guild",
                params = payload,
                headers = {"API-Key": self.api_key}
            )

            guild_response.raise_for_status()

            logger.debug(guild_response)
            if guild_response.json()["guild"] is None:
                logger.info("no guild")
                return None, None, None

            guild_response_json = guild_response.json()

            members = guild_response_json["guild"]["members"]
            guild_name = guild_response_json["guild"]["name"]
            guild_id = guild_response_json["guild"]["_id"]
            guild_members = []
            for index, member in enumerate(members):
                if index < self.guild_members_to_fetch: # gets the first x members of the guild
                    guild_members.append(member["uuid"])

            return guild_members, guild_name, guild_id
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error occurred: {e}")
            return None, None, None
        except requests.exceptions.RequestException as e:
            logger.error(f"Request exception occurred: {e}")
            return None, None, None
        except KeyError as e:
            logger.warning(f"couldn't find {e}")
            return None, None, None
        except Exception as e:
            logger.warning(f"something went wrong while getting hypixel guild info: {e}")
            return None, None, None


if __name__ == "__main__":
    uuid = "3ff2e63ad63045e0b96f57cd0eae708d"
    hypixel_api_key = os.getenv("hypixel_api_key")

    user = GetHypixelData(uuid, hypixel_api_key)
    data = user.get_basic_data()
    print(data)