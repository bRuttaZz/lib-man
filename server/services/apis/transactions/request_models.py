from pydantic import BaseModel, Field, model_validator
from ....db.models import Members, Books, Transactions

class SearchTransactions(BaseModel):
    _searchType=None 

    reader_name:str = Field("", description="name of the reader", min_length=1, max_length=15)
    book_name:str = Field("", description="title of the book", min_length=1, max_length=250)
    isbn: str = Field("", description="ISBN of the book", min_length=1, max_length=15)
    transaction_status: str | None = Field("", description="Transaction status (Give True / False)", min_length=1, max_length=5)
    page: int = Field(1, description="page number")

    @model_validator(mode="after")
    def set_similar_ones(self):
        if self.reader_name:
            self._searchType = Members
        elif self.book_name or self.isbn:
            self._searchType = Books
        elif self.transaction_status:
            self.transaction_status = True if self.transaction_status.strip().lower()=="true" else False
            self._searchType = Transactions

        return self

class CreateTransaction(BaseModel):
    reader_id:int = Field(..., description="reader id")
    book_id: int = Field(..., description="Book id")

class DeleteTransaction(BaseModel):
    id: int = Field(..., description="id to be deleted")

class UpdateTransaction(DeleteTransaction):
    returned: bool = Field(..., description="Whether completed or not")