"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();
  const [name, setName] = useState("کاربر MIZ");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("در حال بارگذاری...");

  useEffect(() => {
    if (!supabase) {
      setStatus("اتصال Supabase تنظیم نشده است.");
      return;
    }
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data.user) {
        router.replace("/auth");
        return;
      }
      setEmail(data.user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile?.display_name) setName(profile.display_name);
      setStatus("حساب فعال است");
    });
  }, [router]);

  async function logout() {
    await supabase?.auth.signOut();
    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-orange-400">MIZ | میز</div>
            <h1 className="mt-1 text-3xl font-black">حساب من</h1>
          </div>
          <button onClick={logout} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:border-orange-400">خروج</button>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:col-span-2">
            <div className="text-xs text-zinc-500">پروفایل</div>
            <div className="mt-3 text-2xl font-black">{name}</div>
            <div className="mt-2 text-sm text-zinc-400">{email}</div>
            <div className="mt-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-300">{status}</div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="text-xs text-zinc-500">مرحله محصول</div>
            <div className="mt-3 text-2xl font-black text-orange-400">۱۵ / ۲۰</div>
            <div className="mt-2 text-sm text-zinc-400">Auth + RLS فعال</div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-black">هسته حساب</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-zinc-900 p-4"><b>نیازها</b><p className="mt-1 text-xs text-zinc-500">ثبت و مدیریت نیازهای خود</p></div>
            <div className="rounded-2xl bg-zinc-900 p-4"><b>ادعاها</b><p className="mt-1 text-xs text-zinc-500">ثبت ادعا و شواهد</p></div>
            <div className="rounded-2xl bg-zinc-900 p-4"><b>اعتبار</b><p className="mt-1 text-xs text-zinc-500">در حال اتصال به Reputation Engine</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
