# Manvié — Full Production Deployment Guide

> **Platform:** Next.js 14 · Supabase · Stripe · Replicate · Vercel  
> **Last updated:** April 2026

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Variables](#2-environment-variables)
3. [Supabase Setup](#3-supabase-setup)
4. [Google OAuth Setup](#4-google-oauth-setup)
5. [Stripe Setup](#5-stripe-setup)
6. [Replicate (Virtual Try-On) Setup](#6-replicate-virtual-try-on-setup)
7. [OpenAI (AI Stylist) Setup](#7-openai-ai-stylist-setup)
8. [Local Production Build Test](#8-local-production-build-test)
9. [Deploy to Vercel](#9-deploy-to-vercel)
10. [Custom Domain & SSL](#10-custom-domain--ssl)
11. [Stripe Webhook (Production)](#11-stripe-webhook-production)
12. [Admin & Supplier Credentials](#12-admin--supplier-credentials)
13. [Post-Deploy Smoke Test](#13-post-deploy-smoke-test)
14. [Multi-User & Multi-Supplier Architecture](#14-multi-user--multi-supplier-architecture)
15. [Security Checklist](#15-security-checklist)
16. [SEO Checklist](#16-seo-checklist)
17. [Ongoing Maintenance](#17-ongoing-maintenance)

---

## 1. Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18.17+ LTS | nodejs.org |
| npm | 9+ | Included with Node |
| Git | Any | git-scm.com |
| Vercel CLI | Latest | `npm i -g vercel` |

---

## 2. Environment Variables

Create `.env.local` at the project root. **Never commit this file.**

```env
# ── Site URL ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# ── Auth Secret (HMAC for admin session tokens) ───────────────────────────────
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET=your_64_char_hex_secret_here

# ── Admin Portal ──────────────────────────────────────────────────────────────
ADMIN_USERNAME=admin
# Pre-hash your password:
#   node -e "const c=require('crypto'); console.log(c.createHmac('sha256','YOUR_AUTH_SECRET').update('YOUR_PASSWORD').digest('hex'))"
ADMIN_PASSWORD_HASH=

# ── Supabase ───────────────────────────────────────────────────────────────────
# Project Settings → API in your Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # Server-side only — keep secret

# ── Stripe ────────────────────────────────────────────────────────────────────
# dashboard.stripe.com → Developers → API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── Replicate (Virtual Try-On) ────────────────────────────────────────────────
# replicate.com → Account → API Tokens
REPLICATE_API_TOKEN=r8_...

# ── OpenAI (AI Stylist text enrichment) ───────────────────────────────────────
# platform.openai.com → API Keys
OPENAI_API_KEY=sk-...
```

---

## 3. Supabase Setup

### 3a. Create a Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a region close to your users (e.g. `ca-central-1` for Canada)
3. Set a strong database password and save it
4. Copy **Project URL**, **anon key**, and **service_role key** into `.env.local`

### 3b. Run the Database Schema

1. In your Supabase dashboard → **SQL Editor**
2. Open `supabase/migrations/001_schema.sql` from this repo
3. Paste the full contents and click **Run**

This creates:
- `products` table with seed data (18 real luxury items)
- `supplier_profiles` table with 3 seed suppliers
- `orders` table
- `customer_profiles` table — auto-created on user signup via DB trigger
- Row Level Security policies on all tables
- Auto-generate order number function

### 3c. Enable Google OAuth in Supabase

> Get Google credentials first (Section 4), then come back here.

1. Supabase dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. Paste your **Client ID** and **Client Secret**
4. Set the **Authorized Redirect URI** to:
   ```
   https://xxxxxxxxxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
5. Save

### 3d. Configure Redirect URLs

In Supabase → **Authentication** → **URL Configuration**:

- **Site URL:** `https://your-domain.com`
- **Redirect URLs:** Add both:
  - `https://your-domain.com/auth/callback`
  - `http://localhost:3001/auth/callback` (local dev)

### 3e. Enable Email Confirmations (recommended)

1. Supabase → **Authentication** → **Providers** → **Email**
2. Enable **Confirm email**
3. Customize the email template under **Authentication** → **Email Templates**

---

## 4. Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable the **Google+ API** (or People API) under **APIs & Services**
4. **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web Application**
6. Add **Authorized JavaScript origins:**
   ```
   https://your-domain.com
   http://localhost:3001
   ```
7. Add **Authorized redirect URIs:**
   ```
   https://xxxxxxxxxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
8. Copy **Client ID** and **Client Secret** → paste into Supabase Google Provider (Section 3c)

---

## 5. Stripe Setup

### 5a. Get API Keys

1. [dashboard.stripe.com](https://dashboard.stripe.com) → **Developers** → **API Keys**
2. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`
4. Switch to **Live mode** before going to production

### 5b. Webhook Setup

> Do this after deploying (Step 9) so you have your production URL.

1. Stripe dashboard → **Developers** → **Webhooks** → **Add Endpoint**
2. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
3. Events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 6. Replicate (Virtual Try-On) Setup

1. Go to [replicate.com](https://replicate.com) → Sign up
2. **Account** → **API Tokens** → **Create Token**
3. Copy token → `REPLICATE_API_TOKEN`

The app uses the **IDM-VTON** model (`yisol/idm-vton`). No additional configuration needed.

> **Cost estimate:** ~$0.004–0.01 per try-on generation. Monitor at replicate.com/dashboard.

---

## 7. OpenAI (AI Stylist) Setup

1. Go to [platform.openai.com](https://platform.openai.com) → **API Keys**
2. Create a new secret key → `OPENAI_API_KEY`
3. Set a **Usage Limit** in Billing settings to cap monthly spend

> The AI Stylist works with static curated ensembles even without an OpenAI key — the key only enables additional text enrichment on top of the static results.

---

## 8. Local Production Build Test

```bash
cd your-project-directory

# Install dependencies
npm install

# Type-check — must pass with 0 errors
./node_modules/.bin/tsc --noEmit

# Production build
npm run build

# Preview production
npm run start
# Open http://localhost:3000
```

---

## 9. Deploy to Vercel

### 9a. Connect Repository

**Via Vercel Dashboard (recommended):**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import from GitHub → select `manvion/manvie`
3. Framework preset: **Next.js** (auto-detected)
4. Do not deploy yet — add env vars first

**Via CLI:**
```bash
npm install -g vercel
vercel login
vercel link
```

### 9b. Add Environment Variables

In Vercel dashboard → Project → **Settings** → **Environment Variables**, add every key from Section 2.

Or via CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add AUTH_SECRET production
vercel env add ADMIN_USERNAME production
vercel env add ADMIN_PASSWORD_HASH production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add REPLICATE_API_TOKEN production
vercel env add OPENAI_API_KEY production
vercel env add NEXT_PUBLIC_SITE_URL production
```

### 9c. Deploy

```bash
vercel --prod
```

Site is live at `https://manvie.vercel.app` (or your custom domain).

---

## 10. Custom Domain & SSL

1. Vercel dashboard → Project → **Settings** → **Domains**
2. Add your domain (e.g. `manvie.com`)
3. Add these DNS records at your registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

4. SSL is provisioned automatically (Let's Encrypt) — usually within 2 minutes
5. Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars → redeploy

---

## 11. Stripe Webhook (Production)

After your domain is live:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli

stripe webhooks create \
  --url https://your-domain.com/api/webhooks/stripe \
  --events checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed

# Copy the signing secret output
# Update STRIPE_WEBHOOK_SECRET in Vercel and redeploy
vercel --prod
```

---

## 12. Admin & Supplier Credentials

### Admin Login (`/admin/login`)

Generate a hashed password before going live:

```bash
node -e "
  const c = require('crypto');
  const secret = 'YOUR_AUTH_SECRET_HERE';
  const password = 'YOUR_STRONG_PASSWORD_HERE';
  console.log(c.createHmac('sha256', secret).update(password).digest('hex'));
"
```

Set the output as `ADMIN_PASSWORD_HASH` in Vercel.  
Set `ADMIN_USERNAME` to your preferred username.

### Supplier Login (`/supplier/login`)

Suppliers self-register at `/supplier/register`. The admin approves applications from the **Partners** tab. Approved suppliers log in with their own email and password.

---

## 13. Post-Deploy Smoke Test

```
Customer Flow
  ✓ Homepage loads — hero, ticker, all sections visible
  ✓ Language toggle EN ↔ FR — all nav labels and page text switch
  ✓ Dark / light theme toggle persists on reload
  ✓ AI Stylist link visible in desktop navigation header
  ✓ /shop — products load from Supabase (seed data shows 18 items)
  ✓ /shop — filter by category (La Femme, L'Homme, etc.) works
  ✓ /shop — hover over product shows gender try-on overlay
  ✓ Add to cart → /cart shows items with correct totals
  ✓ /cart → Stripe Checkout opens
  ✓ /account — Sign In and Create Account tabs both render
  ✓ /account — "Continue with Google" triggers Google OAuth
  ✓ After Google sign-in → redirected to /account/dashboard
  ✓ Email registration → confirmation email received
  ✓ /try-on — gender/size prompt shown before try-on
  ✓ /try-on — men cannot try women's/children's garments
  ✓ /stylist — occasion form → outfit recommendations appear instantly

Supplier Flow
  ✓ /supplier/register — form submits successfully
  ✓ Application appears in Admin → Partners tab as "pending"
  ✓ Admin approves → supplier status changes to "active"
  ✓ Approved supplier can log in at /supplier/login
  ✓ /supplier — products and orders load from Supabase

Admin Flow
  ✓ /admin/login — credentials work
  ✓ /admin — metrics cards load live data
  ✓ Catalog, Orders, Partners tabs all show real data
  ✓ Approve/deny product → status updates in database
  ✓ Advance order status → persists in database
```

---

## 14. Multi-User & Multi-Supplier Architecture

This platform is built for unlimited users and suppliers.

### Customers
- Each customer is an independent Supabase Auth user
- `customer_profiles` record auto-created on signup via DB trigger
- Google OAuth and email/password both supported
- RLS ensures customers see only their own orders

### Suppliers
- Each supplier registers independently at `/supplier/register`
- Gets their own Supabase Auth account + `supplier_profiles` record
- Status starts as `pending` — admin must approve before portal access
- Each supplier sees only their own products and orders (RLS by `supplier_name`)
- Unlimited suppliers supported

### Admins
- Single admin via environment variables
- **To add multiple admins:** Create an `admin_users` table in Supabase and update `/src/app/api/auth/admin/route.ts` to query it instead of env vars

### Row Level Security Summary

| Table | Public Access | Customer Access | Supplier Access | Service Role |
|-------|--------------|-----------------|-----------------|--------------|
| products | Read active only | Read active only | Read own only | Full |
| orders | None | Read own only | Read own only | Full |
| supplier_profiles | None | None | Read own only | Full |
| customer_profiles | None | Read/write own | None | Full |

---

## 15. Security Checklist

```
Secrets
  ✓ AUTH_SECRET is a random 32-byte hex string (not the default)
  ✓ ADMIN_PASSWORD_HASH set — default "manvie-admin-2024" NOT used
  ✓ SUPABASE_SERVICE_ROLE_KEY only referenced in server-side API routes
  ✓ All .env* files listed in .gitignore
  ✓ No secrets in git history

Supabase
  ✓ Row Level Security enabled on all 4 tables
  ✓ Email confirmation enabled for new signups
  ✓ Redirect URLs restricted to production domain only

API Security
  ✓ All /api/admin/* routes verify manvie-admin cookie
  ✓ All /api/supplier/* routes verify manvie-supplier cookie
  ✓ Stripe webhook validates STRIPE_WEBHOOK_SECRET signature
  ✓ Session tokens expire after 24 hours

Headers (add to next.config.mjs)
  ✓ X-Frame-Options: DENY
  ✓ X-Content-Type-Options: nosniff
  ✓ Referrer-Policy: strict-origin-when-cross-origin
```

Add security headers to `next.config.mjs`:
```js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

// In your config export, add:
async headers() {
  return [{ source: '/(.*)', headers: securityHeaders }];
},
```

---

## 16. SEO Checklist

```
Before Launch
  ✓ src/app/layout.tsx — metadataBase points to production URL
  ✓ Open Graph image at /public/og-image.jpg (1200×630px)
  ✓ /public/favicon.ico and /public/icon.png present
  ✓ src/app/robots.ts — crawlers allowed, sitemap URL correct
  ✓ src/app/sitemap.ts — all public routes listed

After First Deploy
  □ Submit sitemap in Google Search Console:
      https://search.google.com/search-console
      → Add Property → https://your-domain.com
      → Sitemaps → Submit https://your-domain.com/sitemap.xml

Performance
  ✓ All images use next/image (WebP + lazy load)
  ✓ Fonts loaded via next/font (zero layout shift)
  □ Run Lighthouse — target 90+ Performance, 100 SEO
  □ Enable Vercel Analytics for real user monitoring
```

---

## 17. Ongoing Maintenance

| Task | Frequency | How |
|------|-----------|-----|
| Rotate `AUTH_SECRET` | Every 90 days | Update Vercel env → redeploy |
| `npm audit fix` | Monthly | Terminal in project root |
| Review Stripe webhook failures | Weekly | Stripe dashboard → Webhooks |
| Check Replicate model deprecations | Quarterly | replicate.com → Deployments |
| Database backups | Automatic | Supabase handles daily backups |
| Reindex sitemap | After major content changes | Google Search Console → Sitemaps |

---

## Quick Reference — All URLs

| Page | Path |
|------|------|
| Homepage | `/` |
| Shop | `/shop` |
| Virtual Try-On | `/try-on` |
| AI Stylist | `/stylist` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Customer Account | `/account` |
| Customer Dashboard | `/account/dashboard` |
| Admin Login | `/admin/login` |
| Admin Dashboard | `/admin` |
| Supplier Register | `/supplier/register` |
| Supplier Login | `/supplier/login` |
| Supplier Dashboard | `/supplier` |

---

*Manvié — Québec Haute Couture, Reimagined by AI — Est. 1942, Montréal*
