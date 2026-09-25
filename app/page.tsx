"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, CheckCircle2, FileSearch, Home, MessageSquareText, Plus, Search, ShieldCheck, Users, Wifi, WifiOff } from "lucide-react";
import { supabase, type Claim, type Need } from "@/lib/supabase";

const demoNeeds: Need[] = [
  { id: "demo-1", title: "نیاز به تعمیرکار مطمئن خودرو", description: "", urgency: "high", region: "قم", status: "open", visibility: "public", created_at: new Date().toISOString() },
  { id: "demo-2", title: "خرید عمده پارچه با قیمت مناسب", description: "", urgency: "medium", region: "تهران", status: "open", visibility: "public", created_at: new Date().toISOString() },
  { id: "demo-3", title: "پیدا کردن فضای امن برای اجاره وسیله", description: "", urgency: "medium", region: "قزوین", status: "open", visibility: "public", created_at: new Date().toISOString() },
];

const demoClaims: Claim[] = [
  { id: "demo-c1", statement: "این خدمت در کمتر از ۲۴ ساعت انجام می‌شود.", status: "under_review", confidence: 0.61, created_at: new Date().toISOString() },
  { id: "demo-c2", statement: "این فروشنده سابقه رضایت بالا دارد.", status: "supported", confidence: 0.88, created_at: new Date().toISOString() },
  { id: "demo-c3", statement: "این قیمت پایین‌تر از میانگین بازار است.", status: "unverified", confidence: 0.43, created_at: new Date().toISOString() },
];

const claimLabel: Record<string, string> = {
  supported: "پشتیبانی‌شده",
  refuted: "ردشده",
  disputed: "مورد اختلاف",
  under_review: "در حال بررسی",
  partially_supported: "پشتیبانی نسبی",
  unverified: "نیازمند مدرک",
};

