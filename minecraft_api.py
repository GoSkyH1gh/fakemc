from utils import pillow_to_b64
import requests
import json
import base64
import io
from PIL import Image
import logging
from pydantic import BaseModel
from typing import Optional

class MojangData(BaseModel):
    username: str
    uuid: str
    has_cape: bool
    cape_name: Optional[str]
    skin_url: str
    cape_url: Optional[str]
    skin_showcase_b64: str
    cape_front_b64: Optional[str]
    cape_back_b64: Optional[str]

logger = logging.getLogger(__name__)

# the last 32 characters of the cape url recieved from mojang with a corresponding name
CAPE_MAP = {
    "71658f2180f56fbce8aa315ea70e2ed6": "Minecon 2011",
    "273c4f82bc1b737e934eed4a854be1b6": "Minecon 2012",
    "943239b1372780da44bcbb29273131da": "Minecon 2013",
    "65a13a603bf64b17c803c21446fe1635": "Minecon 2015", 
    "59c0cd0ea42f9999b6e97c584963e980": "Minecon 2016",
    "29304776d0f347334f8a6eae509f8a56": "Realms Mapmaker",
    "53cddd0995d17d0da995662913fb00f7": "Mojang Studios",
    "995751e91cee373468c5fbf4865e7151": "Mojang",
    "2abb2051b2481d0ba7defd635ca7a933": "Migrator",
    "e1a76d397c8b9c476c2f77cb6aebb1df": "MCC 15th Year",
    "cd50e4b2954ab29f0caeb85f96bf52a1": "Founder's",
    "8f1e3966956123ccb574034c06f5d336": "Pan",
    "a4faa4d9a9c3d6af8eafb377fa05c2bb": "Blossom",
    "8886e3b7722a895255fbf22ab8652434": "Minecraft Experience",
    "b4b6559b0e6d3bc71c40c96347fa03f0": "Common",
    "a22e3412e84fe8385a0bdd73dc41fa89": "Yearn",
    "0a7ca74936ad50d8e860152e482cfbde": "Purple Heart",
    "b1e6d35f4f3cfb0324ef2d328223d350": "Follower",
    "91c359e9e61a31f4ce11c88f207f0ad4": "Vanilla",
    "9f1bc1523a0dcdc16263fab150693edd": "Home",
    "12d3aeebc3c192054fba7e3b3f8c77b1": "Menace",
    "a7540e117fae7b9a2853658505a80625": "15th Anniversary",
    "76b9eb7a8f9f2fe6659c23a2d8b18edf": "Millionth Customer",
    "a4ef76ebde88d27e4d430ac211df681e": "Translator",
    "fb45ea81e785a7854ae8429d7236ca26": "Office",
    "93199a2ee9e1585cb8d09d6f687cb761": "Mojang (Legacy)",
    "26b546a54d519e6a3ff01efa01acce81": "Cobalt",
    "e926b997d5e66c86483dfb1e031aee95": "Turtle"
}

