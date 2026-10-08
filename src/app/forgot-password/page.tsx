"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SYSTEM_MESSAGES } from "@/lib/messages";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSent, countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(SYSTEM_MESSAGES.MSG_V01("Email"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(SYSTEM_MESSAGES.MSG_V02);
      return;
    }

    setIsLoading(true);

    // Simulasi pengiriman tautan reset (BR-26: berlaku 60 menit)
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setCountdown(60);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-zinc-800">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="flex items-center gap-2 mb-3 hover:opacity-80 transition">
          <div className="w-8 h-8 rounded bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center text-sm tracking-tighter">
            UT
          </div>
          <span className="font-semibold text-base text-zinc-100 tracking-tight">
            Sistem Modul Mandiri
          </span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
          Layar S-04 • Permintaan Reset Sandi
        </span>
      </div>

      <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl relative">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Lupa Kata Sandi
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Masukkan email terdaftar untuk menerima tautan atur ulang kata sandi akunmu.
          </p>
        </div>

        {/* State Terkirim (MSG-A06) */}
        {isSent ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <div className="font-semibold text-emerald-200 mb-1">Tautan Telah Dikirim</div>
                <div>{SYSTEM_MESSAGES.MSG_A06}</div>
              </div>
            </div>

            <div className="p-3 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
              <div className="font-mono text-zinc-300">Simulasi Tautan Reset (Klik untuk uji coba):</div>
              <Link
                href="/reset-password?token=valid-demo-token"
                className="text-sky-400 hover:underline block font-mono text-xs break-all"
              >
                /reset-password?token=valid-demo-token ↗
              </Link>
            </div>

            <button
              onClick={() => {
                if (countdown === 0) {
                  setIsSent(false);
                }
              }}
              disabled={countdown > 0}
              className="w-full py-2 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
            >
              {countdown > 0
                ? `Kirim Ulang Aktif dalam (${countdown} detik)`
                : "Kirim Ulang Tautan Reset"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Alamat Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@ecampus.ut.ac.id"
                  className={`w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition ${
                    error
                      ? "border-rose-500/80 focus:border-rose-500"
                      : "border-zinc-800 focus:border-zinc-500"
                  }`}
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {error && (
                <p className="text-[11px] text-rose-400 mt-1 font-mono">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengirimkan tautan…</span>
                </>
              ) : (
                <span>Kirim Tautan Reset</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke halaman Masuk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
