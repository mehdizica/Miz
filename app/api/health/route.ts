import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json({ ok: false, database: "not_configured" }, { status: 503 });
  const started = Date.now();
  const { error } = await supabase.from("categories").select("id", { head: true, count: "exact" });
  return NextResponse.json({ ok: !error, database: error ? "error" : "connected", latency_ms: Date.now() - started });
}
