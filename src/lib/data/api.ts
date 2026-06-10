import { createClient } from "@/lib/supabase/client";
import {
  workflows as seedWorkflows,
  executions as seedExecutions,
  approvals as seedApprovals,
  templates as seedTemplates,
  type Approval,
  type Execution,
  type ExecutionStep,
  type NodeType,
  type StepStatus,
  type Template,
  type Workflow,
  type WorkflowNode,
} from "./workflows";

// ── Context ──────────────────────────────────────────────────────────────────

export async function getCtx() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();
  if (error) throw new Error(error.message);
  if (!profile?.org_id) throw new Error("No organization found for this account");
  return { supabase, user, userId: user.id, orgId: profile.org_id as string };
}

export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  name: string;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const name =
    (user.user_metadata?.full_name as string | undefined) || user.email || "User";
  return { id: user.id, email: user.email ?? "", name };
}

// ── Row types (DB snake_case) ────────────────────────────────────────────────

type Json = Record<string, unknown>;

interface NodeConfigJson {
  name?: string;
  label?: string;
  branches?: { label: string; targetNodeId: string }[];
}

interface NodePositionJson {
  x?: number;
  y?: number;
  order?: number;
}

interface WorkflowRow {
  id: string;
  org_id: string | null;
  name: string;
  description: string | null;
  status: string | null;
  trigger_type: string | null;
  trigger_config: Json | null;
  created_by: string | null;
  version: number | null;
  created_at: string | null;
}

interface WorkflowNodeRow {
  id: string;
  workflow_id: string;
  node_type: string;
  position: NodePositionJson | null;
  config: NodeConfigJson | null;
  next_nodes: unknown;
}

interface ApprovalMeta {
  stepName?: string;
  requestedBy?: string;
  dataSummary?: string;
  requestedAt?: string;
  resolution?: "approved" | "rejected";
  resolvedAt?: string;
  resolvedBy?: string;
}

interface TriggerData {
  trigger?: string;
  approval?: ApprovalMeta;
  [key: string]: unknown;
}

interface ExecutionRow {
  id: string;
  workflow_id: string;
  trigger_data: TriggerData | null;
  status: string | null;
  started_at: string | null;
  completed_at: string | null;
  current_node_id: string | null;
  workflows?: { name: string } | { name: string }[] | null;
}

interface ExecutionStepRow {
  id: string;
  execution_id: string;
  node_id: string | null;
  status: string | null;
  input: Json | null;
  output: Json | null;
  started_at: string | null;
  completed_at: string | null;
}

interface TemplateRow {
  id: string;
  org_id: string | null;
  name: string;
  description: string | null;
  category: string | null;
  workflow_snapshot: { nodes?: WorkflowNode[] } | null;
  is_public: boolean | null;
  usage_count: number | null;
  created_at: string | null;
}

// ── Mapping helpers (DB → UI types) ──────────────────────────────────────────

const UI_NODE_TYPES: NodeType[] = ["start", "condition", "action", "approval", "end"];

function mapNodeType(t: string | null | undefined): NodeType {
  if (t && (UI_NODE_TYPES as string[]).includes(t)) return t as NodeType;
  return "action";
}

function mapWorkflowStatus(s: string | null): Workflow["status"] {
  if (s === "active" || s === "paused" || s === "draft") return s;
  return "draft";
}

function mapTriggerType(t: string | null | undefined): Workflow["triggerType"] {
  if (t === "manual" || t === "webhook" || t === "schedule") return t;
  return "manual";
}

function isAwaitingApproval(status: string | null): boolean {
  return status === "awaiting_approval" || status === "waiting_approval";
}

function mapExecutionStatus(s: string | null): Execution["status"] {
  if (s === "completed" || s === "failed" || s === "running") return s;
  if (s === "cancelled") return "failed";
  return "waiting";
}

function mapStepStatus(s: string | null): StepStatus {
  if (s === "completed" || s === "failed" || s === "skipped" || s === "running")
    return s;
  return "waiting";
}

function toDbStepStatus(s: StepStatus): string {
  return s === "waiting" ? "pending" : s;
}

const UI_CATEGORIES = ["HR", "Finance", "Operations", "Engineering", "Custom"];

