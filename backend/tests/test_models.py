from datetime import datetime

import pytest
from pydantic import ValidationError

from backend.models.audit import (
    AuditAction,
    AuditEventCreate,
    AuditEventInDB,
    AuditEventResponse,
)
from backend.models.document import (
    DocumentCreate,
    DocumentInDB,
    DocumentResponse,
    DocumentUpdate,
)
from backend.models.user import (
    UserCreate,
    UserInDB,
    UserResponse,
    UserRole,
)


def test_user_role_enum_values():
    assert UserRole.ADMIN == "admin"
    assert UserRole.EDITOR == "editor"
    assert UserRole.VIEWER == "viewer"


def test_user_create_validation():
    user = UserCreate(email="alice@company.com", password="securepassword123")
    assert user.email == "alice@company.com"
    assert user.role == UserRole.VIEWER
    assert user.is_active is True
    assert user.password == "securepassword123"

    with pytest.raises(ValidationError):
        # Invalid email
        UserCreate(email="not-an-email", password="securepassword123")

    with pytest.raises(ValidationError):
        # Password too short (< 8 chars)
        UserCreate(email="alice@company.com", password="short")


def test_user_in_db_and_response():
    db_user = UserInDB(
        _id="user_123",
        email="bob@company.com",
        role=UserRole.ADMIN,
        hashed_password="hashed_secret_string",
    )
    assert db_user.id == "user_123"
    assert db_user.hashed_password == "hashed_secret_string"
    assert isinstance(db_user.created_at, datetime)

    # Response should work by alias or name and exclude password
    response_user = UserResponse(
        _id="user_123",
        email=db_user.email,
        role=db_user.role,
        is_active=db_user.is_active,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
    )
    assert response_user.id == "user_123"
    assert not hasattr(response_user, "hashed_password")


def test_document_creation_and_defaults():
    doc = DocumentCreate(
        title="Engineering Handbook",
        content="# Internal Handbook\nContent goes here.",
    )
    assert doc.title == "Engineering Handbook"
    assert doc.tags == []
    assert doc.allowed_roles == [UserRole.EDITOR, UserRole.ADMIN, UserRole.VIEWER]

    with pytest.raises(ValidationError):
        # Empty title
        DocumentCreate(title="", content="valid content")

    with pytest.raises(ValidationError):
        # Empty content
        DocumentCreate(title="valid title", content="")


def test_document_update_fields():
    update = DocumentUpdate(title="New Title", allowed_roles=[UserRole.ADMIN])
    assert update.title == "New Title"
    assert update.content is None
    assert update.tags is None
    assert update.allowed_roles == [UserRole.ADMIN]


def test_document_db_and_response():
    doc_db = DocumentInDB(
        _id="doc_456",
        author_id="user_123",
        title="Security Policy",
        content="Classification Rules",
        tags=["security", "compliance"],
        allowed_roles=[UserRole.ADMIN],
    )
    assert doc_db.id == "doc_456"
    assert doc_db.author_id == "user_123"

    doc_response = DocumentResponse.model_validate(doc_db.model_dump(by_alias=True))
    assert doc_response.id == "doc_456"
    assert doc_response.tags == ["security", "compliance"]


def test_audit_event_logging():
    event = AuditEventCreate(
        user_id="user_123",
        action=AuditAction.DOCUMENT_VIEW,
        resource_id="doc_456",
        ip_address="192.168.1.1",
        status="allowed",
        details={"search_query": "security"},
    )
    assert event.action == "document.view"
    assert event.resource_type == "document"
    assert event.details["search_query"] == "security"

    event_db = AuditEventInDB(
        _id="audit_789",
        **event.model_dump(),
    )
    assert event_db.id == "audit_789"
    assert event_db.status == "allowed"

    event_resp = AuditEventResponse.model_validate(event_db.model_dump(by_alias=True))
    assert event_resp.id == "audit_789"
