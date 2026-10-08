"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SYSTEM_MESSAGES } from "@/lib/messages";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Field inline errors
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!email.trim()) {
      errs.email = SYSTEM_MESSAGES.MSG_V01("Email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = SYSTEM_MESSAGES.MSG_V02;
    }

    if (!password) {
      errs.password = SYSTEM_MESSAGES.MSG_V01("Kata sandi");
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsLoading(true);

    // Simulasi Verifikasi Akun Sesuai Kasus Dokumen STSI4440
    setTimeout(() => {
      setIsLoading(false);

      const trimmedEmail = email.trim().toLowerCase();

      // Kasus 1: Akun Dinonaktifkan (MSG-A02 / BR-23)
      if (trimmedEmail === "nonaktif@ecampus.ut.ac.id") {
        setErrorMessage(SYSTEM_MESSAGES.MSG_A02);
        return;
      }

      // Kasus 2: Email atau Sandi Salah (MSG-A01)
      if (password === "salah123") {
        setErrorMessage(SYSTEM_MESSAGES.MSG_A01);
        return;
      }

      // Kasus 3: Admin (BR-31 -> Dashboard Admin S-14)
      if (trimmedEmail === "admin@ecampus.ut.ac.id") {
        router.push("/admin");
        return;
      }

      // Kasus 4: Mahasiswa Normal (BR-31 -> Beranda Mahasiswa S-06)
      router.push("/dashboard");
    }, 700);
  };

  // Helper cepat untuk demo / pengujian
  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFieldErrors({});
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-zinc-800">
      {/* Brand Header */}
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
          Layar S-02 • Masuk ke Akun
        </span>
      </div>

      {/* 21st.dev Container Card */}
      <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl relative">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Masuk ke Akun
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gunakan email universitas atau akun yang telah terdaftar.
          </p>
        </div>

        {/* Global Error Banner (MSG-A01 / MSG-A02) */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-sans">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email Mahasiswa / Admin <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@ecampus.ut.ac.id"
              className={`w-full px-3 py-2 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition ${
                fieldErrors.email
                  ? "border-rose-500/80 focus:border-rose-500"
                  : "border-zinc-800 focus:border-zinc-500"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Kata Sandi <span className="text-rose-400">*</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-zinc-400 hover:text-zinc-200 transition"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className={`w-full pl-3 pr-9 py-2 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition ${
                  fieldErrors.password
                    ? "border-rose-500/80 focus:border-rose-500"
                    : "border-zinc-800 focus:border-zinc-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memverifikasi akun…</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </div>
        </form>

        {/* Demo Credential Quick Selector (Bagus untuk Uji Coba Tim / Dosen) */}
        <div className="mt-5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 text-[11px] space-y-2">
          <div className="text-zinc-500 font-mono flex items-center justify-between">
            <span>UJI SKENARIO AKUN:</span>
            <span>(Klik untuk isi otomatis)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount("mahasiswa@ecampus.ut.ac.id", "rahasia123")}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-[10px] border border-zinc-700 transition cursor-pointer"
            >
              Mahasiswa Aktif
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("nonaktif@ecampus.ut.ac.id", "rahasia123")}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-mono text-[10px] border border-zinc-700 transition cursor-pointer"
            >
              Mahasiswa Nonaktif
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@ecampus.ut.ac.id", "admin123")}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-sky-400 font-mono text-[10px] border border-zinc-700 transition cursor-pointer"
            >
              Akun Admin
            </button>
          </div>
        </div>

        {/* Footer switch to S-03 */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
          Belum punya akun?{" "}
          <Link href="/register" className="text-zinc-200 hover:text-white font-medium underline underline-offset-4">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
