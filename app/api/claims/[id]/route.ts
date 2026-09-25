import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!url || !key) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const [{ data: claim, error }, { data: evidence }, { data: score }] = await Promise.all([
    supabase.from("claims").select("id,statement,status,confidence,created_at,updated_at").eq("id", params.id).single(),
    supabase.from("evidence").select("id,relation,excerpt,strength,source_id,sources(id,title,url,publisher,authority_level,verified)").eq("claim_id", params.id),
    supabase.from("claim_scores").select("evidence_coverage,source_quality,source_agreement,reviewer_agreement,freshness,contradiction_penalty,score,method_version,calculated_at").eq("claim_id", params.id).order("calculated_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ claim, evidence: evidence ?? [], score: score ?? null });
}
