"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SYSTEM_MESSAGES } from "@/lib/messages";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function LupaSandiPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sedangKirim, setSedangKirim] = useState(false);
  const [terkirim, setTerkirim] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (terkirim && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [terkirim, countdown]);

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

    setSedangKirim(true);

    setTimeout(() => {
      setSedangKirim(false);
      setTerkirim(true);
      setCountdown(60);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-center items-center px-4 py-12 selection:bg-primary-container selection:text-on-primary-container">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="flex items-center gap-2 mb-2 hover:opacity-85 transition">
          <div className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center text-sm tracking-tighter shadow-sm">
            UT
          </div>
          <span className="font-semibold text-base text-on-surface tracking-tight">
            Pahami
          </span>
        </Link>
        <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container-high border border-outline-variant px-2.5 py-0.5 rounded-full">
          Layar S-04 • Permintaan Reset Sandi
        </span>
      </div>

      <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-on-surface">
            Lupa Kata Sandi
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Masukkan email terdaftar untuk menerima tautan atur ulang kata sandi akunmu.
          </p>
        </div>

        {terkirim ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary-container text-on-primary-container text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <div className="font-semibold mb-1">Tautan Telah Dikirim</div>
                <div>{SYSTEM_MESSAGES.MSG_A06}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-outline-variant text-[11px] text-on-surface-variant space-y-1">
              <div className="font-mono text-on-surface">Simulasi Tautan Reset (Klik untuk uji coba):</div>
              <Link
                href="/atur-ulang-sandi?token=valid-demo-token"
                className="text-primary hover:underline block font-mono text-xs break-all"
              >
                /atur-ulang-sandi?token=valid-demo-token ↗
              </Link>
            </div>

            <button
              onClick={() => {
                if (countdown === 0) setTerkirim(false);
              }}
              disabled={countdown > 0}
              className="w-full py-2.5 px-4 rounded-full bg-surface-container-high hover:bg-surface-variant disabled:opacity-50 text-on-surface text-xs font-medium border border-outline-variant transition"
            >
              {countdown > 0
                ? `Kirim Ulang Aktif dalam (${countdown} detik)`
                : "Kirim Ulang Tautan Reset"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-on-surface mb-1.5">
                Alamat Email <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@ecampus.ut.ac.id"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface border text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition ${
                    error
                      ? "border-error focus:border-error"
                      : "border-outline-variant focus:border-primary"
                  }`}
                />
                <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {error && (
                <p className="text-[11px] text-error mt-1 font-mono">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={sedangKirim}
              className="w-full py-2.5 px-4 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {sedangKirim ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirimkan tautan…</span>
                </>
              ) : (
                <span>Kirim Tautan Reset</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-outline-variant/60 text-center text-xs text-on-surface-variant">
          <Link
            href="/masuk"
            className="inline-flex items-center gap-1.5 text-on-surface hover:text-primary transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke halaman Masuk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