function mapCategory(c: string | null): Template["category"] {
  if (c && UI_CATEGORIES.includes(c)) return c as Template["category"];
  return "Custom";
}

function nodeOrder(n: WorkflowNodeRow): number {
  return n.position?.order ?? n.position?.y ?? 0;
}

function embeddedWorkflowName(w: ExecutionRow["workflows"]): string {
  if (!w) return "Workflow";
  if (Array.isArray(w)) return w[0]?.name ?? "Workflow";
  return w.name;
}

function formatDuration(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  if (!start || !end) return "—";
  const ms = Date.parse(end) - Date.parse(start);
  if (Number.isNaN(ms) || ms < 0) return "—";
  const s = ms / 1000;
  if (s < 10) return `${s.toFixed(1)}s`;
  if (s < 60) return `${Math.round(s)}s`;
  const m = Math.floor(s / 60);
  const rs = Math.round(s % 60);
  if (m < 60) return `${m}m ${rs}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function rowToNode(r: WorkflowNodeRow): WorkflowNode {
  return {
    id: r.id,
    type: mapNodeType(r.node_type),
    name: r.config?.name ?? r.node_type,
    config: r.config?.label ?? "",
    ...(r.config?.branches ? { branches: r.config.branches } : {}),
  };
}

function rowToWorkflow(
  r: WorkflowRow,
  nodes: WorkflowNode[],
  executionCount: number,
  lastRun: string | null
): Workflow {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    triggerType: mapTriggerType(r.trigger_type),
    status: mapWorkflowStatus(r.status),
    nodes,
    executionCount,
    lastRun,
    createdAt: r.created_at ?? "",
  };
}

function rowToStep(
  r: ExecutionStepRow,
  node?: { name: string; type: NodeType }
): ExecutionStep {
  return {
    nodeId: r.node_id ?? r.id,
    nodeName: node?.name ?? "Step",
    nodeType: node?.type ?? "action",
    status: mapStepStatus(r.status),
    input: r.input ?? {},
    output: r.output ?? {},
    duration: formatDuration(r.started_at, r.completed_at),
    startedAt: r.started_at ?? "",
  };
}

function rowToExecution(r: ExecutionRow, steps: ExecutionStep[] = []): Execution {
  return {
    id: r.id,
    workflowId: r.workflow_id,
    workflowName: embeddedWorkflowName(r.workflows),
    status: mapExecutionStatus(r.status),
    trigger: mapTriggerType(r.trigger_data?.trigger),
    startedAt: r.started_at ?? "",
    duration: formatDuration(r.started_at, r.completed_at),
    steps,
  };
}

function rowToTemplate(r: TemplateRow): Template {
  const rawNodes = r.workflow_snapshot?.nodes ?? [];
  const nodes: WorkflowNode[] = rawNodes.map((n, i) => ({
    id: n.id ?? `n${i + 1}`,
    type: mapNodeType(n.type),
    name: n.name ?? "Step",
    config: n.config ?? "",
    ...(n.branches ? { branches: n.branches } : {}),
  }));
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    category: mapCategory(r.category),
    nodeCount: nodes.length,
    nodes,
  };
}

function rowToApproval(r: ExecutionRow): Approval {
  const meta = r.trigger_data?.approval;
  const approval: Approval = {
    id: r.id,
    workflowId: r.workflow_id,
    workflowName: embeddedWorkflowName(r.workflows),
    executionId: r.id,
    stepName: meta?.stepName ?? "Approval required",
    requestedBy: meta?.requestedBy ?? "System",
    requestedAt: meta?.requestedAt ?? r.started_at ?? "",
    dataSummary: meta?.dataSummary ?? "",
    status: "pending",
  };
  if (meta?.resolution) {
    approval.status = meta.resolution;
    if (meta.resolvedAt) approval.resolvedAt = meta.resolvedAt;
    if (meta.resolvedBy) approval.resolvedBy = meta.resolvedBy;
  }
  return approval;
}

// ── Workflows CRUD ───────────────────────────────────────────────────────────

export async function listWorkflows(): Promise<Workflow[]> {
  const { supabase, orgId } = await getCtx();
  const [wfRes, exRes] = await Promise.all([
    supabase
      .from("workflows")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false }),
    supabase.from("workflow_executions").select("workflow_id, started_at"),
  ]);
  if (wfRes.error) throw new Error(wfRes.error.message);
  if (exRes.error) throw new Error(exRes.error.message);

  const counts = new Map<string, number>();
  const lastRuns = new Map<string, string>();
  for (const e of (exRes.data ?? []) as {
    workflow_id: string;
    started_at: string | null;
  }[]) {
    counts.set(e.workflow_id, (counts.get(e.workflow_id) ?? 0) + 1);
    if (e.started_at) {
      const prev = lastRuns.get(e.workflow_id);
      if (!prev || e.started_at > prev) lastRuns.set(e.workflow_id, e.started_at);
    }
  }

  return ((wfRes.data ?? []) as WorkflowRow[]).map((r) =>
    rowToWorkflow(r, [], counts.get(r.id) ?? 0, lastRuns.get(r.id) ?? null)
  );
}

export async function getWorkflowById(id: string): Promise<Workflow | null> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as WorkflowRow;

  const nodesRes = await supabase
    .from("workflow_nodes")
    .select("*")
    .eq("workflow_id", id);
  if (nodesRes.error) throw new Error(nodesRes.error.message);
  const nodes = ((nodesRes.data ?? []) as WorkflowNodeRow[])
    .slice()
    .sort((a, b) => nodeOrder(a) - nodeOrder(b))
    .map(rowToNode);

  return rowToWorkflow(row, nodes, 0, null);
}

export interface CreateWorkflowInput {
  name: string;
  description: string;
  triggerType: "manual" | "webhook" | "schedule";
  template?: Template | null;
}

export async function createWorkflow(input: CreateWorkflowInput): Promise<string> {
  const { supabase, orgId, userId } = await getCtx();
  const { data, error } = await supabase
    .from("workflows")
    .insert({
      org_id: orgId,
      name: input.name,
      description: input.description,
      status: "draft",
      trigger_type: input.triggerType,
      trigger_config: {},
      created_by: userId,
      version: 1,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create workflow");
  const workflowId = data.id as string;

  const templateNodes = input.template?.nodes ?? [];
  if (templateNodes.length > 0) {
    await insertWorkflowNodes(supabase, workflowId, templateNodes);
  }
  if (input.template) {
    // Usage tracking is best-effort; never block workflow creation on it.
    try {
      await incrementTemplateUsage(input.template.id);
    } catch {
      // ignore
    }
  }
  return workflowId;
}

export async function updateWorkflowStatus(
  id: string,
  status: Workflow["status"]
): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("workflows").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteWorkflow(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("workflows").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Inserts UI-shaped nodes for a workflow. Node name + display config live in the
 * `config` jsonb ({ name, label, branches }), linear order in `position.order`.
 * Returns a map of seed node id (e.g. "n1") → real DB uuid.
 */
async function insertWorkflowNodes(
  supabase: ReturnType<typeof createClient>,
  workflowId: string,
  nodes: WorkflowNode[]
): Promise<Map<string, string>> {
  const payload = nodes.map((n, i) => ({
    workflow_id: workflowId,
    node_type: n.type,
    position: { x: 0, y: i * 120, order: i },
    config: {
      name: n.name,
      label: n.config,
      ...(n.branches ? { branches: n.branches } : {}),
    },
    next_nodes: [],
  }));
  const { data, error } = await supabase
    .from("workflow_nodes")
    .insert(payload)
    .select("id, position");
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as { id: string; position: NodePositionJson | null }[];
  const sorted = rows
    .slice()
    .sort((a, b) => (a.position?.order ?? 0) - (b.position?.order ?? 0));
  const map = new Map<string, string>();
  sorted.forEach((row, i) => {
    const seedNode = nodes[i];
    if (seedNode) map.set(seedNode.id, row.id);
  });
  return map;
}

// ── Executions ───────────────────────────────────────────────────────────────

export async function listExecutions(): Promise<Execution[]> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("workflow_executions")
    .select("*, workflows(name)")
    .order("started_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as ExecutionRow[]).map((r) => rowToExecution(r));
}

export async function listWorkflowExecutions(
  workflowId: string
): Promise<Execution[]> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("workflow_executions")
    .select("*, workflows(name)")
    .eq("workflow_id", workflowId)
    .order("started_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as ExecutionRow[]).map((r) => rowToExecution(r));
}

export async function getExecutionById(id: string): Promise<Execution | null> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("workflow_executions")
    .select("*, workflows(name)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as ExecutionRow;

  // No FK exists between execution_steps.node_id and workflow_nodes in the live
  // schema, so PostgREST can't embed — join client-side instead.
  const [stepsRes, nodesRes] = await Promise.all([
    supabase.from("execution_steps").select("*").eq("execution_id", id),
    supabase.from("workflow_nodes").select("*").eq("workflow_id", row.workflow_id),
  ]);
  if (stepsRes.error) throw new Error(stepsRes.error.message);
  if (nodesRes.error) throw new Error(nodesRes.error.message);

  const nodeInfo = new Map<string, { name: string; type: NodeType; order: number }>();
  for (const n of (nodesRes.data ?? []) as WorkflowNodeRow[]) {
    nodeInfo.set(n.id, {
      name: n.config?.name ?? n.node_type,
      type: mapNodeType(n.node_type),
      order: nodeOrder(n),
    });
  }

  const steps = ((stepsRes.data ?? []) as ExecutionStepRow[])
    .slice()
    .sort(
      (a, b) =>
        (nodeInfo.get(a.node_id ?? "")?.order ?? Number.MAX_SAFE_INTEGER) -
        (nodeInfo.get(b.node_id ?? "")?.order ?? Number.MAX_SAFE_INTEGER)
    )
    .map((s) => rowToStep(s, s.node_id ? nodeInfo.get(s.node_id) : undefined));

  return rowToExecution(row, steps);
}

// ── Approvals (executions awaiting approval) ─────────────────────────────────

export async function listApprovals(): Promise<{
  pending: Approval[];
  history: Approval[];
}> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("workflow_executions")
    .select("*, workflows(name)")
    .order("started_at", { ascending: false });
  if (error) throw new Error(error.message);

  const pending: Approval[] = [];
  const history: Approval[] = [];
  for (const row of (data ?? []) as ExecutionRow[]) {
    if (isAwaitingApproval(row.status)) {
      pending.push({ ...rowToApproval(row), status: "pending" });
    } else if (row.trigger_data?.approval?.resolution) {
      history.push(rowToApproval(row));
    }
  }
  history.sort((a, b) => (b.resolvedAt ?? "").localeCompare(a.resolvedAt ?? ""));
  return { pending, history };
}

export async function resolveApproval(
  executionId: string,
  decision: "approved" | "rejected"
): Promise<void> {
  const { supabase, user } = await getCtx();
  const resolvedBy =
    (user.user_metadata?.full_name as string | undefined) || user.email || "You";

  const { data: execData, error: execErr } = await supabase
    .from("workflow_executions")
    .select("*")
    .eq("id", executionId)
    .maybeSingle();
  if (execErr) throw new Error(execErr.message);
  if (!execData) throw new Error("Approval request not found");
  const execution = execData as ExecutionRow;

  const [stepsRes, nodesRes] = await Promise.all([
    supabase.from("execution_steps").select("*").eq("execution_id", executionId),
    supabase
      .from("workflow_nodes")
      .select("*")
      .eq("workflow_id", execution.workflow_id),
  ]);
  if (stepsRes.error) throw new Error(stepsRes.error.message);
  if (nodesRes.error) throw new Error(nodesRes.error.message);

  const nodeTypes = new Map<string, NodeType>();
  const nodeOrders = new Map<string, number>();
  for (const n of (nodesRes.data ?? []) as WorkflowNodeRow[]) {
    nodeTypes.set(n.id, mapNodeType(n.node_type));
    nodeOrders.set(n.id, nodeOrder(n));
  }

  const steps = ((stepsRes.data ?? []) as ExecutionStepRow[])
    .slice()
    .sort(
      (a, b) =>
        (nodeOrders.get(a.node_id ?? "") ?? Number.MAX_SAFE_INTEGER) -
        (nodeOrders.get(b.node_id ?? "") ?? Number.MAX_SAFE_INTEGER)
    );

  const approvalStep = steps.find(
    (s) =>
      s.node_id &&
      nodeTypes.get(s.node_id) === "approval" &&
      (s.status === "pending" || s.status === "running")
  );

  const now = new Date().toISOString();
  const approved = decision === "approved";
  const prev: TriggerData = execution.trigger_data ?? {};
  const triggerData: TriggerData = {
    ...prev,
    approval: {
      ...(prev.approval ?? {}),
      resolution: decision,
      resolvedAt: now,
      resolvedBy,
    },
  };

  const updates: PromiseLike<{ error: { message: string } | null }>[] = [];
  updates.push(
    supabase
      .from("workflow_executions")
      .update({
        status: approved ? "completed" : "failed",
        completed_at: now,
        current_node_id: null,
        trigger_data: triggerData,
      })
      .eq("id", executionId)
  );

  if (approvalStep) {
    updates.push(
      supabase
        .from("execution_steps")
        .update({
          status: approved ? "completed" : "failed",
          output: { ...(approvalStep.output ?? {}), approved, resolvedBy },
          started_at: approvalStep.started_at ?? now,
          completed_at: now,
        })
        .eq("id", approvalStep.id)
    );
  }

  // Simulate the rest of the run: remaining steps complete on approval, are
  // skipped on rejection.
  for (const s of steps) {
    if (approvalStep && s.id === approvalStep.id) continue;
    if (s.status === "pending" || s.status === "running") {
      updates.push(
        approved
          ? supabase
              .from("execution_steps")
              .update({
                status: "completed",
                started_at: s.started_at ?? now,
                completed_at: now,
              })
              .eq("id", s.id)
          : supabase
              .from("execution_steps")
              .update({ status: "skipped" })
              .eq("id", s.id)
      );
    }
  }

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);
}

// ── Templates CRUD ───────────────────────────────────────────────────────────

export async function listTemplates(): Promise<Template[]> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as TemplateRow[]).map(rowToTemplate);
}

export interface CreateTemplateInput {
  name: string;
  description: string;
  category: Template["category"];
  nodes: WorkflowNode[];
}

export async function createTemplate(input: CreateTemplateInput): Promise<string> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("templates")
    .insert({
      org_id: orgId,
      name: input.name,
      description: input.description,
      category: input.category,
      workflow_snapshot: { nodes: input.nodes },
      is_public: false,
      usage_count: 0,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to create template");
  return data.id as string;
}

export async function deleteTemplate(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("templates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function incrementTemplateUsage(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("templates")
    .select("usage_count")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const current = (data?.usage_count as number | null) ?? 0;
  const { error: updErr } = await supabase
    .from("templates")
    .update({ usage_count: current + 1 })
    .eq("id", id);
  if (updErr) throw new Error(updErr.message);
}

// ── Demo seeding ─────────────────────────────────────────────────────────────

/**
 * The seed arrays were authored against a fixed "now" of 2026-04-11T15:30Z.
 * Shift every seed timestamp so the same relative recency holds today.
 */
const SEED_ANCHOR_MS = Date.parse("2026-04-11T15:30:00Z");

function shiftDate(seedIso: string | null | undefined): string | null {
  if (!seedIso) return null;
  const t = Date.parse(seedIso);
  if (Number.isNaN(t)) return null;
  return new Date(Date.now() - (SEED_ANCHOR_MS - t)).toISOString();
}

function parseDurationMs(d: string): number {
  let ms = 0;
  for (const match of d.matchAll(/([\d.]+)\s*(h|m|s)/g)) {
    const value = parseFloat(match[1]);
    if (Number.isNaN(value)) continue;
    if (match[2] === "h") ms += value * 3_600_000;
    else if (match[2] === "m") ms += value * 60_000;
    else ms += value * 1_000;
  }
  return ms;
}

export async function seedDemoData(): Promise<void> {
  const { supabase, orgId, userId } = await getCtx();

  // 1) Workflows, then their nodes (capture real ids for FK chains).
  const workflowIds = new Map<string, string>();
  const nodeMaps = new Map<string, Map<string, string>>();
  for (const wf of seedWorkflows) {
    const { data, error } = await supabase
      .from("workflows")
      .insert({
        org_id: orgId,
        name: wf.name,
        description: wf.description,
        status: wf.status,
        trigger_type: wf.triggerType,
        trigger_config: {},
        created_by: userId,
        version: 1,
      })
      .select("id")
      .single();
    if (error || !data)
      throw new Error(error?.message ?? `Failed to seed workflow "${wf.name}"`);
    const realId = data.id as string;
    workflowIds.set(wf.id, realId);
    nodeMaps.set(wf.id, await insertWorkflowNodes(supabase, realId, wf.nodes));
  }

  // 2) Executions, then their steps.
  for (const seedExecution of seedExecutions) {
    const workflowId = workflowIds.get(seedExecution.workflowId);
    const nodeMap = nodeMaps.get(seedExecution.workflowId);
    if (!workflowId || !nodeMap) continue;

    const waitingApprovalStep = seedExecution.steps.find(
      (s) => s.nodeType === "approval" && s.status === "waiting"
    );
    // Demo requirement: runs paused on an approval gate are stored as
    // 'awaiting_approval' so the approvals page has live items to act on.
    const awaiting =
      seedExecution.status === "waiting" ||
      (seedExecution.status === "running" && !!waitingApprovalStep);
    const dbStatus = awaiting ? "awaiting_approval" : seedExecution.status;

    const startedAt = shiftDate(seedExecution.startedAt);
    const durationMs = parseDurationMs(seedExecution.duration);
    const completedAt =
      (dbStatus === "completed" || dbStatus === "failed") &&
      startedAt &&
      durationMs > 0
        ? new Date(Date.parse(startedAt) + durationMs).toISOString()
        : null;

    const seedApproval = seedApprovals.find(
      (a) => a.executionId === seedExecution.id
    );
    let approvalMeta: ApprovalMeta | undefined;
    if (seedApproval) {
      approvalMeta = {
        stepName: seedApproval.stepName,
        requestedBy: seedApproval.requestedBy,
        dataSummary: seedApproval.dataSummary,
        requestedAt: shiftDate(seedApproval.requestedAt) ?? undefined,
      };
      if (seedApproval.status !== "pending") {
        approvalMeta.resolution = seedApproval.status;
        approvalMeta.resolvedAt = shiftDate(seedApproval.resolvedAt) ?? undefined;
        approvalMeta.resolvedBy = seedApproval.resolvedBy;
      }
    } else if (awaiting && waitingApprovalStep) {
      approvalMeta = {
        stepName: waitingApprovalStep.nodeName,
        requestedBy: "System",
        dataSummary: "",
        requestedAt: startedAt ?? undefined,
      };
    }

    const triggerData: TriggerData = {
      trigger: seedExecution.trigger,
      ...(approvalMeta ? { approval: approvalMeta } : {}),
    };
    const currentNodeId =
      awaiting && waitingApprovalStep
        ? nodeMap.get(waitingApprovalStep.nodeId) ?? null
        : null;

    const { data: insData, error: insErr } = await supabase
      .from("workflow_executions")
      .insert({
        workflow_id: workflowId,
        trigger_data: triggerData,
        status: dbStatus,
        started_at: startedAt,
        completed_at: completedAt,
        current_node_id: currentNodeId,
      })
      .select("id")
      .single();
    if (insErr || !insData)
      throw new Error(insErr?.message ?? "Failed to seed execution");
    const executionId = insData.id as string;

    const stepRows = seedExecution.steps.map((s) => {
      const stepStart = s.startedAt ? shiftDate(s.startedAt) : null;
      const stepMs = parseDurationMs(s.duration);
      const stepCompleted =
        (s.status === "completed" || s.status === "failed") && stepStart
          ? new Date(Date.parse(stepStart) + stepMs).toISOString()
          : null;
      return {
        execution_id: executionId,
        node_id: nodeMap.get(s.nodeId) ?? null,
        status: toDbStepStatus(s.status),
        input: s.input,
        output: s.output,
        started_at: stepStart,
        completed_at: stepCompleted,
      };
    });
    const { error: stepErr } = await supabase
      .from("execution_steps")
      .insert(stepRows);
    if (stepErr) throw new Error(stepErr.message);
  }

  // 3) Templates.
  const templateRows = seedTemplates.map((t) => ({
    org_id: orgId,
    name: t.name,
    description: t.description,
    category: t.category,
    workflow_snapshot: { nodes: t.nodes },
    is_public: false,
    usage_count: 0,
  }));
  const { error: tplErr } = await supabase.from("templates").insert(templateRows);
  if (tplErr) throw new Error(tplErr.message);
}
