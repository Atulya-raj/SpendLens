"use client";

import { useState } from "react";

interface LeadCaptureProps {
  auditId: string;
  totalMonthlySavings: number;
}

export function LeadCapture({ auditId, totalMonthlySavings }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          email,
          companyName,
          role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="glass-card p-6 text-center border-savings-800/30 bg-savings-950/20">
        <div className="w-12 h-12 rounded-full bg-savings-950/60 border border-savings-800/40 flex items-center justify-center mx-auto mb-4 text-savings-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-navy-50 mb-1">
          Audit report sent!
        </h3>
        <p className="text-sm text-navy-300 max-w-sm mx-auto">
          We&apos;ve emailed the PDF report breakdown to <strong className="text-navy-100">{email}</strong>.
          {totalMonthlySavings > 500 && " A Credex savings specialist will follow up within 24 hours."}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-4" id="lead-capture-section">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-navy-100 flex items-center gap-2">
          <span>Get this report by email</span>
        </h3>
        <p className="text-sm text-navy-300">
          We&apos;ll send you a complete breakdown checklist so you can optimize your bills.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label htmlFor="lead-email" className="block text-[10px] uppercase font-bold tracking-wider text-navy-400 mb-1">
            Work Email <span className="text-overspend-400">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-navy-800/80 border border-navy-700/40 rounded-lg px-3 py-2 text-navy-100 text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-company" className="block text-[10px] uppercase font-bold tracking-wider text-navy-400 mb-1">
              Company
            </label>
            <input
              id="lead-company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc"
              className="w-full bg-navy-800/80 border border-navy-700/40 rounded-lg px-3 py-2 text-navy-100 text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="lead-role" className="block text-[10px] uppercase font-bold tracking-wider text-navy-400 mb-1">
              Your Role
            </label>
            <input
              id="lead-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. CTO, EM"
              className="w-full bg-navy-800/80 border border-navy-700/40 rounded-lg px-3 py-2 text-navy-100 text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-overspend-400 font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-navy-100 hover:bg-navy-200 text-navy-950 font-semibold rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          id="submit-lead-btn"
        >
          {isSubmitting ? "Sending..." : "Email Report"}
        </button>
      </form>
    </div>
  );
}