const urgencyLabel: Record<string, string> = { high: "بالا", medium: "متوسط", normal: "عادی" };

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [needs, setNeeds] = useState<Need[]>(demoNeeds);
  const [claims, setClaims] = useState<Claim[]>(demoClaims);
  const [stats, setStats] = useState({ needs: 1284, claims: 642, sources: 398, users: 2761 });
  const [live, setLive] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) return;
      const [needsRes, claimsRes, sourcesRes, profilesRes] = await Promise.all([
        supabase.from("needs").select("id,title,description,urgency,region,status,visibility,created_at").eq("visibility", "public").order("created_at", { ascending: false }).limit(20),
        supabase.from("claims").select("id,statement,status,confidence,created_at").order("created_at", { ascending: false }).limit(6),
        supabase.from("sources").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      if (!active) return;
      if (!needsRes.error && needsRes.data?.length) setNeeds(needsRes.data as Need[]);
      if (!claimsRes.error && claimsRes.data?.length) setClaims(claimsRes.data as Claim[]);
      setStats({
        needs: needsRes.error ? 1284 : (needsRes.count ?? needsRes.data?.length ?? 0),
        claims: claimsRes.error ? 642 : (claimsRes.count ?? claimsRes.data?.length ?? 0),
        sources: sourcesRes.error ? 398 : (sourcesRes.count ?? 0),
        users: profilesRes.error ? 2761 : (profilesRes.count ?? 0),
      });
      setLive(!needsRes.error && !claimsRes.error);
    }
    load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fa");
    if (!q) return needs;
    return needs.filter((n) => `${n.title} ${n.description} ${n.region ?? ""}`.toLocaleLowerCase("fa").includes(q));
  }, [needs, query]);

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-xl font-black text-black">م</div>
            <div><div className="text-xl font-black tracking-tight">MIZ <span className="text-orange-400">| میز</span></div><div className="text-xs text-zinc-500">نیاز را پیدا کن، ادعا را بسنج، تصمیم را آگاهانه بگیر.</div></div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`hidden items-center gap-1 rounded-full border px-3 py-1 text-xs sm:inline-flex ${live ? "border-emerald-500/30 text-emerald-300" : "border-zinc-700 text-zinc-500"}`}>{live ? <Wifi size={13}/> : <WifiOff size={13}/>} {live ? "داده زنده" : "حالت نمایشی"}</span>
            <Link href="/auth" className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:border-orange-400">ورود / ثبت‌نام</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-300"><ShieldCheck size={14}/> هسته اعتبارسنجی MIZ</span>
            <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">نیازهای واقعی مردم را از میان داده‌ها پیدا و اولویت‌بندی کن.</h1>
            <p className="mt-4 max-w-2xl text-zinc-400">MIZ نیازها، ادعاها و شواهد را از هم جدا می‌کند؛ سپس بر اساس داده و منبع، وضعیت و میزان اطمینان را نمایش می‌دهد.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-zinc-700 bg-black/30 px-4"><Search size={19} className="text-zinc-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="جستجوی نیاز، دسته یا منطقه..." className="w-full bg-transparent py-4 outline-none placeholder:text-zinc-600"/></div>
              <Link href="/account" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-black hover:bg-orange-400"><Plus size={18}/> ثبت نیاز</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["نیازهای باز", stats.needs.toLocaleString("fa-IR"), Activity],["ادعاهای بررسی‌شده", stats.claims.toLocaleString("fa-IR"), CheckCircle2],["منابع ثبت‌شده", stats.sources.toLocaleString("fa-IR"), FileSearch],["کاربران فعال", stats.users.toLocaleString("fa-IR"), Users]].map(([label,value,Icon]: any) => <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"><Icon size={20} className="text-orange-400"/><div className="mt-4 text-2xl font-black">{value}</div><div className="mt-1 text-sm text-zinc-500">{label}</div></div>)}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black">نیازهای قابل مشاهده</h2><p className="mt-1 text-xs text-zinc-500">آخرین داده‌های عمومی MIZ</p></div><BarChart3 className="text-orange-400"/></div>
            <div className="space-y-3">{filtered.length ? filtered.map(n => <article key={n.id} className="rounded-2xl border border-zinc-800 bg-black/20 p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold">{n.title}</h3><div className="mt-2 text-xs text-zinc-500">{n.region ?? "بدون منطقه"} • فوریت {urgencyLabel[n.urgency] ?? n.urgency}</div></div><div className="rounded-xl bg-orange-500/10 px-3 py-2 text-center"><div className="text-sm font-black text-orange-300">{n.status}</div><div className="text-[10px] text-zinc-500">وضعیت</div></div></div></article>) : <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-500">موردی با این جستجو پیدا نشد.</div>}</div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="mb-5 flex items-center gap-3"><MessageSquareText className="text-orange-400"/><div><h2 className="text-xl font-black">اعتبار ادعاها</h2><p className="mt-1 text-xs text-zinc-500">وضعیت، شواهد و اطمینان؛ نه حکم قطعی</p></div></div>
            <div className="space-y-3">{claims.map(c => <div key={c.id} className="rounded-2xl border border-zinc-800 p-4"><p className="text-sm leading-6">{c.statement}</p><div className="mt-3 flex items-center justify-between text-xs"><span className="text-zinc-500">{claimLabel[c.status] ?? c.status}</span><span className="text-orange-300">{Math.round((c.confidence ?? 0) * 100)}٪ اطمینان</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-orange-500" style={{width: `${Math.round((c.confidence ?? 0) * 100)}%`}}/></div></div>)}</div>
          </section>
        </div>

        <footer className="mt-10 flex flex-col gap-3 border-t border-zinc-800 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between"><span>© MIZ — نسخه ۰.۲، اتصال داده در حال اجرا</span><span className="inline-flex items-center gap-2"><Home size={14}/> معماری داده‌محور و قابل توسعه</span></footer>
      </section>
    </main>
  );
}
