# Database Layer

This project keeps its production data model in `prisma/schema.prisma`.

Runtime persistence is currently split into:
- `src/server/storage` for local JSON-backed catalog and order storage
- `src/server/auth` for auth session and OTP helpers

When a live database is connected, this folder can hold the Prisma client and repository adapters.
