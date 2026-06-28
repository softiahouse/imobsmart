import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(/[;,]/).map((h) => h.trim().toLowerCase().replace(/["\s]/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/[;,]/).map((v) => v.trim().replace(/^"|"$/g, ""));
    if (values.every((v) => !v)) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

const FIELD_MAP: Record<string, string> = {
  nome: "business_name",
  empresa: "business_name",
  business_name: "business_name",
  name: "business_name",
  telefone: "phone",
  phone: "phone",
  tel: "phone",
  email: "email",
  site: "website_url",
  website: "website_url",
  website_url: "website_url",
  url: "website_url",
  cidade: "city",
  city: "city",
  pais: "country",
  country: "country",
  contato: "contact_name",
  contact: "contact_name",
  contact_name: "contact_name",
  classificacao: "classification",
  classification: "classification",
  notas: "notes",
  notes: "notes",
};

const CLASSIFICATION_MAP: Record<string, string> = {
  "sem site": "no_site",
  "no site": "no_site",
  no_site: "no_site",
  "site ruim": "bad_site",
  "bad site": "bad_site",
  bad_site: "bad_site",
  "site bom": "good_site",
  "good site": "good_site",
  good_site: "good_site",
  cliente: "client",
  client: "client",
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const defaultCity = (formData.get("city") as string) || "";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const text = await file.text();
  const rows = parseCSV(text);

  if (rows.length === 0) return NextResponse.json({ error: "CSV empty or invalid" }, { status: 400 });

  const prospects = rows.map((row) => {
    const mapped: Record<string, string> = {};
    for (const [csvKey, value] of Object.entries(row)) {
      const dbField = FIELD_MAP[csvKey];
      if (dbField && value) mapped[dbField] = value;
    }

    const classification = mapped.classification
      ? CLASSIFICATION_MAP[mapped.classification.toLowerCase()] || "no_site"
      : "no_site";

    return {
      business_name: mapped.business_name || "Sem nome",
      phone: mapped.phone || null,
      email: mapped.email || null,
      contact_name: mapped.contact_name || null,
      website_url: mapped.website_url || null,
      city: mapped.city || defaultCity,
      country: mapped.country || "ES",
      classification,
      b2b_stage: "new" as const,
      source: "csv_import",
      notes: mapped.notes || null,
    };
  });

  const supabase = await createClient();
  const { data, error } = await supabase.from("prospects").insert(prospects).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ imported: data?.length ?? 0, data });
}
