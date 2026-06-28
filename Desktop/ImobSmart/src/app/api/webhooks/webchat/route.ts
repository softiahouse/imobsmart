import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { org_id, visitor_name, message, session_id } = body;

  if (!org_id || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (process.env.N8N_WEBHOOK_URL) {
    const res = await fetch(`${process.env.N8N_WEBHOOK_URL}/webhook/webchat-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify({ org_id, visitor_name, message, session_id, timestamp: new Date().toISOString() }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  }

  return NextResponse.json({ reply: "Obrigado pelo contato! Em breve retornaremos." });
}
