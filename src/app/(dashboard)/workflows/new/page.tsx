"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Play,
  Webhook,
  Clock,
  CheckCircle2,
  GitBranch,
  Loader2,
} from "lucide-react";
import type { Template } from "@/lib/data/workflows";
import { createWorkflow, listTemplates } from "@/lib/data/api";

type TriggerType = "manual" | "webhook" | "schedule";

const triggers: { value: TriggerType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "manual",
    label: "Manual",
    description: "Trigger manually from the dashboard",
    icon: <Play className="h-5 w-5" />,
  },
  {
    value: "webhook",
    label: "Webhook",
    description: "Trigger via HTTP POST request",
    icon: <Webhook className="h-5 w-5" />,
  },
  {
    value: "schedule",
    label: "Schedule",
    description: "Run on a recurring schedule",
    icon: <Clock className="h-5 w-5" />,
  },
];

export default function NewWorkflowPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <NewWorkflowContent />
    </Suspense>
  );
}

function NewWorkflowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState<TriggerType>("manual");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listTemplates()
      .then((data) => {
        if (!cancelled) setTemplates(data);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load templates");
      })
      .finally(() => {
        if (!cancelled) setTemplatesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedTemplate = templateId
    ? templates.find((t) => t.id === templateId) ?? null
    : null;
  const selectedTemplateId = selectedTemplate?.id ?? null;

  // Prefill the form whenever a template is (re)selected.
  useEffect(() => {
    if (!selectedTemplateId) return;
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      setName(template.name);
      setDescription(template.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId]);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const id = await createWorkflow({
        name: name.trim(),
        description: description.trim(),
        triggerType,
        template: selectedTemplate,
      });
      router.push(`/workflows/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create workflow");
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start gap-3">
        <Link href="/workflows">
          <Button variant="ghost" size="sm" className="mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Workflow
          </h1>
          <p className="text-muted-foreground">
            {selectedTemplate
              ? `Starting from template: ${selectedTemplate.name}`
              : "Start from scratch or pick a template"}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Template info */}
      {templateId && templatesLoading && (
        <Card>
          <CardContent className="py-4">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {selectedTemplate && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                Using template: {selectedTemplate.name}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <GitBranch className="h-3 w-3" />
                {selectedTemplate.nodeCount} steps &middot;{" "}
                {selectedTemplate.category}
              </p>
            </div>
            <Link href="/workflows/new">
              <Button variant="outline" size="sm">
                Clear
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* No template — show template picker */}
      {!selectedTemplate && !(templateId && templatesLoading) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Start from a template</CardTitle>
          </CardHeader>
          <CardContent>
            {templatesLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : templates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No templates yet — load demo data from the Dashboard to add
                starter templates.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {templates.slice(0, 6).map((t) => (
                  <Link
                    key={t.id}
                    href={`/workflows/new?template=${t.id}`}
                    className="rounded-lg border p-3 text-sm hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t.nodeCount} steps &middot; {t.category}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workflow Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Employee Onboarding"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this workflow does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Trigger Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {triggers.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTriggerType(t.value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                    triggerType === t.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div
                    className={
                      triggerType === t.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {t.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Link href="/workflows">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleCreate} disabled={!name.trim() || creating}>
          {creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Workflow"
          )}
        </Button>
      </div>
    </div>
  );
}
