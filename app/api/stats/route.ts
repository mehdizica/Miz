import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const [needs, claims, sources, users] = await Promise.all([
    supabase.from("needs").select("id", { count: "exact", head: true }).eq("status", "open").eq("visibility", "public"),
    supabase.from("claims").select("id", { count: "exact", head: true }),
    supabase.from("sources").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  return NextResponse.json({ needs: needs.count ?? 0, claims: claims.count ?? 0, sources: sources.count ?? 0, users: users.count ?? 0, generated_at: new Date().toISOString() });
}
