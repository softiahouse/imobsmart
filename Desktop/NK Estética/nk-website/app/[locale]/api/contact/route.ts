import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let body: { name?: string; phone?: string; service?: string; message?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.name || !body.phone) {
    return NextResponse.json({ error: 'name and phone are required' }, { status: 400 });
  }

  const payload = {
    name: body.name,
    phone: body.phone,
    service: body.service ?? '',
    message: body.message ?? '',
    lang: body.lang ?? 'es',
    source: 'nk-website',
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}
