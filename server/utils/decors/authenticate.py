from flask import request, make_response, Response, redirect
from ..crypt import get_jwt, check_jwt
from ...settings import SESSION_EXPIRY_HOURS, JWT_SESSION_SECRET

COOKIE_KEY="sessionId"

def authenticate(res:dict = {}, status_code:int=200) -> Response:
    """To authenticate a session"""
    response = make_response(res, status_code)
    response.set_cookie(COOKIE_KEY, get_jwt({}, SESSION_EXPIRY_HOURS, JWT_SESSION_SECRET))
    return response

def validate_session(redirect_req="/login"):
    """Decorator to authenticate sessions. See `authenticate` for setting the validation"""
    def dec(fun:callable):
        def modified_fun(*args, **kwargs):
            status, dat = check_jwt(request.cookies.get(COOKIE_KEY, "-"), JWT_SESSION_SECRET)
            if not status:
                if redirect_req:
                    return redirect(redirect_req)
                elif dat == "token_expire":
                    return {"success": False, "detail": "SESSION_EXPIRED"}, 400
                else:
                    return {"success": False, "detail": "INVALID_SESSION"}, 401
            return fun(*args, **kwargs)
        return modified_fun
    return dec

def api_key_check(access_key:str, header_key_name:str="key"):
    """Check api key in header for validation, the key name is `key`"""
    def dec(fun:callable):
        def modified_fun(*args, **kwargs):
            if request.headers.get(header_key_name, "") != access_key:
                return {"success": False, "detail": "NOT_AUTHENTICATED"}, 401
            return fun(*args, **kwargs)
        return modified_fun
    return dec 