"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GitBranch,
  CheckSquare,
  Activity,
  TrendingUp,
  ArrowRight,
  Loader2,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatRelativeTime,
  type Approval,
  type Execution,
  type Workflow,
} from "@/lib/data/workflows";
import {
  getCurrentUser,
  listApprovals,
  listExecutions,
  listWorkflows,
  resolveApproval,
  seedDemoData,
} from "@/lib/data/api";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [wfs, execs, apprs] = await Promise.all([
        listWorkflows(),
        listExecutions(),
        listApprovals(),
      ]);
      setWorkflows(wfs);
      setExecutions(execs);
      setPendingApprovals(apprs.pending);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUserName(u.name))
      .catch(() => {});
    void load();
  }, [load]);

  async function handleSeed() {
    setSeeding(true);
    setError(null);
    try {
      await seedDemoData();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load demo data");
    } finally {
      setSeeding(false);
    }
  }

  async function handleResolve(
    executionId: string,
    decision: "approved" | "rejected"
  ) {
    setResolvingId(executionId);
    try {
      await resolveApproval(executionId, decision);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update approval");
    } finally {
      setResolvingId(null);
    }
  }

  const activeWorkflows = workflows.filter((w) => w.status === "active").length;
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayExecutions = executions.filter((e) =>
    e.startedAt.startsWith(todayKey)
  );
  const completedToday = todayExecutions.filter(
    (e) => e.status === "completed"
  ).length;
  const successRate =
    todayExecutions.length > 0
      ? Math.round((completedToday / todayExecutions.length) * 100)
      : 0;

  const recentExecutions = [...executions]
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    )
    .slice(0, 5);

  const isEmpty = !loading && !error && workflows.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{userName ? `, ${userName}` : ""}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Active Workflows"
              value={String(activeWorkflows)}
              description={`${workflows.length} total workflows`}
              icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Pending Approvals"
              value={String(pendingApprovals.length)}
              description="Awaiting your decision"
              icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Executions Today"
              value={String(todayExecutions.length)}
              description={`${completedToday} completed`}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Success Rate"
              value={`${successRate}%`}
              description="Today's execution success"
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {isEmpty ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Database className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium">No workflows yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first workflow or load demo data to explore Axiom.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button onClick={handleSeed} disabled={seeding}>
                    {seeding ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading demo data...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        Load demo data
                      </>
                    )}
                  </Button>
                  <Link href="/workflows/new">
                    <Button variant="outline">Create Workflow</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Executions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recent Executions</CardTitle>
                  <Link href="/workflows">
                    <Button variant="ghost" size="sm">
                      View all
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workflow</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentExecutions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-muted-foreground py-8"
                          >
                            No executions yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentExecutions.map((exec) => (
                          <TableRow key={exec.id}>
                            <TableCell className="font-medium">
                              <Link
                                href={`/workflows/${exec.workflowId}/runs/${exec.id}`}
                                className="hover:underline"
                              >
                                {exec.workflowName}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={exec.status} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatRelativeTime(exec.startedAt)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {exec.duration}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pending Approvals */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Pending Approvals</CardTitle>
                  <Link href="/approvals">
                    <Button variant="ghost" size="sm">
                      View all
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingApprovals.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No pending approvals
                      </p>
                    ) : (
                      pendingApprovals.map((approval) => (
                        <div
                          key={approval.id}
                          className="flex flex-col gap-2 rounded-lg border p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                {approval.stepName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {approval.workflowName} &middot; Requested by{" "}
                                {approval.requestedBy}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(approval.requestedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {approval.dataSummary}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              disabled={resolvingId === approval.executionId}
                              onClick={() =>
                                handleResolve(approval.executionId, "approved")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              disabled={resolvingId === approval.executionId}
                              onClick={() =>
                                handleResolve(approval.executionId, "rejected")
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({
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
  return (
    <Badge variant={variants[status] || "secondary"}>
      {status}
    </Badge>
  );
}
