from pydantic import BaseModel, Field, model_validator
from typing import Optional
from ....utils.crypt import get_hash

class LoginRequest(BaseModel):
    username:str = Field(..., description="username of admin user", max_length=15, min_length=1)
    password:str = Field(..., description="password of the user", max_length=25, min_length=5)

class AdminUpdateRequest(BaseModel):
    username:str = Field(..., description="username of current user", max_length=15, min_length=1)
    new_password:str = Field(..., description="new password", max_length=25, min_length=5)
    super_user_password: str = Field(..., description="super user password", max_length=25, min_length=1)

    @model_validator(mode="after")
    def check_if_any_exists(self):
        if not self.new_password:
            raise Exception("no_password")
        if self.new_password:
            self.new_password = get_hash(self.new_password)
        return self
