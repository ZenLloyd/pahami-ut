"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SYSTEM_MESSAGES } from "@/lib/messages";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  // Hitung Kekuatan Sandi (Minimal 8 karakter, huruf + angka)
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-zA-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = calculatePasswordStrength(password);

  // Validasi Tiap Kolom (saat onBlur sesuai dokumen S-03)
  const validateField = (field: "name" | "email" | "password" | "confirmPassword") => {
    const newErrors = { ...errors };

    if (field === "name") {
      if (!name.trim()) {
        newErrors.name = SYSTEM_MESSAGES.MSG_V01("Nama lengkap");
      } else if (name.trim().length < 3 || name.trim().length > 60) {
        newErrors.name = SYSTEM_MESSAGES.MSG_V03;
      } else {
        delete newErrors.name;
      }
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        newErrors.email = SYSTEM_MESSAGES.MSG_V01("Email");
      } else if (!emailRegex.test(email.trim())) {
        newErrors.email = SYSTEM_MESSAGES.MSG_V02;
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (!password) {
        newErrors.password = SYSTEM_MESSAGES.MSG_V01("Kata sandi");
      } else if (password.length < 8 || !hasLetter || !hasNumber) {
        newErrors.password = SYSTEM_MESSAGES.MSG_V04;
      } else {
        delete newErrors.password;
      }
    }

    if (field === "confirmPassword") {
      if (!confirmPassword) {
        newErrors.confirmPassword = SYSTEM_MESSAGES.MSG_V01("Konfirmasi kata sandi");
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = SYSTEM_MESSAGES.MSG_V05;
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi semua kolom saat kirim (sesuai dokumen)
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = SYSTEM_MESSAGES.MSG_V01("Nama lengkap");
    else if (name.trim().length < 3 || name.trim().length > 60) newErrors.name = SYSTEM_MESSAGES.MSG_V03;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = SYSTEM_MESSAGES.MSG_V01("Email");
    else if (!emailRegex.test(email.trim())) newErrors.email = SYSTEM_MESSAGES.MSG_V02;

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!password) newErrors.password = SYSTEM_MESSAGES.MSG_V01("Kata sandi");
    else if (password.length < 8 || !hasLetter || !hasNumber) newErrors.password = SYSTEM_MESSAGES.MSG_V04;

    if (!confirmPassword) newErrors.confirmPassword = SYSTEM_MESSAGES.MSG_V01("Konfirmasi kata sandi");
    else if (confirmPassword !== password) newErrors.confirmPassword = SYSTEM_MESSAGES.MSG_V05;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulasi Cek Email Unik (BR-22 / MSG-A05)
    if (email.toLowerCase() === "mahasiswa@ut.ac.id") {
      setErrors({ email: SYSTEM_MESSAGES.MSG_A05 });
      return;
    }

    setIsLoading(true);

    // Simulasi pembuatan akun (BP-01) & Pengalihan ke S-06 Beranda Mahasiswa
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard?new=true");
    }, 900);
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
          Layar S-03 • Pendaftaran Mahasiswa
        </span>
      </div>

      {/* 21st.dev Style Container Card */}
      <div className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl relative">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Daftar Akun Mahasiswa
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Simpan modul belajar, pantau progres topik lemah, dan akses AI pembimbing mandiri.
          </p>
        </div>

        {errors.general && (
          <div className="mb-5 p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* 1. Nama Lengkap (3-60 karakter) */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Nama Lengkap <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => validateField("name")}
              placeholder="Contoh: Muhammad Latif"
              className={`w-full px-3 py-2 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition ${
                errors.name
                  ? "border-rose-500/80 focus:border-rose-500"
                  : "border-zinc-800 focus:border-zinc-500"
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* 2. Email (Format valid & unik) */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Alamat Email <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField("email")}
              placeholder="nama@ecampus.ut.ac.id"
              className={`w-full px-3 py-2 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition ${
                errors.email
                  ? "border-rose-500/80 focus:border-rose-500"
                  : "border-zinc-800 focus:border-zinc-500"
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* 3. Kata Sandi (>= 8 karakter, huruf + angka, meter indikator) */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Kata Sandi <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField("password")}
                placeholder="Minimal 8 karakter (huruf & angka)"
                className={`w-full pl-3 pr-9 py-2 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition ${
                  errors.password
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

            {/* Indikator Kekuatan Sandi (21st.dev subtle bar) */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="grid grid-cols-4 gap-1 h-1">
                  <div
                    className={`rounded-full transition ${
                      strength >= 1 ? "bg-rose-500" : "bg-zinc-800"
                    }`}
                  />
                  <div
                    className={`rounded-full transition ${
                      strength >= 2 ? "bg-amber-500" : "bg-zinc-800"
                    }`}
                  />
                  <div
                    className={`rounded-full transition ${
                      strength >= 3 ? "bg-sky-400" : "bg-zinc-800"
                    }`}
                  />
                  <div
                    className={`rounded-full transition ${
                      strength >= 4 ? "bg-emerald-400" : "bg-zinc-800"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Kekuatan sandi</span>
                  <span>
                    {strength <= 1
                      ? "Sangat Lemah"
                      : strength === 2
                      ? "Sedang"
                      : strength === 3
                      ? "Cukup Baik"
                      : "Sangat Kuat"}
                  </span>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* 4. Konfirmasi Kata Sandi */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Konfirmasi Kata Sandi <span className="text-rose-400">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => validateField("confirmPassword")}
              placeholder="Ulangi kata sandi"
              className={`w-full px-3 py-2 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition ${
                errors.confirmPassword
                  ? "border-rose-500/80 focus:border-rose-500"
                  : "border-zinc-800 focus:border-zinc-500"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* Tombol Submit Utama */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mendaftarkan akun…</span>
                </>
              ) : (
                <span>Daftar Akun</span>
              )}
            </button>
          </div>
        </form>

        {/* Footer switch to S-02 */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-zinc-200 hover:text-white font-medium underline underline-offset-4">
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
}
