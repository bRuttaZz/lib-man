
from .base import Base

# this import is crusial for the migration configs (Yeah otherwise the the Base.metadata will be empty)
from .models import Admin, Books, Members, Transactions

