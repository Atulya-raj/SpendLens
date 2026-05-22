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
    <main 
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 grid-bg relative"
      style={{ zoom: 1.08 }}
    >
      {/* Background decorations container (prevents overflow layout stretching) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Ambient floating bubbles backdrop */}
        <div className="bubble-container">
          <div className="bubble" style={{ left: "5%", width: "20px", height: "20px", animationDelay: "0s", animationDuration: "12s" }} />
          <div className="bubble bubble-green" style={{ left: "15%", width: "40px", height: "40px", animationDelay: "2s", animationDuration: "16s" }} />
          <div className="bubble" style={{ left: "30%", width: "15px", height: "15px", animationDelay: "5s", animationDuration: "10s" }} />
          <div className="bubble bubble-green" style={{ left: "45%", width: "25px", height: "25px", animationDelay: "1s", animationDuration: "14s" }} />
          <div className="bubble" style={{ left: "60%", width: "35px", height: "35px", animationDelay: "4s", animationDuration: "18s" }} />
          <div className="bubble bubble-green" style={{ left: "75%", width: "18px", height: "18px", animationDelay: "3s", animationDuration: "12s" }} />
          <div className="bubble" style={{ left: "90%", width: "30px", height: "30px", animationDelay: "6s", animationDuration: "15s" }} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
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
