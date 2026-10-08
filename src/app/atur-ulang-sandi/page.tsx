"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SYSTEM_MESSAGES } from "@/lib/messages";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function AturUlangSandiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [kataSandiBaru, setKataSandiBaru] = useState("");
  const [konfirmasiSandi, setKonfirmasiSandi] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);
  const [berhasil, setBerhasil] = useState(false);

  const isExpired = token === "expired";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const hasLetter = /[a-zA-Z]/.test(kataSandiBaru);
    const hasNumber = /[0-9]/.test(kataSandiBaru);

    if (!kataSandiBaru) {
      setError(SYSTEM_MESSAGES.MSG_V01("Kata sandi baru"));
      return;
    }

    if (kataSandiBaru.length < 8 || !hasLetter || !hasNumber) {
      setError(SYSTEM_MESSAGES.MSG_V04);
      return;
    }

    if (kataSandiBaru !== konfirmasiSandi) {
      setError(SYSTEM_MESSAGES.MSG_V05);
      return;
    }

    setSedangMenyimpan(true);

    setTimeout(() => {
      setSedangMenyimpan(false);
      setBerhasil(true);
      setTimeout(() => {
        router.push("/masuk?reset=success");
      }, 1500);
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
          Layar S-05 • Atur Ulang Kata Sandi
        </span>
      </div>

      <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-on-surface">
            Atur Ulang Kata Sandi
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Buat kata sandi baru yang kuat (minimal 8 karakter kombinasi huruf & angka).
          </p>
        </div>

        {isExpired ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-error/10 border border-error/25 text-error text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <div className="font-semibold mb-1">Tautan Tidak Berlaku</div>
                <div>{SYSTEM_MESSAGES.MSG_A08}</div>
              </div>
            </div>
            <Link
              href="/lupa-sandi"
              className="block w-full text-center py-2.5 px-4 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition"
            >
              Minta Tautan Baru
            </Link>
          </div>
        ) : berhasil ? (
          <div className="p-4 rounded-xl bg-primary-container text-on-primary-container text-xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <div className="font-semibold mb-1">Berhasil Disimpan</div>
              <div>{SYSTEM_MESSAGES.MSG_A07} Mengalihkan ke halaman masuk…</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="p-3.5 rounded-xl bg-error/10 border border-error/25 text-error text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-on-surface mb-1.5">
                Kata Sandi Baru <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={kataSandiBaru}
                  onChange={(e) => setKataSandiBaru(e.target.value)}
                  placeholder="Minimal 8 karakter kombinasi"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-surface border border-outline-variant focus:border-primary text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface mb-1.5">
                Konfirmasi Kata Sandi Baru <span className="text-error">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={konfirmasiSandi}
                onChange={(e) => setKonfirmasiSandi(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-outline-variant focus:border-primary text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={sedangMenyimpan}
              className="w-full py-2.5 px-4 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {sedangMenyimpan ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan kata sandi…</span>
                </>
              ) : (
                <span>Simpan Kata Sandi</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-outline-variant/60 text-center text-xs text-on-surface-variant">
          <Link href="/masuk" className="text-on-surface hover:text-primary transition font-medium">
            Kembali ke halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AturUlangSandiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface text-on-surface-variant flex items-center justify-center text-xs font-mono">
          Memuat formulir…
        </div>
      }
    >
      <AturUlangSandiContent />
    </Suspense>
  );
}
