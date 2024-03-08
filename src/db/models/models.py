import datetime
import sqlalchemy as sa
from sqlalchemy import Column
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

class Books(Base):
    """Book details"""
    __tablename__ = "books"
    id = Column(sa.Integer(), primary_key=True, autoincrement=True)

class Members(Base):
    """Member details"""
    __tablename__ = "members"
    id = Column(sa.Integer(), primary_key=True, autoincrement=True)

class Transactions(Base):
    """Transaction details"""
    __tablename__ = "transactions"
    id = Column(sa.Integer(), primary_key=True, autoincrement=True)

