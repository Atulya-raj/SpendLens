import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicAudit } from "@/lib/db";
import { AuditResult } from "@/components/AuditResult/AuditResult";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getPublicAudit(id);

  if (!audit) {
    return {
      title: "Audit Not Found — SpendLens",
    };
  }

  const savingsFormatted = `$${Math.round(audit.result.totalMonthlySavings)}`;
  const annualFormatted = `$${Math.round(audit.result.totalAnnualSavings)}`;

  return {
    title: `AI Spend Audit: Found ${savingsFormatted}/mo in Savings — SpendLens`,
    description: `SpendLens analyzed this stack and identified ${annualFormatted}/year in potential savings. View the full tool breakdown.`,
    openGraph: {
      title: `AI Spend Audit: Found ${savingsFormatted}/mo in Savings`,
      description: `Free audit via SpendLens. See exactly where your AI budget is going.`,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://spendlens.vercel.app"}/audit/${id}`,
      type: "website",
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: `SpendLens Savings found: ${savingsFormatted}/mo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Spend Audit: Found ${savingsFormatted}/mo in Savings`,
      description: `Free audit via SpendLens. See exactly where your AI budget is going.`,
    },
  };
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params;
  const audit = await getPublicAudit(id);

  if (!audit) {
    notFound();
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 grid-bg">
      <div className="max-w-5xl mx-auto space-y-8">
        <AuditResult
          auditId={audit.id}
          inputTools={audit.input.tools}
          result={audit.result}
          aiSummary={audit.aiSummary}
        />
      </div>
    </main>
  );
}
