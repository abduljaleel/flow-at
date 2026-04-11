"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Plus, GitBranch, Webhook, Clock, Play } from "lucide-react";
import { workflows, formatDate } from "@/lib/data/workflows";

type StatusFilter = "all" | "active" | "paused" | "draft";

const triggerIcons: Record<string, React.ReactNode> = {
  manual: <Play className="h-3.5 w-3.5" />,
  webhook: <Webhook className="h-3.5 w-3.5" />,
  schedule: <Clock className="h-3.5 w-3.5" />,
};

export default function WorkflowsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered =
    filter === "all" ? workflows : workflows.filter((w) => w.status === filter);

  const statusCounts = {
    all: workflows.length,
    active: workflows.filter((w) => w.status === "active").length,
    paused: workflows.filter((w) => w.status === "paused").length,
    draft: workflows.filter((w) => w.status === "draft").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Build and manage your automated workflows
          </p>
        </div>
        <Link href="/workflows/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "active", "paused", "draft"] as StatusFilter[]).map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">
              {statusCounts[s]}
            </span>
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Executions</TableHead>
                <TableHead>Last Run</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((wf) => (
                <TableRow key={wf.id}>
                  <TableCell>
                    <Link
                      href={`/workflows/${wf.id}`}
                      className="flex items-center gap-2 font-medium hover:underline"
                    >
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{wf.name}</div>
                        <div className="text-xs font-normal text-muted-foreground max-w-xs truncate">
                          {wf.description}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      {triggerIcons[wf.triggerType]}
                      <span className="capitalize">{wf.triggerType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <WorkflowStatusBadge status={wf.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {wf.executionCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {wf.lastRun ? formatDate(wf.lastRun) : "Never"}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No workflows matching this filter
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function WorkflowStatusBadge({
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
