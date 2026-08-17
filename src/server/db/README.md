# Database Layer

This project keeps its production data model in `src/server/db/schema.sql`.

Runtime persistence is currently split into:
- `src/server/services` for business logic
- `src/server/auth` for auth session and OTP helpers
- `src/server/db` for MySQL state storage helpers

When a live database is connected, this folder can hold repository adapters and migration scripts.