class GetMojangAPIData:
    def __init__(self, username, uuid = None):
        self.username = username
        self.uuid = uuid
        self.skin_url = None
        self.cape_url = None
        self.has_cape = None
        self.skin_id = None
        self.cape_name = None
        self.cape_back = None
        self.cape_showcase = None
        self.skin_showcase_b64 = None
        self.cape_back_b64 = None
        self.cape_showcase_b64 = None

    
    def get_data(self) -> Optional[MojangData]:
        """
        master function, gets uuid if not provided and then calls get_skin_data
        returns a MojangData object on success
        returns None on fail
        """
        lookup_failed = False
        if not self.uuid:
            logger.info(f"no uuid found, calling API for {self.username}")
            if self.get_uuid():
                self.get_skin_data() # only tries get_skin_data if request suceeds
            else:
                lookup_failed = True
        else:
            self.get_skin_data()
        
        if self.skin_url is not None: # only tries to get skin and cape data if they exist
            self.get_skin_images()
        
        if lookup_failed:
            return None
        try:
            player_profile = MojangData(
                username=self.username,
                uuid=self.uuid,
                has_cape=self.has_cape,
                skin_showcase_b64=self.skin_showcase_b64,
                cape_name=self.cape_name,
                skin_url=self.skin_url,
                cape_url=self.cape_url,
                cape_front_b64=self.cape_showcase_b64,
                cape_back_b64=self.cape_back_b64
                )
        except Exception as e:
            logger.error(f"Could not build object MojangData: {e}")
            return None
        
        return player_profile

        
    def get_uuid(self) -> bool:
        """
        receives uuid based on username
        """
        try:
            request = requests.get(f"https://api.minecraftservices.com/minecraft/profile/lookup/name/{self.username}")
            logger.info("request success for getting UUID!")
            json_request = json.loads(request.text)
            logger.debug(json_request)
            self.uuid = json_request["id"]
            self.username = json_request["name"]
            return True
            
        except Exception as e:
            logger.error(f"something went wrong in get_uuid: {e}")
            return False
    
    def get_skin_data(self) -> None:
        """
        This function receives data about the skin and cape, requires UUID
        structure is here because it's confusing: https://minecraft.wiki/w/Mojang_API#Query_player's_skin_and_cape
        but basically there's a main json which contains a value that is base64 encoded
        that is where skin and cape data are (another json)
        """

        try:
            request = requests.get(f"https://sessionserver.mojang.com/session/minecraft/profile/{self.uuid}")
            json_request = json.loads(request.text)
            logger.info("request success for getting skin and cape data!")

            # gets a list which contains a dictionary
            self.username = json_request["name"]
            properties = json_request["properties"]
            base64_text = properties[0]["value"]
            decoded_base64_text = base64.b64decode(base64_text) # this is a bytes object
            decoded_base64_string = decoded_base64_text.decode("utf-8") # this is a string in UTF-8 
            
            # now that we have the decoded string, we can finally get the urls
            properties_json = json.loads(decoded_base64_string)
            logger.info(f"skin link: {properties_json['textures']['SKIN']['url']}")
            
            self.skin_url = properties_json["textures"]["SKIN"]["url"]
            
            try:
                logger.info(f"cape link: {properties_json['textures']['CAPE']['url']}")
                self.cape_url = properties_json["textures"]["CAPE"]["url"]
                self.has_cape = True

            except:
                self.has_cape = False
                logger.info(f"User {self.username} has no equipped cape")

        except Exception as e:
            logger.error(f"something went wrong in get_skin_data: {e}")

    def get_skin_images(self):
        """
        This downloads the images from skin url and optionally cape url(if it exists)
        """
        try:
            response_skin = requests.get(self.skin_url) # skin image request
            skin_bytes = io.BytesIO(response_skin.content)

            full_skin_image = Image.open(skin_bytes)
            logger.debug("skin image opened successfully")

            try: # we overlap base face with outer layer here
                crop_area = (8, 8, 16, 16)
                self.skin_showcase = full_skin_image.crop(crop_area) # base skin face
                
                crop_area = (40, 8, 48, 16)
                skin_showcase_overlay = full_skin_image.crop(crop_area) # skin face overlay
                _, _, _, alpha_mask = skin_showcase_overlay.split()

                paste_area = (0, 0)
                self.skin_showcase.paste(skin_showcase_overlay, paste_area, mask = alpha_mask)

                self.skin_showcase_b64 = pillow_to_b64(self.skin_showcase)
                
            except Exception as e:
                logger.error(f"something went wrong while cropping skin image: {e}")

        except Exception as e:
            logger.error(f"something went wrong in get_skin_images: {e}")
        

        # cape section
        if self.has_cape: # only gets image if url exists
            try:
                response_cape = requests.get(self.cape_url)
                cape_bytes = io.BytesIO(response_cape.content)

                full_cape_image = Image.open(cape_bytes) # uncropped cape image
                logger.info("cape image opened successfully")
            except Exception as e:
                logger.error(f"something went wrong while fetching cape image: {e}")

            try:
                crop_area = (1, 1, 11, 17)
                self.cape_showcase = full_cape_image.crop(crop_area)

            except Exception as e:
                logger.error(f"something went wrong while cropping cape image: {e}") 

            try:
                crop_area = (12, 1, 22, 17)
                self.cape_back = full_cape_image.crop(crop_area)
            except Exception as e:
                logger.error(f"something went wrong while cropping back of cape: {e}")

            self.cape_showcase_b64 = pillow_to_b64(self.cape_showcase)
            self.cape_back_b64 = pillow_to_b64(self.cape_back)

            raw_cape_data = self.cape_url[-32:]
            try:
                logger.info(f"trying to access {raw_cape_data}")
                self.cape_name = CAPE_MAP[raw_cape_data]
                logger.info(f"Identified {self.cape_name} cape!")
            except:
                logger.warning("Cape not regonized")
                self.cape_name = "Unkown cape"

            return self.skin_showcase_b64, self.cape_showcase_b64, self.cape_back_b64
            
        else:
            logger.info(f"no cape for user {self.username}")

            return self.skin_showcase_b64, None, None

    def get_name(self):
        try:
            request = requests.get(f"https://sessionserver.mojang.com/session/minecraft/profile/{self.uuid}")

            request.raise_for_status()

            self.username = request.json()["name"]
            logger.debug(self.username)
            return self.username
        
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error occured: {e}")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"Request exception occured: {e}")
            return None
        except Exception as e:
            logger.error(f"something went wrong while getting name from uuid: {e}")
            return None
        
if __name__ == "__main__":
    user = GetMojangAPIData(None, "d63a3a136e8a43e6918fddc5a1eb6c84")
    print(user.get_data())