import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!url || !key) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("refresh_claim_score", { p_claim_id: params.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ claim_id: params.id, score: data, confidence: data, method_version: "v1" });
}
