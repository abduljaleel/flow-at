"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  SkipForward,
  Loader2,
  CirclePlay,
  GitBranch,
  Zap,
  ShieldCheck,
  CircleStop,
} from "lucide-react";
import {
  getExecution,
  getWorkflow,
  formatDate,
  type StepStatus,
  type NodeType,
} from "@/lib/data/workflows";

const statusConfig: Record<
  StepStatus,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  completed: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
    label: "Completed",
  },
  failed: {
    icon: <XCircle className="h-5 w-5" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
    label: "Failed",
  },
  waiting: {
    icon: <Clock className="h-5 w-5" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    label: "Waiting",
  },
  running: {
    icon: <Loader2 className="h-5 w-5 animate-spin" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    label: "Running",
  },
  skipped: {
    icon: <SkipForward className="h-5 w-5" />,
    color: "text-gray-400 dark:text-gray-500",
    bg: "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700",
    label: "Skipped",
  },
};

const nodeTypeIcon: Record<NodeType, React.ReactNode> = {
  start: <CirclePlay className="h-3.5 w-3.5" />,
  condition: <GitBranch className="h-3.5 w-3.5" />,
  action: <Zap className="h-3.5 w-3.5" />,
  approval: <ShieldCheck className="h-3.5 w-3.5" />,
  end: <CircleStop className="h-3.5 w-3.5" />,
};

export default function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string; runId: string }>;
}) {
  const { id, runId } = use(params);
  const execution = getExecution(runId);
  const workflow = getWorkflow(id);

  if (!execution || !workflow) return notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href={`/workflows/${id}`}>
          <Button variant="ghost" size="sm" className="mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Execution {runId}
            </h1>
            <ExecStatusBadge status={execution.status} />
          </div>
          <p className="text-muted-foreground mt-1">
            {workflow.name} &middot; Started {formatDate(execution.startedAt)}{" "}
            &middot; Duration: {execution.duration} &middot; Trigger:{" "}
            <span className="capitalize">{execution.trigger}</span>
          </p>
        </div>
      </div>

      {/* Step trace */}
      <div className="space-y-0">
        {execution.steps.map((step, i) => {
          const cfg = statusConfig[step.status];
          const isLast = i === execution.steps.length - 1;
          const hasData =
            Object.keys(step.input).length > 0 ||
            Object.keys(step.output).length > 0;

          return (
            <div key={step.nodeId} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className={`${cfg.color}`}>{cfg.icon}</div>
                {!isLast && (
                  <div className="w-px flex-1 bg-border min-h-[24px]" />
                )}
              </div>

              {/* Step card */}
              <div className={`flex-1 mb-4 rounded-lg border ${cfg.bg} p-4`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {step.nodeName}
                      </span>
                      <Badge variant="outline" className="text-[10px] capitalize gap-1">
                        {nodeTypeIcon[step.nodeType]}
                        {step.nodeType}
                      </Badge>
                      <Badge
                        variant={
                          step.status === "failed"
                            ? "destructive"
                            : step.status === "completed"
                              ? "default"
                              : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {cfg.label}
                      </Badge>
                    </div>
                    {step.startedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Started: {formatDate(step.startedAt)} &middot; Duration:{" "}
                        {step.duration}
                      </p>
                    )}
                  </div>
                </div>

                {hasData && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.keys(step.input).length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Input
                        </p>
                        <pre className="text-xs bg-background/80 rounded p-2 overflow-x-auto border">
                          {JSON.stringify(step.input, null, 2)}
                        </pre>
                      </div>
                    )}
                    {Object.keys(step.output).length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Output
                        </p>
                        <pre className="text-xs bg-background/80 rounded p-2 overflow-x-auto border">
                          {JSON.stringify(step.output, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
