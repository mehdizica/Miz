import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function POST(req: NextRequest) {
  if (!url || !key) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.description) return NextResponse.json({ error: "title and description are required" }, { status: 400 });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("needs").insert({ title: body.title.trim(), description: body.description.trim(), urgency: body.urgency ?? "normal", region: body.region ?? null, visibility: "public", status: "open" }).select("id,title,description,urgency,region,status,visibility,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
