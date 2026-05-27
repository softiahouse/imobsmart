import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MP_API = "https://api.mercadopago.com/checkout/preferences";

type Item = {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
};

type Body = {
  items?: Item[];
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: "approved" | "all";
  external_reference?: string;
  notification_url?: string;
};

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
    return new Response(
      JSON.stringify({ error: "MP_ACCESS_TOKEN não configurado" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const jwt = authHeader.replace("Bearer ", "");

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Sessão inválida" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const siteUrl = Deno.env.get("SITE_URL")?.replace(/\/$/, "") ?? "";
  const defaultBack = siteUrl
    ? {
        success: `${siteUrl}/painel`,
        failure: `${siteUrl}/painel`,
        pending: `${siteUrl}/painel`,
      }
    : undefined;

  const items =
    body.items?.length ?
      body.items.map((i) => ({
        title: i.title,
        quantity: Math.max(1, Math.floor(i.quantity)),
        unit_price: Number(i.unit_price),
        currency_id: i.currency_id ?? "BRL",
      }))
    : [
        {
          title: "Acesso à plataforma Pare de Jogar",
          quantity: 1,
          unit_price: 1,
          currency_id: "BRL",
        },
      ];

  const payload: Record<string, unknown> = {
    items,
    external_reference:
      body.external_reference ?? user.id,
    metadata: { supabase_user_id: user.id },
  };

  if (body.back_urls || defaultBack) {
    payload.back_urls = { ...defaultBack, ...body.back_urls };
  }
  if (body.auto_return) {
    payload.auto_return = body.auto_return;
  } else if (payload.back_urls) {
    payload.auto_return = "approved";
  }
  if (body.notification_url) {
    payload.notification_url = body.notification_url;
  }

  const mpRes = await fetch(MP_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const mpData = await mpRes.json().catch(() => ({}));

  if (!mpRes.ok) {
    console.error("Mercado Pago preferences error:", mpRes.status, mpData);
    return new Response(
      JSON.stringify({
        error: "Falha ao criar preferência",
        details: mpData,
      }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(
    JSON.stringify({
      id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
