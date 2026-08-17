# Deployment Guide

## Recommended Flow
1. Create the production MySQL database.
2. Apply `src/server/db/schema.sql`.
3. Set the production environment variables.
4. Run `npm run db:seed` to load the live `app_state` rows.
5. Run `npm run typecheck` and `npm run build`.
6. Deploy the Next.js app.
7. Verify the live site and `/api/health`.

## Required Environment Variables
- `NEXT_PUBLIC_SITE_URL`
- `MYSQL_URL`
- `DATABASE_URL` optional fallback
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_VERIFY_SERVICE_SID`
- `RAZORPAY_WEBHOOK_SECRET`

## Storage
- MySQL is the primary store.
- `app_state` holds catalog, auth, and order JSON payloads.
- `src/server/db/schema.sql` defines the table.

## Go-Live Checks
- Homepage loads on desktop and mobile.
- Search works.
- Product detail page opens correctly.
- Cart updates persist.
- Login and OTP flows work.
- Checkout reaches the payment step.
