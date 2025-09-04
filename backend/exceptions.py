from fastapi import HTTPException
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    detail: str

class NotFound(HTTPException):
    def __init__(self):
        super().__init__(
            detail=f"Requested resource not found",
            status_code=404,
        )

class UpstreamError(HTTPException):
    def __init__(self):
        super().__init__(
            detail=f"Recieved an error from Upstream",
            status_code=502,
        )