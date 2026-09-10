# Project Plan

## Evidence boundary

This plan separates explicit repository intent from future work. The original README states the product goal: employees securely find internal knowledge, with role-based access to sensitive documents and an auditable access trail. No detailed feature specification, wireframes, data model, role taxonomy, user stories, delivery dates, or prior phased plan exists in the tracked repository or Git history. Items marked **TODO** are a continuation plan, not pre-approved implementation details.

## Goals

1. Deliver a secure internal-knowledge system.
2. Enable employees to find internal knowledge.
3. Enforce role-based access to sensitive documents.
4. Maintain an auditable trail of knowledge access.

## Architecture and implementation phases

### Phase 0 — Stabilize the foundation (Complete)

- Confirm a reachable MongoDB deployment and startup behavior (verified `{'ok': 1}`).
- Preserve the FastAPI, async PyMongo, Pydantic Settings, and uv foundation.
- Decide whether database failure should prevent all startup or be represented by separate liveness/readiness endpoints (Decision D-008: retained startup gate).
- Add minimal automated tests for configuration, lifespan behavior, and health behavior (`backend/tests/`, 11 tests passing).

**Definition of done:** reproducible setup from documented environment variables; an intentional, tested health contract; a database ping succeeds in a permitted environment; tests execute and collect at least the foundation tests. (Met on 2026-09-11).

### Phase 1 — Domain and data design (**In progress**)


- Define documents/knowledge items, user identity linkage, roles, permissions, and audit-event schemas.
- Define required MongoDB collections, indexes, validation, ownership/organization boundaries, retention, and migration/seed approach.
- Document the authorization rules before implementing endpoints.

**Definition of done:** reviewed schema and permission contract, indexes/migration approach, and tests for core data behavior. Exact collection names and fields are currently UNKNOWN.

### Phase 2 — Identity and authorization (**TODO**)

- Select an authentication strategy and identity provider or credential flow.
- Add current-user handling, role/permission checks, secure error behavior, and audit-event recording.
- Protect all knowledge routes by default.

**Definition of done:** an authenticated actor can access only authorized resources, denied attempts are tested, and relevant access events are auditable. The mechanism and role taxonomy are UNKNOWN.

### Phase 3 — Knowledge workflows (**TODO**)

- Define/administer knowledge item creation, update, retrieval, and visibility rules.
- Implement discovery/search only after authorization filtering is correct.
- Add API contracts, validation, pagination, and tests.

**Definition of done:** authorized users can find and retrieve permitted knowledge; unauthorized content cannot be discovered or retrieved; audit behavior is verified.

### Phase 4 — Frontend (**TODO**)

- Select and scaffold a web stack in the empty `frontend/` directory.
- Build sign-in, discovery, document access, and appropriate administration/audit experiences once API contracts are stable.

**Definition of done:** the frontend uses the protected API contract and does not substitute client-side checks for backend authorization. No frontend choice exists today.

### Phase 5 — Production readiness (**TODO**)

- Add CI, test coverage policy, dependency/security review, deployment configuration, observability, backup/restore, secrets management, CORS/host policy, and operational runbooks.

**Definition of done:** documented deploy path, automated verification, protected secrets, monitoring, and a recovery plan. Hosting is UNKNOWN.

## Milestones

| Milestone | State | Evidence |
| --- | --- | --- |
| Backend project scaffold | Complete | `backend/pyproject.toml`, `backend/uv.lock` |
| API app and MongoDB lifecycle hook | Complete | `backend/src/backend/main.py` |
| Verified MongoDB connection | Complete | Bounded ping `{'ok': 1}` and live lifespan verified |
| Test suite (Foundation) | Complete | `backend/tests/` (11 passing tests) |
| Domain model and RBAC | In progress | Schema and permission design |
| Audit trail | Not started | No collection or code |
| Knowledge workflows/search | Not started | No routes or code |
| Frontend | Not started | Empty `frontend/` directory |
| CI/deployment | Not started | No CI/deployment files |

## Future features


The following are implied only at a high level by the product statement and require explicit design: document ingestion, search/retrieval, role administration, audit reporting, frontend workflows, and production operations. Features such as semantic search, file uploads, embeddings, SSO, multi-tenancy, notifications, collaboration, or AI assistants are **UNKNOWN** and must not be assumed.
