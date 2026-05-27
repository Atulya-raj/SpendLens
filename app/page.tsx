"use client";

import { SpendForm } from "@/components/SpendForm/SpendForm";
import { Logo } from "@/components/Logo";
import { ToolIconsRow } from "@/components/ToolIcons";

export default function Home() {
  return (
    <main 
      className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 grid-bg relative"
    >
      {/* ===== AURA BACKGROUND SYSTEM ===== */}
      {/* Layer 1: Gradient aura blobs — large, soft, slowly floating */}
      <div className="aura-container">
        <div className="aura-blob aura-blob--orange" />
        <div className="aura-blob aura-blob--amber" />
        <div className="aura-blob aura-blob--peach" />
        <div className="aura-blob aura-blob--cool" />
      </div>

      {/* Layer 2: Organic flowing line vectors as visual paths */}
      <div className="organic-lines">
        <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {/* Primary flowing path — sweeps from top-left to bottom-right */}
          <path
            d="M-50 200 C200 180, 400 350, 600 280 S900 420, 1100 300 S1300 500, 1500 380"
            stroke="rgba(255, 140, 50, 0.35)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Secondary path — gentler arc from left to right-center */}
          <path
            d="M-30 500 C150 460, 350 600, 550 520 S800 650, 1000 550 S1250 700, 1500 600"
            stroke="rgba(255, 180, 100, 0.25)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          {/* Tertiary accent path — thin, looping near top */}
          <path
            d="M100 80 C250 120, 400 50, 550 130 S750 60, 900 140 S1100 80, 1300 160"
            stroke="rgba(200, 160, 100, 0.2)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Bottom path — wide gentle curve along the footer region */}
          <path
            d="M-20 750 C200 720, 450 800, 700 740 S1000 830, 1200 760 S1400 820, 1500 780"
            stroke="rgba(255, 160, 80, 0.2)"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Layer 3: Noise / grain texture overlay */}
      <div className="noise-overlay" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        {/* Header - Enhanced Glassmorphism over aura background */}
        <header className="px-4 py-3 sm:px-8 sm:py-5 flex items-center justify-between rounded-3xl bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/50 shadow-[0_8px_32px_-8px_rgba(139,90,43,0.12),inset_0_1px_0_0_rgba(255,255,255,0.6)] relative z-20 transition-all duration-400 hover:bg-white/50 hover:shadow-[0_16px_48px_-8px_rgba(139,90,43,0.16),inset_0_1px_0_0_rgba(255,255,255,0.7)]">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo size={36} className="animate-float" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy-50 tracking-tight font-display">
              SpendLens
            </h1>
          </div>
          <a
            href="https://credex.rocks/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-extrabold px-3 py-2 sm:px-5 sm:py-3 rounded-xl border border-credex-500/30 text-credex-500 bg-white/40 hover:bg-credex-500 hover:text-white hover:border-transparent shadow-sm hover:shadow-credex-500/15 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Powered by <span className="font-black text-credex-600 hover:text-white transition-colors duration-300">Credex</span>
          </a>
        </header>

        {/* Hero Section - Redesigned, Centered, Animal-free */}
        <section className="max-w-3xl mx-auto text-center space-y-8 pt-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-6xl font-black text-navy-100 tracking-tight leading-[1.1] font-display">
              See exactly where your{" "}
              <span className="bg-gradient-to-r from-credex-600 to-credex-400 bg-clip-text text-transparent">
                AI budget
              </span>{" "}
              is going.
            </h2>
            <p className="text-sm sm:text-lg text-navy-300 leading-relaxed font-medium">
              The free AI spend auditor for startups that are tired of guessing. Analyze Cursor, Claude, ChatGPT, and API spend in 2 minutes. No sign-up required.
            </p>
          </div>

          {/* Centered Showcase Button - Fixed Scroll Hook */}
          <div className="pt-4 flex flex-col items-center justify-center space-y-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("audit-form-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative inline-flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4.5 bg-gradient-to-r from-credex-600 to-credex-500 hover:from-credex-500 hover:to-credex-400 text-white font-extrabold rounded-2xl shadow-xl shadow-credex-600/30 hover:shadow-credex-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer text-base sm:text-lg"
              id="start-audit-hero-btn"
            >
              {/* Glowing shadow effect */}
              <span className="absolute inset-0 w-full h-full rounded-2xl bg-credex-500/25 blur-lg group-hover:blur-xl transition-all duration-300 animate-pulse pointer-events-none -z-10" />
              Start Free Audit ↓
            </button>
            <p className="text-xs text-navy-400 font-semibold">No signup. Instant report.</p>
          </div>

          {/* Supported Tools — Brand Icons */}
          <ToolIconsRow />
        </section>

        {/* How It Works Explainer */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass-card p-5 border-navy-800/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-sm font-bold text-navy-300">
              1
            </div>
            <h3 className="font-bold text-navy-100 text-base font-display">Input Your Stack</h3>
            <p className="text-xs text-navy-300 leading-relaxed">
              Add the AI subscriptions your team uses, including plans, seats, and actual monthly invoice values.
            </p>
          </div>

          <div className="glass-card p-5 border-navy-800/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-sm font-bold text-navy-300">
              2
            </div>
            <h3 className="font-bold text-navy-100 text-base font-display">Analyze Inefficiencies</h3>
            <p className="text-xs text-navy-300 leading-relaxed">
              Our rule engine detects overpaid seats, idle billing tiers, and tool redundancy (like Copilot + Cursor overlaps).
            </p>
          </div>

          <div className="glass-card p-5 border-navy-800/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-sm font-bold text-navy-300">
              3
            </div>
            <h3 className="font-bold text-navy-100 text-base font-display">Get Your Savings</h3>
            <p className="text-xs text-navy-300 leading-relaxed">
              View your public shareable savings report, complete with a personalized AI summary and a checklist of actions.
            </p>
          </div>
        </section>

        {/* Spend Input Form Section */}
        <section id="audit-form-section" className="pt-8 scroll-mt-6">
          <div className="glass-card p-4 sm:p-8 border-navy-700/30">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-bold text-navy-50">
                  AI Tool Subscription Audit
                </h3>
                <p className="text-sm text-navy-300">
                  Enter your current monthly subscription info to find cost-saving opportunities.
                </p>
              </div>

              <SpendForm />
            </div>
          </div>
        </section>

        {/* FAQs - Redesigned and Premium */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-navy-100 tracking-tight font-display">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-navy-350 font-medium max-w-md mx-auto">
              Everything you need to know about our free, privacy-first AI spend audit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/40 hover:bg-white/55 border border-white/50 backdrop-blur-xl backdrop-saturate-150 rounded-3xl p-6 transition-all duration-400 shadow-[0_8px_32px_-8px_rgba(139,90,43,0.08),inset_0_1px_0_0_rgba(255,255,255,0.5)] hover:shadow-[0_16px_48px_-8px_rgba(139,90,43,0.12),inset_0_1px_0_0_rgba(255,255,255,0.65)] hover:-translate-y-1 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-credex-500 uppercase tracking-widest block mb-1">01. Privacy</span>
                <h4 className="font-extrabold text-navy-100 text-base">Is my data secure and private?</h4>
                <p className="text-xs text-navy-300 leading-relaxed mt-2 font-medium">
                  Yes. We do not require you to sign in or connect any billing accounts. The public audit report link shows only tool names, seats, and savings (stripping all PII like emails and company names).
                </p>
              </div>
            </div>

            <div className="bg-white/40 hover:bg-white/55 border border-white/50 backdrop-blur-xl backdrop-saturate-150 rounded-3xl p-6 transition-all duration-400 shadow-[0_8px_32px_-8px_rgba(139,90,43,0.08),inset_0_1px_0_0_rgba(255,255,255,0.5)] hover:shadow-[0_16px_48px_-8px_rgba(139,90,43,0.12),inset_0_1px_0_0_rgba(255,255,255,0.65)] hover:-translate-y-1 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-credex-500 uppercase tracking-widest block mb-1">02. Pricing</span>
                <h4 className="font-extrabold text-navy-100 text-base">How accurate is the pricing engine?</h4>
                <p className="text-xs text-navy-300 leading-relaxed mt-2 font-medium">
                  All pricing rules are based on official vendor pricing sheets (updated May 2026). The engine detects anomalies where your actual spend exceeds expected rates.
                </p>
              </div>
            </div>

            <div className="bg-white/40 hover:bg-white/55 border border-white/50 backdrop-blur-xl backdrop-saturate-150 rounded-3xl p-6 transition-all duration-400 shadow-[0_8px_32px_-8px_rgba(139,90,43,0.08),inset_0_1px_0_0_rgba(255,255,255,0.5)] hover:shadow-[0_16px_48px_-8px_rgba(139,90,43,0.12),inset_0_1px_0_0_rgba(255,255,255,0.65)] hover:-translate-y-1 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-credex-500 uppercase tracking-widest block mb-1">03. Pricing</span>
                <h4 className="font-extrabold text-navy-100 text-base">Why is this tool free?</h4>
                <p className="text-xs text-navy-300 leading-relaxed mt-2 font-medium">
                  SpendLens is sponsored by Credex. If your startup is spending over $500/month on AI, Credex can help you buy discounted subscription credits to lower your bills directly.
                </p>
              </div>
            </div>

            <div className="bg-white/40 hover:bg-white/55 border border-white/50 backdrop-blur-xl backdrop-saturate-150 rounded-3xl p-6 transition-all duration-400 shadow-[0_8px_32px_-8px_rgba(139,90,43,0.08),inset_0_1px_0_0_rgba(255,255,255,0.5)] hover:shadow-[0_16px_48px_-8px_rgba(139,90,43,0.12),inset_0_1px_0_0_rgba(255,255,255,0.65)] hover:-translate-y-1 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-credex-500 uppercase tracking-widest block mb-1">04. Scope</span>
                <h4 className="font-extrabold text-navy-100 text-base">What tools does it audit?</h4>
                <p className="text-xs text-navy-300 leading-relaxed mt-2 font-medium">
                  We support Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, and OpenAI API, covering 95% of standard developer and writing stacks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Redesigned, Multi-column, Clean structure */}
        <footer className="pt-12 pb-8 border-t border-navy-600/30 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Column 1: Brand & Logo */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-2">
                <Logo size={28} />
                <span className="font-extrabold text-navy-100 tracking-tight font-display text-lg">
                  SpendLens
                </span>
              </div>
              <p className="text-xs text-navy-350 font-medium leading-relaxed max-w-xs">
                The free AI spend auditor for startups. Find redundant seats, overlapping subscriptions, and save thousands.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3 md:text-center text-left">
              <h5 className="text-xs font-bold text-navy-200 uppercase tracking-widest">Resources</h5>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => document.getElementById("audit-form-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs text-navy-400 hover:text-credex-500 transition-colors text-left md:text-center font-semibold cursor-pointer border-none bg-transparent p-0"
                >
                  Start Free Audit
                </button>
                <span className="text-xs text-navy-400 hover:text-navy-250 transition-colors cursor-pointer text-left md:text-center">
                  Privacy Policy
                </span>
                <span className="text-xs text-navy-400 hover:text-navy-250 transition-colors cursor-pointer text-left md:text-center">
                  Terms of Service
                </span>
              </div>
            </div>

            {/* Column 3: Sponsor & Action */}
            <div className="space-y-3 md:text-right text-left">
              <h5 className="text-xs font-bold text-navy-200 uppercase tracking-widest">Sponsor</h5>
              <div className="space-y-2">
                <p className="text-xs text-navy-400 font-medium leading-relaxed">
                  Looking for discounted subscription credits?
                </p>
                <a
                  href="https://credex.rocks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-credex-500/10 text-credex-500 hover:bg-credex-500 hover:text-white border border-credex-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Visit Credex.rocks →
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-navy-600/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-navy-505 font-semibold text-navy-350">
              © 2026 SpendLens. All rights reserved.
            </p>
            <p className="text-xs text-navy-505 font-medium text-navy-350">
              Made for smart startup finance.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
