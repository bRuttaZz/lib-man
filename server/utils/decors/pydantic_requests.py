import logging
from flask import request
from pydantic import BaseModel

def validate_input(input_model:BaseModel):
    """Returns a validator decorator, for validating and passing the request input"""
    def dec(handler:callable):   
        def modified_handler(*args, **kwargs):
            dat = request.get_json(force=True, silent=True)
            dat = dat if dat else {}
            if not isinstance(dat, dict):
                logging.warning(f"[request err] : jsonification error :!")
                return {"success": False, "detail": "UNPREOCESSIBLE_ENTITY"}, 422
            try:
                dat = input_model(**dat)
            except Exception as exp:
                logging.warning(f"[request err] : validation error : {exp}")
                return {"success": False, "detail": "UNPROCESSIBLE_ENTITY"}, 422
            return handler(dat, *args, **kwargs)
        return modified_handler
    return dec 