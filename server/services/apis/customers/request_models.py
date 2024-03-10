from pydantic import BaseModel, Field


class CreateMember(BaseModel):
    """Craete new memeber"""
    name:str = Field(..., description="name of the customer", min_length=3, max_length=50)
    phone_number:str = Field(..., description="phone of the customer", min_length=9, max_length=10)
    email:str = Field(..., description="name of the customer", min_length=4, max_length=50)

class OptionalMemberFields(BaseModel):
    """Craete new memeber"""
    name:str = Field("", description="name of the customer", min_length=0, max_length=50)
    phone_number:str = Field("", description="phone of the customer", min_length=0, max_length=10)
    email:str = Field("", description="name of the customer", min_length=0, max_length=50)


class SearchMember(OptionalMemberFields):
    """ for search membres """
    page:int = Field(1, description="number of  page")


class DeleteMember(BaseModel):
    id:int = Field(..., description="id of the customer")

class UpdateMember(OptionalMemberFields, DeleteMember):
    """Craete new memeber"""
