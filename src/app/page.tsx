import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import {
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Activity,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              {appConfig.name.charAt(0)}
            </div>
            <span className="font-semibold text-lg">{appConfig.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm text-muted-foreground mb-6">
          <Activity className="h-3.5 w-3.5" />
          Workflow orchestration for the AI age
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          IF/THEN for the AI age
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Turn decisions, approvals, and logic into reliable automated workflows.
          Build in minutes. Execute with confidence. Trace every step.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/signup">
            <Button size="lg">
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-bold">
            Everything you need to orchestrate decisions
          </h2>
          <p className="text-center text-muted-foreground mt-3 max-w-2xl mx-auto">
            From simple approval chains to complex multi-step workflows, Flow gives you
            the building blocks to automate any business process.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <GitBranch className="h-6 w-6" />,
                title: "Visual Builder",
                desc: "Design workflows visually with conditions, actions, and approval gates. No code required.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "Approval Chains",
                desc: "Route decisions through the right people. Multi-tier approvals with automatic escalation.",
              },
              {
                icon: <Activity className="h-6 w-6" />,
                title: "Execution Traces",
                desc: "Full visibility into every run. See inputs, outputs, and timing for every step.",
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: "Template Library",
                desc: "Start fast with pre-built workflows for HR, finance, engineering, and operations.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-background p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Design your workflow",
              desc: "Use the visual builder to create your workflow with triggers, conditions, actions, and approval gates.",
            },
            {
              step: "2",
              title: "Connect and configure",
              desc: "Set up triggers (manual, webhook, or schedule), configure each step, and define your approval chain.",
            },
            {
              step: "3",
              title: "Run and monitor",
              desc: "Activate your workflow and watch executions in real time. Trace every decision, approval, and action.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-3xl font-bold">Ready to automate your decisions?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join teams using {appConfig.name} to turn logic into reliable workflows.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} {appConfig.name}. All rights
            reserved.
          </span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
