import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/demo";
import { mockArticles } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthenticatedUser();

  if (!user) {
    const article = mockArticles.find((a) => a.id === id);
    if (!article) return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    return NextResponse.json(article);
  }

  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select(
      "id, title, summary, content, status, category, ticket_count, confidence, cluster_id, created_at"
    )
    .eq("id", id)
    .single();

  if (error || !article) {
    // Try mock data as fallback
    const mock = mockArticles.find((a) => a.id === id);
    if (mock) return NextResponse.json(mock);
    return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
  }

  // Fetch source tickets
  let sourceTickets: Array<{
    id: string;
    subject: string;
    customer: string;
    date: string;
  }> = [];

  if (article.cluster_id) {
    const { data: links } = await supabase
      .from("cluster_tickets")
      .select("ticket_id")
      .eq("cluster_id", article.cluster_id)
      .limit(5);

    if (links?.length) {
      const { data: tickets } = await supabase
        .from("tickets")
        .select("id, subject, customer, resolved_at")
        .in(
          "id",
          links.map((l) => l.ticket_id)
        );

      sourceTickets = (tickets || []).map((t) => ({
        id: t.id,
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
    }
  }

  return NextResponse.json({
    id: article.id,
    title: article.title,
    summary: article.summary,
    content: article.content,
    status: article.status,
    category: article.category,
    ticketCount: article.ticket_count,
    sourceTickets,
    createdAt: new Date(article.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    confidence: article.confidence,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ success: true });
  }

  const supabase = await createClient();

  const body = await req.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.content !== undefined) updates.content = body.content;
  if (body.title !== undefined) updates.title = body.title;
  if (body.status !== undefined) updates.status = body.status;

  const { error } = await supabase
    .from("articles")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
