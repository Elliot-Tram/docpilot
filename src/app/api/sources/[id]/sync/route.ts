import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enqueueJob } from "@/lib/jobs/queue";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Verify source exists and belongs to user
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

  // Update status to syncing
  await supabase
    .from("sources")
    .update({ status: "syncing" })
    .eq("id", id);

  // Create sync log
  const { data: syncLog } = await supabase
    .from("sync_logs")
    .insert({ source_id: id, status: "running" })
    .select("id")
    .single();

  // Enqueue import job
  await enqueueJob("import-tickets", {
    sourceId: id,
    userId: user.id,
    syncLogId: syncLog?.id,
  });

  return NextResponse.json({ success: true, message: "Synchronisation lancée" });
}
