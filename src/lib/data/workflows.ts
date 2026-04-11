// ── Types ────────────────────────────────────────────────────────────────────

export type NodeType = "start" | "condition" | "action" | "approval" | "end";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: string;
  branches?: { label: string; targetNodeId: string }[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  triggerType: "manual" | "webhook" | "schedule";
  status: "draft" | "active" | "paused";
  nodes: WorkflowNode[];
  executionCount: number;
  lastRun: string | null;
  createdAt: string;
}

export type StepStatus = "completed" | "failed" | "skipped" | "waiting" | "running";

export interface ExecutionStep {
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  status: StepStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  duration: string;
  startedAt: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "completed" | "failed" | "running" | "waiting";
  trigger: "manual" | "webhook" | "schedule";
  startedAt: string;
  duration: string;
  steps: ExecutionStep[];
}

export interface Approval {
  id: string;
  workflowId: string;
  workflowName: string;
  executionId: string;
  stepName: string;
  requestedBy: string;
  requestedAt: string;
  dataSummary: string;
  status: "pending" | "approved" | "rejected";
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: "HR" | "Finance" | "Operations" | "Engineering" | "Custom";
  nodeCount: number;
  nodes: WorkflowNode[];
}

// ── Mock Workflows ───────────────────────────────────────────────────────────

