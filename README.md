# Flow

**IF/THEN for the AI age. Orchestrate decisions and workflows.**

Part of the [12 Cities](https://github.com/abduljaleel) venture ecosystem.

## What it does

Flow is a workflow and decision orchestration platform. It lets teams build conditional logic, approval chains, and event-driven automation as visual, auditable workflows.

### Core Features

- **Visual Workflow Builder** — Drag-and-drop canvas with condition, action, approval, delay, and webhook nodes connected by arrows
- **Execution Engine** — Run workflows manually, via webhook, or on schedule with step-by-step trace views
- **Approval Queue** — Centralized inbox for pending approvals with approve/reject actions and full audit trail
- **Template Library** — Pre-built templates (Employee Onboarding, Expense Approval, Deploy Pipeline, Content Review, Incident Response)
- **Execution Traces** — Color-coded node-by-node trace showing input/output data, duration, and status for every run

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Auth & Database:** Supabase (Auth, Postgres, RLS)
- **Deployment:** Vercel

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Add your Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 12 Cities Role

**Domain:** flow.at | **Tier:** 1 (Core) | **Layer:** Intelligence

## License

Private — 12 Cities Venture System
