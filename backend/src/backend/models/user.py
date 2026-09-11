from datetime import UTC, datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRole(str, Enum):
    EDITOR = "editor"
    ADMIN = "admin"
    VIEWER = "viewer"


class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.VIEWER
    is_active: bool = True


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    model_config = ConfigDict(populate_by_name=True)


class UserResponse(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(populate_by_name=True)
