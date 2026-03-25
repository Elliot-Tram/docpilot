import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/demo";
import { mockSources } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(mockSources);
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sources")
    .select("id, name, type, status, tickets_imported, last_sync_at, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json(mockSources);

  const sources = (data || []).map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    status: s.status,
    ticketsImported: s.tickets_imported,
    lastSync: s.last_sync_at
      ? formatRelativeDate(new Date(s.last_sync_at))
      : "Jamais synchronisé",
  }));

  return NextResponse.json(sources.length > 0 ? sources : mockSources);
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();

  if (!user) {
    const body = await req.json();
    return NextResponse.json({
      id: `src-demo-${Date.now()}`,
      name: body.name || "Demo Source",
      type: body.type || "zendesk",
      status: "connected",
      ticketsImported: 0,
      lastSync: "A l'instant",
    });
  }

  const supabase = await createClient();
  const { createProvider } = await import("@/lib/providers");

  const body = await req.json();
  const { name, type, credentials } = body;

  if (!name || !type || !credentials?.apiKey) {
    return NextResponse.json(
      { error: "Nom, type et clé API requis" },
      { status: 400 }
    );
  }

  if (!["zendesk", "intercom", "freshdesk"].includes(type)) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  const provider = createProvider(type, credentials);
  const valid = await provider.validateCredentials();
  if (!valid) {
    return NextResponse.json(
      { error: "Impossible de se connecter. Vérifiez vos identifiants." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("sources")
    .insert({
      user_id: user.id,
      name,
      type,
      credentials,
      status: "connected",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    name: data.name,
    type: data.type,
    status: data.status,
    ticketsImported: 0,
    lastSync: "Jamais synchronisé",
  });
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `Il y a ${diffD}j`;
}
