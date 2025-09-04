# wynn_cache.py
import sqlite3
import time
from pathlib import Path
import json # <--- Import the json module

current_directory = Path(__file__).parent

class WynnCacheManager:
    def __init__(self):
        # Make sure the storage directory exists
        self.conn = sqlite3.connect(current_directory / 'wynn_cache.db')
        self.cursor = self.conn.cursor()

        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS guild_list (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT,
                timestamp INTEGER
            )
        ''')
        self.conn.commit()

    def save_guild_list(self, data):
        timestamp = int(time.time())
        # Use json.dumps to serialize the dictionary into a JSON string
        data_as_string = json.dumps(data)
        self.cursor.execute('''
            INSERT INTO guild_list (data, timestamp)
            VALUES (?, ?)
        ''', (data_as_string, timestamp))
        self.conn.commit()
    
    def get_guild_list(self):
        self.cursor.execute('SELECT data, timestamp FROM guild_list ORDER BY id DESC LIMIT 1')
        row = self.cursor.fetchone()
        if row:
            # Use json.loads to parse the JSON string back into a Python dictionary
            data_dict = json.loads(row[0])
            timestamp = row[1]
            return data_dict, timestamp # Return a tuple of (dictionary, timestamp)
        return None # Return None if no cache exists
    
    def __del__(self):
        # Good practice to close the connection when the object is destroyed
        if self.conn:
            self.conn.close()

# The __main__ block should also be updated if you use it for testing
if __name__ == "__main__":
    wynn_cache = WynnCacheManager()
    # Example usage with a dictionary
    example_data = {'guilds': [{'name': 'The Test Guild', 'prefix': 'TTG'}]}
    wynn_cache.save_guild_list(example_data)
    cached_result = wynn_cache.get_guild_list()
    print(f"Retrieved data type: {type(cached_result[0])}")
    print(cached_result)