"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Play,
  Pause,
  Pencil,
  CirclePlay,
  GitBranch,
  ShieldCheck,
  Zap,
  CircleDot,
  CircleStop,
  ChevronRight,
} from "lucide-react";
import {
  getWorkflow,
  getWorkflowExecutions,
  formatDate,
  type WorkflowNode,
  type NodeType,
} from "@/lib/data/workflows";

const nodeTypeConfig: Record<
  NodeType,
  { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  start: {
    icon: <CirclePlay className="h-4 w-4" />,
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  condition: {
    icon: <GitBranch className="h-4 w-4" />,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-200 dark:border-amber-800",
  },
  action: {
    icon: <Zap className="h-4 w-4" />,
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
  },
  approval: {
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "text-purple-700 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950",
    border: "border-purple-200 dark:border-purple-800",
  },
  end: {
    icon: <CircleStop className="h-4 w-4" />,
    color: "text-gray-700 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-900",
    border: "border-gray-200 dark:border-gray-700",
  },
};

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const workflow = getWorkflow(id);
  if (!workflow) return notFound();

  const wfExecutions = getWorkflowExecutions(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/workflows">
            <Button variant="ghost" size="sm" className="mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {workflow.name}
              </h1>
              <StatusBadge status={workflow.status} />
            </div>
            <p className="text-muted-foreground mt-1">
              {workflow.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant={workflow.status === "active" ? "outline" : "default"}
            size="sm"
          >
            {workflow.status === "active" ? (
              <>
                <Pause className="mr-2 h-3.5 w-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-3.5 w-3.5" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="builder">
        <TabsList>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="runs">
            Runs
            <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5">
              {wfExecutions.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <BuilderTab nodes={workflow.nodes} />
        </TabsContent>

        <TabsContent value="runs">
          <RunsTab
            workflowId={workflow.id}
            executions={wfExecutions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Builder Tab ──────────────────────────────────────────────────────────────

function BuilderTab({ nodes }: { nodes: WorkflowNode[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      {/* Workflow visualization */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workflow Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-0">
              {nodes.map((node, i) => (
                <div key={node.id} className="flex flex-col items-center w-full max-w-md">
                  <NodeCard node={node} />
                  {i < nodes.length - 1 && (
                    <div className="flex flex-col items-center py-1">
                      <div className="w-px h-6 bg-border" />
                      <ChevronRight className="h-3 w-3 text-muted-foreground rotate-90" />
                      <div className="w-px h-2 bg-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node legend / summary */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workflow Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total steps</span>
              <span className="font-medium">{nodes.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Conditions</span>
              <span className="font-medium">
                {nodes.filter((n) => n.type === "condition").length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Actions</span>
              <span className="font-medium">
                {nodes.filter((n) => n.type === "action").length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Approval gates</span>
              <span className="font-medium">
                {nodes.filter((n) => n.type === "approval").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Node Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(
              Object.entries(nodeTypeConfig) as [
                NodeType,
                (typeof nodeTypeConfig)[NodeType],
              ][]
            ).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-2 text-sm">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded ${cfg.bg} ${cfg.color}`}
                >
                  {cfg.icon}
                </div>
                <span className="capitalize">{type}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NodeCard({ node }: { node: WorkflowNode }) {
  const cfg = nodeTypeConfig[node.type];
  return (
    <div
      className={`w-full max-w-md rounded-lg border-2 ${cfg.border} ${cfg.bg} p-4 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${cfg.border} bg-background ${cfg.color}`}
        >
          {cfg.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{node.name}</span>
            <Badge variant="outline" className="text-[10px] capitalize">
              {node.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{node.config}</p>
        </div>
      </div>
    </div>
  );
}

// ── Runs Tab ─────────────────────────────────────────────────────────────────

function RunsTab({
  workflowId,
  executions,
}: {
  workflowId: string;
  executions: ReturnType<typeof getWorkflowExecutions>;
}) {
  if (executions.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="py-12 text-center text-muted-foreground">
          No executions yet. Run this workflow to see results here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((exec) => (
              <TableRow key={exec.id}>
                <TableCell>
                  <ExecStatusBadge status={exec.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(exec.startedAt)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {exec.duration}
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">
                  {exec.trigger}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/workflows/${workflowId}/runs/${exec.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  status,
}: {
  status: "draft" | "active" | "paused";
}) {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    active: "default",
    paused: "secondary",
    draft: "outline",
  };
  return <Badge variant={variants[status]}>{status}</Badge>;
}

function ExecStatusBadge({
  status,
}: {
  status: "completed" | "failed" | "running" | "waiting";
}) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    completed: "default",
    failed: "destructive",
    running: "secondary",
    waiting: "outline",
  };
  return <Badge variant={variants[status]}>{status}</Badge>;
}
