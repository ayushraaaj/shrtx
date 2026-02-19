# 🚀 Shrtx – Subscription-Based URL Shortener SaaS

Shrtx is a production-style full-stack SaaS application built to explore real-world system design concepts, subscription billing architecture, webhook-driven state management, and feature-gated access control.

This project was built as part of my preparation for a backend/full-stack role switch, focusing on scalable architecture and production-grade engineering patterns.

---

## 🌐 Live Demo

- Frontend: [https://shrtx.vercel.app](https://shrtx.vercel.app)
- Backend API: [https://shrtx.onrender.com](https://shrtx.onrender.com)

> ⚠️ Currently running in Razorpay Test Mode (Live mode migration planned).

---

# 🧠 Why This Project?

Shrtx was built to deeply understand:

- Subscription lifecycle management
- Webhook-based state synchronization
- Event-driven architecture
- SaaS feature gating
- Secure payment integration
- Document parsing and backend processing
- Clean separation of frontend and backend concerns

Instead of building a basic CRUD app, the goal was to simulate how real SaaS platforms manage billing, access control, and analytics.

---

# 🏗 Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

### Payments

- Razorpay Subscription API
- HMAC SHA256 Webhook Signature Verification

### Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas

---

# 🔗 Core Features

## URL Shortening

- Generate short URLs
- Custom short codes
- Frontend public short link routing
- Backend validation before redirect
- Infinite redirect prevention (reserved route filtering)

---

## 🔐 URL Controls

- Password protection (bcrypt)
- Expiration (date & time based)
- Click limits
- Enable / disable toggle
- URL notes
- URL grouping

---

# 📊 Analytics

### Per URL

- Click count tracking
- Graph-based visualization

### Group-Level Analytics

- View analytics of all URLs inside a group
- Aggregate insights derived from grouped URLs

---

# 📄 Document Processing (PRO Feature)

Supported formats:

- Excel (.xlsx, .xls)
- PDF

### Processing Flow

1. Upload document
2. Extract URLs
3. Store extracted URLs in database
4. Apply internal shortening logic
5. Manage processed URLs via dashboard

Files are not returned. Processing is database-driven.

---

# 💳 Subscription System

Plan:

- PRO Plan – ₹199/month

### Lifecycle States

- created
- active
- cancelled

### Activation Flow

1. User clicks Upgrade
2. Razorpay checkout opens
3. Payment success
4. Razorpay sends `subscription.activated`
5. Webhook verifies signature
6. Database status updated
7. User redirected automatically

---

## 🔔 Webhook Events Handled

- subscription.activated
- subscription.cancelled

Security:

- Raw body parsing
- HMAC verification
- Razorpay webhook secret validation

---

# 🔐 Access Control

- JWT authentication
- Middleware-based route protection
- PRO-only feature gating
- Pricing page restricted for active subscribers
- Backend-level enforcement for document processing

---

# 📐 Architecture Overview

## Redirect Flow

User → shrtx.vercel.app/{shortCode}
↓
Frontend dynamic route
↓
Backend validation
↓
Redirect to original URL

---

## Subscription Flow

Upgrade → Razorpay Checkout → Webhook → DB Update → Access Granted

---

## Document Processing Flow

Upload → URL Extraction → Database Storage → Managed via Dashboard

---

# ⚙️ Local Setup

## Backend

```bash
cd backend
npm install
npm run dev
```

Required `.env`:

```
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_PLAN_ID=
RAZORPAY_WEBHOOK_SECRET=
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

`.env.local`:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_BACKEND_URL=
```

---

# 🔮 Future Improvements

- Razorpay Live Mode migration
- Yearly subscription plan
- Bot & abuse protection
- Advanced analytics (device, geo, referrer)
- Billing history dashboard
- Subscription retry handling
- Role-based access control

---

# 👨‍💻 Author

Ayush Raj
GitHub: [https://github.com/ayushraaaj](https://github.com/ayushraaaj)
LinkedIn: [https://linkedin.com/in/ayushraaaj](https://linkedin.com/in/ayushraaaj)

---

# 🎯 What This Project Demonstrates

- Subscription lifecycle management
- Event-driven backend design
- Secure webhook handling
- Middleware-based feature gating
- Real SaaS architecture patterns
- Production deployment setup

---

If you'd like, I can now:

- Rewrite this to be even more recruiter-optimized
- Create a shorter LinkedIn project description
- Or help you write a strong resume bullet section based on Shrtx 🚀
