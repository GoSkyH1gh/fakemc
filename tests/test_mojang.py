from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from minecraft_api import GetMojangAPIData, MojangData
from pathlib import Path

current_directory = Path(__file__).parent


@patch("minecraft_api.requests.get")
def test_mojang_data(mock_get):
    fake_response_uuid = MagicMock()
    fake_response_uuid.json.return_value = {
        "id": "3ff2e63ad63045e0b96f57cd0eae708d",
        "name": "GoSkyHigh",
    }

    fake_response_profile = MagicMock()
    fake_response_profile.json.return_value = {
        "id": "3ff2e63ad63045e0b96f57cd0eae708d",
        "name": "GoSkyHigh",
        "properties": [
            {
                "name": "textures",
                "value": "ewogICJ0aW1lc3RhbXAiIDogMTc1NTI1NDkzOTI2OCwKICAicHJvZmlsZUlkIiA6ICIzZmYyZTYzYWQ2MzA0NWUwYjk2ZjU3Y2QwZWFlNzA4ZCIsCiAgInByb2ZpbGVOYW1lIiA6ICJHb1NreUhpZ2giLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWY3NzM4MWEzYmY2ZjY5YzBjYWE0NWRkZDA3OTljODA1YjkyZDkwNDY0OTY2ZDk3MzU1ZGJmNjBkYzQ2ZTVjMyIKICAgIH0sCiAgICAiQ0FQRSIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOTlhYmEwMmVmMDVlYzZhYTRkNDJkYjhlZTQzNzk2ZDZjZDUwZTRiMjk1NGFiMjlmMGNhZWI4NWY5NmJmNTJhMSIKICAgIH0KICB9Cn0=",
            }
        ],
        "profileActions": [],
    }

    fake_skin_image_response = MagicMock()
    with open(current_directory / "samples" / "mc_goskyhigh_skin_raw", "rb") as file:
        fake_skin_image_response.content = file.read()

    fake_cape_image_response = MagicMock()
    with open(current_directory / "samples" / "mc_founders_cape_raw", "rb") as file:
        fake_cape_image_response.content = file.read()

    mock_get.side_effect = [
        fake_response_uuid,
        fake_response_profile,
        fake_skin_image_response,
        fake_cape_image_response,
    ]

    instance = GetMojangAPIData("GoSkyHigh")
    mojang_data = instance.get_data()
    assert isinstance(mojang_data, MojangData)
    assert mojang_data.has_cape == True
    assert mojang_data.username == "GoSkyHigh"
    assert mojang_data.cape_name == "Founder's"
    assert mojang_data.uuid == "3ff2e63ad63045e0b96f57cd0eae708d"
    assert (
        mojang_data.skin_url
        == "http://textures.minecraft.net/texture/ef77381a3bf6f69c0caa45ddd0799c805b92d90464966d97355dbf60dc46e5c3"
    )
    assert (
        mojang_data.cape_url
        == "http://textures.minecraft.net/texture/99aba02ef05ec6aa4d42db8ee43796d6cd50e4b2954ab29f0caeb85f96bf52a1"
    )


@patch("minecraft_api.requests.get")
def test_mojang_no_cape(mock_get):
    fake_response_uuid = MagicMock()
    fake_response_uuid.json.return_value = {
        "id": "3ff2e63ad63045e0b96f57cd0eae708d",
        "name": "GoSkyHigh",
    }

    fake_response_profile = MagicMock()
    fake_response_profile.json.return_value = {
        "id": "3ff2e63ad63045e0b96f57cd0eae708d",
        "name": "GoSkyHigh",
        "properties": [
            {
                "name": "textures",
                "value": "ewogICJ0aW1lc3RhbXAiIDogMTc1NTI4MDY3NTIyNiwKICAicHJvZmlsZUlkIiA6ICIzZmYyZTYzYWQ2MzA0NWUwYjk2ZjU3Y2QwZWFlNzA4ZCIsCiAgInByb2ZpbGVOYW1lIiA6ICJHb1NreUhpZ2giLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZWY3NzM4MWEzYmY2ZjY5YzBjYWE0NWRkZDA3OTljODA1YjkyZDkwNDY0OTY2ZDk3MzU1ZGJmNjBkYzQ2ZTVjMyIKICAgIH0KICB9Cn0=",
            }
        ],
        "profileActions": [],
    }

    fake_skin_image_response = MagicMock()
    with open(current_directory / "samples" / "mc_goskyhigh_skin_raw", "rb") as file:
        fake_skin_image_response.content = file.read()

    mock_get.side_effect = [
        fake_response_uuid,
        fake_response_profile,
        fake_skin_image_response,
    ]

    instance = GetMojangAPIData("GoSkyHigh")
    mojang_data = instance.get_data()
    assert isinstance(mojang_data, MojangData)
    assert mojang_data.has_cape == False
    assert mojang_data.username == "GoSkyHigh"
    assert mojang_data.cape_name == None
    assert mojang_data.uuid == "3ff2e63ad63045e0b96f57cd0eae708d"
    assert (
        mojang_data.skin_url
        == "http://textures.minecraft.net/texture/ef77381a3bf6f69c0caa45ddd0799c805b92d90464966d97355dbf60dc46e5c3"
    )
    assert mojang_data.cape_url == None


@patch("minecraft_api.requests.get")
def test_mojang_404(mock_get):
    fake_response_uuid = MagicMock()
    fake_response_uuid.status_code = 404
    fake_response_uuid.json.return_value = {
        "path": "/minecraft/profile/lookup/name/goskyhigh_",
        "errorMessage": "Couldn't find any profile with name goskyhigh_",
    }

    mock_get.return_value = fake_response_uuid
    instance = GetMojangAPIData("goskyhigh_")
    mojang_data = instance.get_data()
    assert mojang_data is None

@patch("minecraft_api.requests.get")
def test_mojang_429(mock_get):
    fake_response_uuid = MagicMock()
    fake_response_uuid.status_code = 429
    fake_response_uuid.json.return_value = {'path': '/session/minecraft/profile/0000566aa28347c4940654afc438008b'}

    mock_get.return_value = fake_response_uuid
    instance = GetMojangAPIData("goskyhigh")
    mojang_data = instance.get_data()
    assert mojang_data is None
