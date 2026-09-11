from datetime import UTC, datetime

from pydantic import BaseModel, ConfigDict, Field

from backend.models.user import UserRole


class DocumentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    tags: list[str] = Field(default_factory=list)
    allowed_roles: list[UserRole] = Field(
        default_factory=lambda: [UserRole.EDITOR, UserRole.ADMIN, UserRole.VIEWER],
        description="List of roles that are allowed to access the document. Defaults to all roles.",
    )


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    content: str | None = Field(None, min_length=1)
    tags: list[str] | None = None
    allowed_roles: list[UserRole] | None = None


class DocumentInDB(DocumentBase):
    id: str = Field(alias="_id")
    author_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    model_config = ConfigDict(populate_by_name=True)


class DocumentResponse(DocumentBase):
    id: str = Field(alias="_id")
    author_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(populate_by_name=True)
