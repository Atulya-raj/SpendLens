# SpendLens — Unit Economics

If Credex deployed this tool tomorrow, here is how the money works. All inputs are rough estimates based on reasonable industry benchmarks — but approximate numbers beat no numbers.

---

## 1. What's a Converted Lead Worth to Credex?

**Reasoning:**
SpendLens surfaces a CTO who is provably overpaying for AI tooling. That person has already seen their savings number — say $480/month — and filled in their work email and company name. They've self-qualified. They're not a cold lead. They're a warm hand-raise.

A typical Credex customer is a Series A startup spending somewhere between $3,000–$15,000/month on SaaS and AI tools. Credex's value prop is helping them manage, negotiate, and optimize that spend. Assume Credex charges a flat monthly fee or takes a percentage of savings generated.

Conservative model:
- Average startup managed spend: **$8,000/month in SaaS**
- Credex fee: **3% of managed spend** = **$240/month per customer**
- Average customer retention: **18 months**
- **LTV per converted customer = $240 × 18 = $4,320**

Even if only 1 in 5 booked consultations becomes a paying customer, the expected value of a single qualified lead (post-consultation) is:

**$4,320 × 20% close rate = $864 per qualified lead**

That number drives everything below.

---

## 2. CAC at Each Channel from the GTM Plan

SpendLens runs on a $0 paid budget. All CAC is time cost, not ad spend.

| Channel | Time Investment | Leads Generated (Month 1 estimate) | CAC (time valued at $30/hr) |
|---|---|---|---|
| HN comment replies (15–20 targeted) | 3 hours | 6–8 leads | ~$11/lead |
| Reddit posts (r/startups, r/ExperiencedDevs) | 2 hours | 4–6 leads | ~$10/lead |
| Twitter cold DMs (30–40 sent) | 4 hours | 3–5 leads | ~$26/lead |
| Shareability flywheel (audit → tweet) | 0 hours (organic) | 2–4 leads | ~$0/lead |
| Credex email blast to existing customers | 1 hour (copy) | 10–20 leads | ~$2/lead |

**Blended CAC across all channels: ~$10–$15 per qualified lead.**

The Credex email blast is the highest-leverage channel by a mile. One email to their existing list costs basically nothing and lands in the inbox of people who are already thinking about SaaS spend. It's the unfair advantage.

---

## 3. What Conversion Rate Makes This Profitable?

The funnel has three steps: audit completed → consultation booked → credit purchase.

**Base assumptions:**
- 1,000 unique visitors/month
- Audit completion rate: **40%** (no signup, frictionless) = 400 audits
- Lead capture rate (savings > $200): **15%** of audits = 60 qualified leads
- Consultation booked rate: **25%** of leads = 15 consultations
- Close rate (consultation → paying customer): **20%** = 3 new Credex customers

**Revenue per 1,000 visitors:**
- 3 customers × $4,320 LTV = **$12,960**
- Cost to generate 1,000 visitors: ~$150 in time + ~$2 in API costs = **~$152**
- **ROI: ~85x**

Now, what's the **break-even conversion rate?** If Credex's cost to run SpendLens (hosting + API + 10 hours/month of maintenance) is roughly $300/month:

$300 ÷ $864 per lead = **you need 0.35 paying customers per month to break even.** That means less than one new customer every three months is the floor. The bar is genuinely low.

---

## 4. What Would Have to Be True to Drive $1M ARR in 18 Months?

**Target:** $1,000,000 ARR from Credex customers sourced through SpendLens.

$1M ARR ÷ $240/month per customer = **347 active Credex customers** needed.

To get 347 customers in 18 months, assuming 18-month retention (so every customer acquired counts):

**347 customers ÷ 18 months = ~19 new customers per month needed.**

Working back up the funnel:

| Stage | Required monthly volume |
|---|---|
| New paying customers | 19 |
| Consultations (at 20% close) | 95 |
| Qualified leads (at 25% book rate) | 380 |
| Audits completed (at 15% lead rate) | 2,533 |
| Unique visitors (at 40% audit rate) | **~6,333/month** |

**So the question becomes: can SpendLens drive 6,333 unique visitors per month by month 6?**

That's actually realistic. It's roughly 200 visitors/day. With:
- One Credex email blast per month (~5,000 opens, ~10% click-through = 500 visitors)
- Consistent Reddit/HN seeding (~1,000 visitors/month)
- Organic shareability from audit result tweets (~500–1,000 visits/tweet × 2–3 tweets/month)
- Word-of-mouth compounding from a growing user base

Month 6 at 6,000 visitors/month is achievable without paid ads if the shareability flywheel kicks in. The one thing that has to be true: **the audit result has to be good enough that people actually want to share it.** That's a product problem as much as a distribution problem — and it's why we built the ShareBar component and made the savings card visually striking enough to screenshot.

---

## Summary: The One-Number Version

Every 1,000 people who visit SpendLens are worth approximately **$12,960 in Credex LTV** if the funnel holds. The tool costs roughly $150/month to run at this volume. The math works at even a fraction of these conversion rates.
