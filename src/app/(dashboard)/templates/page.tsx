"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Settings,
  Code,
  Palette,
  GitBranch,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { templates, type Template } from "@/lib/data/workflows";

type Category = "All" | "HR" | "Finance" | "Operations" | "Engineering" | "Custom";

const categoryIcons: Record<string, React.ReactNode> = {
  HR: <Users className="h-4 w-4" />,
  Finance: <DollarSign className="h-4 w-4" />,
  Operations: <Settings className="h-4 w-4" />,
  Engineering: <Code className="h-4 w-4" />,
  Custom: <Palette className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  HR: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
  Finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Operations: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Engineering: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Custom: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400",
};

export default function TemplatesPage() {
  const [filter, setFilter] = useState<Category>("All");

  const categories: Category[] = [
    "All",
    "HR",
    "Finance",
    "Operations",
    "Engineering",
    "Custom",
  ];

  const filtered =
    filter === "All"
      ? templates
      : templates.filter((t) => t.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground">
          Start with a pre-built workflow or create your own
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
          >
            {cat !== "All" && (
              <span className="mr-1.5">{categoryIcons[cat]}</span>
            )}
            {cat}
            <span className="ml-1.5 text-xs opacity-70">
              {cat === "All"
                ? templates.length
                : templates.filter((t) => t.category === cat).length}
            </span>
          </Button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const nodeTypeCounts = {
    actions: template.nodes.filter((n) => n.type === "action").length,
    conditions: template.nodes.filter((n) => n.type === "condition").length,
    approvals: template.nodes.filter((n) => n.type === "approval").length,
  };

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${categoryColors[template.category]}`}
          >
            {categoryIcons[template.category]}
          </div>
          <Badge variant="outline" className="text-[10px]">
            {template.category}
          </Badge>
        </div>
        <CardTitle className="text-base mt-3">{template.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {template.description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {template.nodeCount} steps
            </span>
            {nodeTypeCounts.actions > 0 && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {nodeTypeCounts.actions} actions
              </span>
            )}
            {nodeTypeCounts.approvals > 0 && (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                {nodeTypeCounts.approvals} approvals
              </span>
            )}
          </div>
        </div>
        <Link href={`/workflows/new?template=${template.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            Use Template
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
