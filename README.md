# SopySafe

Premium Indian e-commerce scaffold for the SopySafe brand.

## Included
- Next.js App Router storefront
- Tailwind-based luxury design system
- Dynamic product and category routes
- Account, policy, checkout, and admin surfaces
- SEO routes and metadata helpers
- Prisma schema for PostgreSQL
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
5. Run `npm run dev`
6. Open the site on desktop or mobile using `http://localhost:3000` or `http://192.168.1.114:3000`

## Auth and storage
- Google login uses the standard OAuth code flow with PKCE.
- OTP delivery uses Twilio Verify when configured; otherwise the local dev fallback still works.
- Orders and auth users are persisted in local `.data` JSON files for this scaffold.
- The app also exposes `/api/health` for deployment checks and `/api/catalog` for the live storefront state.

## Production checklist
- Set the live site URL in `NEXT_PUBLIC_SITE_URL`
- Add Google OAuth credentials
- Add Twilio Verify credentials
- Add payment gateway webhook secret
- Verify `/api/health` returns `ready`

## Repository layout
- `src/` application code
- `src/app/` routes, pages, and API handlers
- `src/components/` frontend UI
- `src/lib/` shared domain/data helpers
- `src/server/` backend-facing storage, auth, and config adapters
- `public/` static assets
- `docs/` planning and reference documents
- `docs/assets/` design screenshots and visual references
- `prisma/` database schema
- Root config files only: `package.json`, `next.config.mjs`, `tsconfig*.json`, `eslint.config.mjs`, `postcss.config.mjs`
