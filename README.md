# CreatorHub ⚡

> Build your page. Set your price. Own your audience.

CreatorHub is a full-stack creator monetization platform. Creators publish a customizable link-in-bio page, set subscription tiers, gate premium content, and track audience analytics — all in one dashboard. Built for the Indian market, powered by Razorpay.

**Live demo:** [creatorhub.vercel.app](https://creatorhub.vercel.app) · **API:** [creatorhub-api.onrender.com](https://creatorhub-api.onrender.com)

---

## Features

### For creators
- **Drag-and-drop builder** — link, text, image, video, and paid-post blocks with live reordering via DND Kit
- **Subscription tiers** — create multiple tiers with custom pricing, descriptions, and benefits via Razorpay Plans API
- **Content gating** — paid blocks are locked server-side behind an active subscription; unauthenticated visitors see a locked placeholder
- **Analytics dashboard** — page views, link clicks, device breakdown, top links, referrers (90-day TTL, MongoDB aggregation pipelines)
- **Avatar upload** — Cloudinary-hosted, auto-cropped to 200×200 WebP
- **3 public page themes** — Minimal, Dark, Gradient; applied per creator

### For fans
- Subscribe to creators via Razorpay Checkout in one tap
- Sticky subscribe button on every creator page
- Fan dashboard at `/subscriptions` — view active subscriptions, renewal dates, cancel self-service

### Platform
- **httpOnly cookie auth** — JWT stored in `httpOnly; SameSite=Strict` cookie, never in `localStorage`
- **Password reset** — SHA-256 hashed tokens, 1-hour expiry, Resend transactional email
- **Razorpay webhooks** — signature verified against raw request buffer; handles `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.halted`
- **Zod validation** on every route
- **Structured logging** — timestamped, leveled (debug/info/warn/error), swappable to Pino/Winston
- **Rate limiting** — global (200/15min), auth (20/15min), analytics (60/min), upload (10/hr)
- **Helmet** security headers

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion 12, React Router 7 |
| Backend | Express 5, TypeScript, Mongoose 9, Zod 3, JWT, bcryptjs, cookie-parser |
| Database | MongoDB Atlas (TTL indexes, compound indexes, aggregation pipelines) |
| Payments | Razorpay (Subscriptions, Plans, Webhooks) |
| Storage | Cloudinary (avatar upload, auto-crop, WebP conversion) |
| Email | Resend (password reset, welcome email) |
| Deployment | Vercel (client) · Render (server) |

---

## Project structure
```
creatorhub/
├── client/                       # Vite + React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # AppLayout (sidebar + mobile nav), ProtectedRoute
│   │   │   └── ui/               # Button, Card, Input, Badge, Modal, Skeleton
│   │   ├── context/              # AuthContext (cookie-based session)
│   │   ├── hooks/                # useBlocks
│   │   ├── lib/                  # axios instance (withCredentials)
│   │   ├── pages/
│   │   │   ├── dashboard/        # DashboardPage, BuilderPage, AnalyticsPage, MonetizePage, SettingsPage
│   │   │   ├── FanDashboardPage  # /subscriptions — fan self-service
│   │   │   ├── ForgotPasswordPage, ResetPasswordPage
│   │   │   ├── CreatorPage       # Public /@username page
│   │   │   └── LandingPage
│   │   └── types/                # Shared TypeScript interfaces
│   ├── vercel.json
│   └── package.json
│
├── server/                       # Express + TypeScript API
│   ├── src/
│   │   ├── config/               # db.ts (Mongoose connect)
│   │   ├── controllers/          # auth, block, analytics, subscription, tier, public, webhook, user
│   │   ├── lib/                  # logger, email (Resend), upload (Cloudinary), razorpay, deviceParser
│   │   ├── middleware/           # authMiddleware (cookie+header), softAuth, rateLimiter, validate (Zod)
│   │   ├── models/               # User, Block, SubscriptionTier, Subscription, AnalyticsEvent
│   │   ├── routes/               # auth, blocks, subscriptions, tiers, analytics, public, webhooks, upload, user
│   │   ├── schemas/              # Zod schemas (index.ts, analyticsSchemas.ts, subscriptionSchemas.ts)
│   │   └── server.ts
│   ├── .env.example
│   ├── render.yaml
│   └── package.json
│
└── README.md
```

---

## Getting started

### Prerequisites
- Node.js 20+
- MongoDB Atlas cluster (free tier works)
- Razorpay account (test mode)
- Resend account (free tier = 3,000 emails/month)
- Cloudinary account (free tier = 25 credits/month)

### Environment variables

**`server/.env`**
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/creatorhub

# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

RESEND_API_KEY=re_...
FROM_EMAIL=CreatorHub <noreply@yourdomain.com>

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Run locally
```bash
# 1. Clone
git clone https://github.com/yourusername/creatorhub.git
cd creatorhub

# 2. Server
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev            # http://localhost:5000

# 3. Client (new terminal)
cd ../client
npm install
npm run dev            # http://localhost:5173
```

---

## Subscription flow
```
Creator creates tier → Razorpay Plan created via API
Fan clicks Subscribe → POST /subscriptions → Razorpay Subscription object
Fan completes checkout → Razorpay fires subscription.activated webhook
Webhook handler → Subscription.status = "active"
Fan revisits page → softAuth decodes cookie → paid blocks unlocked
Fan cancels → DELETE /subscriptions/:id/cancel → Razorpay cancel_at_cycle_end
Razorpay fires subscription.cancelled → status = "canceled"
```

## Content gating

`GET /public/:username` accepts an optional `httpOnly` cookie. If present and valid, the handler checks `Subscription.findOne({ fanId, creatorId, status: "active" })`. Matching subscription → full block data returned. No match → paid blocks replaced with `{ type: "locked", content: { locked: true } }`. All gating logic is server-side — the frontend never receives paid content for unsubscribed visitors.

## Analytics pipeline

Every page view and link click fires `POST /analytics/track` (fire-and-forget, never blocks UI). The controller validates `creatorId` exists in the DB before writing, preventing fake event spam. Events have a 90-day TTL index for automatic cleanup. `GET /analytics/summary` runs 5 parallel MongoDB aggregations: daily stats, device breakdown, top clicked links, all-time totals, and top referrers.

---

## Deployment

### Server → Render
1. Connect your GitHub repo to Render
2. Render auto-detects `render.yaml` in the repo root
3. Set environment variables in the Render dashboard
4. Deploy

### Client → Vercel
1. Connect your GitHub repo to Vercel
2. Set root directory to `client/`
3. Add `VITE_API_URL=https://your-render-url.onrender.com/api`
4. Deploy — `vercel.json` handles SPA routing and cache headers automatically

### Razorpay webhook setup
```
https://your-render-url.onrender.com/api/webhooks/razorpay
```
Select: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.completed`, `subscription.halted`

---

## Roadmap

- [ ] OAuth (Google login)
- [ ] Custom domain support (`CNAME` → creator page)
- [ ] Email blast to subscribers (Resend broadcast)
- [ ] Video upload (Cloudinary direct upload)
- [ ] Creator payout automation (Razorpay Route)
- [ ] Rich text editor for text blocks (TipTap)
- [ ] Creator discovery / explore page
- [ ] Multi-language support (Hindi)

---

## License

MIT