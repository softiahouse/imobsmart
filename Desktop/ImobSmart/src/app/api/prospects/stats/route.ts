import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getProspectsFilter } from "@/lib/prospects-access";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateParam = searchParams.get("state");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const filter = getProspectsFilter(user?.email);

  let prospectsQuery = supabase.from("prospects").select("b2b_stage, classification, deal_value, state, loss_reason, country");
  if (filter.country) prospectsQuery = prospectsQuery.eq("country", filter.country);
  if (filter.state) {
    prospectsQuery = prospectsQuery.eq("state", filter.state);
  } else if (stateParam) {
    prospectsQuery = prospectsQuery.eq("state", stateParam);
  }

  const { data: prospects, error: pErr } = await prospectsQuery;
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  const total = prospects?.length ?? 0;
  const byStage: Record<string, number> = {};
  const byClassification: Record<string, number> = {};
  const lossReasons: Record<string, number> = {};
  let pipelineValue = 0;

  for (const p of prospects ?? []) {
    byStage[p.b2b_stage] = (byStage[p.b2b_stage] || 0) + 1;
    byClassification[p.classification] = (byClassification[p.classification] || 0) + 1;
    if (p.b2b_stage !== "lost" && p.deal_value) pipelineValue += p.deal_value;
    if (p.b2b_stage === "lost" && p.loss_reason) {
      lossReasons[p.loss_reason] = (lossReasons[p.loss_reason] || 0) + 1;
    }
  }

  let eventsQuery = supabase
    .from("prospect_events")
    .select("event_type, user_email, created_at")
    .eq("event_type", "whatsapp_sent")
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (filter.state || stateParam) {
    const st = filter.state || stateParam;
    eventsQuery = eventsQuery.like("user_email", `%`);
  }

  const { data: events } = await eventsQuery;

  const dailyDispatches: Record<string, number> = {};
  const repDispatches: Record<string, number> = {};

  for (const e of events ?? []) {
    const day = new Date(e.created_at).toLocaleDateString("pt-BR", { weekday: "short" });
    dailyDispatches[day] = (dailyDispatches[day] || 0) + 1;
    if (e.user_email) {
      repDispatches[e.user_email] = (repDispatches[e.user_email] || 0) + 1;
    }
  }

  const repStats: { email: string; dispatches: number; contacted: number; won: number }[] = [];

  const repEmails = new Set<string>();
  for (const e of events ?? []) {
    if (e.user_email) repEmails.add(e.user_email);
  }

  for (const email of repEmails) {
    let repQuery = supabase.from("prospects").select("b2b_stage, state");
    if (filter.country) repQuery = repQuery.eq("country", filter.country);

    const { data: repProspects } = await repQuery;

    const contacted = repProspects?.filter((p) => p.b2b_stage !== "new").length ?? 0;
    const won = repProspects?.filter((p) => p.b2b_stage === "won").length ?? 0;

    repStats.push({
      email,
      dispatches: repDispatches[email] || 0,
      contacted,
      won,
    });
  }

  return NextResponse.json({
    total,
    byStage,
    byClassification,
    lossReasons,
    pipelineValue,
    totalDispatches: events?.length ?? 0,
    dailyDispatches,
    repStats,
    contacted: byStage["contacted"] ?? 0,
    meeting: byStage["meeting"] ?? 0,
    proposal: byStage["proposal"] ?? 0,
    negotiation: byStage["negotiation"] ?? 0,
    won: byStage["won"] ?? 0,
    lost: byStage["lost"] ?? 0,
  });
}
