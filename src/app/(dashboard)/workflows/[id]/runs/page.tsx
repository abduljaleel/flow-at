import { redirect } from "next/navigation";

// The runs list lives on the workflow detail page (Runs tab). This route
// exists so direct/bookmarked links to /workflows/[id]/runs resolve instead
// of 404ing.
export default async function WorkflowRunsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/workflows/${id}`);
}
