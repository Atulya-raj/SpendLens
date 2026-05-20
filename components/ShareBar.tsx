"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface ShareBarProps {
  auditId: string;
  totalMonthlySavings: number;
}

export function ShareBar({ auditId, totalMonthlySavings }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/audit/${auditId}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  const shareText = `I just audited our AI tool subscriptions using SpendLens and found ${formatCurrency(
    totalMonthlySavings
  )}/mo in waste! Audit yours here: ${getShareUrl()}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-400">
        <svg className="w-4 h-4 text-credex-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.757-2.379a3 3 0 111.06 2.122L9.747 12.87a3.369 3.369 0 000 2.26l4.757 2.378a3 3 0 11-1.06 2.122l-4.757-2.379a3 3 0 110-4.242z" />
        </svg>
        Share Report
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 sm:flex-none px-4 py-2 border border-navy-700/50 hover:border-navy-500 rounded-lg text-xs font-semibold text-navy-200 hover:text-navy-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          id="copy-link-btn"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-savings-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Audit Link
            </>
          )}
        </button>

        {/* Twitter Share Button */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none px-4 py-2 bg-navy-800 hover:bg-navy-700 border border-navy-700/30 rounded-lg text-xs font-semibold text-navy-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          id="tweet-savings-btn"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </a>
      </div>
    </div>
  );
}
