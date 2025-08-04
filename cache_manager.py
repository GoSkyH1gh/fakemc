import sqlite3
import logging
from pathlib import Path
import time
import json

logger = logging.getLogger(__file__)

current_directory = Path(__file__).parent

class CacheManager:
    """
    Manages caching of Mojang and Hypixel data using SQLite.
    Currently, there are three tables:
    - mojang_cache: Stores Mojang data including UUID, username, cape information, and timestamps.
    - hypixel_player_cache: Stores Hypixel player data including UUID, first login, rank, guild ID, and timestamps.
    - hypixel_guild_cache: Stores Hypixel guild data including guild ID, guild name, member UUIDs, and timestamps.
    """
    def __init__(self):
        self.conn = sqlite3.Connection(current_directory / "cache.db")
        self.cursor = self.conn.cursor()

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS mojang_cache (
            uuid TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            has_cape BOOLEAN NOT NULL,
            cape_name TEXT,
            skin_showcase_b64 TEXT,
            cape_front_b64 TEXT,
            cape_back_b64 TEXT,
            skin_url TEXT,
            cape_url Text,
            timestamp INTEGER NOT NULL);
        """)

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS hypixel_player_cache (
            uuid TEXT PRIMARY KEY,
            first_login TEXT,
            last_login TEXT,
            rank TEXT,
            guild_id TEXT,
            timestamp INTEGER NOT NULL);
        """)

        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS hypixel_guild_cache (
            guild_id TEXT PRIMARY KEY,
            guild_name TEXT,
            member_uuids TEXT,
            timestamp INTEGER NOT NULL);
        """)

    def check_mojang_cache(self, search_term: str, time_between_cache: int = 360):
        """
        Check if Mojang cache is valid for a given UUID or username.
        Returns True if cache is valid, False otherwise.
        """
        results = self.cursor.execute("SELECT timestamp FROM mojang_cache WHERE uuid = ? OR LOWER(username) = ?", (search_term.lower(), search_term.lower(),)).fetchall()
        try:
            last_timestamp = results[0][0]
            if self._is_cache_valid(last_timestamp, time_between_cache):
                logger.info(f"Cache found for UUID: {search_term}, returning True")
                return True
            else:
                logger.info(f"Cache expired for UUID: {search_term}, returning False")
                return False
        except IndexError:
            logger.info(f"No cache found for UUID: {search_term}")
            return False
        
    
    def get_data_from_mojang_cache(self, search_term: str):
        """Retrieve Mojang cache data for a given UUID or username."""
        
        self.cursor.execute("SELECT * FROM mojang_cache WHERE uuid = ? OR LOWER(username) = ?", (search_term.lower(), search_term.lower(),))
        results = self.cursor.fetchone()
        
        if results:
            logger.info(f"Cache found for search term: {search_term}")
            return {
                "uuid": results[0],
                "username": results[1],
                "has_cape": results[2],
                "cape_name": results[3],
                "skin_showcase_b64": results[4],
                "cape_front_b64": results[5],
                "cape_back_b64": results[6],
                "skin_url": results[7],
                "cape_url": results[8],
                "timestamp": results[9]
            }
        else:
            logger.info(f"No cache found for UUID: {search_term}")
            return None

    def add_mojang_cache(
            self, uuid: str, username: str, has_cape: bool = False, cape_name: str = None,
            skin_showcase_b64: str = None, cape_front_b64: str = None, cape_back_b64: str = None,
            skin_url: str = None, cape_url: str = None
            ):
        """Add or update Mojang cache data for a given UUID."""

        self.cursor.execute(
            """INSERT OR REPLACE INTO mojang_cache (uuid, username, has_cape, cape_name, skin_showcase_b64, cape_front_b64, cape_back_b64, skin_url, cape_url, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))""", (uuid, username, has_cape, cape_name, skin_showcase_b64, cape_front_b64, cape_back_b64, skin_url, cape_url))
        self.conn.commit()
    
    def add_hypixel_cache(self, uuid, hypixel_data: dict):
        if hypixel_data["status"] != "success":
            logger.warning(f"Invalid Hypixel data for UUID {uuid}: {hypixel_data['status']}, cache not updated")
            return
        self.cursor.execute(
            """INSERT OR REPLACE INTO hypixel_player_cache (uuid, first_login, last_login, rank, guild_id, timestamp)
            VALUES (?, ?, ?, ?, ?, strftime('%s', 'now'))""", 
            (uuid, hypixel_data["first_login"], hypixel_data["last_login"],hypixel_data["player_rank"], hypixel_data["guild_id"])
        )

        #logger.info(hypixel_data)
        json_guild_members = json.dumps(hypixel_data["member_uuids"])
        
        logger.info(f"Adding Hypixel guild cache for UUID {uuid} with members: {json_guild_members}")

        self.cursor.execute(
            """INSERT OR REPLACE INTO hypixel_guild_cache (guild_id, guild_name, member_uuids, timestamp)
            VALUES (?, ?, ?, strftime('%s', 'now'))""", 
            (hypixel_data["guild_id"], hypixel_data["guild_name"], json_guild_members)
        )
        self.conn.commit()
    
    def check_hypixel_player_cache(self, uuid: str, time_between_cache: int = 360):
        """
        Check if Hypixel player cache is valid for a given UUID.
        Returns True if cache is valid, False otherwise.
        """
        results = self.cursor.execute("SELECT timestamp FROM hypixel_player_cache WHERE uuid = ?", (uuid,)).fetchall()
        try:
            last_timestamp = results[0][0]
            if self._is_cache_valid(last_timestamp, time_between_cache):
                logger.info(f"Cache found for UUID: {uuid}, returning True")
                return True
            else:
                logger.info(f"Cache expired for UUID: {uuid}, returning False")
                return False
        except IndexError:
            logger.info(f"No cache found for UUID: {uuid}")
            return False
    
    def get_hypixel_player_cache(self, uuid: str):
        """Retrieve Hypixel player cache data for a given UUID."""
        
        self.cursor.execute("SELECT * FROM hypixel_player_cache WHERE uuid = ?", (uuid,))
        results = self.cursor.fetchone()
        
        if results:
            logger.info(f"Cache found for UUID: {uuid}")
            return {
                "uuid": results[0],
                "first_login": results[1],
                "last_login": results[2],
                "rank": results[3],
                "guild_id": results[4],
                "timestamp": results[5]
            }
        else:
            logger.info(f"No cache found for UUID: {uuid}")
            return None
    
    def check_hypixel_guild_cache(self, guild_id: str, time_between_cache: int = 720):
        """
        Check if Hypixel guild cache is valid for a given guild ID.
        Returns True if cache is valid, False otherwise.
        """
        results = self.cursor.execute("SELECT timestamp FROM hypixel_guild_cache WHERE guild_id = ?", (guild_id,)).fetchall()
        try:
            last_timestamp = results[0][0]
            if self._is_cache_valid(last_timestamp, time_between_cache):
                logger.info(f"Cache found for guild ID: {guild_id}, returning True")
                return True
            else:
                logger.info(f"Cache expired for guild ID: {guild_id}, returning False")
                return False
        except IndexError:
            logger.info(f"No cache found for guild ID: {guild_id}")
            return False
        
    def get_hypixel_guild_cache(self, guild_id: str):
        """Retrieve Hypixel guild cache data for a given guild ID."""
        
        self.cursor.execute("SELECT * FROM hypixel_guild_cache WHERE guild_id = ?", (guild_id,))
        results = self.cursor.fetchone()
        
        if results:
            logger.info(f"Cache found for guild ID: {guild_id}")
            return {
                "guild_id": results[0],
                "guild_name": results[1],
                "member_uuids": json.loads(results[2]),
                "timestamp": results[3]
            }
        else:
            logger.info(f"No cache found for guild ID: {guild_id}")
            return None
    
    def get_usernames_for_uuids_from_cache(self, uuids: list[str]) -> dict:
        """
        Retrieve usernames for a list of UUIDs from the Mojang cache.
        Returns a dictionary mapping UUIDs to usernames.
        """
        if not uuids:
            return {}
        
        # This creates a query like: SELECT ... WHERE uuid IN (?, ?, ?, ...)
        placeholders = ','.join('?' for _ in uuids)
        query = f"SELECT uuid, username, skin_showcase_b64 FROM mojang_cache WHERE uuid IN ({placeholders})"
        
        try:
            rows = self.cursor.execute(query, uuids).fetchall()
            # This is a dictionary comprehension, a concise way to build a dict from a list.
            return {uuid: {"username": username, "skin_showcase_b64": skin_b64} for uuid, username, skin_b64 in rows}
        except Exception as e:
            logger.error(f"Error during bulk UUID lookup: {e}")
            return {}

    def _is_cache_valid(self, timestamp, threshold):
        return time.time() - timestamp < threshold

    def clear_cache(self):
        self.cursor.execute("DELETE FROM hypixel_guild_cache")
        self.cursor.execute("DELETE FROM hypixel_player_cache")
        self.cursor.execute("DELETE FROM mojang_cache")
        self.conn.commit()

        self.cursor.execute("VACUUM") # clear extra space
        self.conn.commit()
        logger.info("Cache has been cleared")
        self.conn.close()

if __name__ == "__main__":
    cache_instance = CacheManager()
    #cache_instance.add_mojang_cache("3ff2e63ad63045e0b96f57cd0eae708d", "GoSkyHigh", True, "Purple Heart", "base64yap", None, None)
    #results = cache_instance.cursor.execute("SELECT * FROM mojang_cache").fetchall()
    #cache_instance.cursor.execute("DROP TABLE hypixel_cache")
    """
    cache_instance.add_hypixel_cache(
        "3ff2e63ad63045e0b96f57cd0eae708d", 
        hypixel_data = {
            "status": "success",
            "first_login": "01/2021",
            "rank": "VIP",
            "guild_id": "1234567890",
            "guild_name": "Test Guild",
            "guild_members": ["uuid1", "uuid2", "uuid3"]
        }
    )
    """
    print(cache_instance.check_hypixel_guild_cache("1234567890", 360))
    print(cache_instance.get_hypixel_guild_cache("1234567890"))
    print(f"finished")
    