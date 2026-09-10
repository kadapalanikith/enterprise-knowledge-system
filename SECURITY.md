# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of this enterprise knowledge system seriously. If you discover a security vulnerability, please do not open a public GitHub issue.

Instead, please send an email to the project maintainer:
- **Email**: kadapalanikith@gmail.com
- **Subject line**: `[SECURITY VULNERABILITY] Enterprise Knowledge System`

Please provide:
1. Description of the vulnerability and potential impact.
2. Steps to reproduce or proof-of-concept.
3. Affected components, routes, or files.

You will receive an acknowledgment within 48 hours, followed by updates on triage and remediation.

## Core Security Rules

1. **Zero Secret Leakage**:
   - Connection strings (`MONGO_URI`), API keys, credentials, and `.env` files must NEVER be committed to version control or included in build artifacts.
   - All `.env*` files are ignored by git via root and package `.gitignore` files, except `.env.example`.
2. **Access Control & Permissions**:
   - Knowledge discovery and document endpoints must enforce authentication and role-based permissions before returning data.
   - Authorization filtering must occur on the server/database layer, never client-side.
3. **Auditing**:
   - All sensitive knowledge access, document updates, and access denials must generate immutable audit events.
