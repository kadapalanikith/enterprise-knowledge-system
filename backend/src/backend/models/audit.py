from datetime import UTC, datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class AuditAction(StrEnum):
    AUTH_LOGIN_SUCCESS = "auth_login_success"
    AUTH_LOGIN_FAILURE = "auth_login_failure"
    DOCUMENT_CREATE = "document.create"
    DOCUMENT_UPDATE = "document.update"
    DOCUMENT_DELETE = "document.delete"
    DOCUMENT_VIEW = "document.view"
    ACCESS_DENIED = "access.denied"


class AuditEventCreate(BaseModel):
    user_id: str | None = None
    action: AuditAction
    resource_type: str = "document"
    resource_id: str | None = None
    ip_address: str | None = None
    status: str = "allowed"
    details: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class AuditEventInDB(AuditEventCreate):
    id: str = Field(alias="_id")

    model_config = ConfigDict(populate_by_name=True)


class AuditEventResponse(AuditEventInDB):
    pass
