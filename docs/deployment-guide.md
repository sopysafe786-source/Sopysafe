# Deployment Guide

## Web
- Deploy the Next.js app to Vercel.

## Backend
- Host the API and workers on Railway or a comparable Node platform.

## Infrastructure
- MySQL for the database
- Redis for caching and rate limits
- Cloudinary or S3 for media

## Environment Variables
- `NEXT_PUBLIC_SITE_URL`
- `MYSQL_URL`
- `DATABASE_URL` optional fallback
- `REDIS_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
