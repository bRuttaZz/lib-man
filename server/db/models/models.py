import datetime
import sqlalchemy as sa
from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


def datetime_now(
        negative_hr_delta:float=0, 
        negative_min_delta:float=0, 
        negative_day_delta:float=0):
    """return current time"""
    negative_time_delta = datetime.timedelta(hours=negative_hr_delta, minutes=negative_min_delta, days=negative_day_delta)
    time_shift = datetime.timedelta(hours=5, minutes=30)
    return datetime.datetime.utcnow() + time_shift - negative_time_delta

class Admin(Base):
    """Admin account"""
    __tablename__ = "admin_account"
    id = Column(sa.Integer(), primary_key=True, autoincrement=True)
    username = Column(sa.String(15), unique=True)
    password_hash = Column(sa.String(65), nullable=False)

class Books(Base):
    """Book details"""
    __tablename__ = "books"
    id = Column(sa.Integer(), primary_key=True, autoincrement=True)
    # given data
    bookID = Column(sa.Integer(), unique=True)
    title = Column(sa.String(250), nullable=False)
    authors = Column(sa.String(250))
    average_rating = Column(sa.Float())
    isbn = Column(sa.String(11))
    isbn13 = Column(sa.String(14))
    language_code = Column(sa.String(10))
    num_pages = Column(sa.Integer())
    ratings_count = Column(sa.Integer())
    text_reviews_count = Column(sa.Integer())
    publication_date = Column(sa.Date())
    publisher = Column(sa.String(125))

    # book keeping values
    bookCount = Column(sa.Integer(), default=1)

class Members(Base):
    """Member details"""
    __tablename__ = "members"
    id = Column(sa.Integer(), primary_key=True, autoincrement=True)
    name = Column(sa.String(50), nullable=False)
    phone_number = Column(sa.String(10), unique=True, nullable=False)
    email = Column(sa.String(50), unique=True, nullable=False)

class Transactions(Base):
    """Transaction details"""
    __tablename__ = "transactions"
    id = Column(sa.Integer(), primary_key=True, autoincrement=True)
    borrowed_at = Column(sa.DateTime(), nullable=False, default=datetime_now)
    returned_at = Column(sa.DateTime(), nullable=True)
    returned = Column(sa.Boolean(), default=False)

    reader_id = Column(sa.Integer(), ForeignKey("members.id"))
    book_id = Column(sa.Integer(), ForeignKey("books.id"))

    reader = relationship("Members", backref="transactions")
    book = relationship("Books", backref="transactions")