export const workflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Employee Onboarding",
    description: "Automates the new hire onboarding process from offer acceptance to day-one setup.",
    triggerType: "webhook",
    status: "active",
    nodes: [
      { id: "n1", type: "start", name: "New Hire Trigger", config: "Webhook: POST /api/new-hire" },
      { id: "n2", type: "action", name: "Create Accounts", config: "Provision email, Slack, GitHub" },
      { id: "n3", type: "condition", name: "Engineering Role?", config: "If department == 'Engineering'" },
      { id: "n4", type: "action", name: "Setup Dev Environment", config: "Provision AWS, CI/CD access" },
      { id: "n5", type: "approval", name: "Manager Approval", config: "Requires hiring manager sign-off" },
      { id: "n6", type: "action", name: "Send Welcome Email", config: "Template: onboarding-welcome" },
      { id: "n7", type: "end", name: "Complete", config: "Mark onboarding complete" },
    ],
    executionCount: 47,
    lastRun: "2026-04-11T09:15:00Z",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "wf-2",
    name: "Expense Approval",
    description: "Routes expense reports through the appropriate approval chain based on amount.",
    triggerType: "manual",
    status: "active",
    nodes: [
      { id: "n1", type: "start", name: "Submit Expense", config: "Manual trigger" },
      { id: "n2", type: "condition", name: "Amount Check", config: "If amount > $5000" },
      { id: "n3", type: "approval", name: "Manager Approval", config: "Direct manager approval" },
      { id: "n4", type: "approval", name: "VP Approval", config: "VP approval for >$5k" },
      { id: "n5", type: "action", name: "Process Payment", config: "Submit to accounting system" },
      { id: "n6", type: "end", name: "Done", config: "Notify submitter" },
    ],
    executionCount: 128,
    lastRun: "2026-04-11T11:30:00Z",
    createdAt: "2026-02-01T08:00:00Z",
  },
  {
    id: "wf-3",
    name: "Deploy Pipeline",
    description: "CI/CD pipeline with staging validation and production approval gate.",
    triggerType: "webhook",
    status: "active",
    nodes: [
      { id: "n1", type: "start", name: "Push to Main", config: "Webhook: GitHub push event" },
      { id: "n2", type: "action", name: "Run Tests", config: "Execute test suite" },
      { id: "n3", type: "condition", name: "Tests Pass?", config: "If all tests pass" },
      { id: "n4", type: "action", name: "Deploy Staging", config: "Deploy to staging env" },
      { id: "n5", type: "approval", name: "Production Gate", config: "Eng lead approval" },
      { id: "n6", type: "action", name: "Deploy Production", config: "Deploy to prod" },
      { id: "n7", type: "end", name: "Deployed", config: "Notify team in Slack" },
    ],
    executionCount: 312,
    lastRun: "2026-04-11T14:22:00Z",
    createdAt: "2026-01-20T12:00:00Z",
  },
  {
    id: "wf-4",
    name: "Content Review",
    description: "Content publishing workflow with editorial review and compliance checks.",
    triggerType: "manual",
    status: "paused",
    nodes: [
      { id: "n1", type: "start", name: "Submit Content", config: "Manual trigger" },
      { id: "n2", type: "action", name: "AI Review", config: "Run compliance & quality check" },
      { id: "n3", type: "approval", name: "Editor Review", config: "Editorial team review" },
      { id: "n4", type: "action", name: "Publish", config: "Push to CMS" },
      { id: "n5", type: "end", name: "Published", config: "Notify author" },
    ],
    executionCount: 56,
    lastRun: "2026-04-09T16:45:00Z",
    createdAt: "2026-03-05T09:00:00Z",
  },
  {
    id: "wf-5",
    name: "Incident Response",
    description: "Automated incident response workflow with escalation and post-mortem creation.",
    triggerType: "webhook",
    status: "active",
    nodes: [
      { id: "n1", type: "start", name: "Alert Received", config: "Webhook: PagerDuty alert" },
      { id: "n2", type: "condition", name: "Severity Check", config: "If severity >= P2" },
      { id: "n3", type: "action", name: "Create Incident Channel", config: "Create Slack channel" },
      { id: "n4", type: "action", name: "Page On-Call", config: "Send PagerDuty notification" },
      { id: "n5", type: "approval", name: "Resolution Confirmation", config: "On-call confirms resolution" },
      { id: "n6", type: "action", name: "Create Post-Mortem", config: "Generate post-mortem doc" },
      { id: "n7", type: "end", name: "Resolved", config: "Close incident" },
    ],
    executionCount: 23,
    lastRun: "2026-04-10T22:14:00Z",
    createdAt: "2026-02-20T14:00:00Z",
  },
  {
    id: "wf-6",
    name: "Invoice Processing",
    description: "Extracts invoice data and routes for approval based on vendor and amount.",
    triggerType: "schedule",
    status: "draft",
    nodes: [
      { id: "n1", type: "start", name: "Scheduled Scan", config: "Daily at 9:00 AM UTC" },
      { id: "n2", type: "action", name: "Scan Inbox", config: "Check invoices@company.com" },
      { id: "n3", type: "action", name: "Extract Data", config: "AI-powered data extraction" },
      { id: "n4", type: "approval", name: "Finance Approval", config: "Finance team review" },
      { id: "n5", type: "action", name: "Book Entry", config: "Create accounting entry" },
      { id: "n6", type: "end", name: "Processed", config: "Archive invoice" },
    ],
    executionCount: 0,
    lastRun: null,
    createdAt: "2026-04-08T11:00:00Z",
  },
];

// ── Mock Executions ──────────────────────────────────────────────────────────

