import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { generateArticle } from "@/lib/ai/generate";

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(req: NextRequest) {
  const { clusterId, userId } = await req.json();
  const supabase = createServiceClient();

  try {
    // Get cluster with linked tickets
    const { data: cluster } = await supabase
      .from("clusters")
      .select("id, theme, summary, ticket_count, confidence")
      .eq("id", clusterId)
      .single();

    if (!cluster) {
      return NextResponse.json({ error: "Cluster introuvable" }, { status: 404 });
    }

    // Get linked ticket IDs
    const { data: links } = await supabase
      .from("cluster_tickets")
      .select("ticket_id")
      .eq("cluster_id", clusterId);

    const ticketIds = (links || []).map((l) => l.ticket_id);

    // Fetch full ticket data
    const { data: tickets } = await supabase
      .from("tickets")
      .select("subject, messages, customer, resolved_at")
      .in("id", ticketIds);

    if (!tickets?.length) {
      return NextResponse.json({ error: "Aucun ticket trouvé" }, { status: 404 });
    }

    // Generate article with AI
    const content = await generateArticle({
      theme: cluster.theme,
      tickets: tickets.map((t) => ({
        subject: t.subject,
        messages: t.messages as Array<{ role: string; body: string }>,
      })),
    });

    // Extract title from first H2 heading or use theme
    const titleMatch = content.match(/^##\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : cluster.theme;

    // Derive a category from the theme
    const category = "Général";

    // Build source tickets for the article detail view
    const sourceTickets = tickets.slice(0, 5).map((t, i) => ({
      id: ticketIds[i],
      subject: t.subject,
      customer: t.customer || "Client",
      date: t.resolved_at
        ? new Date(t.resolved_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
    }));

    // Save article
    await supabase.from("articles").insert({
      cluster_id: clusterId,
      user_id: userId,
      title,
      summary: cluster.summary,
      content,
      status: "draft",
      category,
      ticket_count: cluster.ticket_count,
      confidence: cluster.confidence,
    });

    return NextResponse.json({ success: true, title });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur génération" },
      { status: 500 }
    );
  }
}
