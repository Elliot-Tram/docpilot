import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createProvider } from "@/lib/providers";
import type { TicketProviderCredentials } from "@/lib/providers";
import { enqueueJob } from "@/lib/jobs/queue";

// This route is called by QStash, not by the user directly
// Uses service role to bypass RLS
function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sourceId, userId, syncLogId, cursor } = body;

  const supabase = createServiceClient();

  try {
    // Get source with credentials
    const { data: source, error: sourceError } = await supabase
      .from("sources")
      .select("*")
      .eq("id", sourceId)
      .single();

    if (sourceError || !source) {
      throw new Error("Source introuvable");
    }

    // Create provider and fetch tickets
    const provider = createProvider(
      source.type,
      source.credentials as TicketProviderCredentials
    );
    const result = await provider.fetchResolvedTickets(cursor || undefined);

    // Upsert tickets
    for (const ticket of result.tickets) {
      await supabase.from("tickets").upsert(
        {
          source_id: sourceId,
          external_id: ticket.externalId,
          subject: ticket.subject,
          customer: ticket.customer,
          status: ticket.status,
          messages: ticket.messages,
          resolved_at: ticket.resolvedAt,
        },
        { onConflict: "source_id,external_id" }
      );
    }

    // Update sync log progress
    const { data: currentLog } = await supabase
      .from("sync_logs")
      .select("tickets_fetched")
      .eq("id", syncLogId)
      .single();

    const totalFetched =
      (currentLog?.tickets_fetched || 0) + result.tickets.length;

    await supabase
      .from("sync_logs")
      .update({ tickets_fetched: totalFetched })
      .eq("id", syncLogId);

    // If there are more pages, enqueue next batch
    if (result.nextCursor) {
      await enqueueJob("import-tickets", {
        sourceId,
        userId,
        syncLogId,
        cursor: result.nextCursor,
      });
    } else {
      // Import complete: update source and sync log
      await supabase
        .from("sources")
        .update({
          status: "connected",
          tickets_imported: totalFetched,
          last_sync_at: new Date().toISOString(),
        })
        .eq("id", sourceId);

      await supabase
        .from("sync_logs")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", syncLogId);

      // Trigger clustering
      await enqueueJob("cluster", { userId, sourceId });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // Mark sync as failed
    await supabase
      .from("sync_logs")
      .update({
        status: "failed",
        error: err instanceof Error ? err.message : "Erreur inconnue",
        completed_at: new Date().toISOString(),
      })
      .eq("id", syncLogId);

    await supabase
      .from("sources")
      .update({ status: "error" })
      .eq("id", sourceId);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur" },
      { status: 500 }
    );
  }
}
