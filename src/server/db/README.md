# Database Layer

This project keeps its production data model in `src/server/db/schema.sql`.

Runtime persistence is split into:
- `src/server/services` for business logic
- `src/server/auth` for auth session and OTP helpers
- `src/server/db` for MySQL state storage helpers

MySQL currently stores catalog, order, and auth state in the `app_state` table as JSON payloads.
The seed script in `scripts/seed-mysql.ts` can bootstrap a fresh database from the local `.data` snapshot or default storefront data.
