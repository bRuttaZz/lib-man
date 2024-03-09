import datetime
from hashlib import sha256
from hmac import compare_digest
import jwt

JWT_ALGORITHM = "HS256"

def get_hash(string:str):
    """generate hash from a string"""
    h = sha256(string.encode("utf-8"))
    return h.hexdigest()

def compare_string_with_hash(string:str, hash_string:str):
    """Compare string with hashed string"""
    return compare_digest(get_hash(string), hash_string)


def get_jwt(obj:dict, timeout_hrs:int, secret:str):
    """Create new jwt token from given dictionary"""
    obj["exp"] = datetime.datetime.now() + datetime.timedelta(hours=timeout_hrs)
    return jwt.encode(obj, secret, algorithm=JWT_ALGORITHM)

def check_jwt(token:str, secret:str):
    try:
        return True, jwt.decode(token, secret, algorithms=JWT_ALGORITHM)
    except jwt.ExpiredSignatureError:
        return False, "token_expire"
    except :
        return False, "decode_error"