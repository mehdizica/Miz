"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/account");
    });
  }, [router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setMessage("اتصال Supabase در محیط اجرا تنظیم نشده است.");
      return;
    }
    setBusy(true);
    setMessage("");

    try {
      if (mode === "signup") {
        if (displayName.trim().length < 2) throw new Error("نام نمایشی را وارد کنید.");
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() } },
        });
        if (error) throw error;

        if (data.user && !data.session) {
          setMessage("حساب ایجاد شد. در صورت فعال بودن تأیید ایمیل، ایمیل تأیید را باز کنید و سپس وارد شوید.");
        } else if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            display_name: displayName.trim(),
          });
          router.replace("/account");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.user) router.replace("/account");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "خطا در احراز هویت.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-orange-500 text-2xl font-black text-black">م</div>
          <h1 className="text-3xl font-black">ورود به MIZ</h1>
          <p className="mt-2 text-sm text-zinc-500">حساب شما برای نیازها، ادعاها و اعتبار شخصی.</p>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-zinc-900 p-1">
            <button type="button" onClick={() => setMode("login")} className={`rounded-xl px-3 py-2 text-sm ${mode === "login" ? "bg-orange-500 font-bold text-black" : "text-zinc-400"}`}>ورود</button>
            <button type="button" onClick={() => setMode("signup")} className={`rounded-xl px-3 py-2 text-sm ${mode === "signup" ? "bg-orange-500 font-bold text-black" : "text-zinc-400"}`}>ثبت‌نام</button>
          </div>

          {mode === "signup" && (
            <label className="mb-4 block text-sm">
              نام نمایشی
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-orange-400" required />
            </label>
          )}

          <label className="mb-4 block text-sm">
            ایمیل
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-orange-400" required />
          </label>

          <label className="mb-5 block text-sm">
            رمز عبور
            <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-orange-400" required />
          </label>

          {message && <div className="mb-4 rounded-2xl border border-zinc-700 bg-zinc-900 p-3 text-sm leading-6 text-zinc-300">{message}</div>}

          <button disabled={busy} className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-black text-black disabled:opacity-50">
            {busy ? "در حال پردازش..." : mode === "login" ? "ورود امن" : "ایجاد حساب"}
          </button>
        </form>
      </div>
    </main>
  );
}
