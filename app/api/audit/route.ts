import { NextRequest } from "next/server";
import { z } from "zod";
import { runAudit } from "@/lib/audit-engine/engine";
import { createAudit } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateAISummary } from "@/lib/anthropic";

const toolInputSchema = z.object({
  toolId: z.enum([
    "cursor",
    "github-copilot",
    "claude",
    "chatgpt",
    "anthropic-api",
    "openai-api",
    "gemini",
    "windsurf",
  ]),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0),
  seats: z.number().int().min(1),
});

const auditInputSchema = z.object({
  tools: z.array(toolInputSchema).min(1).max(20),
  teamSize: z.number().int().min(1).max(10000),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  honeypot: z.string().optional(), // honeypot field
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const ipHash = await hashString(ip);
    const rateLimit = await checkRateLimit(ipHash);

    if (!rateLimit.success) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = auditInputSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Honeypot check — if filled, reject silently
    if (parsed.data.honeypot) {
      // Return fake success to not tip off bots
      return Response.json({ id: "fake", result: null, aiSummary: null });
    }

    // Run audit engine
    const auditInput = {
      tools: parsed.data.tools,
      teamSize: parsed.data.teamSize,
      useCase: parsed.data.useCase,
    };
    const result = runAudit(auditInput);

    // Generate AI summary (with fallback)
    const aiSummary = await generateAISummary(
      result,
      auditInput.useCase,
      auditInput.teamSize
    );

    // Save to database
    const record = await createAudit({
      input: auditInput,
      result,
      aiSummary,
      ipHash,
    });

    return Response.json({
      id: record.id,
      result,
      aiSummary,
    });
  } catch (error) {
    console.error("Audit API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
