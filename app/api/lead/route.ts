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

    // TODO: Send transactional email via Resend when RESEND_API_KEY is configured
    // For now, just log success
    console.log(`Lead captured for audit ${parsed.data.auditId}: ${parsed.data.email}`);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
