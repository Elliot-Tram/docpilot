import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ success: true, message: "Synchronisation lancée" });
  }

  const supabase = await createClient();
  const { enqueueJob } = await import("@/lib/jobs/queue");

  const { data: source, error: sourceError } = await supabase
    .from("sources")
    .select("id, status")
    .eq("id", id)
    .single();

  if (sourceError || !source) {
    return NextResponse.json({ error: "Source introuvable" }, { status: 404 });
  }

  if (source.status === "syncing") {
    return NextResponse.json(
      { error: "Synchronisation déjà en cours" },
      { status: 409 }
    );
  }

  await supabase
    .from("sources")
    .update({ status: "syncing" })
    .eq("id", id);

  const { data: syncLog } = await supabase
    .from("sync_logs")
    .insert({ source_id: id, status: "running" })
    .select("id")
    .single();

  await enqueueJob("import-tickets", {
    sourceId: id,
    userId: user.id,
    syncLogId: syncLog?.id,
  });

  return NextResponse.json({ success: true, message: "Synchronisation lancée" });
}
