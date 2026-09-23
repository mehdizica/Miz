"use client";

import { useMemo, useState } from "react";
import { BarChart3, CheckCircle2, FileSearch, Home, MessageSquareText, ShieldCheck, Users, Plus, Search, Activity } from "lucide-react";

const demoNeeds = [
  { title: "نیاز به تعمیرکار مطمئن خودرو", category: "خدمات", urgency: "بالا", score: 92, region: "قم" },
  { title: "خرید عمده پارچه با قیمت مناسب", category: "کالا", urgency: "متوسط", score: 84, region: "تهران" },
  { title: "پیدا کردن فضای امن برای اجاره وسیله", category: "اجاره", urgency: "متوسط", score: 79, region: "قزوین" },
];

const demoClaims = [
  { text: "این خدمت در کمتر از ۲۴ ساعت انجام می‌شود.", status: "در حال بررسی", confidence: 61 },
  { text: "این فروشنده سابقه رضایت بالا دارد.", status: "پشتیبانی‌شده", confidence: 88 },
  { text: "این قیمت پایین‌تر از میانگین بازار است.", status: "نیازمند مدرک", confidence: 43 },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => demoNeeds.filter((n) => (n.title + " " + n.category + " " + n.region).includes(query.trim())),
    [query]
  );

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-xl font-black text-black">م</div>
            <div>
              <div className="text-xl font-black tracking-tight">MIZ <span className="text-orange-400">| میز</span></div>
              <div className="text-xs text-zinc-500">نیاز را پیدا کن، ادعا را بسنج، تصمیم را آگاهانه بگیر.</div>
            </div>
          </div>
          <button className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:border-orange-400">ورود / ثبت‌نام</button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-300"><ShieldCheck size={14}/> هسته اعتبارسنجی MIZ</span>
            <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">نیازهای واقعی مردم را از میان داده‌ها پیدا و اولویت‌بندی کن.</h1>
            <p className="mt-4 max-w-2xl text-zinc-400">MIZ نیازها، ادعاها و شواهد را از هم جدا می‌کند؛ سپس بر اساس داده و منبع، وضعیت و میزان اطمینان را نمایش می‌دهد.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-zinc-700 bg-black/30 px-4">
                <Search size={19} className="text-zinc-500"/>
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="جستجوی نیاز، دسته یا منطقه..." className="w-full bg-transparent py-4 outline-none placeholder:text-zinc-600"/>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-black hover:bg-orange-400"><Plus size={18}/> ثبت نیاز</button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["نیازهای باز", "۱,۲۸۴", Activity],
            ["ادعاهای بررسی‌شده", "۶۴۲", CheckCircle2],
            ["منابع ثبت‌شده", "۳۹۸", FileSearch],
            ["کاربران فعال", "۲,۷۶۱", Users],
          ].map(([label, value, Icon]: any) => (
            <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <Icon size={20} className="text-orange-400"/>
              <div className="mt-4 text-2xl font-black">{value}</div>
              <div className="mt-1 text-sm text-zinc-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div><h2 className="text-xl font-black">نیازهای قابل مشاهده</h2><p className="mt-1 text-xs text-zinc-500">نمونه رابط MVP</p></div>
              <BarChart3 className="text-orange-400"/>
            </div>
            <div className="space-y-3">
              {filtered.map((n) => (
                <article key={n.title} className="rounded-2xl border border-zinc-800 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div><h3 className="font-bold">{n.title}</h3><div className="mt-2 text-xs text-zinc-500">{n.category} • {n.region} • فوریت {n.urgency}</div></div>
                    <div className="rounded-xl bg-orange-500/10 px-3 py-2 text-center"><div className="text-lg font-black text-orange-300">{n.score}</div><div className="text-[10px] text-zinc-500">اولویت</div></div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="mb-5 flex items-center gap-3"><MessageSquareText className="text-orange-400"/><div><h2 className="text-xl font-black">اعتبار ادعاها</h2><p className="mt-1 text-xs text-zinc-500">وضعیت، شواهد و اطمینان؛ نه حکم قطعی</p></div></div>
            <div className="space-y-3">
              {demoClaims.map(c => <div key={c.text} className="rounded-2xl border border-zinc-800 p-4"><p className="text-sm leading-6">{c.text}</p><div className="mt-3 flex items-center justify-between text-xs"><span className="text-zinc-500">{c.status}</span><span className="text-orange-300">{c.confidence}% اطمینان</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-orange-500" style={{width: c.confidence+"%"}}/></div></div>)}
            </div>
          </section>
        </div>

        <footer className="mt-10 flex flex-col gap-3 border-t border-zinc-800 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© MIZ — نسخه MVP</span>
          <span className="inline-flex items-center gap-2"><Home size={14}/> معماری داده‌محور و قابل توسعه</span>
        </footer>
      </section>
    </main>
  );
}
