import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  workflows,
  executions,
  getPendingApprovals,
  formatDate,
  formatRelativeTime,
} from "@/lib/data/workflows";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const activeWorkflows = workflows.filter((w) => w.status === "active").length;
  const pendingApprovals = getPendingApprovals();
  const todayExecutions = executions.filter((e) =>
    e.startedAt.startsWith("2026-04-11")
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

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
                {recentExecutions.map((exec) => (
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
                ))}
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
                      <Button size="sm" className="h-7 text-xs">
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
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
    </div>
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
