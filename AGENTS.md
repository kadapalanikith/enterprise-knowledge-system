# Agent Instructions: Enterprise Knowledge System

This repository uses persistent project memory. Every AI coding agent working in this repository must adhere to these instructions.

## Workflow

```text
Code -> Test -> Update Memory -> Verify
```

## Persistent Project Memory

Documentation in this repository represents the shared persistent memory across sessions. When completing any meaningful development task, update the relevant files:

- **`AI_CONTEXT.md`**: Core technical facts, current stack, database collections, auth model, key constraints, and known issues.
- **`TASKS.md`**: Task tracker (`Completed`, `In progress`, `Blocked`, `Next`, `Future`). Keep granular and mark items completed as progress is made.
- **`DECISIONS.md`**: Architectural and product decisions formatted as `D-xxx` (Decision, Reason, Alternatives considered, Consequences). Do not record trivial edits.
- **`HANDOFF.md`**: Operational handoff for immediate session continuation (current state, recent work, blockers, next actions, test commands).
- **`PROJECT_PLAN.md`**: Bounded product roadmap and implementation phase milestones.
- **`README.md`**: Public onboarding, setup, and execution instructions.

## Development Rules

1. **Code is the source of truth**: Verify claims against actual code. Never overwrite project memory with assumptions.
2. **Zero secret leakage**: Never log, commit, or write connection strings, passwords, API keys, or `.env` content into documentation or source files.
3. **Preserve established architecture**:
   - Node.js (plain JavaScript, CommonJS), Express.js, Mongoose, dotenv, `npm`.
   - Single database named `enterprise_knowledge_system` (Mongoose `dbName` option).
   - Fail-fast startup: `connectDB()` throws → `index.js` exits with code 1 if DB unreachable.
   - Jest with `--forceExit` in `package.json` test script.
   - ESLint flat config in `backend/eslint.config.mjs` (no `.eslintrc` files).
4. **Proportional updates**: Do not spend entire sessions editing documentation. Keep updates crisp and proportional to code changes.
5. **No unauthenticated/unprotected features**: All knowledge access and administrative operations must enforce explicit permissions once Phase 1 & 2 are in place.

## Standard Verification Commands

Execute from `backend/`:

```powershell
npm install
npm test
npx eslint src/
npm start
```

## End-of-Task Protocol

Before marking any meaningful task complete:
1. Run automated tests and lint checks (`pytest`, `ruff`).
2. Update `TASKS.md` to reflect progress and update next steps.
3. Update `AI_CONTEXT.md` if architecture, schema, or implementation details changed.
4. Update `DECISIONS.md` if an architectural decision was made.
5. Update `HANDOFF.md` with the new immediate handoff state.
6. Report concise summary of changes and immediate next action.
