# Database Schema

## Core Models
- User
- Account
- Session
- Product
- Category
- Brand
- Order
- OrderItem
- Cart
- CartItem
- WishlistItem
- Review
- Address
- Coupon
- Notification
- ReturnRequest
- RefundRequest
- SupportTicket

## Notes
- PostgreSQL is the primary store.
- Prisma owns schema and relations.
- Redis should support cache, sessions, and rate limiting.
