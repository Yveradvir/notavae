from secrets import token_hex
from datetime import datetime, timezone
from typing import Any, Union, Dict, Annotated

from fastapi import HTTPException, Request, Response, status, Depends
from fastapi.security import APIKeyCookie, APIKeyHeader

from app.core.security.models.jwt_config import JwtConfig, CookieNames
from app.core.security.models.jwt_constant import SecurityPayloadReturn, SecurityTokenReturn, TokenType

import jwt

cookie_names = CookieNames()

access_cookie_depend = Depends(APIKeyCookie(name=cookie_names.access_token_cookie, scheme_name=cookie_names.access_token_cookie, description="Access token in cookies"))
access_csrf_depend = Depends(APIKeyCookie(name=cookie_names.access_token_csrf, scheme_name=cookie_names.access_token_csrf, description="Access csrf token from cookies"))

refresh_cookie_depend = Depends(APIKeyCookie(name=cookie_names.refresh_token_cookie, scheme_name=cookie_names.refresh_token_cookie, description="Refresh token in cookies"))
refresh_csrf_depend = Depends(APIKeyCookie(name=cookie_names.refresh_token_csrf, scheme_name=cookie_names.refresh_token_csrf, description="Refresh csrf token from cookies"))

header_csrf_depend = Depends(APIKeyHeader(name="X-CSRF-Token", scheme_name="X-CSRF-Token", description="Csrf for jwt token"))

class JwtSecurity:
    config: JwtConfig
    
    def __init__(self, config: JwtConfig) -> None:
        self.jwt = jwt.PyJWT()
        self.config = config
    

    def _g_posix(self) -> float:
        """
        Get posix string

        Return: 
            timestamp(posix) number of current time
        """

        return datetime.now(tz=timezone.utc).timestamp()

    def get_payload(
        self, data: Dict 
    ) -> SecurityPayloadReturn:
        """
        Create a payload for tokens

        Parameters:
            data (Dict[str, Any]): Data to be encoded into the token

        Return:
            SecurityPayloadReturn: A named tuple with Payload typed dict first and csrf token
        """

        posix = self._g_posix()
        csrf = token_hex(16)

        return SecurityPayloadReturn({
            "iat": posix,
            "exp": posix + self.config.access_token_life,
            "trg": posix + self.config.access_token_triger,
            "csrf": csrf,
            "data": data
        }, csrf)

    def create_access_token(
        self, data: Dict[str, Any]
    ) -> SecurityTokenReturn:
        """
        Creates an access token

        Parameters:
            data (Dict[str, Any]): Data to be encoded into the token

        Returns:
            SecurityTokenReturn: A named tuple with jwt token first and csrf token second
        """

        payload, csrf = self.get_payload(data)
        token = self.jwt.encode(
            payload=payload, key=self.config.secret_key, 
            algorithm=self.config.algorithm,
            headers={
                "alg": self.config.algorithm,
                "typ": "JWT",
                "ttype": "access"
            }
        )
    
        return SecurityTokenReturn(token, csrf)
    
    def create_refresh_token(
        self, data: Dict[str, Any]
    ) -> SecurityTokenReturn:
        """
        Creates a refresh token

        Parameters:
            data (Dict[str, Any]): Data to be encoded into the token

        Returns:
            SecurityTokenReturn: A named tuple with jwt token first and csrf token second.
        """

        payload, csrf = self.get_payload(data)
        payload.pop("trg")
        
        token = self.jwt.encode(
            payload=payload, key=self.config.secret_key, 
            algorithm=self.config.algorithm,
            headers={
                "alg": self.config.algorithm,
                "typ": "JWT",
                "ttype": "access"
            }
        )
        return SecurityTokenReturn(token, csrf)
    
    def set_cookies(
        self, response: Response, 
        token_data: SecurityTokenReturn, token_type: TokenType    
    ) -> None:
        """
        Set token to response.

        Parameters:
            response (Response): Response instance for setting cookies
            token_data (SecurityTokenReturn): Product of self.create_<type>_token function
            token_type ("access" | "refresh"): Type of token
        """
        
        _c = self.config ; _n = cookie_names
        response.set_cookie(
            key=_n.access_token_cookie if token_type == "access" else _n.refresh_token_cookie,
            max_age=_c.access_token_life if token_type == "access" else _c.refresh_token_life,
            value=token_data.token, httponly=True, samesite="lax", secure=_c.secure
        )
        response.set_cookie(
            key=_n.access_token_csrf if token_type == "access" else _n.refresh_token_csrf,
            max_age=_c.access_token_life if token_type == "access" else _c.refresh_token_life,
            value=token_data.csrf, httponly=False, samesite="lax", secure=_c.secure
        )
    
    def verify(self, token: str) -> SecurityPayloadReturn.Payload:
        """
        Verify jwt token

        Parameters:
            token (str): JW Token
        Return:
            SecurityPayloadReturn.Payload (TypedDict): Payload of the token
        """

        try:
            print(token)
            token = self.jwt.decode(token, self.config.secret_key, algorithms=self.config.algorithm)
            return token
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED, "Unauthorized, jwt token has expired"
            )
        except jwt.InvalidSignatureError:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, "Invalid signature"
            )
        except jwt.DecodeError:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, "Invalid jwt"
            )
        except Exception as e:
            print("[ JwtSecure:verify > ", e)
            
            raise HTTPException(
                status.HTTP_500_INTERNAL_SERVER_ERROR, "Something went wrong"
            )
    
    async def depend_access_token(
        self, request: Request,
        access_token: Union[str, None] = access_cookie_depend, 
        access_csrf: Union[str, None] = access_csrf_depend,
        header_csrf: Union[str, None] = header_csrf_depend
    ):
        """
        Function that provides depend of access token in FastAPI routes
        
        Parameters:
            request (Request): Request that will save token data in state.token_data
            access_token, access_ and header_ csrf (Annotated[Union[str, None], api_depend]):
                dependies to make sure that access token is correct and provided
        """
        
        if access_token is None:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthorized. Access token is required but not provided")

        if not all([access_csrf, header_csrf]):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthorized. Some csrf isn't provided")

        token = self.verify(access_token)

        if token:
            if token["csrf"] == access_csrf == header_csrf:
                trg = token.get("trg", None)
                if trg:
                    if (self._g_posix() - token["iat"]) > self.config.access_token_triger:
                        self.set_cookies(Response(), token["data"], "access")
                
                request.state.token = token
            else:
                raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Csrf tokens aren't match")
    
    async def depend_refresh_token(
        self, request: Request,
        refresh_token: Union[str, None] = refresh_cookie_depend, 
        refresh_csrf: Union[str, None] = refresh_csrf_depend,
        header_csrf: Union[str, None] = header_csrf_depend
    ):
        """
        Function that provides depend of refresh token in FastAPI routes
        
        Parameters:
            request (Request): Request that will save token data in state.token_data
            refresh_token, refresh_ and header_ csrf (Annotated[Union[str, None], api_depend]):
                dependies to make sure that refresh token is correct and provided
        """
        
        if refresh_token is None:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthorized. Refresh token is required but not provided")

        if not all([refresh_csrf, header_csrf]):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthorized. Some csrf isn't provided")

        token = self.verify(refresh_token)

        if token:
            if token["csrf"] == refresh_csrf == header_csrf:                
                request.state.token = token
            else:
                raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Csrf tokens aren't match")
        