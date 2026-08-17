# SopySafe

Premium Indian e-commerce scaffold for the SopySafe brand.

## Included
- Next.js App Router storefront
- Tailwind-based luxury design system
- Dynamic product and category routes
- Account, policy, checkout, and admin surfaces
- SEO routes and metadata helpers
- MySQL-backed backend with a clean TypeScript service layer
- API route scaffolding
- Brand and implementation docs

## Local setup
1. Install dependencies
2. Copy `.env.example` to `.env.local`
3. Set `NEXT_PUBLIC_SITE_URL`
4. For production auth, set:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` or use the default `/api/auth/google`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`
   - `AUTH_SECRET`
5. Run `npm run db:seed` after MySQL is ready
6. Run `npm run dev`
7. Open the site on desktop or mobile using `http://localhost:3000` or `http://192.168.1.114:3000`

## Auth and storage
- Google login uses the standard OAuth code flow with PKCE.
- OTP delivery uses Twilio Verify when configured; otherwise the local dev fallback still works.
- Catalog, auth, and order state are stored in MySQL `app_state` rows.
- The local `.data` folder is used as a seed source and fallback snapshot.
- The app also exposes `/api/health` for deployment checks and `/api/catalog` for the live storefront state.

## Production checklist
- See [docs/production-checklist.md](./docs/production-checklist.md)
- See [docs/deployment-guide.md](./docs/deployment-guide.md)

## Repository layout
- `src/` application code
- `src/app/` routes, pages, and API handlers
- `src/components/` frontend UI
- `src/lib/` shared domain/data helpers
- `src/server/` backend-facing storage, auth, and config adapters
- `src/server/services/` backend service layer for orders, catalog, and auth flows
- `public/` static assets
- `docs/` planning and reference documents
- `docs/assets/` design screenshots and visual references
- `src/server/db/` MySQL connection and schema helpers
- Root config files only: `package.json`, `next.config.mjs`, `tsconfig*.json`, `eslint.config.mjs`, `postcss.config.mjs`

## Backend stack
- API layer: Next.js App Router route handlers
- Service layer: TypeScript backend services in `src/server/services`
- Storage layer: MySQL-backed `app_state` JSON storage with local fallback snapshots
- Database layer: MySQL via `MYSQL_URL` with `DATABASE_URL` fallback for compatibility
