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
- MySQL is the primary store.
- Schema lives in `src/server/db/schema.sql`.
- The current runtime stores catalog, auth, and order state in `app_state` JSON payloads.
- Redis is not required for the current scaffold.
