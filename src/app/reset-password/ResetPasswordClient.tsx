"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SYSTEM_MESSAGES } from "@/lib/messages";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cek apakah token kedaluwarsa (simulasi MSG-A08)
  const isExpired = token === "expired";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!newPassword) {
      setError(SYSTEM_MESSAGES.MSG_V01("Kata sandi baru"));
      return;
    }

    if (newPassword.length < 8 || !hasLetter || !hasNumber) {
      setError(SYSTEM_MESSAGES.MSG_V04);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(SYSTEM_MESSAGES.MSG_V05);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 1500);
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
          Layar S-05 • Atur Ulang Kata Sandi
        </span>
      </div>

      <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl relative">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Atur Ulang Kata Sandi
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Buat kata sandi baru yang kuat (minimal 8 karakter kombinasi huruf & angka).
          </p>
        </div>

        {/* Kasus 1: Tautan Kedaluwarsa (MSG-A08) */}
        {isExpired ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <div className="font-semibold text-amber-200 mb-1">Tautan Tidak Berlaku</div>
                <div>{SYSTEM_MESSAGES.MSG_A08}</div>
              </div>
            </div>
            <Link
              href="/forgot-password"
              className="block w-full text-center py-2.5 px-4 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition"
            >
              Minta Tautan Baru
            </Link>
          </div>
        ) : isSuccess ? (
          /* Kasus 2: Berhasil Diubah (MSG-A07) */
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <div className="font-semibold text-emerald-200 mb-1">Berhasil Disimpan</div>
              <div>{SYSTEM_MESSAGES.MSG_A07} Mengalihkan ke halaman masuk…</div>
            </div>
          </div>
        ) : (
          /* Form Input */
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Kata Sandi Baru <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter kombinasi"
                  className="w-full pl-3 pr-9 py-2 rounded-md bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Konfirmasi Kata Sandi Baru <span className="text-rose-400">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-3 py-2 rounded-md bg-zinc-900/90 border border-zinc-800 focus:border-zinc-500 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan kata sandi…</span>
                </>
              ) : (
                <span>Simpan Kata Sandi</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
          <Link href="/login" className="text-zinc-300 hover:text-white transition">
            Kembali ke halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
