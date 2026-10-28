"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SYSTEM_MESSAGES } from "@/lib/messages";
import { verifikasiLogin } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoUT } from "@/components/LogoUT";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export default function MasukPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [pesanError, setPesanError] = useState<string | null>(null);
  const [sedangMemproses, setSedangMemproses] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    kataSandi?: string;
  }>({});

  const validasi = () => {
    const errs: typeof fieldErrors = {};
    if (!email.trim()) {
      errs.email = SYSTEM_MESSAGES.MSG_V01("Email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = SYSTEM_MESSAGES.MSG_V02;
    }

    if (!kataSandi) {
      errs.kataSandi = SYSTEM_MESSAGES.MSG_V01("Kata sandi");
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleKirim = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError(null);

    if (!validasi()) return;

    setSedangMemproses(true);

    setTimeout(() => {
      setSedangMemproses(false);

      // Verifikasi Riil ke Database Akun Lokal
      const hasil = verifikasiLogin(email, kataSandi);

      if (!hasil.success) {
        if (hasil.status === "NONAKTIF") {
          // BP-02 / BR-23: Akun Dinonaktifkan
          setPesanError(SYSTEM_MESSAGES.MSG_A02);
        } else {
          // BP-02 / MSG-A01: Email atau kata sandi salah
          setPesanError(SYSTEM_MESSAGES.MSG_A01);
        }
        return;
      }

      // BR-31: Arahkan Sesuai Peran
      if (hasil.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/beranda");
      }
    }, 600);
  };

  const isiAkunDemo = (demoEmail: string, demoSandi: string) => {
    setEmail(demoEmail);
    setKataSandi(demoSandi);
    setFieldErrors({});
    setPesanError(null);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface lg:grid lg:grid-cols-2 selection:bg-primary-container selection:text-on-primary-container relative">
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* PANEL KIRI: VISUAL SHOWCASE M3 (Tampil di Desktop) */}
      <aside className="hidden lg:flex lg:flex-col lg:justify-between relative overflow-hidden bg-surface-container border-r border-outline-variant px-12 py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-tertiary-container/30 blur-3xl"
        />

        <Link href="/" className="inline-flex items-center gap-2.5 relative self-start hover:opacity-85 transition">
          <LogoUT />
          <div>
            <span className="font-bold text-base text-on-surface tracking-tight block leading-none">
              Pahami
            </span>
            <span className="text-[10px] font-mono text-primary">Asisten Belajar BMP UT</span>
          </div>
        </Link>

        <div className="relative my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teman belajar mandiri mahasiswa UT</span>
          </div>

          <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-on-surface leading-snug">
            Belajar dari PDF-mu sendiri, dibantu AI yang menyebut nomor halaman.
          </h2>

          <ul className="space-y-3 text-xs sm:text-sm text-on-surface-variant">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Topik kegiatan belajar otomatis dari modul PDF</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Latihan 5 soal pilihan ganda + pembahasan per topik</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Jawaban AI 100% bersumber dari bukumu lengkap dengan halaman</span>
            </li>
          </ul>

          {/* Mini Preview Card */}
          <div className="p-4 rounded-2xl bg-surface border border-outline-variant shadow-md space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
              <span className="text-primary font-semibold">TOPIK MODUL</span>
              <span>1 dari 4 selesai</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container">
                <span className="font-medium text-on-surface truncate">1. Konsep Dasar Sistem Informasi</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                  Selesai
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container">
                <span className="font-medium text-on-surface truncate">2. Komponen & Siklus Data</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-error/15 text-error">
                  Perlu diulang
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-[11px] font-mono text-on-surface-variant">
          Capstone Project STSI4440 • Sistem Informasi • Universitas Terbuka • 2026
        </p>
      </aside>

      {/* PANEL KANAN: FORM LOGIN S-02 */}
      <div className="flex flex-col justify-center items-center px-4 py-12">
        {/* Brand Header (Mobile) */}
        <div className="mb-6 flex flex-col items-center text-center lg:hidden">
          <Link href="/" className="flex items-center gap-2 mb-2 hover:opacity-85 transition">
            <LogoUT />
            <span className="font-semibold text-base text-on-surface tracking-tight">
              Pahami
            </span>
          </Link>
          <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container-high border border-outline-variant px-2.5 py-0.5 rounded-full">
            Layar S-02 • Masuk ke Akun
          </span>
        </div>

        {/* M3 Card Container */}
        <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6">
            <div className="hidden lg:inline-block text-[10px] font-mono text-primary bg-primary-container/50 border border-primary/20 px-2.5 py-0.5 rounded-full mb-2">
              Layar S-02 • Autentikasi Pengguna
            </div>
            <h1 className="text-xl font-bold tracking-tight text-on-surface">
              Masuk ke Akun
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Lanjutkan belajar mandiri dari dokumen modulmu.
            </p>
          </div>

          {/* Global Error Banner (MSG-A01 / MSG-A02) */}
          {pesanError && (
            <div className="mb-5 p-3.5 rounded-xl bg-error/10 border border-error/25 text-error text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{pesanError}</div>
            </div>
          )}

          <form onSubmit={handleKirim} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-on-surface mb-1.5">
                Email Mahasiswa / Admin <span className="text-error">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@ecampus.ut.ac.id"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface border text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition ${
                  fieldErrors.email
                    ? "border-error focus:border-error"
                    : "border-outline-variant focus:border-primary"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-error mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Kata Sandi */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-on-surface">
                  Kata Sandi <span className="text-error">*</span>
                </label>
                <Link
                  href="/lupa-sandi"
                  className="text-[11px] text-primary hover:underline transition"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={kataSandi}
                  onChange={(e) => setKataSandi(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-surface border text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition ${
                    fieldErrors.kataSandi
                      ? "border-error focus:border-error"
                      : "border-outline-variant focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.kataSandi && (
                <p className="text-[11px] text-error mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" />
                  <span>{fieldErrors.kataSandi}</span>
                </p>
              )}
            </div>

            {/* Tombol Utama Filled M3 */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={sedangMemproses}
                className="w-full py-2.5 px-4 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {sedangMemproses ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi akun…</span>
                  </>
                ) : (
                  <span>Masuk</span>
                )}
              </button>
            </div>
          </form>

          {/* Demo Credential Selector */}
          <div className="mt-6 p-3.5 rounded-xl bg-surface-container-high border border-outline-variant text-[11px] space-y-2">
            <div className="text-on-surface-variant font-mono flex items-center justify-between text-[10px]">
              <span>AKUN UJI COBA TIM (KLIK UNTUK ISI):</span>
              <span>Sandi: rahasia123</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => isiAkunDemo("uji.pahami+1@example.com", "rahasia123")}
                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-variant text-on-surface text-[10px] border border-outline-variant transition cursor-pointer"
              >
                Mahasiswa (uji.pahami+1)
              </button>
              <button
                type="button"
                onClick={() => isiAkunDemo("uji.pahami+admin@example.com", "rahasia123")}
                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-variant text-primary text-[10px] border border-outline-variant transition cursor-pointer"
              >
                Admin (uji.pahami+admin)
              </button>
              <button
                type="button"
                onClick={() => isiAkunDemo("mahasiswa@ecampus.ut.ac.id", "rahasia123")}
                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-variant text-on-surface text-[10px] border border-outline-variant transition cursor-pointer"
              >
                Mahasiswa UT
              </button>
              <button
                type="button"
                onClick={() => isiAkunDemo("budsant@ecampus.ut.ac.id", "rahasia123")}
                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-variant text-error text-[10px] border border-outline-variant transition cursor-pointer"
              >
                Akun Nonaktif (BR-23)
              </button>
            </div>
          </div>

          {/* Footer switch to S-03 Daftar */}
          <div className="mt-6 pt-5 border-t border-outline-variant/60 text-center text-xs text-on-surface-variant">
            Belum punya akun?{" "}
            <Link href="/daftar" className="text-primary hover:underline font-medium">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
