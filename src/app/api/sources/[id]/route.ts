import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ success: true });
  }

  const supabase = await createClient();

  const { error } = await supabase.from("sources").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
