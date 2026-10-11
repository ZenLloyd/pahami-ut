"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SYSTEM_MESSAGES } from "@/lib/messages";
import { simpanPenggunaBaru } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoUT } from "@/components/LogoUT";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function DaftarPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [konfirmasiSandi, setKonfirmasiSandi] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    nama?: string;
    email?: string;
    kataSandi?: string;
    konfirmasiSandi?: string;
  }>({});

  const [sedangMemproses, setSedangMemproses] = useState(false);

  const hitungKekuatanSandi = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-zA-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    return score;
  };

  const kekuatan = hitungKekuatanSandi(kataSandi);

  const validasiKolom = (field: "nama" | "email" | "kataSandi" | "konfirmasiSandi") => {
    const newErrors = { ...errors };

    if (field === "nama") {
      if (!nama.trim()) {
        newErrors.nama = SYSTEM_MESSAGES.MSG_V01("Nama lengkap");
      } else if (nama.trim().length < 3 || nama.trim().length > 60) {
        newErrors.nama = SYSTEM_MESSAGES.MSG_V03;
      } else {
        delete newErrors.nama;
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

    if (field === "kataSandi") {
      const hasLetter = /[a-zA-Z]/.test(kataSandi);
      const hasNumber = /[0-9]/.test(kataSandi);
      if (!kataSandi) {
        newErrors.kataSandi = SYSTEM_MESSAGES.MSG_V01("Kata sandi");
      } else if (kataSandi.length < 8 || !hasLetter || !hasNumber) {
        newErrors.kataSandi = SYSTEM_MESSAGES.MSG_V04;
      } else {
        delete newErrors.kataSandi;
      }
    }

    if (field === "konfirmasiSandi") {
      if (!konfirmasiSandi) {
        newErrors.konfirmasiSandi = SYSTEM_MESSAGES.MSG_V01("Konfirmasi kata sandi");
      } else if (konfirmasiSandi !== kataSandi) {
        newErrors.konfirmasiSandi = SYSTEM_MESSAGES.MSG_V05;
      } else {
        delete newErrors.konfirmasiSandi;
      }
    }

    setErrors(newErrors);
  };

  const handleDaftar = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!nama.trim()) newErrors.nama = SYSTEM_MESSAGES.MSG_V01("Nama lengkap");
    else if (nama.trim().length < 3 || nama.trim().length > 60) newErrors.nama = SYSTEM_MESSAGES.MSG_V03;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = SYSTEM_MESSAGES.MSG_V01("Email");
    else if (!emailRegex.test(email.trim())) newErrors.email = SYSTEM_MESSAGES.MSG_V02;

    const hasLetter = /[a-zA-Z]/.test(kataSandi);
    const hasNumber = /[0-9]/.test(kataSandi);
    if (!kataSandi) newErrors.kataSandi = SYSTEM_MESSAGES.MSG_V01("Kata sandi");
    else if (kataSandi.length < 8 || !hasLetter || !hasNumber) newErrors.kataSandi = SYSTEM_MESSAGES.MSG_V04;

    if (!konfirmasiSandi) newErrors.konfirmasiSandi = SYSTEM_MESSAGES.MSG_V01("Konfirmasi kata sandi");
    else if (konfirmasiSandi !== kataSandi) newErrors.konfirmasiSandi = SYSTEM_MESSAGES.MSG_V05;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSedangMemproses(true);

    setTimeout(() => {
      setSedangMemproses(false);

      // Simpan Akun Baru ke Database Lokal (BP-01)
      const hasil = simpanPenggunaBaru(nama, email, kataSandi);

      if (!hasil.success) {
        if (hasil.error === "EMAIL_DUPLIKAT") {
          // BR-22 / MSG-A05: Email sudah terdaftar
          setErrors({ email: SYSTEM_MESSAGES.MSG_A05 });
        }
        return;
      }

      // Sukses: Sesuai BP-01 Langkah 5 -> Buat sesi login dan arahkan ke Beranda S-06
      router.push("/beranda?baru=true");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-center items-center px-4 py-12 selection:bg-primary-container selection:text-on-primary-container relative">
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="flex items-center gap-2 mb-2 hover:opacity-85 transition">
          <LogoUT />
          <span className="font-semibold text-base text-on-surface tracking-tight">
            Pahami
          </span>
        </Link>
        <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container-high border border-outline-variant px-2.5 py-0.5 rounded-full">
          Layar S-03 • Pendaftaran Mahasiswa
        </span>
      </div>

      {/* M3 Card Container */}
      <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-on-surface">
            Daftar Akun Mahasiswa
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Simpan modul belajar, pantau progres topik lemah, dan akses AI pembimbing mandiri.
          </p>
        </div>

        <form onSubmit={handleDaftar} className="space-y-4" noValidate>
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">
              Nama Lengkap <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              onBlur={() => validasiKolom("nama")}
              placeholder="Contoh: Muhammad Latif"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface border text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition ${
                errors.nama
                  ? "border-error focus:border-error"
                  : "border-outline-variant focus:border-primary"
              }`}
            />
            {errors.nama && (
              <p className="text-[11px] text-error mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.nama}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">
              Alamat Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validasiKolom("email")}
              placeholder="nama@ecampus.ut.ac.id"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface border text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition ${
                errors.email
                  ? "border-error focus:border-error"
                  : "border-outline-variant focus:border-primary"
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-error mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Kata Sandi */}
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">
              Kata Sandi <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={kataSandi}
                onChange={(e) => setKataSandi(e.target.value)}
                onBlur={() => validasiKolom("kataSandi")}
                placeholder="Minimal 8 karakter kombinasi huruf & angka"
                className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-surface border text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition ${
                  errors.kataSandi
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

            {/* Indikator Kekuatan Sandi M3 */}
            {kataSandi.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="grid grid-cols-4 gap-1 h-1.5">
                  <div
                    className={`rounded-full transition ${
                      kekuatan >= 1 ? "bg-error" : "bg-surface-variant"
                    }`}
                  />
                  <div
                    className={`rounded-full transition ${
                      kekuatan >= 2 ? "bg-amber-400" : "bg-surface-variant"
                    }`}
                  />
                  <div
                    className={`rounded-full transition ${
                      kekuatan >= 3 ? "bg-primary-container" : "bg-surface-variant"
                    }`}
                  />
                  <div
                    className={`rounded-full transition ${
                      kekuatan >= 4 ? "bg-primary" : "bg-surface-variant"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>Kekuatan sandi</span>
                  <span>
                    {kekuatan <= 1
                      ? "Sangat Lemah"
                      : kekuatan === 2
                      ? "Sedang"
                      : kekuatan === 3
                      ? "Cukup Baik"
                      : "Sangat Kuat"}
                  </span>
                </div>
              </div>
            )}

            {errors.kataSandi && (
              <p className="text-[11px] text-error mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.kataSandi}</span>
              </p>
            )}
          </div>

          {/* Konfirmasi Kata Sandi */}
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">
              Konfirmasi Kata Sandi <span className="text-error">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={konfirmasiSandi}
              onChange={(e) => setKonfirmasiSandi(e.target.value)}
              onBlur={() => validasiKolom("konfirmasiSandi")}
              placeholder="Ulangi kata sandi"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface border text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition ${
                errors.konfirmasiSandi
                  ? "border-error focus:border-error"
                  : "border-outline-variant focus:border-primary"
              }`}
            />
            {errors.konfirmasiSandi && (
              <p className="text-[11px] text-error mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.konfirmasiSandi}</span>
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
                  <span>Mendaftarkan akun…</span>
                </>
              ) : (
                <span>Daftar Akun</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-outline-variant/60 text-center text-xs text-on-surface-variant">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="text-primary hover:underline font-medium">
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
}
