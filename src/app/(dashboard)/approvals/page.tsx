"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  GitBranch,
  Loader2,
} from "lucide-react";
import {
  formatDate,
  formatRelativeTime,
  type Approval,
} from "@/lib/data/workflows";
import { listApprovals, resolveApproval } from "@/lib/data/api";

export default function ApprovalsPage() {
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [pending, setPending] = useState<Approval[]>([]);
  const [history, setHistory] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const result = await listApprovals();
      setPending(result.pending);
      setHistory(result.history);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleResolve(
    approval: Approval,
    decision: "approved" | "rejected"
  ) {
    setResolvingId(approval.executionId);
    try {
      await resolveApproval(approval.executionId, decision);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update approval");
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground">
          Review and respond to approval requests
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Tab buttons */}
      <div className="flex gap-2">
        <Button
          variant={tab === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("pending")}
        >
          Pending
          {pending.length > 0 && (
            <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5">
              {pending.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={tab === "history" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("history")}
        >
          History
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tab === "pending" ? (
        <PendingApprovals
          approvals={pending}
          resolvingId={resolvingId}
          onResolve={handleResolve}
        />
      ) : (
        <ApprovalHistory approvals={history} />
      )}
    </div>
  );
}

function PendingApprovals({
  approvals,
  resolvingId,
  onResolve,
}: {
  approvals: Approval[];
  resolvingId: string | null;
  onResolve: (approval: Approval, decision: "approved" | "rejected") => void;
}) {
  if (approvals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-emerald-500" />
          <p className="font-medium">All clear</p>
          <p className="text-sm">No pending approvals at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {approvals.map((approval) => {
        const busy = resolvingId === approval.executionId;
        return (
          <Card key={approval.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{approval.stepName}</CardTitle>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                    <GitBranch className="h-3.5 w-3.5" />
                    <Link
                      href={`/workflows/${approval.workflowId}`}
                      className="hover:underline"
                    >
                      {approval.workflowName}
                    </Link>
                  </div>
                </div>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  Requested by {approval.requestedBy}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatRelativeTime(approval.requestedAt)}
                </p>
                <p className="text-sm">{approval.dataSummary}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={busy}
                  onClick={() => onResolve(approval, "approved")}
                >
                  {busy ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={busy}
                  onClick={() => onResolve(approval, "rejected")}
                >
                  <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ApprovalHistory({ approvals }: { approvals: Approval[] }) {
  if (approvals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-3" />
          <p className="font-medium">No history yet</p>
          <p className="text-sm">Resolved approvals will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {approvals.map((approval) => (
        <Card key={approval.id}>
          <CardContent className="flex items-center gap-4 py-4">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                approval.status === "approved"
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {approval.status === "approved" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{approval.stepName}</span>
                <Badge
                  variant={
                    approval.status === "approved" ? "default" : "destructive"
                  }
                  className="text-[10px]"
                >
                  {approval.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {approval.workflowName} &middot; Requested by{" "}
                {approval.requestedBy} &middot;{" "}
                {approval.resolvedBy && `Resolved by ${approval.resolvedBy}`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {approval.dataSummary}
              </p>
            </div>
            <div className="text-xs text-muted-foreground text-right shrink-0">
              {approval.resolvedAt && formatDate(approval.resolvedAt)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
