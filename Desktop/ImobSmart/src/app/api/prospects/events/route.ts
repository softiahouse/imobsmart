import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const body = await request.json();

  const { prospect_id, event_type, metadata } = body;
  if (!prospect_id || !event_type) {
    return NextResponse.json({ error: "prospect_id and event_type required" }, { status: 400 });
  }

  const { error } = await supabase.from("prospect_events").insert({
    prospect_id,
    event_type,
    user_email: user?.email ?? null,
    metadata: metadata ?? {},
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
