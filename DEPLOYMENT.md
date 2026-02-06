# Slick Solutions - Deployment Guide

## Overview
This document outlines the steps to deploy Slick Solutions to production using Vercel and Convex.

---

## Prerequisites

1. **Vercel Account**: [vercel.com](https://vercel.com)
2. **Convex Account**: [convex.dev](https://convex.dev)
3. **Stripe Account**: [stripe.com](https://stripe.com) (with production API keys)
4. **Resend Account**: [resend.com](https://resend.com)
5. **OpenAI API Key** (or Ollama for self-hosted)

---

## Step 1: Convex Production Setup

### 1.1 Create Production Deployment
```bash
npx convex deploy --prod
```

### 1.2 Get Production Credentials
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project → Settings
3. Copy:
   - `CONVEX_DEPLOYMENT` (production)
   - `NEXT_PUBLIC_CONVEX_URL` (production URL)
   - `CONVEX_DEPLOY_KEY` (for CI/CD)

### 1.3 Set Convex Environment Variables
In the Convex Dashboard, go to Settings → Environment Variables and add:
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`
- `SITE_URL` (your Vercel production URL)

---

## Step 2: Vercel Deployment

### 2.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### 2.2 Configure Build Settings
Vercel should auto-detect Next.js. Verify:
- **Framework Preset**: Next.js
- **Build Command**: `npx convex deploy --cmd 'npm run build'`
- **Install Command**: `pnpm install`

### 2.3 Add Environment Variables
Add these in Vercel → Project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `CONVEX_DEPLOY_KEY` | (from Convex) | Production, Preview |
| `NEXT_PUBLIC_CONVEX_URL` | (production URL) | All |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_live_... | Production |
| `SITE_URL` | https://your-domain.com | Production |

> ⚠️ **Important**: Backend-only secrets (STRIPE_SECRET_KEY, OPENAI_API_KEY) should ONLY be set in Convex Dashboard, NOT in Vercel.

### 2.4 Deploy
Click "Deploy" and wait for the build to complete.

---

## Step 3: Stripe Webhook Configuration

### 3.1 Create Webhook Endpoint
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: `https://your-convex-url.convex.site/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

### 3.2 Copy Webhook Secret
Copy the `whsec_...` signing secret and add it to Convex environment variables as `STRIPE_WEBHOOK_SECRET`.

---

## Step 4: DNS & Custom Domain (Optional)

### 4.1 Add Custom Domain in Vercel
1. Vercel → Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 4.2 Update Environment Variables
Update `SITE_URL` in both Vercel and Convex to use your custom domain.

---

## Verification Checklist

After deployment, verify:

- [ ] Homepage loads at production URL
- [ ] `/book/demo_org_123` assessment flow works
- [ ] `/dashboard` redirects and displays data
- [ ] Stripe checkout opens correctly
- [ ] Emails are sent via Resend
- [ ] AI pricing agent responds

---

## Rollback Procedure

### Vercel Rollback
1. Vercel → Project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Convex Rollback
```bash
# List previous deployments
npx convex history

# Rollback to specific version
npx convex rollback <deployment-id>
```

---

## Monitoring

### Vercel Analytics
Enable in Vercel → Project → Analytics

### Convex Logs
View at: https://dashboard.convex.dev → Logs

### Error Tracking
Consider adding Sentry for production error monitoring.

---

## Cost Estimates (Monthly)

| Service | Tier | Est. Cost |
|---------|------|-----------|
| Vercel | Pro | $20 |
| Convex | Starter | Free-$25 |
| Stripe | Pay-per-use | ~2.9% + $0.30/tx |
| Resend | Free tier | $0 (first 3k emails) |
| OpenAI | Pay-per-use | ~$5-20 |

**Total**: ~$50-100/month for MVP scale
