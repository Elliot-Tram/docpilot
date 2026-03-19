import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { clusterTickets } from "@/lib/ai/cluster";
import { enqueueJob } from "@/lib/jobs/queue";

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(req: NextRequest) {
  const { userId, sourceId } = await req.json();
  const supabase = createServiceClient();

  try {
    // Fetch tickets for this source
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("id, subject, messages")
      .eq("source_id", sourceId)
      .limit(500);

    if (error || !tickets?.length) {
      return NextResponse.json({ message: "Aucun ticket a analyser" });
    }

    // Prepare tickets for clustering
    const prepared = tickets.map((t) => {
      const messages = t.messages as Array<{ role: string; body: string }>;
      const firstCustomerMessage =
        messages.find((m) => m.role === "customer")?.body || "";
      return {
        id: t.id,
        subject: t.subject,
        firstMessage: firstCustomerMessage,
      };
    });

    // Run AI clustering
    const clusters = await clusterTickets(prepared);

    // Save clusters and enqueue article generation
    for (const cluster of clusters) {
      // Map ticket external references to our UUIDs
      const ticketIds = cluster.ticket_ids.filter((id) =>
        tickets.some((t) => t.id === id)
      );

      if (ticketIds.length < 2) continue;

      const { data: savedCluster } = await supabase
        .from("clusters")
        .insert({
          user_id: userId,
          theme: cluster.theme,
          summary: cluster.summary,
          ticket_count: ticketIds.length,
          confidence: cluster.confidence,
        })
        .select("id")
        .single();

      if (!savedCluster) continue;

      // Link tickets to cluster
      const junctions = ticketIds.map((ticketId) => ({
        cluster_id: savedCluster.id,
        ticket_id: ticketId,
      }));
      await supabase.from("cluster_tickets").insert(junctions);

      // Generate article for high-confidence clusters
      if (cluster.confidence >= 70) {
        await enqueueJob("generate-article", {
          clusterId: savedCluster.id,
          userId,
        });
      }
    }

    return NextResponse.json({ success: true, clusters: clusters.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur clustering" },
      { status: 500 }
    );
  }
}
