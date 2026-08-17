# Production Checklist

Use this checklist before you publish the storefront.

## Environment
- Set `NEXT_PUBLIC_SITE_URL` to the live domain.
- Set `MYSQL_URL` to the production MySQL connection string.
- Set `DATABASE_URL` as the same MySQL URL if you want compatibility fallback.
- Set `AUTH_SECRET` to a long random secret.
- Add Google OAuth credentials if login is enabled.
- Add Twilio Verify credentials if OTP login is enabled.
- Add payment gateway keys and webhook secret if checkout is enabled.

## Database
- Create the `app_state` table with `src/server/db/schema.sql`.
- Seed the database with `npm run db:seed`.
- Confirm the catalog, orders, and auth payloads exist in MySQL.

## App Checks
- Run `npm run typecheck`.
- Run `npm run build`.
- Start the app with `npm run start`.
- Verify `/api/health` returns ready.
- Test homepage, search, product page, cart, sign-in, and checkout.

## Deployment
- Deploy the Next.js app to your hosting provider.
- Point the domain to the deployed app.
- Re-check the live `NEXT_PUBLIC_SITE_URL`.
- Confirm MySQL firewall and credentials allow the app host.
- Re-test login and order placement after deployment.

## Rollout
- Watch logs for auth, payment, and MySQL errors.
- Verify seeded content renders correctly on mobile and desktop.
- Keep a backup of the database before larger catalog updates.
