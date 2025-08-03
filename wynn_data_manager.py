# wynn_data_manager.py
import time
from wynn_cache import WynnCacheManager
from wynncraft_api import GetWynncraftData

class WynnDataManager:
    def __init__(self):
        # It's more efficient to create these instances once
        self.cache_manager = WynnCacheManager()
        self.api_client = GetWynncraftData()
    
    def get_guild_list(self, cache_duration: int = 3600):
        """
        Retrieve the list of guilds, using the cache if it's valid.
        This is a more efficient, combined version of your two original methods.
        """
        cached_data = self.cache_manager.get_guild_list()
        
        # Check if cache exists and is valid
        if cached_data:
            data, timestamp = cached_data
            current_time = int(time.time())
            if (current_time - timestamp) < cache_duration:
                print("Returning guild list from CACHE.")
                guild_list = self._process_guild_list(data)
                return guild_list  # Return the processed guild list directly

        # If cache is invalid or doesn't exist, fetch from API
        print("Cache invalid or not found. Fetching guild list from API.")
        expanded_guild_list = self.api_client.get_guild_list()

        # Save the new data to the cache
        if expanded_guild_list: # Only save if the API call was successful
            self.cache_manager.save_guild_list(expanded_guild_list)
        
        guild_list = self._process_guild_list(expanded_guild_list)


        return guild_list
    
    def _process_guild_list(self, expanded_guild_list):
        """
        Process the expanded guild list to extract relevant information.
        """
        guild_list = []
        for guild in expanded_guild_list:
            guild_list.append(
                {
                    "name": guild,
                    "prefix": expanded_guild_list[guild]["prefix"],
                }
            )
        return guild_list

if __name__ == "__main__":
    wynn_data_manager = WynnDataManager()
    
    print("First call (should fetch from API):")
    guilds = wynn_data_manager.get_guild_list()
    print(f"Got {len(guilds.get('guilds', []))} guilds.")
    
    print("\nSecond call (should use cache):")
    guilds_from_cache = wynn_data_manager.get_guild_list()
    print(f"Got {len(guilds_from_cache.get('guilds', []))} guilds from cache.")