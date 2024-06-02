from typing import Literal, NamedTuple, TypedDict, Dict, Any

type TokenType = Literal["access", "refresh"]

class SecurityPayloadReturn(NamedTuple):
    class Payload(TypedDict):
        iat: float ; exp: float ; trg: float
        
        data: Dict[str, Any]
        csrf: str

    payload: Payload ; csrf: str

class SecurityTokenReturn(NamedTuple):
    token: str ; csrf: str
