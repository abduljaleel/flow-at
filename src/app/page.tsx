import Link from "next/link";
import { appConfig } from "@/lib/config";
import { RevealObserver } from "@/components/landing/reveal-observer";

// A printed mathematical/philosophical treatise.
// Warm paper, dark ink, serif throughout. The accent appears exactly twice:
// the rubricated drop cap and the terminal CTA button's hover state.
const SERIF = "'Iowan Old Style', 'Palatino', 'Palatino Linotype', Georgia, serif";
const MONO = "'SF Mono', ui-monospace, 'JetBrains Mono', 'Menlo', 'Consolas', monospace";
const INK = "#1a1815";
const PAPER = "#f7f4ee";
const RULE = "#d8d2c5";
const FAINT = "#6b6557";
const FIG_BG = "#fbf9f4";

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
      <style>{`
        /* ── Links & buttons (real hover states, letterpress behavior) ── */
        .ax-link {
          transition: text-decoration-color 180ms ease;
        }
        .ax-link:hover {
          text-decoration-color: ${INK};
        }
        .ax-btn-outline {
          border: 1px solid ${INK};
          color: ${INK};
          background: transparent;
          transition: background-color 180ms ease, color 180ms ease;
        }
        .ax-btn-outline:hover {
          background-color: ${INK};
          color: ${PAPER};
        }
        .ax-btn-solid {
          background-color: ${INK};
          color: ${PAPER};
          border: 1px solid ${INK};
          transition: background-color 180ms ease, border-color 180ms ease,
            transform 120ms ease;
        }
        .ax-btn-solid:hover {
          background-color: #5e7cff;
          border-color: #5e7cff;
        }
        .ax-btn-solid:active {
          transform: translateY(1px);
        }

        /* ── Rubricated drop cap, em-sized so it tracks the thesis ── */
        .ax-dropcap {
          float: left;
          font-size: 3em;
          line-height: 0.78;
          padding-right: 0.14em;
          padding-top: 0.07em;
          font-weight: 600;
          color: #5e7cff;
        }
        @media (max-width: 479px) {
          .ax-dropcap {
            float: none;
            padding: 0;
            font-size: 1em;
            line-height: inherit;
          }
        }

        /* ── Justification only where the measure can afford it ── */
        .ax-justify {
          text-align: left;
        }
        @media (min-width: 640px) {
          .ax-justify {
            text-align: justify;
            text-justify: inter-word;
            hyphens: auto;
          }
        }

        /* ── Fig. 1 responsive typesetting ── */
        .ax-fig {
          border: 1px solid ${INK};
        }
        .ax-figwrap {
          position: relative;
        }
        .ax-mbr,
        .ax-mind {
          display: none;
        }
        @media (max-width: 399px) {
          .ax-mono {
            font-size: 12px;
          }
          .ax-mbr,
          .ax-mind {
            display: inline;
          }
          .ax-dsp {
            display: none;
          }
          .ax-figwrap::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 20px;
            background: linear-gradient(90deg, transparent, ${FIG_BG});
            pointer-events: none;
          }
        }

        /* ── Print-motion: rules draw, text settles. Ink behavior only. ──
           Every rule below is gated on no-preference; with reduced motion
           the page is completely static. Hidden states are applied by JS
           (.ax-pre), so the page is fully visible without JavaScript. */
        @media (prefers-reduced-motion: no-preference) {
          @keyframes ax-draw {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          @keyframes ax-rise {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .ax-rule-anim {
            transform-origin: left;
            animation: ax-draw 600ms ease-out both;
          }
          .ax-thesis-anim {
            animation: ax-rise 700ms ease-out 200ms both;
          }
          [data-reveal] {
            transition: opacity 600ms ease-out, transform 600ms ease-out;
          }
          [data-reveal].ax-pre {
            opacity: 0;
            transform: translateY(8px);
          }
          .ax-hairline {
            transform-origin: left;
            transition: transform 700ms ease-out 150ms;
          }
          .ax-pre .ax-hairline {
            transform: scaleX(0);
          }
          .ax-fig-reveal {
            transition: border-color 800ms ease-out;
          }
          .ax-fig-reveal.ax-pre {
            opacity: 1;
            transform: none;
            border-color: ${RULE};
          }
        }
      `}</style>
      <RevealObserver />

      <div className="mx-auto max-w-[720px] px-6 sm:px-8">
        {/* ══════════════════════════════════════════════════════════════
            MASTHEAD — letterpress
        ══════════════════════════════════════════════════════════════ */}
        <header className="pt-14">
          <div className="flex items-end justify-between">
            <h1
              className="text-3xl uppercase sm:text-4xl"
              style={{ letterSpacing: "0.42em", fontWeight: 600 }}
            >
              {appConfig.name}
            </h1>
            <div
              className="pb-1 text-right text-[11px] uppercase"
              style={{ letterSpacing: "0.22em", color: FAINT }}
            >
              Vienna · MMXXVI
            </div>
          </div>
          <div
            className="ax-rule-anim mt-4"
            style={{ borderTop: `1.5px solid ${INK}` }}
          />
          <div
            className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderTop: `0.5px solid ${RULE}`, paddingTop: "8px" }}
          >
            <p
              className="pt-1 text-[11px] uppercase sm:pt-0"
              style={{ letterSpacing: "0.22em", color: FAINT }}
            >
              On the Safety of Autonomous Agents
            </p>
            <nav className="flex items-center justify-end gap-4 text-[13px]">
              <Link
                href="/login"
                className="ax-link inline-flex min-h-11 items-center whitespace-nowrap px-1 underline decoration-from-font underline-offset-4"
                style={{ color: INK, textDecorationColor: RULE }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="ax-btn-outline inline-flex min-h-11 items-center whitespace-nowrap px-[18px]"
              >
                Get started
              </Link>
            </nav>
          </div>
        </header>

        <main>
          {/* ══════════════════════════════════════════════════════════════
              OPENING — dateline + rubricated drop cap + thesis
          ══════════════════════════════════════════════════════════════ */}
          <section className="pt-12 sm:pt-16">
            <p className="italic" style={{ color: FAINT, fontSize: "15px" }}>
              A treatise on agent safety.
            </p>

            <p
              className="ax-thesis-anim mt-6"
              style={{
                fontSize: "clamp(28px, 3.2vw, 40px)",
                lineHeight: 1.3,
                fontWeight: 500,
              }}
            >
              <span className="ax-dropcap">S</span>afety is not a policy you
              write. It is a space you cannot leave.
            </p>

            <p
              className="ax-justify mt-7"
              style={{ fontSize: "16.5px", lineHeight: 1.72 }}
            >
              The prevailing approach asks an agent to behave, then watches to
              see whether it did. This is governance by hindsight — a ledger of
              harms already done. {appConfig.name} proposes the opposite
              discipline. We do not instruct the agent in what it ought not do;
              we shape the world so that the forbidden act has no path to
              occur. The rule is compiled into the boundary of action itself,
              evaluated before any irreversible step, and accompanied always by
              the proof of its own enforcement. What cannot happen needs no
              monitoring.
            </p>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              THE AXIOMS — numbered like formal theorems
          ══════════════════════════════════════════════════════════════ */}
          <section className="pt-14 sm:pt-16">
            <h2
              className="text-[11px] uppercase"
              style={{ letterSpacing: "0.3em", color: FAINT, fontWeight: 400 }}
            >
              The Axioms
            </h2>
            <div className="mt-3" style={{ borderTop: `0.5px solid ${RULE}` }} />

            <ol>
              {AXIOMS.map((ax, i) => (
                <li
                  key={ax.numeral}
                  className="pt-7"
                  data-reveal
                  data-reveal-delay={i > 0 ? i * 80 : undefined}
                >
                  <div className="sm:flex sm:gap-7">
                    {/* hanging Roman numeral — desktop only */}
                    <div
                      className="hidden shrink-0 pt-1 text-right sm:block"
                      style={{
                        width: "3.4rem",
                        fontStyle: "italic",
                        fontSize: "24px",
                        color: INK,
                      }}
                    >
                      {ax.numeral}.
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* small-caps eyebrow — mobile only, full measure below */}
                      <p
                        className="mb-2 text-[11px] uppercase sm:hidden"
                        style={{ letterSpacing: "0.24em", color: FAINT }}
                      >
                        Axiom {ax.numeral}.
                      </p>
                      <h3
                        style={{
                          fontSize: "20px",
                          lineHeight: 1.4,
                          fontWeight: 600,
                        }}
                      >
                        {ax.title}
                      </h3>
                      <p
                        className="mt-3"
                        style={{
                          fontSize: "16px",
                          lineHeight: 1.7,
                          color: "#3a352d",
                        }}
                      >
                        {ax.body}
                      </p>
                    </div>
                  </div>
                  <div
                    className="ax-hairline mt-7"
                    style={{ borderTop: `0.5px solid ${RULE}` }}
                  />
                </li>
              ))}
            </ol>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              FIGURE 1 — a constraint as predicate (the only mono block)
          ══════════════════════════════════════════════════════════════ */}
          <section className="pt-14 sm:pt-16">
            <h2 className="sr-only">Figure 1 — a constraint as predicate</h2>
            <figure
              className="ax-fig ax-fig-reveal px-4 py-5 sm:px-8 sm:py-7"
              style={{ background: FIG_BG }}
              data-reveal
            >
              <figcaption
                className="mb-4 text-[11px] uppercase"
                style={{ letterSpacing: "0.24em", color: FAINT }}
              >
                Fig. 1 — A constraint as predicate
              </figcaption>
              <div className="ax-figwrap">
                <pre
                  className="ax-mono overflow-x-auto text-[13.5px] leading-relaxed"
                  style={{ fontFamily: MONO, color: "#2a2722" }}
                >
                  {`constraint("pii.never.leaves.eu") {
  when  agent.action`}
                  <span className="ax-dsp"> </span>
                  <br className="ax-mbr" />
                  <span className="ax-mind">{"        "}</span>
                  {`∈ {export, send}
  then  reject · log · prove
}`}
                </pre>
              </div>
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
              Q.E.D. — closing line
          ══════════════════════════════════════════════════════════════ */}
          <section className="pt-16 text-center" data-reveal>
            <h2 className="sr-only">Conclusion</h2>
            <div className="mx-auto mb-8 h-px w-16" style={{ background: RULE }} />
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
          </section>

          {/* ══════════════════════════════════════════════════════════════
              CORRESPONDENCE — the subscription coupon
          ══════════════════════════════════════════════════════════════ */}
          <section className="pt-14" data-reveal>
            <div
              className="px-6 py-9 text-center sm:px-10 sm:py-10"
              style={{ border: `1px solid ${INK}`, background: FIG_BG }}
            >
              <h2
                className="text-[11px] uppercase"
                style={{ letterSpacing: "0.3em", color: FAINT, fontWeight: 400 }}
              >
                Correspondence
              </h2>
              <p
                className="mt-4"
                style={{ fontSize: "22px", lineHeight: 1.35, fontWeight: 500 }}
              >
                Begin with one constraint.
              </p>
              <p
                className="mx-auto mt-2 max-w-[44ch]"
                style={{ fontSize: "14.5px", lineHeight: 1.6, color: FAINT }}
              >
                Write the rule once; the boundary holds it thereafter.
              </p>
              <div className="mt-7 flex flex-col items-center gap-4">
                <Link
                  href="/signup"
                  className="ax-btn-solid inline-flex min-h-12 items-center justify-center whitespace-nowrap px-10 text-[15px]"
                  style={{ letterSpacing: "0.04em" }}
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="ax-link text-[13.5px] underline decoration-from-font underline-offset-4"
                  style={{ color: FAINT, textDecorationColor: RULE }}
                >
                  Sign in to an existing account
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ══════════════════════════════════════════════════════════════
            FOOTER — printer's imprint
        ══════════════════════════════════════════════════════════════ */}
        <footer className="mt-14 pb-16">
          <div
            className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-[12px] uppercase"
            style={{ letterSpacing: "0.26em", color: "#4a443a" }}
          >
            <span className="whitespace-nowrap">SOC 2 ·</span>
            <span className="whitespace-nowrap">APRA CPS 234 ·</span>
            <span className="whitespace-nowrap">ISO 27001 ·</span>
            <span className="whitespace-nowrap">GDPR</span>
          </div>
          <div className="mt-5" style={{ borderTop: `0.5px solid ${RULE}` }} />
          <div className="mt-4 flex flex-col gap-2 text-[13px] sm:flex-row sm:items-center sm:justify-between">
            <span style={{ color: FAINT }}>
              <span style={{ fontWeight: 600, color: INK }}>
                {appConfig.name}
              </span>
              {" · "}
              <span
                className="text-[11px] uppercase"
                style={{ letterSpacing: "0.18em" }}
              >
                Vienna, Austria
              </span>
            </span>
            <a
              href="https://abduljaleel.xyz/aletheia/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-from-font underline-offset-4 transition-opacity hover:opacity-70"
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
