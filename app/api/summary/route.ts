import { NextRequest } from "next/server";
import { z } from "zod";
import { generateAISummary } from "@/lib/anthropic";

const summarySchema = z.object({
  result: z.object({
    tools: z.array(z.any()),
    totalMonthlySavings: z.number(),
    totalAnnualSavings: z.number(),
    totalCurrentSpend: z.number(),
    totalProjectedSpend: z.number(),
    savingsPercent: z.number(),
    showCredexCTA: z.boolean(),
    isAlreadyOptimal: z.boolean(),
  }),
  useCase: z.string(),
  teamSize: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = summarySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const summary = await generateAISummary(
      parsed.data.result,
      parsed.data.useCase,
      parsed.data.teamSize
    );

    return Response.json({ summary });
  } catch (error) {
    console.error("Summary API error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
