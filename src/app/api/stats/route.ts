import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Count tickets across all user's sources
  const { data: sources } = await supabase
    .from("sources")
    .select("tickets_imported");

  const ticketsAnalyzed = (sources || []).reduce(
    (sum, s) => sum + (s.tickets_imported || 0),
    0
  );

  // Count articles
  const { count: articlesGenerated } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true });

  // Count clusters (gaps detected)
  const { count: gapsDetected } = await supabase
    .from("clusters")
    .select("id", { count: "exact", head: true });

  // Count published articles (tickets deflected proxy)
  const { count: published } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  return NextResponse.json({
    ticketsAnalyzed,
    articlesGenerated: articlesGenerated || 0,
    gapsDetected: gapsDetected || 0,
    ticketsDeflected: (published || 0) * 30, // rough estimate
  });
}
