import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#fafafa] text-[#1a1a1a]"
      style={{
        backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Nav */}
      <header className="border-b border-[#e5e5e5] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M4 2v10M7 7l3 3M7 7l-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-semibold text-base text-[#1a1a1a]">flow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm text-white px-4 py-1.5 rounded-lg transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 pb-16 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1a1a1a] leading-tight">
          Build logic that<br />
          <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            runs itself
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#888] leading-relaxed">
          Workflows, approvals, and decisions — orchestrated.
        </p>
      </section>

      {/* Live Workflow Preview */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8 md:p-12 relative overflow-hidden" style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.06)' }}>
          <p className="text-xs font-medium text-[#aaa] uppercase tracking-[0.15em] mb-10 text-center">Live Workflow</p>

          {/* Workflow diagram */}
          <div className="flex flex-col items-center gap-0">
            {/* START node */}
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-[#dcfce7] border-2 border-[#22c55e] flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(34,197,94,0.15)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <polygon points="6,3 15,9 6,15" fill="#22c55e" />
                </svg>
              </div>
              <span className="mt-2 text-xs font-medium text-[#888]">START</span>
            </div>

            {/* Connector down */}
            <div className="w-0.5 h-8 bg-[#d4d4d4]" />

            {/* CONDITION node (diamond) */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="h-20 w-20 border-2 border-[#eab308] bg-[#fefce8] flex items-center justify-center"
                  style={{ transform: 'rotate(45deg)', borderRadius: '6px', boxShadow: '0 2px 8px rgba(234,179,8,0.15)' }}
                >
                  <span className="text-[10px] font-semibold text-[#a16207]" style={{ transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                    &gt; $5000?
                  </span>
                </div>
              </div>
              <span className="mt-4 text-xs font-medium text-[#888]">If amount &gt; $5,000</span>
            </div>

            {/* Two branches */}
            <div className="flex items-start gap-8 md:gap-20 mt-6 w-full justify-center">
              {/* YES branch */}
              <div className="flex flex-col items-center gap-0">
                <span className="text-xs font-bold text-[#22c55e] mb-2 uppercase tracking-wider">Yes</span>
                <div className="w-0.5 h-6 bg-[#d4d4d4]" />

                {/* VP Approval card */}
                <div className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-5 py-3 text-center" style={{ boxShadow: '0 2px 8px rgba(59,130,246,0.1)' }}>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="4" r="2.5" stroke="#3b82f6" strokeWidth="1.2" />
                      <path d="M1.5 11c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-semibold text-[#1d4ed8]">VP Approval</span>
                  </div>
                  <span className="text-[10px] text-[#60a5fa]">Required</span>
                </div>

                <div className="w-0.5 h-6 bg-[#d4d4d4]" />

                {/* Process Payment card */}
                <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-3 text-center" style={{ boxShadow: '0 2px 8px rgba(34,197,94,0.1)' }}>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-semibold text-[#15803d]">Process Payment</span>
                  </div>
                </div>

                <div className="w-0.5 h-6 bg-[#d4d4d4]" />

                {/* END */}
                <div className="h-10 w-10 rounded-full bg-[#f3f4f6] border-2 border-[#9ca3af] flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#9ca3af]" />
                </div>
                <span className="mt-1 text-[10px] text-[#aaa]">END</span>
              </div>

              {/* NO branch */}
              <div className="flex flex-col items-center gap-0">
                <span className="text-xs font-bold text-[#ef4444] mb-2 uppercase tracking-wider">No</span>
                <div className="w-0.5 h-6 bg-[#d4d4d4]" />

                {/* Auto-approve card */}
                <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-3 text-center" style={{ boxShadow: '0 2px 8px rgba(34,197,94,0.1)' }}>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6h10M6 1v10" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs font-semibold text-[#15803d]">Auto-approve</span>
                  </div>
                  <span className="text-[10px] text-[#86efac]">Instant</span>
                </div>

                <div className="w-0.5 h-6 bg-[#d4d4d4]" />

                {/* END */}
                <div className="h-10 w-10 rounded-full bg-[#f3f4f6] border-2 border-[#9ca3af] flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#9ca3af]" />
                </div>
                <span className="mt-1 text-[10px] text-[#aaa]">END</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="border-t border-[#e5e5e5] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold text-[#1a1a1a]">Start from a template</h2>
          <p className="text-center text-[#888] mt-3 max-w-xl mx-auto">
            Pre-built workflows for real business processes. Customize and deploy in minutes.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Expense Approval */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] overflow-hidden hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 group">
              <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }} />
              <div className="p-6">
                <span className="text-xs font-medium text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full">Finance</span>
                <h3 className="mt-3 text-lg font-semibold">Expense Approval</h3>
                <p className="mt-2 text-sm text-[#888]">Route expenses through manager and finance approval based on amount thresholds.</p>
                {/* Mini workflow */}
                <div className="mt-4 flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="2,1 7,4 2,7" fill="#22c55e" /></svg>
                  </div>
                  <div className="h-px w-4 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded bg-[#fefce8] border border-[#fde68a] rotate-45 flex items-center justify-center">
                    <span className="text-[6px] -rotate-45 text-[#a16207]">?</span>
                  </div>
                  <div className="h-px w-4 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded-md bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="3" r="1.5" stroke="#3b82f6" strokeWidth="0.8" fill="none" /><path d="M1 7c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5" stroke="#3b82f6" strokeWidth="0.8" fill="none" /></svg>
                  </div>
                  <div className="h-px w-4 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded-full bg-[#f3f4f6] border border-[#d4d4d4] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#9ca3af]" />
                  </div>
                </div>
                <span className="mt-3 block text-[10px] text-[#bbb]">4 nodes</span>
              </div>
            </div>

            {/* Content Review */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] overflow-hidden hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 group">
              <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
              <div className="p-6">
                <span className="text-xs font-medium text-[#6366f1] bg-[#6366f1]/10 px-2 py-0.5 rounded-full">Marketing</span>
                <h3 className="mt-3 text-lg font-semibold">Content Review</h3>
                <p className="mt-2 text-sm text-[#888]">Multi-stage content approval with legal review, brand check, and publishing.</p>
                {/* Mini workflow */}
                <div className="mt-4 flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="2,1 7,4 2,7" fill="#22c55e" /></svg>
                  </div>
                  <div className="h-px w-3 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded-md bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8"><rect x="1" y="2" width="6" height="4" rx="0.5" stroke="#3b82f6" strokeWidth="0.8" fill="none" /></svg>
                  </div>
                  <div className="h-px w-3 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded bg-[#fefce8] border border-[#fde68a] rotate-45 flex items-center justify-center">
                    <span className="text-[6px] -rotate-45 text-[#a16207]">?</span>
                  </div>
                  <div className="h-px w-3 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded-md bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4l2 2 3-3.5" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" fill="none" /></svg>
                  </div>
                  <div className="h-px w-3 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded-full bg-[#f3f4f6] border border-[#d4d4d4] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#9ca3af]" />
                  </div>
                </div>
                <span className="mt-3 block text-[10px] text-[#bbb]">5 nodes</span>
              </div>
            </div>

            {/* Incident Response */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] overflow-hidden hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 group">
              <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #ec4899, #f472b6)' }} />
              <div className="p-6">
                <span className="text-xs font-medium text-[#ec4899] bg-[#ec4899]/10 px-2 py-0.5 rounded-full">Engineering</span>
                <h3 className="mt-3 text-lg font-semibold">Incident Response</h3>
                <p className="mt-2 text-sm text-[#888]">Automated incident triage, notification routing, and resolution tracking.</p>
                {/* Mini workflow */}
                <div className="mt-4 flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-[#fce7f3] border border-[#f9a8d4] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="2,1 7,4 2,7" fill="#ec4899" /></svg>
                  </div>
                  <div className="h-px w-4 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded bg-[#fefce8] border border-[#fde68a] rotate-45 flex items-center justify-center">
                    <span className="text-[6px] -rotate-45 text-[#a16207]">!</span>
                  </div>
                  <div className="h-px w-4 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded-md bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 1v3M4 5.5v0.5" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" /></svg>
                  </div>
                  <div className="h-px w-4 bg-[#d4d4d4]" />
                  <div className="h-6 w-6 rounded-full bg-[#f3f4f6] border border-[#d4d4d4] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#9ca3af]" />
                  </div>
                </div>
                <span className="mt-3 block text-[10px] text-[#bbb]">4 nodes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-[#e5e5e5]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {/* Design */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-[#f5f3ff] border border-[#e9e5ff] flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="4" width="8" height="8" rx="2" stroke="#8b5cf6" strokeWidth="1.5" />
                  <rect x="16" y="16" width="8" height="8" rx="2" stroke="#8b5cf6" strokeWidth="1.5" />
                  <path d="M12 8h4l-4 12h4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Design</h3>
              <p className="mt-2 text-sm text-[#888] max-w-xs">Drag nodes, set conditions, wire approvals. Visual builder, no code required.</p>
            </div>

            {/* Deploy */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4v16M8 14l6 6 6-6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 24h16" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Deploy</h3>
              <p className="mt-2 text-sm text-[#888] max-w-xs">One click to production. Versioned, rollback-safe, instant activation.</p>
            </div>

            {/* Monitor */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-[#eff6ff] border border-[#dbeafe] flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M4 20l4-6 4 3 4-8 4 4 4-5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="24" cy="8" r="2" fill="#3b82f6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Monitor</h3>
              <p className="mt-2 text-sm text-[#888] max-w-xs">Live execution traces, bottleneck detection, and full audit history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-t border-[#e5e5e5] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <p className="text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                2,400+
              </p>
              <p className="mt-1 text-sm text-[#888]">workflows built</p>
            </div>
            <div>
              <p className="text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                12K
              </p>
              <p className="mt-1 text-sm text-[#888]">approvals processed</p>
            </div>
            <div>
              <p className="text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                99.7%
              </p>
              <p className="mt-1 text-sm text-[#888]">uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#e5e5e5]">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center">
          <h2 className="text-3xl font-bold text-[#1a1a1a]">Ready to orchestrate?</h2>
          <p className="mt-4 text-lg text-[#888] max-w-lg mx-auto">
            Join teams using {appConfig.name} to turn logic into reliable workflows.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block text-white px-8 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}
          >
            Build your first workflow {"→"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 text-xs text-[#bbb]">
          <span>&copy; {new Date().getFullYear()} {appConfig.name}</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
