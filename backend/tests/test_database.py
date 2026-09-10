from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

from backend.database import client, database


def test_database_client_instance() -> None:
    assert isinstance(client, AsyncMongoClient)


def test_database_instance_and_name() -> None:
    assert isinstance(database, AsyncDatabase)
    assert database.name == "enterprise_knowledge_system"
