import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function POST(req: NextRequest) {
  if (!url || !key) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body?.title) return NextResponse.json({ error: "title is required" }, { status: 400 });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("sources").insert({ title: body.title.trim(), url: body.url ?? null, publisher: body.publisher ?? null, source_type: body.source_type ?? "web", authority_level: body.authority_level ?? 1, verified: false }).select("id,title,url,publisher,authority_level,verified,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
