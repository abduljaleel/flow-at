import Link from "next/link";
import { appConfig } from "@/lib/config";

// A printed mathematical/philosophical treatise.
// Warm paper, dark ink, serif throughout. Blue appears in only ~2 places.
const SERIF = "'Iowan Old Style', 'Palatino', 'Palatino Linotype', Georgia, serif";
const MONO = "'SF Mono', ui-monospace, 'JetBrains Mono', 'Menlo', 'Consolas', monospace";
const INK = "#1a1815";
const PAPER = "#f7f4ee";
const RULE = "#d8d2c5";
const FAINT = "#6b6557";
const ACCENT = "#5e7cff";

const AXIOMS: { numeral: string; title: string; body: string }[] = [
  {
    numeral: "I",
    title: "A constraint is evaluated before the act, never after.",
    body: "Permission is decided at the threshold. An action that has already occurred can be logged, regretted, or audited — but it cannot be prevented. Axiom moves the decision earlier in time.",
  },
  {
    numeral: "II",
    title: "What is forbidden cannot be reached, not merely discouraged.",
    body: "A rule that depends on the agent's cooperation is a suggestion. A constraint that bounds the space of possible actions is a law. We deal only in the latter.",
  },
  {
    numeral: "III",
    title: "Every prohibition carries its own proof.",
    body: "When an action is refused, the refusal is accompanied by the predicate that refused it and a record sufficient to reconstruct the judgment. Compliance is not asserted; it is demonstrable.",
  },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: PAPER,
        color: INK,
        fontFamily: SERIF,
        // faint vertical paper-grain so the cream never reads as flat SaaS white
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0px, rgba(0,0,0,0.012) 1px, transparent 1px, transparent 4px)",
      }}
    >
      <div className="mx-auto max-w-[720px] px-6 sm:px-8">
        {/* ══════════════════════════════════════════════════════════════
            MASTHEAD — letterpress
        ══════════════════════════════════════════════════════════════ */}
        <header className="pt-14">
          <div className="flex items-end justify-between">
            <h1
              className="text-3xl sm:text-4xl"
              style={{ letterSpacing: "0.42em", fontWeight: 600 }}
            >
              AXIOM
            </h1>
            <div
              className="pb-1 text-right text-[11px] uppercase"
              style={{ letterSpacing: "0.22em", color: FAINT }}
            >
              Vienna · MMXXVI
            </div>
          </div>
          <div className="mt-4" style={{ borderTop: `1.5px solid ${INK}` }} />
          <div
            className="mt-1 flex items-center justify-between"
            style={{ borderTop: `0.5px solid ${RULE}`, paddingTop: "8px" }}
          >
            <p
              className="text-[11px] uppercase"
              style={{ letterSpacing: "0.22em", color: FAINT }}
            >
              On the Safety of Autonomous Agents
            </p>
            <nav className="flex items-center gap-5 text-[13px]">
              <Link
                href="/login"
                className="underline decoration-from-font underline-offset-4 transition-colors"
                style={{ color: INK, textDecorationColor: RULE }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="underline decoration-from-font underline-offset-4 transition-colors"
                style={{ color: INK, textDecorationColor: ACCENT }}
              >
                Get started
              </Link>
            </nav>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════
            OPENING — dateline + drop cap + justified thesis
        ══════════════════════════════════════════════════════════════ */}
        <section className="pt-16">
          <p
            className="italic"
            style={{ color: FAINT, fontSize: "15px" }}
          >
            A treatise on agent safety.
          </p>

          <p
            className="mt-6"
            style={{
              fontSize: "27px",
              lineHeight: 1.34,
              fontWeight: 500,
            }}
          >
            <span
              style={{
                float: "left",
                fontSize: "82px",
                lineHeight: 0.78,
                paddingRight: "12px",
                paddingTop: "6px",
                fontWeight: 600,
              }}
            >
              S
            </span>
            afety is not a policy you write. It is a space you cannot leave.
          </p>

          <p
            className="mt-7"
            style={{
              fontSize: "16.5px",
              lineHeight: 1.72,
              textAlign: "justify",
              textJustify: "inter-word",
              hyphens: "auto",
            }}
          >
            The prevailing approach asks an agent to behave, then watches to see
            whether it did. This is governance by hindsight — a ledger of harms
            already done. {appConfig.name} proposes the opposite discipline. We
            do not instruct the agent in what it ought not do; we shape the world
            so that the forbidden act has no path to occur. The rule is compiled
            into the boundary of action itself, evaluated before any irreversible
            step, and accompanied always by the proof of its own enforcement.
            What cannot happen needs no monitoring.
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            THE AXIOMS — numbered like formal theorems
        ══════════════════════════════════════════════════════════════ */}
        <section className="pt-16">
          <p
            className="text-[11px] uppercase"
            style={{ letterSpacing: "0.3em", color: FAINT }}
          >
            The Axioms
          </p>
          <div className="mt-3" style={{ borderTop: `0.5px solid ${RULE}` }} />

          <ol className="mt-2">
            {AXIOMS.map((ax) => (
              <li
                key={ax.numeral}
                className="py-7"
                style={{ borderBottom: `0.5px solid ${RULE}` }}
              >
                <div className="flex gap-5 sm:gap-7">
                  {/* hanging Roman numeral */}
                  <div
                    className="shrink-0 pt-1 text-right"
                    style={{
                      width: "3.4rem",
                      fontStyle: "italic",
                      fontSize: "21px",
                      color: FAINT,
                    }}
                  >
                    {ax.numeral}.
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",
                        lineHeight: 1.4,
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ color: FAINT }}>Axiom {ax.numeral} — </span>
                      {ax.title}
                    </h3>
                    <p
                      className="mt-3"
                      style={{ fontSize: "16px", lineHeight: 1.7, color: "#3a352d" }}
                    >
                      {ax.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FIGURE 1 — a constraint as predicate (the only mono block)
        ══════════════════════════════════════════════════════════════ */}
        <section className="pt-16">
          <figure
            className="px-6 py-6 sm:px-8 sm:py-7"
            style={{ border: `1px solid ${INK}`, background: "#fbf9f4" }}
          >
            <figcaption
              className="mb-4 text-[11px] uppercase"
              style={{ letterSpacing: "0.24em", color: FAINT }}
            >
              Fig. 1 — A constraint as predicate
            </figcaption>
            <pre
              className="overflow-x-auto text-[13.5px] leading-relaxed"
              style={{ fontFamily: MONO, color: "#2a2722" }}
            >
{`constraint("pii.never.leaves.eu") {
  when  agent.action ∈ {export, send}
  then  reject · log · prove
}`}
            </pre>
          </figure>
          <p
            className="mt-3 italic"
            style={{ fontSize: "13.5px", color: FAINT, textAlign: "center" }}
          >
            The predicate wraps every session. Violation is structurally
            impossible.
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            Q.E.D. — closing line + compliance marks as text
        ══════════════════════════════════════════════════════════════ */}
        <section className="pt-20 pb-4 text-center">
          <div
            className="mx-auto mb-8 h-px w-16"
            style={{ background: RULE }}
          />
          <p
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              fontWeight: 500,
              fontStyle: "italic",
            }}
          >
            What cannot happen, needs no policing.
          </p>
          <p
            className="mt-4 text-[12px] uppercase"
            style={{ letterSpacing: "0.32em", color: FAINT }}
          >
            Q.E.D.
          </p>

          <p
            className="mt-10 text-[12.5px] uppercase"
            style={{ letterSpacing: "0.26em", color: "#4a443a" }}
          >
            SOC 2 &nbsp;·&nbsp; APRA CPS 234 &nbsp;·&nbsp; ISO 27001 &nbsp;·&nbsp; GDPR
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════ */}
        <footer className="mt-16 pb-16">
          <div style={{ borderTop: `0.5px solid ${RULE}` }} />
          <div className="mt-4 flex flex-col gap-2 text-[13px] sm:flex-row sm:items-center sm:justify-between">
            <span style={{ color: FAINT }}>
              <span style={{ fontWeight: 600, color: INK }}>{appConfig.name}</span>{" "}
              · Vienna 🇦🇹
            </span>
            <a
              href="https://abduljaleel.xyz/aletheia/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-from-font underline-offset-4 transition-colors hover:opacity-70"
              style={{ color: FAINT, textDecorationColor: RULE }}
            >
              Part of the Aletheia stack ↗
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
