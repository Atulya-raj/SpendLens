# SpendLens — Metrics

---

## The North Star Metric — and Why

**North Star: Qualified Credex leads generated per month.**

A "qualified lead" is defined as a user who completed an audit showing savings greater than $200 AND submitted their work email and company name through the lead capture form.

This is the right North Star because SpendLens is not a product people use daily. It's a B2B lead-gen tool that people use once — maybe once a quarter if they're disciplined. Tracking DAU, MAU, or even "audits completed" would be misleading. A thousand audits with zero lead captures means the tool is failing at its actual job, which is filling Credex's pipeline. The North Star has to measure business outcomes, not tool usage.

Everything else on this page is in service of moving that one number.

---

## 3 Input Metrics That Drive the North Star

**1. Audit completion rate (visitors → completed audits)**
This is the top of the funnel. If people land on the page but don't finish the form, no leads are possible. Target: ≥ 40%. We can move this by reducing form fields, improving the UI, and making it clear there's no signup involved. If this drops below 25%, something is broken at the top — unclear value prop, slow load time, or a form step that's too confusing.

**2. Savings-to-lead conversion rate (audits with > $200 savings → lead captures)**
This is the middle of the funnel. It measures whether users who see a meaningful result actually take the next step and share their info with Credex. Target: ≥ 15%. If this is low, the lead capture offer isn't compelling enough, or the savings number doesn't feel credible to the user. We can move this by tightening the lead capture copy, surfacing the CTA at the right moment (immediately after the savings hero card), or increasing the savings threshold we use to trigger the CTA.

**3. Lead-to-consultation rate (captured leads → booked Credex consultation)**
This is owned by Credex's sales team, not the product — but it matters because it validates that the leads we're sending are actually qualified. Target: ≥ 25%. If a Credex rep reaches out to 100 leads and only 3 book a call, something is wrong with who we're capturing. Either the form isn't filtering for decision-makers, or users are submitting personal emails instead of work emails. We track this by checking back with Credex monthly.

---

## What We'd Instrument First

If I had one afternoon to set up tracking, here's the exact order:

1. **`audit_completed` event** — fires when the `/api/audit` endpoint returns successfully. Properties: `tools_count`, `total_monthly_savings`, `currency`, `use_case`. This is the single most important event. Without it, we're flying blind on funnel performance.

2. **`lead_captured` event** — fires when the Credex lead form submits successfully. Properties: `audit_id`, `savings_amount`, `savings_threshold_triggered` (boolean for whether savings > $200). This tells us if the North Star is moving.

3. **`report_shared` event** — fires on "Copy Link" or "Share on X" click. Properties: `share_type`, `savings_amount`. This measures the shareability flywheel — our main organic growth mechanism.

I would *not* instrument page views or scroll depth first. Those are vanity metrics for a tool that people use once. The three events above tell the whole story.

---

## What Number Triggers a Pivot Decision

**If the savings-to-lead conversion rate is below 5% after 500 completed audits, we pivot.**

Here's the reasoning: 500 audits is enough statistical signal to know if the product is working. A 5% conversion rate at that volume means we've generated 25 leads — which is actually still workable for Credex. But below 5% means the tool is creating real value (people are finishing audits) but users don't trust it enough or care enough to hand over their contact info. That's a fundamental product-market fit problem, not a distribution problem.

At that point, the pivot options are:
- **Deepen the audit** — make the recommendations so specific and credible that users feel compelled to act on them (e.g., link directly to the cheaper plan, show the exact cancellation steps)
- **Change the lead capture offer** — instead of "get a free consultation," offer something more immediate like "get this report in your inbox" or "get a Credex credit discount code"
- **Narrow the target user** — stop trying to serve everyone and go deep on one vertical (e.g., only dev tools companies, only Indian startups using INR)

If visitor-to-audit completion drops below 20%, that's a separate pivot trigger — it means there's a top-of-funnel problem and the landing page or form needs a complete rethink.
