import Link from "next/link";
import { appConfig } from "@/lib/config";

const ACCENT = "#5e7cff";

export default function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#08090d] text-[#d4d4d8]"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}
    >
      {/* ──────────────────────────────────────────────────────────────
          NAV
      ────────────────────────────────────────────────────────────── */}
      <header className="border-b border-[#16181d]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
            />
            <span
              className="text-base tracking-wide text-[#fafafa]"
              style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 600 }}
            >
              Axiom
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-[#52525b] hidden sm:inline"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
              · Vienna
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs text-[#71717a] hover:text-[#fafafa] transition-colors"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
              sign in
            </Link>
            <Link
              href="/signup"
              className="text-xs border px-4 py-1.5 transition-colors"
              style={{
                fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                borderColor: `${ACCENT}66`,
                color: ACCENT,
              }}
            >
              get started
            </Link>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────
          HERO
      ────────────────────────────────────────────────────────────── */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-28 pb-16 text-center">
        <div className="flex items-center gap-2 mb-10">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }}
          />
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: ACCENT, fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            Governance Layer · Constraints Active
          </span>
        </div>

        <h1
          className="text-7xl sm:text-8xl lg:text-[10rem] tracking-tight text-white leading-none"
          style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 500 }}
        >
          Axiom
        </h1>

        <p className="mt-8 max-w-2xl text-xl sm:text-2xl text-[#d4d4d8] leading-snug">
          Safety as physics, not policy.
        </p>
        <p
          className="mt-6 text-sm text-[#71717a]"
          style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
        >
          From Vienna — birthplace of formal logic.
        </p>

        <div
          className="mt-10 inline-block border-l-2 pl-4 py-1 text-left text-sm text-[#a1a1aa] max-w-md"
          style={{ borderColor: `${ACCENT}80` }}
        >
          &ldquo;Agents break rules nobody told them existed.&rdquo;
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          CONSTRAINT AS PREDICATE — code block + violation log
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.25em] text-[#71717a]"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
              >
                /constraints/eu-data.axiom
              </span>
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-[#52525b]"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
              compiled
            </span>
          </div>

          {/* Constraint code block */}
          <div
            className="rounded-md border bg-[#0a0c11] overflow-hidden"
            style={{ borderColor: `${ACCENT}40`, boxShadow: `0 0 30px ${ACCENT}15` }}
          >
            <div
              className="px-5 py-2 border-b text-[10px] uppercase tracking-[0.2em] flex items-center justify-between"
              style={{
                borderColor: "#16181d",
                color: ACCENT,
                fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
              }}
            >
              <span>predicate</span>
              <span className="text-[#52525b]">v 1.4.2</span>
            </div>
            <pre
              className="px-5 py-6 text-sm leading-relaxed overflow-x-auto"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
{`  `}<span style={{ color: ACCENT }}>axiom</span>(<span className="text-[#22c55e]">&quot;data.pii.never.leaves.eu&quot;</span>){` {`}
{`    `}<span className="text-[#a78bfa]">when</span>:{` `}<span className="text-[#d4d4d8]">agent.action.includes</span>(<span className="text-[#22c55e]">&quot;export&quot;</span>)
{`    `}<span className="text-[#a78bfa]">then</span>:{` `}<span className="text-[#ef4444]">block</span>.<span className="text-[#d4d4d8]">with_reason</span>(<span className="text-[#22c55e]">&quot;EU data sovereignty&quot;</span>)
{`  }`}
            </pre>
          </div>

          {/* Violation log */}
          <div className="mt-6 rounded-md border border-[#16181d] bg-[#0a0c11] overflow-hidden">
            <div
              className="px-5 py-2 border-b border-[#16181d] text-[10px] uppercase tracking-[0.2em] text-[#71717a] flex items-center justify-between"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
              <span>/var/log/axiom/blocks.jsonl</span>
              <span style={{ color: "#ef4444" }}>· violation prevented</span>
            </div>
            <div
              className="px-5 py-4 text-xs leading-relaxed text-[#a1a1aa]"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
            >
              <span className="text-[#52525b]">2026-05-27T14:32:08.441Z</span>{" "}
              <span style={{ color: "#ef4444" }}>BLOCK</span>{" "}
              <span className="text-white">agent=research-04</span>{" "}
              <span className="text-[#71717a]">action=</span>
              <span className="text-[#22c55e]">&quot;export_dataset&quot;</span>{" "}
              <span className="text-[#71717a]">target=</span>
              <span className="text-[#22c55e]">&quot;s3://us-east-1/...&quot;</span>
              <br />
              <span className="pl-4 text-[#52525b]">↳ violated:</span>{" "}
              <span style={{ color: ACCENT }}>data.pii.never.leaves.eu</span>{" "}
              <span className="text-[#52525b]">· reason: EU data sovereignty · halted before syscall</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          CONSTRAINT LIFECYCLE — DECLARE → COMPILE → BLOCK
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[#71717a] mb-12 text-center"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            The constraint lifecycle
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "DECLARE",
                desc: "Write the law once, in a declarative DSL. Human-readable, version-controlled, reviewable.",
              },
              {
                step: "02",
                title: "COMPILE",
                desc: "Axiom lowers the predicate into a fast runtime check. No interpretation cost at execution.",
              },
              {
                step: "03",
                title: "BLOCK BEFORE EXECUTION",
                desc: "Violations are stopped at the syscall boundary — before the action happens, never after.",
              },
            ].map((s, idx) => (
              <div key={s.step} className="relative">
                <div className="border border-[#16181d] bg-[#0a0c11] p-6 h-full">
                  <div
                    className="text-[10px] uppercase tracking-[0.25em] mb-3"
                    style={{ color: ACCENT, fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                  >
                    Step {s.step}
                  </div>
                  <div
                    className="text-lg text-white mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 600 }}
                  >
                    {s.title}
                  </div>
                  <div className="text-xs text-[#71717a] leading-relaxed">{s.desc}</div>
                </div>
                {idx < 2 && (
                  <div
                    className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 text-xs"
                    style={{ color: ACCENT, fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          STATS
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]" style={{ background: "#06070a" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-3 text-center md:text-left">
            <div>
              <div
                className="text-4xl sm:text-5xl text-white tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 500 }}
              >
                47,000
              </div>
              <div
                className="mt-3 text-xs uppercase tracking-[0.25em] text-[#71717a]"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
              >
                constraints evaluated / sec
              </div>
            </div>
            <div>
              <div
                className="text-4xl sm:text-5xl tracking-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif",
                  fontWeight: 500,
                  color: ACCENT,
                }}
              >
                0
              </div>
              <div
                className="mt-3 text-xs uppercase tracking-[0.25em] text-[#71717a]"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
              >
                false-negatives
              </div>
            </div>
            <div>
              <div
                className="text-4xl sm:text-5xl text-white tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 500 }}
              >
                Audit-ready
              </div>
              <div
                className="mt-3 text-xs uppercase tracking-[0.25em] text-[#71717a]"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
              >
                by default
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          COMPLIANCE BADGES
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[#71717a] mb-8 text-center"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            Compliance frameworks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["SOC 2", "APRA CPS 234", "ISO 27001", "GDPR"].map((badge) => (
              <div
                key={badge}
                className="border px-4 py-2 text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
                  borderColor: `${ACCENT}30`,
                  color: "#a1a1aa",
                  background: `${ACCENT}08`,
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          CTA
      ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#16181d]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-[#71717a] mb-6"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            Declare your first axiom
          </p>
          <Link
            href="/signup"
            className="inline-block border px-8 py-3 text-sm transition-all duration-200"
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
              borderColor: ACCENT,
              color: ACCENT,
              boxShadow: `0 0 20px ${ACCENT}30`,
            }}
          >
            $ axiom declare →
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          FOOTER
      ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#16181d]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="text-xs text-[#52525b]"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" }}
          >
            <span
              className="text-[#a1a1aa]"
              style={{ fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontWeight: 600, fontSize: "0.9rem" }}
            >
              {appConfig.name}
            </span>
            <span className="mx-2">·</span>
            <span>Vienna</span>
            <span className="mx-2">·</span>
            <span>axiom.at</span>
          </div>
          <a
            href="https://abduljaleel.xyz/aletheia/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 border transition-colors"
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
              borderColor: `${ACCENT}40`,
              color: ACCENT,
            }}
          >
            Part of the Aletheia stack ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
