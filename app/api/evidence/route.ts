import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function POST(req: NextRequest) {
  if (!url || !key) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body?.claim_id || !body?.source_id || !body?.relation) return NextResponse.json({ error: "claim_id, source_id and relation are required" }, { status: 400 });
  if (!["supports", "refutes", "context"].includes(body.relation)) return NextResponse.json({ error: "invalid relation" }, { status: 400 });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("evidence").insert({ claim_id: body.claim_id, source_id: body.source_id, relation: body.relation, excerpt: body.excerpt ?? null, strength: Math.min(1, Math.max(0, Number(body.strength ?? 0.5))) }).select("id,claim_id,source_id,relation,excerpt,strength,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
