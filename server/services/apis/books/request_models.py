import datetime
from typing import List
from pydantic import BaseModel, Field, model_validator


class Book(BaseModel):
    """Book model"""
    bookID:int 
    title: str = Field(..., description="title of the book", min_length=2, max_length=250)
    authors: str = Field(..., description="authors of the book", min_length=2, max_length=250)
    average_rating: float = Field(float, description="average rating of the book")
    isbn: str = Field(..., description="ISBN of the book", min_length=9, max_length=11)
    isbn13: str = Field(..., description="ISBN13 of the book", min_length=12, max_length=14)
    language_code: str = Field(..., description="lang code of the book", min_length=1, max_length=10)
    num_pages: int = Field(..., description="number of pages of the book") 
    ratings_count: int = Field(..., description="rating count of the book") 
    text_reviews_count: int = Field(..., description="text reviews count of the book")
    publication_date:str | datetime.date = Field(..., description="publication date of the book", min_length=5, max_length=10) 
    publisher:str = Field(..., description="publisher of the book", min_length=3, max_length=125)

    bookCount:int = Field(..., description="number of books")

    @model_validator(mode="after")
    def correct_time(self):
        if self.publication_date:
            self.publication_date = datetime.datetime.strptime(self.publication_date, "%m/%d/%Y").date()
        return self

class PutBooks(BaseModel):
    """Put new books into databse"""
    books : List[Book] = Field([], description="list of books to add", min_items=1, max_items=10)

    @model_validator(mode="after")
    def check_total_limit(self):
        count = sum([book.bookCount for book in self.books])
        if count > 10:
            raise Exception("total_book_count_exceeded!")
        return self
    
class SearchBook(BaseModel):
    """search for books"""
    title: str = Field("", description="title of the book", min_length=1, max_length=250)
    authors: str = Field("", description="authors of the book", min_length=1, max_length=250)
    isbn: str = Field("", description="ISBN of the book", min_length=1, max_length=15)
    isbn13: str = Field("", description="ISBN13 of the book", min_length=1, max_length=15)
    language_code: str = Field("", description="lang code of the book", min_length=1, max_length=10)
    publisher:str = Field("", description="publisher of the book", min_length=1, max_length=125)
    page:int = Field(1, description="page number")