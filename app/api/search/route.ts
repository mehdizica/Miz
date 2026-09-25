import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ needs: [], claims: [] });
  const [{ data: needs }, { data: claims }] = await Promise.all([
    supabase.from("needs").select("id,title,description,urgency,region,status,created_at").eq("visibility", "public").or(`title.ilike.%${q}%,description.ilike.%${q}%,region.ilike.%${q}%`).limit(20),
    supabase.from("claims").select("id,statement,status,confidence,created_at").ilike("statement", `%${q}%`).limit(20),
  ]);
  return NextResponse.json({ needs: needs ?? [], claims: claims ?? [] });
}
