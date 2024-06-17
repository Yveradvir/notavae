from sqlalchemy import Column, ForeignKey, select, delete

from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base, relationship, DeclarativeBase
from sqlalchemy.types import Uuid, UUID, DateTime, Date, LargeBinary, Integer, Text, String

from uuid import uuid4
from base64 import b64decode, b64encode
from datetime import datetime, timezone

class InitialMixin(object):
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid4)

    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        """Converts the SQLAlchemy model instance to a dictionary."""
        data = {}

        for col in self.__table__.columns:
            if isinstance(col.type, LargeBinary):
                binary_data = getattr(self, col.name)
                if binary_data:
                    data[col.name] = b64encode(
                        getattr(self, col.name)
                    ).decode()
                else:
                    data[col.name] = None
            elif isinstance(col.type, (Date, DateTime)):
                date_data = getattr(self, col.name).isoformat()
                data[col.name] = date_data
            elif isinstance(col.type, (Uuid, UUID)):
                data[col.name] = str(getattr(self, col.name))
            else:
                data[col.name] = getattr(self, col.name)

        return data

    def to_reducer_dict(self):
        """SHOULD BE OVERWRITEN! Make self.to_dict-method version for reducer in frontend."""
        
        pop_data = ["password"]
        data = self.to_dict()
        
        for key in pop_data:
            data.pop(key, None)

        return data

Base = declarative_base()