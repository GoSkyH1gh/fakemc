from unittest.mock import patch, MagicMock
from fastapi import HTTPException
import json
from pathlib import Path
from hypixel_api import GetHypixelData

current_directory = Path(__file__).parent

with open(
    current_directory / "samples" / "hypixel_success.json", "r", encoding="utf-8"
) as f:
    SAMPLE_PLAYER_JSON = json.load(f)


@patch("hypixel_api.requests.get")
def test_get_basic_data_success(mock_get):
    mock_resp = MagicMock()
    mock_resp.json.return_value = SAMPLE_PLAYER_JSON
    mock_resp.raise_for_status.return_value = None
    mock_get.return_value = mock_resp

    hypixel = GetHypixelData("some-uuid", "fake-api-key")
    first_login, rank, last_login, status = hypixel.get_basic_data()

    # Assert: check parsed values
    assert status == "success"
    assert isinstance(first_login, str)
    assert isinstance(last_login, str)
    assert isinstance(rank, str)