export const executions: Execution[] = [
  {
    id: "exec-1",
    workflowId: "wf-1",
    workflowName: "Employee Onboarding",
    status: "completed",
    trigger: "webhook",
    startedAt: "2026-04-11T09:15:00Z",
    duration: "4m 32s",
    steps: [
      { nodeId: "n1", nodeName: "New Hire Trigger", nodeType: "start", status: "completed", input: { employee: "Jane Smith", department: "Engineering" }, output: { triggered: true }, duration: "0.1s", startedAt: "2026-04-11T09:15:00Z" },
      { nodeId: "n2", nodeName: "Create Accounts", nodeType: "action", status: "completed", input: { employee: "Jane Smith" }, output: { email: "jane@company.com", slack: true, github: true }, duration: "45s", startedAt: "2026-04-11T09:15:01Z" },
      { nodeId: "n3", nodeName: "Engineering Role?", nodeType: "condition", status: "completed", input: { department: "Engineering" }, output: { result: true, branch: "yes" }, duration: "0.2s", startedAt: "2026-04-11T09:15:46Z" },
      { nodeId: "n4", nodeName: "Setup Dev Environment", nodeType: "action", status: "completed", input: { role: "Engineer" }, output: { aws: true, cicd: true }, duration: "1m 20s", startedAt: "2026-04-11T09:15:47Z" },
      { nodeId: "n5", nodeName: "Manager Approval", nodeType: "approval", status: "completed", input: { approver: "Mike Johnson" }, output: { approved: true, comment: "Looks good" }, duration: "2m 10s", startedAt: "2026-04-11T09:17:07Z" },
      { nodeId: "n6", nodeName: "Send Welcome Email", nodeType: "action", status: "completed", input: { template: "onboarding-welcome" }, output: { sent: true }, duration: "5s", startedAt: "2026-04-11T09:19:17Z" },
      { nodeId: "n7", nodeName: "Complete", nodeType: "end", status: "completed", input: {}, output: { success: true }, duration: "0.1s", startedAt: "2026-04-11T09:19:22Z" },
    ],
  },
  {
    id: "exec-2",
    workflowId: "wf-2",
    workflowName: "Expense Approval",
    status: "waiting",
    trigger: "manual",
    startedAt: "2026-04-11T11:30:00Z",
    duration: "—",
    steps: [
      { nodeId: "n1", nodeName: "Submit Expense", nodeType: "start", status: "completed", input: { submitter: "Alex Chen", amount: 7500 }, output: { submitted: true }, duration: "0.1s", startedAt: "2026-04-11T11:30:00Z" },
      { nodeId: "n2", nodeName: "Amount Check", nodeType: "condition", status: "completed", input: { amount: 7500 }, output: { result: true, branch: "above $5k" }, duration: "0.1s", startedAt: "2026-04-11T11:30:01Z" },
      { nodeId: "n3", nodeName: "Manager Approval", nodeType: "approval", status: "completed", input: { approver: "Sarah Lee" }, output: { approved: true }, duration: "15m", startedAt: "2026-04-11T11:30:02Z" },
      { nodeId: "n4", nodeName: "VP Approval", nodeType: "approval", status: "waiting", input: { approver: "David Kim", amount: 7500 }, output: {}, duration: "—", startedAt: "2026-04-11T11:45:02Z" },
      { nodeId: "n5", nodeName: "Process Payment", nodeType: "action", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
      { nodeId: "n6", nodeName: "Done", nodeType: "end", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
    ],
  },
  {
    id: "exec-3",
    workflowId: "wf-3",
    workflowName: "Deploy Pipeline",
    status: "failed",
    trigger: "webhook",
    startedAt: "2026-04-11T14:22:00Z",
    duration: "1m 45s",
    steps: [
      { nodeId: "n1", nodeName: "Push to Main", nodeType: "start", status: "completed", input: { commit: "a3f29c1", branch: "main" }, output: { triggered: true }, duration: "0.1s", startedAt: "2026-04-11T14:22:00Z" },
      { nodeId: "n2", nodeName: "Run Tests", nodeType: "action", status: "failed", input: { suite: "full" }, output: { error: "3 tests failed in auth module" }, duration: "1m 44s", startedAt: "2026-04-11T14:22:01Z" },
      { nodeId: "n3", nodeName: "Tests Pass?", nodeType: "condition", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
      { nodeId: "n4", nodeName: "Deploy Staging", nodeType: "action", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
      { nodeId: "n5", nodeName: "Production Gate", nodeType: "approval", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
      { nodeId: "n6", nodeName: "Deploy Production", nodeType: "action", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
      { nodeId: "n7", nodeName: "Deployed", nodeType: "end", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
    ],
  },
  {
    id: "exec-4",
    workflowId: "wf-3",
    workflowName: "Deploy Pipeline",
    status: "completed",
    trigger: "webhook",
    startedAt: "2026-04-11T10:05:00Z",
    duration: "6m 12s",
    steps: [
      { nodeId: "n1", nodeName: "Push to Main", nodeType: "start", status: "completed", input: { commit: "b7d41e2", branch: "main" }, output: { triggered: true }, duration: "0.1s", startedAt: "2026-04-11T10:05:00Z" },
      { nodeId: "n2", nodeName: "Run Tests", nodeType: "action", status: "completed", input: { suite: "full" }, output: { passed: 142, failed: 0 }, duration: "2m 30s", startedAt: "2026-04-11T10:05:01Z" },
      { nodeId: "n3", nodeName: "Tests Pass?", nodeType: "condition", status: "completed", input: { passed: true }, output: { result: true }, duration: "0.1s", startedAt: "2026-04-11T10:07:31Z" },
      { nodeId: "n4", nodeName: "Deploy Staging", nodeType: "action", status: "completed", input: { env: "staging" }, output: { url: "https://staging.app.com" }, duration: "1m 15s", startedAt: "2026-04-11T10:07:32Z" },
      { nodeId: "n5", nodeName: "Production Gate", nodeType: "approval", status: "completed", input: { approver: "Tech Lead" }, output: { approved: true }, duration: "1m 50s", startedAt: "2026-04-11T10:08:47Z" },
      { nodeId: "n6", nodeName: "Deploy Production", nodeType: "action", status: "completed", input: { env: "production" }, output: { url: "https://app.com" }, duration: "35s", startedAt: "2026-04-11T10:10:37Z" },
      { nodeId: "n7", nodeName: "Deployed", nodeType: "end", status: "completed", input: {}, output: { notified: true }, duration: "0.1s", startedAt: "2026-04-11T10:11:12Z" },
    ],
  },
  {
    id: "exec-5",
    workflowId: "wf-5",
    workflowName: "Incident Response",
    status: "running",
    trigger: "webhook",
    startedAt: "2026-04-11T15:01:00Z",
    duration: "—",
    steps: [
      { nodeId: "n1", nodeName: "Alert Received", nodeType: "start", status: "completed", input: { alert: "High CPU on prod-web-3", severity: "P1" }, output: { triggered: true }, duration: "0.1s", startedAt: "2026-04-11T15:01:00Z" },
      { nodeId: "n2", nodeName: "Severity Check", nodeType: "condition", status: "completed", input: { severity: "P1" }, output: { result: true, branch: "critical" }, duration: "0.1s", startedAt: "2026-04-11T15:01:01Z" },
      { nodeId: "n3", nodeName: "Create Incident Channel", nodeType: "action", status: "completed", input: { incident: "INC-2026-0411" }, output: { channel: "#inc-2026-0411" }, duration: "3s", startedAt: "2026-04-11T15:01:02Z" },
      { nodeId: "n4", nodeName: "Page On-Call", nodeType: "action", status: "running", input: { oncall: "Pat Morgan" }, output: {}, duration: "—", startedAt: "2026-04-11T15:01:05Z" },
      { nodeId: "n5", nodeName: "Resolution Confirmation", nodeType: "approval", status: "waiting", input: {}, output: {}, duration: "—", startedAt: "" },
      { nodeId: "n6", nodeName: "Create Post-Mortem", nodeType: "action", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
      { nodeId: "n7", nodeName: "Resolved", nodeType: "end", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
    ],
  },
  {
    id: "exec-6",
    workflowId: "wf-1",
    workflowName: "Employee Onboarding",
    status: "completed",
    trigger: "webhook",
    startedAt: "2026-04-10T14:20:00Z",
    duration: "5m 10s",
    steps: [
      { nodeId: "n1", nodeName: "New Hire Trigger", nodeType: "start", status: "completed", input: { employee: "Tom Rivera", department: "Marketing" }, output: { triggered: true }, duration: "0.1s", startedAt: "2026-04-10T14:20:00Z" },
      { nodeId: "n2", nodeName: "Create Accounts", nodeType: "action", status: "completed", input: { employee: "Tom Rivera" }, output: { email: "tom@company.com", slack: true }, duration: "40s", startedAt: "2026-04-10T14:20:01Z" },
      { nodeId: "n3", nodeName: "Engineering Role?", nodeType: "condition", status: "completed", input: { department: "Marketing" }, output: { result: false, branch: "no" }, duration: "0.1s", startedAt: "2026-04-10T14:20:41Z" },
      { nodeId: "n4", nodeName: "Setup Dev Environment", nodeType: "action", status: "skipped", input: {}, output: {}, duration: "—", startedAt: "" },
      { nodeId: "n5", nodeName: "Manager Approval", nodeType: "approval", status: "completed", input: { approver: "Lisa Park" }, output: { approved: true }, duration: "3m 50s", startedAt: "2026-04-10T14:20:42Z" },
      { nodeId: "n6", nodeName: "Send Welcome Email", nodeType: "action", status: "completed", input: { template: "onboarding-welcome" }, duration: "5s", output: { sent: true }, startedAt: "2026-04-10T14:24:32Z" },
      { nodeId: "n7", nodeName: "Complete", nodeType: "end", status: "completed", input: {}, output: { success: true }, duration: "0.1s", startedAt: "2026-04-10T14:24:37Z" },
    ],
  },
];

// ── Mock Approvals ───────────────────────────────────────────────────────────

export const approvals: Approval[] = [
  {
    id: "apr-1",
    workflowId: "wf-2",
    workflowName: "Expense Approval",
    executionId: "exec-2",
    stepName: "VP Approval",
    requestedBy: "Alex Chen",
    requestedAt: "2026-04-11T11:45:02Z",
    dataSummary: "Expense report for $7,500 — Team offsite event. Manager approved.",
    status: "pending",
  },
  {
    id: "apr-2",
    workflowId: "wf-5",
    workflowName: "Incident Response",
    executionId: "exec-5",
    stepName: "Resolution Confirmation",
    requestedBy: "System",
    requestedAt: "2026-04-11T15:01:05Z",
    dataSummary: "P1 incident INC-2026-0411: High CPU on prod-web-3. Channel created.",
    status: "pending",
  },
  {
    id: "apr-3",
    workflowId: "wf-4",
    workflowName: "Content Review",
    executionId: "exec-7",
    stepName: "Editor Review",
    requestedBy: "Maria Lopez",
    requestedAt: "2026-04-11T08:30:00Z",
    dataSummary: 'Blog post: "Q1 Product Updates" — AI review passed, ready for editorial.',
    status: "pending",
  },
  {
    id: "apr-4",
    workflowId: "wf-2",
    workflowName: "Expense Approval",
    executionId: "exec-8",
    stepName: "Manager Approval",
    requestedBy: "Jordan Lee",
    requestedAt: "2026-04-10T16:20:00Z",
    dataSummary: "Expense report for $1,200 — Conference travel expenses.",
    status: "approved",
    resolvedAt: "2026-04-10T17:05:00Z",
    resolvedBy: "Sarah Lee",
  },
  {
    id: "apr-5",
    workflowId: "wf-3",
    workflowName: "Deploy Pipeline",
    executionId: "exec-4",
    stepName: "Production Gate",
    requestedBy: "CI System",
    requestedAt: "2026-04-11T10:08:47Z",
    dataSummary: "Deploy commit b7d41e2 to production. Staging tests passed.",
    status: "approved",
    resolvedAt: "2026-04-11T10:10:37Z",
    resolvedBy: "Tech Lead",
  },
  {
    id: "apr-6",
    workflowId: "wf-1",
    workflowName: "Employee Onboarding",
    executionId: "exec-1",
    stepName: "Manager Approval",
    requestedBy: "HR System",
    requestedAt: "2026-04-11T09:17:07Z",
    dataSummary: "New hire Jane Smith (Engineering). Accounts provisioned, dev env ready.",
    status: "approved",
    resolvedAt: "2026-04-11T09:19:17Z",
    resolvedBy: "Mike Johnson",
  },
  {
    id: "apr-7",
    workflowId: "wf-2",
    workflowName: "Expense Approval",
    executionId: "exec-9",
    stepName: "Manager Approval",
    requestedBy: "Pat Morgan",
    requestedAt: "2026-04-09T10:00:00Z",
    dataSummary: "Expense report for $450 — Software license renewal.",
    status: "rejected",
    resolvedAt: "2026-04-09T11:30:00Z",
    resolvedBy: "Sarah Lee",
  },
];

// ── Mock Templates ───────────────────────────────────────────────────────────

export const templates: Template[] = [
  {
    id: "tpl-1",
    name: "Employee Onboarding",
    description: "End-to-end new hire onboarding: account provisioning, role-specific setup, manager approval, and welcome communication.",
    category: "HR",
    nodeCount: 7,
    nodes: [
      { id: "n1", type: "start", name: "New Hire Trigger", config: "Webhook trigger" },
      { id: "n2", type: "action", name: "Create Accounts", config: "Provision accounts" },
      { id: "n3", type: "condition", name: "Role Check", config: "Check department" },
      { id: "n4", type: "action", name: "Role-Specific Setup", config: "Department setup" },
      { id: "n5", type: "approval", name: "Manager Approval", config: "Manager sign-off" },
      { id: "n6", type: "action", name: "Send Welcome", config: "Welcome email" },
      { id: "n7", type: "end", name: "Complete", config: "Done" },
    ],
  },
  {
    id: "tpl-2",
    name: "Expense Approval",
    description: "Multi-tier expense approval with automatic routing based on amount thresholds and department budgets.",
    category: "Finance",
    nodeCount: 6,
    nodes: [
      { id: "n1", type: "start", name: "Submit Expense", config: "Manual trigger" },
      { id: "n2", type: "condition", name: "Amount Threshold", config: "Check amount" },
      { id: "n3", type: "approval", name: "Manager Approval", config: "Direct manager" },
      { id: "n4", type: "approval", name: "VP Approval", config: "VP for high amounts" },
      { id: "n5", type: "action", name: "Process Payment", config: "Submit payment" },
      { id: "n6", type: "end", name: "Done", config: "Notify submitter" },
    ],
  },
  {
    id: "tpl-3",
    name: "Deploy Pipeline",
    description: "CI/CD pipeline with automated testing, staging deployment, production approval gate, and team notification.",
    category: "Engineering",
    nodeCount: 7,
    nodes: [
      { id: "n1", type: "start", name: "Code Push", config: "Git webhook" },
      { id: "n2", type: "action", name: "Run Tests", config: "Test suite" },
      { id: "n3", type: "condition", name: "Tests Pass?", config: "Check results" },
      { id: "n4", type: "action", name: "Deploy Staging", config: "Staging env" },
      { id: "n5", type: "approval", name: "Production Gate", config: "Lead approval" },
      { id: "n6", type: "action", name: "Deploy Production", config: "Prod env" },
      { id: "n7", type: "end", name: "Deployed", config: "Notify team" },
    ],
  },
  {
    id: "tpl-4",
    name: "Content Review",
    description: "Publishing workflow with AI-powered quality check, editorial review, and automated CMS publishing.",
    category: "Operations",
    nodeCount: 5,
    nodes: [
      { id: "n1", type: "start", name: "Submit Content", config: "Manual trigger" },
      { id: "n2", type: "action", name: "AI Review", config: "Quality check" },
      { id: "n3", type: "approval", name: "Editor Review", config: "Editorial review" },
      { id: "n4", type: "action", name: "Publish", config: "Push to CMS" },
      { id: "n5", type: "end", name: "Published", config: "Notify author" },
    ],
  },
  {
    id: "tpl-5",
    name: "Incident Response",
    description: "Automated incident management: severity-based escalation, channel creation, on-call paging, and post-mortem generation.",
    category: "Engineering",
    nodeCount: 7,
    nodes: [
      { id: "n1", type: "start", name: "Alert", config: "PagerDuty webhook" },
      { id: "n2", type: "condition", name: "Severity Check", config: "Check severity" },
      { id: "n3", type: "action", name: "Create Channel", config: "Slack channel" },
      { id: "n4", type: "action", name: "Page On-Call", config: "PagerDuty page" },
      { id: "n5", type: "approval", name: "Resolution", config: "Confirm resolved" },
      { id: "n6", type: "action", name: "Post-Mortem", config: "Generate doc" },
      { id: "n7", type: "end", name: "Resolved", config: "Close incident" },
    ],
  },
  {
    id: "tpl-6",
    name: "PTO Request",
    description: "Time-off request workflow with calendar conflict checking, manager approval, and team notification.",
    category: "HR",
    nodeCount: 5,
    nodes: [
      { id: "n1", type: "start", name: "Submit Request", config: "Manual trigger" },
      { id: "n2", type: "condition", name: "Calendar Check", config: "Check conflicts" },
      { id: "n3", type: "approval", name: "Manager Approval", config: "Manager review" },
      { id: "n4", type: "action", name: "Update Calendar", config: "Block dates" },
      { id: "n5", type: "end", name: "Confirmed", config: "Notify team" },
    ],
  },
  {
    id: "tpl-7",
    name: "Invoice Processing",
    description: "Automated invoice handling with AI data extraction, approval routing, and accounting system integration.",
    category: "Finance",
    nodeCount: 6,
    nodes: [
      { id: "n1", type: "start", name: "Receive Invoice", config: "Email scan" },
      { id: "n2", type: "action", name: "Extract Data", config: "AI extraction" },
      { id: "n3", type: "condition", name: "Vendor Check", config: "Known vendor?" },
      { id: "n4", type: "approval", name: "Finance Approval", config: "Finance review" },
      { id: "n5", type: "action", name: "Book Entry", config: "Accounting entry" },
      { id: "n6", type: "end", name: "Processed", config: "Archive" },
    ],
  },
  {
    id: "tpl-8",
    name: "Vendor Onboarding",
    description: "New vendor qualification: compliance documentation, security review, legal approval, and system setup.",
    category: "Operations",
    nodeCount: 6,
    nodes: [
      { id: "n1", type: "start", name: "Submit Vendor", config: "Manual trigger" },
      { id: "n2", type: "action", name: "Compliance Check", config: "Document review" },
      { id: "n3", type: "approval", name: "Security Review", config: "Security team" },
      { id: "n4", type: "approval", name: "Legal Approval", config: "Legal team" },
      { id: "n5", type: "action", name: "System Setup", config: "Create vendor" },
      { id: "n6", type: "end", name: "Onboarded", config: "Notify team" },
    ],
  },
  {
    id: "tpl-9",
    name: "Bug Triage",
    description: "Bug report triage with severity classification, team assignment, and SLA tracking.",
    category: "Engineering",
    nodeCount: 5,
    nodes: [
      { id: "n1", type: "start", name: "Bug Report", config: "Jira webhook" },
      { id: "n2", type: "condition", name: "Severity", config: "Classify severity" },
      { id: "n3", type: "action", name: "Assign Team", config: "Route to team" },
      { id: "n4", type: "action", name: "Set SLA", config: "Apply SLA timer" },
      { id: "n5", type: "end", name: "Triaged", config: "Notify assignee" },
    ],
  },
  {
    id: "tpl-10",
    name: "Custom Workflow",
    description: "Start from scratch with a blank workflow. Add your own nodes, conditions, and approval gates.",
    category: "Custom",
    nodeCount: 2,
    nodes: [
      { id: "n1", type: "start", name: "Start", config: "Configure trigger" },
      { id: "n2", type: "end", name: "End", config: "Configure completion" },
    ],
  },
];

// ── Helper functions ─────────────────────────────────────────────────────────

export function getWorkflow(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}

export function getExecution(id: string): Execution | undefined {
  return executions.find((e) => e.id === id);
}

export function getWorkflowExecutions(workflowId: string): Execution[] {
  return executions.filter((e) => e.workflowId === workflowId);
}

export function getPendingApprovals(): Approval[] {
  return approvals.filter((a) => a.status === "pending");
}

export function getApprovalHistory(): Approval[] {
  return approvals.filter((a) => a.status !== "pending");
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "—";
  const now = new Date("2026-04-11T15:30:00Z");
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}
