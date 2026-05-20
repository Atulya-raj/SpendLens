# SpendLens — Unit Economics & ROI

This document details the financial justification for SpendLens as a marketing acquisition channel for Credex.

---

## 📈 CAC & LTV Analysis

### 1. Customer Acquisition Cost (CAC)
Since SpendLens is a free self-serve tool, the organic CAC is low:
- **Hosting**: Free on Vercel Hobby/Pro.
- **Serverless/API costs**:
  - Anthropic API call: ~$0.002 per summary.
  - Upstash Redis: Free tier covers up to 10k requests/day.
- **Development & Maintenance**: Low overhead once rule engine is stable.
- **Estimated Blended CAC**: **$12 - $15 per qualified lead** (including outbound labor/ad spend).

### 2. Customer Lifetime Value (LTV) for Credex
When a lead converts to Credex:
- Startup purchases discounted AI credits through Credex.
- Average startup spends $2,000/month on SaaS/AI tools.
- Credex monetization margin: 3% - 5%.
- Average annual revenue per startup: **$720 - $1,200**.
- Average Customer Lifespan: 3 years.
- **Estimated LTV**: **$2,160 - $3,600**.

---

## 📊 Return on Investment (ROI)

For every 1,000 unique visitors on SpendLens:
- **Audit Conversion Rate**: 15% (150 audits ran).
- **Lead Capture Rate**: 8% of auditors (12 qualified leads).
- **Credex Sales Conversion**: 15% of leads (1.8 new startups closed).
- **Customer Acquisition Cost**: 1,000 visitors * $0.05 page load cost + 150 * $0.002 Claude cost = $50.30.
- **Total Closed Value**: 1.8 startups * $2,500 LTV = $4,500.
- **ROI**: **~90x return on advertising/API spend**.
