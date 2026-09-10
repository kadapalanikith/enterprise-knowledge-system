from pymongo import AsyncMongoClient

from backend.config import settings

client = AsyncMongoClient(settings.mongo_uri)
database = client["enterprise_knowledge_system"]
