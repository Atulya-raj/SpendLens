import { NextRequest } from "next/server";
import { z } from "zod";
import { updateAuditLead } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

const leadSchema = z.object({
  auditId: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().int().min(1).optional(),
  honeypot: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.success) {
      return Response.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Honeypot check — if filled, reject silently
    if (parsed.data.honeypot) {
      console.log(`Honeypot triggered for lead: ${parsed.data.email}`);
      return Response.json({ success: true });
    }

    const updated = await updateAuditLead(parsed.data.auditId, {
      email: parsed.data.email,
      companyName: parsed.data.companyName,
      role: parsed.data.role,
      teamSize: parsed.data.teamSize,
    });

    if (!updated) {
      return Response.json(
        { error: "Audit not found" },
        { status: 404 }
      );
    }

    // Send transactional email via Resend if configured
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const { result } = updated;
        const currencySymbol = result.currency === "INR" ? "₹" : "$";
        const savingsFormatted = `${currencySymbol}${Math.round(result.totalMonthlySavings)}`;
        const annualSavingsFormatted = `${currencySymbol}${Math.round(result.totalAnnualSavings)}`;
        const currentSpendFormatted = `${currencySymbol}${Math.round(result.totalCurrentSpend)}`;
        
        const auditLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://spend-lens-xi.vercel.app"}/audit/${updated.id}`;
        
        // High savings check ($500 USD or ₹40,000 INR monthly savings threshold)
        const isHighSavings = result.currency === "INR" 
          ? result.totalMonthlySavings >= 40000 
          : result.totalMonthlySavings >= 500;
          
        const highSavingsNotice = isHighSavings
          ? `<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0; color: #166534; font-family: sans-serif;">
               <strong style="display: block; font-size: 16px; margin-bottom: 4px;">🎉 High-Savings Case Detected</strong>
               Your audit shows significant potential savings of <strong>${savingsFormatted}/mo</strong>. A Credex savings specialist will reach out to you at this email address within 24 hours to help you optimize your team's subscription stacks.
             </div>`
          : `<p style="color: #475569; font-size: 15px; line-height: 1.6;">
               Your audit is ready and you can view the complete step-by-step breakdown using the link below.
             </p>`;

        const toolBreakdownHtml = result.tools
          .map((t) => {
            const toolName = t.toolId.charAt(0).toUpperCase() + t.toolId.slice(1).replace("-api", " API").replace("chatgpt", "ChatGPT").replace("copilot", "Copilot");
            const actionText = t.recommendedAction.replace(/_/g, " ");
            const actionColor = t.monthlySavings > 0 ? "#15803d" : "#475569";
            
            return `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 8px; font-weight: 600; color: #0f172a;">${toolName}</td>
                <td style="padding: 12px 8px; color: #64748b;">${currencySymbol}${Math.round(t.currentMonthlySpend)}/mo</td>
                <td style="padding: 12px 8px; color: ${actionColor}; font-weight: 500; text-transform: capitalize;">${actionText}</td>
                <td style="padding: 12px 8px; font-weight: bold; color: #15803d;">${currencySymbol}${Math.round(t.monthlySavings)}/mo</td>
              </tr>
            `;
          })
          .join("");

        const fromEmail = process.env.RESEND_FROM_EMAIL || "SpendLens <onboarding@resend.dev>";
        
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [parsed.data.email],
            subject: `SpendLens Audit: ${savingsFormatted}/mo Saved!`,
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background-color: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px;">
                  <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.025em; color: #0f172a;">Spend<span style="color: #10b981;">Lens</span></span>
                  <p style="font-size: 14px; color: #64748b; margin: 4px 0 0 0;">AI Subscription Optimization Report</p>
                </div>
                
                <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Hi${parsed.data.companyName ? ` team at ${parsed.data.companyName}` : ""},</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #334155;">
                  We have completed your AI spend audit. Based on your current stack, you are spending <strong>${currentSpendFormatted}/mo</strong>.
                </p>
                
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                  <p style="margin: 0; font-size: 14px; text-transform: uppercase; tracking-wider; font-weight: bold; color: #166534;">Total Identified Savings</p>
                  <p style="margin: 8px 0; font-size: 36px; font-weight: 800; color: #14532d;">${savingsFormatted} <span style="font-size: 16px; font-weight: 500;">/ month</span></p>
                  <p style="margin: 0; font-size: 14px; color: #15803d; font-weight: 600;">That's ${annualSavingsFormatted} saved per year!</p>
                </div>

                ${highSavingsNotice}

                <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; margin-top: 24px;">Audit Summary</h3>
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; margin-bottom: 24px;">
                  <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0; color: #475569;">
                      <th style="padding: 8px; font-weight: 600;">Tool</th>
                      <th style="padding: 8px; font-weight: 600;">Current</th>
                      <th style="padding: 8px; font-weight: 600;">Action</th>
                      <th style="padding: 8px; font-weight: 600;">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${toolBreakdownHtml}
                  </tbody>
                </table>

                <div style="text-align: center; margin: 32px 0 24px 0;">
                  <a href="${auditLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; font-weight: 600; border-radius: 8px; text-decoration: none; display: inline-block; font-size: 15px;">
                    View Complete Audit Dashboard
                  </a>
                </div>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 32px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                  <p style="margin: 0;">SpendLens — Free AI subscription audit tool built for Credex.</p>
                  <p style="margin: 4px 0 0 0;">You received this because you requested an audit report at ${parsed.data.email}.</p>
                </div>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errData = await emailResponse.json();
          console.error("Resend API returned error:", errData);
        } else {
          console.log(`Resend email successfully sent to ${parsed.data.email}`);
        }
      } catch (err) {
        console.error("Failed to send email via Resend:", err);
      }
    } else {
      console.warn("RESEND_API_KEY not configured. Skipping email sending.");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
