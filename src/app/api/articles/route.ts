import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      "id, title, summary, content, status, category, ticket_count, confidence, cluster_id, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch source tickets for each article
  const result = await Promise.all(
    (articles || []).map(async (article) => {
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

      return {
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
      };
    })
  );

  return NextResponse.json(result);
}
