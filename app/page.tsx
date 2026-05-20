import { SpendForm } from "@/components/SpendForm/SpendForm";

export default function Home() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 grid-bg relative overflow-hidden">
      {/* Background gradients for premium aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-credex-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-savings-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-credex-600 to-credex-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-credex-500/25">
              S
            </span>
            <h1 className="text-xl font-bold text-navy-50 tracking-tight">
              SpendLens
            </h1>
          </div>
          <a
            href="https://credex.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-navy-900 border border-navy-800 hover:border-navy-600 text-navy-300 hover:text-navy-100 transition-colors"
          >
            Powered by Credex
          </a>
        </header>

        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/60 border border-navy-800/40 text-navy-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-savings-400 animate-pulse" />
            <span>143 startups audited this week</span>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-black text-navy-50 tracking-tight leading-[1.1]">
              See exactly where your{" "}
              <span className="bg-gradient-to-r from-savings-400 to-savings-300 bg-clip-text text-transparent">
                AI budget
              </span>{" "}
              is going.
            </h2>
            <p className="text-base sm:text-lg text-navy-300 leading-relaxed font-medium">
              The free AI spend auditor for startups that are tired of guessing. Analyze Cursor, Claude, ChatGPT, and API spend in 2 minutes. No sign-up required.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="#audit-form-section"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-credex-600 to-credex-500 hover:from-credex-500 hover:to-credex-400 text-white font-bold rounded-xl shadow-lg shadow-credex-600/20 hover:shadow-credex-500/30 transition-all duration-300 cursor-pointer"
            >
              Start Free Audit ↓
            </a>
          </div>
        </section>

        {/* How It Works Explainer */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass-card p-5 border-navy-800/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-sm font-bold text-navy-300">
              1
            </div>
            <h3 className="font-bold text-navy-100 text-base">Input Your Stack</h3>
            <p className="text-xs text-navy-300 leading-relaxed">
              Add the AI subscriptions your team uses, including plans, seats, and actual monthly invoice values.
            </p>
          </div>

          <div className="glass-card p-5 border-navy-800/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-sm font-bold text-navy-300">
              2
            </div>
            <h3 className="font-bold text-navy-100 text-base">Analyze Inefficiencies</h3>
            <p className="text-xs text-navy-300 leading-relaxed">
              Our rule engine detects overpaid seats, idle billing tiers, and tool redundancy (like Copilot + Cursor overlaps).
            </p>
          </div>

          <div className="glass-card p-5 border-navy-800/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-sm font-bold text-navy-300">
              3
            </div>
            <h3 className="font-bold text-navy-100 text-base">Get Your Savings</h3>
            <p className="text-xs text-navy-300 leading-relaxed">
              View your public shareable savings report, complete with a personalized AI summary and a checklist of actions.
            </p>
          </div>
        </section>

        {/* Spend Input Form Section */}
        <section id="audit-form-section" className="pt-8 scroll-mt-6">
          <div className="glass-card p-6 sm:p-8 border-navy-700/30">
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

        {/* FAQs */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-navy-100 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 border-navy-800/30 space-y-1.5">
              <h4 className="font-bold text-navy-100 text-sm">Is my data secure and private?</h4>
              <p className="text-xs text-navy-300 leading-relaxed">
                Yes. We do not require you to sign in or connect any billing accounts. The public audit report link shows only tool names, seats, and savings (stripping all PII like emails and company names).
              </p>
            </div>

            <div className="glass-card p-5 border-navy-800/30 space-y-1.5">
              <h4 className="font-bold text-navy-100 text-sm">How accurate is the pricing engine?</h4>
              <p className="text-xs text-navy-300 leading-relaxed">
                All pricing rules are based on official vendor pricing sheets (updated May 2026). The engine detects anomalies where your actual spend exceeds expected rates.
              </p>
            </div>

            <div className="glass-card p-5 border-navy-800/30 space-y-1.5">
              <h4 className="font-bold text-navy-100 text-sm">Why is this tool free?</h4>
              <p className="text-xs text-navy-300 leading-relaxed">
                SpendLens is sponsored by Credex. If your startup is spending over $500/month on AI, Credex can help you buy discounted subscription credits to lower your bills directly.
              </p>
            </div>

            <div className="glass-card p-5 border-navy-800/30 space-y-1.5">
              <h4 className="font-bold text-navy-100 text-sm">What tools does it audit?</h4>
              <p className="text-xs text-navy-300 leading-relaxed">
                We support Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, and OpenAI API, covering 95% of standard developer and writing stacks.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-navy-500 pt-8 pb-4 border-t border-navy-900/60">
          <p>© 2026 SpendLens. All rights reserved.</p>
          <p className="mt-1">
            Created for Credex Web Dev Intern Assignment.
          </p>
        </footer>
      </div>
    </main>
  );
}
