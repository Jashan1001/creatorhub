# CreatorForge

> Build your page. Set your price. Own your audience.

CreatorForge is a full-stack creator monetization platform where creators publish a customizable link-in-bio page, set subscription tiers, gate premium content, and track audience analytics — all in one place.

**Live demo:** [creatorforge.vercel.app](https://creatorforge.vercel.app) &nbsp;·&nbsp; **API:** [creatorforge-api.onrender.com](https://creatorforge-api.onrender.com)

---

## Features

**For creators**
- Drag-and-drop page builder — link, text, image, video, and paid-post blocks
- Subscription tier management — create multiple tiers with custom pricing and benefits
- Content gating — paid blocks are locked behind the fan's active subscription tier
- Real analytics — page views, link clicks, device breakdown, top-performing links (30-day rolling window)
- Avatar + media upload via AWS S3
- Earnings dashboard — subscriber count, MRR, payout history

**For fans**
- Subscribe to a creator via Stripe Checkout in one click
- Instant access to gated content on subscription activation
- Manage and cancel subscriptions

**Platform**
- JWT authentication with bcrypt password hashing
- Stripe webhook handling — `invoice.paid`, `subscription.deleted`, `payment_failed`
- MongoDB aggregation pipelines for analytics
- 3-tier rate limiting, Helmet security headers, Zod input validation on all endpoints

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4, Framer Motion, React Router 7 |
| Backend | Express 5, TypeScript, Mongoose 9, Zod 4, JWT, bcryptjs |
| Database | MongoDB Atlas |
| Payments | Stripe (Subscriptions, Webhooks, Checkout Sessions) |
| Storage | AWS S3 (presigned URLs) |
| Email | Resend |
| Deployment | Vercel (client) · Render (server) |

---

## Project structure

```
creatorforge/
├── client/                   # Vite + React frontend
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── pages/            # Route-level pages
│   │   │   ├── dashboard/    # Overview, Builder, Analytics, Monetize, Earnings, Settings
│   │   │   └── [username]/   # Public creator page
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # useAuth, useAnalytics, useBlocks
│   │   ├── lib/              # axios instance, utils
│   │   └── types/            # Shared TypeScript types
│   └── package.json
│
├── server/                   # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/      # authController, blockController, analyticsController...
│   │   ├── middleware/        # authMiddleware, rateLimiter, zodValidate
│   │   ├── models/           # User, Block, SubscriptionTier, Subscription, AnalyticsEvent
│   │   ├── routes/           # auth, blocks, subscriptions, analytics, webhooks, public
│   │   ├── lib/              # stripe.ts, s3.ts, resend.ts
│   │   └── server.ts
│   └── package.json
│
└── README.md
```

---

## Getting started

### Prerequisites
- Node.js 20+
- MongoDB Atlas connection string
- Stripe account (test mode keys)
- AWS S3 bucket
- Resend API key

### Environment variables

**Server** (`server/.env`)
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
RESEND_API_KEY=
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Run locally

```bash
# Clone
git clone https://github.com/Jashan1001/creatorforge.git
cd creatorforge

# Install dependencies
cd server && npm install
cd ../client && npm install

# Start server (in /server)
npm run dev

# Start client (in /client)
npm run dev
```

Client runs on `http://localhost:5173` · API on `http://localhost:5000`

### Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

---

## Architecture

### Subscription flow
1. Creator creates a tier (name, price, benefits) → Stripe Product + Price created via API
2. Fan visits `/@creator`, clicks Subscribe → `POST /subscriptions/checkout` → Stripe Checkout Session
3. Fan completes payment → Stripe fires `invoice.paid` webhook
4. Webhook handler creates `Subscription` document, sets `status: active`
5. Fan revisits `/@creator` → JWT decoded, subscription checked, paid blocks unlocked

### Content gating
Public route `GET /public/:username` accepts an optional Bearer token. If present and valid, the handler looks up the fan's active subscription for that creator and returns paid blocks. Unauthenticated or unsubscribed requests receive only free blocks — paid blocks are replaced with a locked placeholder.

### Analytics
Every page view and link click fires a fire-and-forget `POST /analytics/track` (no `await`, never blocks the UI). Events are stored in MongoDB with a 90-day TTL index. The dashboard calls `GET /analytics/summary` which runs an aggregation pipeline grouping events by day, type, device, and blockId.

---

## Roadmap

- [ ] OAuth (Google login)
- [ ] Custom domain support for creator pages
- [ ] Email blast to subscribers (via Resend)
- [ ] Video upload (direct S3 multipart)
- [ ] Creator payout automation (Stripe Connect)

---

## License

MIT