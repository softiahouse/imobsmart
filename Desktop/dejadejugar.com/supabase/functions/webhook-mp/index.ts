import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type MpWebhookBody = {
  action?: string;
  type?: string;
  data?: { id?: string };
};

async function fetchPayment(
  paymentId: string,
  accessToken: string,
): Promise<Record<string, unknown>> {
  const res = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return res.json().catch(() => ({}));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const accessToken = Deno.env.get("MP_ACCESS_TOKEN");
  if (!accessToken) {
    console.error("webhook-mp: MP_ACCESS_TOKEN ausente");
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  let body: MpWebhookBody = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text) as MpWebhookBody;
  } catch { /* ignora */ }

  const url = new URL(req.url);
  const topic = body.type ?? url.searchParams.get("topic") ?? url.searchParams.get("type");
  const resourceId = body.data?.id ?? url.searchParams.get("id") ?? url.searchParams.get("data.id");

  console.log("webhook-mp recebido:", { topic, action: body.action, resourceId });

  if ((topic === "payment" || body.type === "payment") && resourceId) {
    const payment = await fetchPayment(String(resourceId), accessToken);
    const status = payment.status as string;
    const extRef = payment.external_reference as string;

    console.log("webhook-mp payment:", { id: resourceId, status, extRef });

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey || !extRef) {
      console.error("webhook-mp: serviceKey ou extRef ausente");
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Formato esperado: user_{userId}_modulo_{moduloId}
    const match = extRef.match(/^user_([0-9a-f-]+)_modulo_(\d+)$/);
    if (!match) {
      console.error("webhook-mp: external_reference fora do formato:", extRef);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const userId = match[1];
    const moduloId = parseInt(match[2], 10);

    console.log("webhook-mp parsed:", { userId, moduloId, status });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      serviceKey,
    );

    // Grava o pagamento
    const { error: errPgto } = await supabase.from("pagamentos_mp").upsert(
      {
        mp_payment_id: String(resourceId),
        user_id: userId,
        modulo_id: moduloId,
        status: status ?? "unknown",
        external_reference: extRef,
        valor: payment.transaction_amount ?? null,
        criado_em: new Date().toISOString(),
      },
      { onConflict: "mp_payment_id" },
    );
    if (errPgto) console.error("webhook-mp pagamentos_mp:", errPgto.message);

    // Se aprovado, libera o módulo
    if (status === "approved") {
      const { error: errLib } = await supabase.from("modulos_liberados").upsert(
        {
          user_id: userId,
          modulo_id: moduloId,
          liberado_em: new Date().toISOString(),
          expira_em: null,
        },
        { onConflict: "user_id,modulo_id" },
      );
      if (errLib) {
        console.error("webhook-mp modulos_liberados:", errLib.message);
      } else {
        console.log(`webhook-mp: módulo ${moduloId} liberado para ${userId}`);
      }
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});