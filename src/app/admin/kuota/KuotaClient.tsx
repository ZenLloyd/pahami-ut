"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { getSesiSaatIni } from "@/lib/auth";
import {
  getPengaturanKuota,
  simpanPengaturanKuota,
  resetPengaturanKuota,
  BATAS_PARAMETER,
  type PengaturanKuota,
} from "@/lib/quota";
import { SYSTEM_MESSAGES as MSG } from "@/lib/messages";
import {
  Sliders,
  FileText,
  HardDrive,
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  ShieldCheck,
  Info,
  ArrowLeft,
  X,
} from "lucide-react";

export function KuotaClient() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState("Admin Pengelola");

  // Form State
  const [kuota, setKuota] = useState<PengaturanKuota>({
    maksDokumen: BATAS_PARAMETER.maksDokumen.default,
    maksUkuranMb: BATAS_PARAMETER.maksUkuranMb.default,
    maksHalaman: BATAS_PARAMETER.maksHalaman.default,
    maksPertanyaanAiHarian: BATAS_PARAMETER.maksPertanyaanAiHarian.default,
    batasNilaiKkm: BATAS_PARAMETER.batasNilaiKkm.default,
  });

  const [terakhirDiperbarui, setTerakhirDiperbarui] = useState<string | null>(null);
  const [diperbaruiOleh, setDiperbaruiOleh] = useState<string | null>(null);

  // Status Feedback
  const [pesanSukses, setPesanSukses] = useState<string | null>(null);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [konfirmasiReset, setKonfirmasiReset] = useState(false);
  const [sedangSimpan, setSedangSimpan] = useState(false);

  useEffect(() => {
    const user = getSesiSaatIni();
    if (!user || user.role !== "admin") {
      setIsAdmin(false);
      return;
    }
    setIsAdmin(true);
    setAdminName(user.nama || "Admin Pengelola");

    // Muat data pengaturan tersimpan
    const saved = getPengaturanKuota();
    setKuota(saved);
    if (saved.terakhirDiperbarui) setTerakhirDiperbarui(saved.terakhirDiperbarui);
    if (saved.diperbaruiOleh) setDiperbaruiOleh(saved.diperbaruiOleh);
  }, []);

  function formatTanggal(iso?: string | null) {
    if (!iso) return "Belum pernah diubah";
    try {
      return new Date(iso).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  function handleFieldChange(field: keyof PengaturanKuota, val: number) {
    setPesanSukses(null);
    setPesanError(null);
    setKuota((prev) => ({
      ...prev,
      [field]: isNaN(val) ? 0 : val,
    }));
  }

  function handleSimpan(e: React.FormEvent) {
    e.preventDefault();
    setPesanSukses(null);
    setPesanError(null);
    setSedangSimpan(true);

    const hasil = simpanPengaturanKuota(kuota, adminName);
    setSedangSimpan(false);

    if (hasil.sukses) {
      setPesanSukses(MSG.MSG_S01);
      const updated = getPengaturanKuota();
      setTerakhirDiperbarui(updated.terakhirDiperbarui ?? new Date().toISOString());
      setDiperbaruiOleh(updated.diperbaruiOleh ?? adminName);

      // Auto dismiss success toast after 4s
      setTimeout(() => {
        setPesanSukses(null);
      }, 4000);
    } else {
      setPesanError(hasil.pesan || "Terjadi kesalahan saat menyimpan pengaturan.");
    }
  }

  function handleReset() {
    const res = resetPengaturanKuota(adminName);
    setKuota(res);
    setTerakhirDiperbarui(res.terakhirDiperbarui ?? new Date().toISOString());
    setDiperbaruiOleh(res.diperbaruiOleh ?? adminName);
    setKonfirmasiReset(false);
    setPesanSukses("Pengaturan kuota berhasil dikembalikan ke default sistem UT.");
    setPesanError(null);

    setTimeout(() => {
      setPesanSukses(null);
    }, 4000);
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-error/15 text-error flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold">Akses Terbatas</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Halaman pengaturan parameter dan kuota sistem (Layar S-16) hanya dapat diakses oleh akun Administrator UT.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/masuk"
              className="w-full min-h-11 rounded-full bg-primary text-on-primary font-semibold text-xs inline-flex items-center justify-center transition"
            >
              Masuk sebagai Admin
            </Link>
            <Link
              href="/beranda"
              className="w-full min-h-11 rounded-full border border-outline-variant text-on-surface font-semibold text-xs inline-flex items-center justify-center hover:bg-surface-variant transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      <AdminNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-12 space-y-6">
        {/* Header Layar S-16 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-outline-variant">
          <div>
            <div className="text-xs font-mono text-primary mb-1">
              Layar S-16 • Pengaturan Kuota & Parameter Sistem (BP-12, BR-29)
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Pengaturan Kuota Sistem
            </h1>
            <p className="text-xs text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
              Atur parameter operasional aplikasi Pahami untuk mahasiswa Universitas Terbuka, termasuk kuota dokumen, kapasitas file, halaman PDF, batas pertanyaan AI, dan KKM kuis.
            </p>
          </div>

          <div className="text-left md:text-right text-xs font-mono text-on-surface-variant bg-surface-container px-3.5 py-2 rounded-2xl border border-outline-variant self-start md:self-auto shrink-0">
            <span className="block text-[10px] text-on-surface-variant/80">Terakhir Diperbarui</span>
            <span className="text-on-surface font-semibold">
              {formatTanggal(terakhirDiperbarui)}
            </span>
            {diperbaruiOleh && (
              <span className="block text-[10px] text-primary mt-0.5">
                oleh {diperbaruiOleh}
              </span>
            )}
          </div>
        </div>

        {/* FEEDBACK TOAST / BANNER */}
        {pesanSukses && (
          <div className="p-4 rounded-2xl bg-primary-container text-on-primary-container border border-primary/30 flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span className="font-medium">{pesanSukses}</span>
            </div>
            <button
              onClick={() => setPesanSukses(null)}
              className="w-7 h-7 rounded-full hover:bg-black/10 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {pesanError && (
          <div className="p-4 rounded-2xl bg-error-container text-on-error-container border border-error/30 flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-error shrink-0" />
              <span className="font-medium">{pesanError}</span>
            </div>
            <button
              onClick={() => setPesanError(null)}
              className="w-7 h-7 rounded-full hover:bg-black/10 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* FORM PENGATURAN PARAMETER KUOTA (S-16 / BP-12) */}
        <form onSubmit={handleSimpan} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. BATAS DOKUMEN PER MAHASISWA */}
            <div className="p-5 rounded-3xl bg-surface-container border border-outline-variant space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant">
                    Default UT: {BATAS_PARAMETER.maksDokumen.default} Dok
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    {BATAS_PARAMETER.maksDokumen.label}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {BATAS_PARAMETER.maksDokumen.keterangan}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={BATAS_PARAMETER.maksDokumen.min}
                    max={BATAS_PARAMETER.maksDokumen.max}
                    value={kuota.maksDokumen}
                    onChange={(e) => handleFieldChange("maksDokumen", parseInt(e.target.value))}
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 w-28 shrink-0">
                    <input
                      type="number"
                      min={BATAS_PARAMETER.maksDokumen.min}
                      max={BATAS_PARAMETER.maksDokumen.max}
                      value={kuota.maksDokumen}
                      onChange={(e) => handleFieldChange("maksDokumen", parseInt(e.target.value))}
                      className="w-16 min-h-10 text-center font-mono font-bold rounded-xl bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                    <span className="text-xs font-mono text-on-surface-variant">Dok</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>Min: {BATAS_PARAMETER.maksDokumen.min}</span>
                  <span>Maks: {BATAS_PARAMETER.maksDokumen.max} Dokumen</span>
                </div>
              </div>
            </div>

            {/* 2. MAKSIMAL UKURAN FILE PDF */}
            <div className="p-5 rounded-3xl bg-surface-container border border-outline-variant space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant">
                    Default UT: {BATAS_PARAMETER.maksUkuranMb.default} MB
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    {BATAS_PARAMETER.maksUkuranMb.label}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {BATAS_PARAMETER.maksUkuranMb.keterangan}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={BATAS_PARAMETER.maksUkuranMb.min}
                    max={BATAS_PARAMETER.maksUkuranMb.max}
                    step={5}
                    value={kuota.maksUkuranMb}
                    onChange={(e) => handleFieldChange("maksUkuranMb", parseInt(e.target.value))}
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 w-28 shrink-0">
                    <input
                      type="number"
                      min={BATAS_PARAMETER.maksUkuranMb.min}
                      max={BATAS_PARAMETER.maksUkuranMb.max}
                      value={kuota.maksUkuranMb}
                      onChange={(e) => handleFieldChange("maksUkuranMb", parseInt(e.target.value))}
                      className="w-16 min-h-10 text-center font-mono font-bold rounded-xl bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                    <span className="text-xs font-mono text-on-surface-variant">MB</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>Min: {BATAS_PARAMETER.maksUkuranMb.min} MB</span>
                  <span>Maks: {BATAS_PARAMETER.maksUkuranMb.max} MB</span>
                </div>
              </div>
            </div>

            {/* 3. MAKSIMAL HALAMAN PER DOKUMEN */}
            <div className="p-5 rounded-3xl bg-surface-container border border-outline-variant space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant">
                    Default UT: {BATAS_PARAMETER.maksHalaman.default} Hal
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    {BATAS_PARAMETER.maksHalaman.label}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {BATAS_PARAMETER.maksHalaman.keterangan}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={BATAS_PARAMETER.maksHalaman.min}
                    max={BATAS_PARAMETER.maksHalaman.max}
                    step={10}
                    value={kuota.maksHalaman}
                    onChange={(e) => handleFieldChange("maksHalaman", parseInt(e.target.value))}
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 w-28 shrink-0">
                    <input
                      type="number"
                      min={BATAS_PARAMETER.maksHalaman.min}
                      max={BATAS_PARAMETER.maksHalaman.max}
                      value={kuota.maksHalaman}
                      onChange={(e) => handleFieldChange("maksHalaman", parseInt(e.target.value))}
                      className="w-16 min-h-10 text-center font-mono font-bold rounded-xl bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                    <span className="text-xs font-mono text-on-surface-variant">Hal</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>Min: {BATAS_PARAMETER.maksHalaman.min} Hal</span>
                  <span>Maks: {BATAS_PARAMETER.maksHalaman.max} Halaman</span>
                </div>
              </div>
            </div>

            {/* 4. BATAS HARIAN TANYA AI */}
            <div className="p-5 rounded-3xl bg-surface-container border border-outline-variant space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant">
                    Default UT: {BATAS_PARAMETER.maksPertanyaanAiHarian.default} / Hari
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    {BATAS_PARAMETER.maksPertanyaanAiHarian.label}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {BATAS_PARAMETER.maksPertanyaanAiHarian.keterangan}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={BATAS_PARAMETER.maksPertanyaanAiHarian.min}
                    max={BATAS_PARAMETER.maksPertanyaanAiHarian.max}
                    step={5}
                    value={kuota.maksPertanyaanAiHarian}
                    onChange={(e) =>
                      handleFieldChange("maksPertanyaanAiHarian", parseInt(e.target.value))
                    }
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 w-28 shrink-0">
                    <input
                      type="number"
                      min={BATAS_PARAMETER.maksPertanyaanAiHarian.min}
                      max={BATAS_PARAMETER.maksPertanyaanAiHarian.max}
                      value={kuota.maksPertanyaanAiHarian}
                      onChange={(e) =>
                        handleFieldChange("maksPertanyaanAiHarian", parseInt(e.target.value))
                      }
                      className="w-16 min-h-10 text-center font-mono font-bold rounded-xl bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                    <span className="text-xs font-mono text-on-surface-variant">Tanya</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>Min: {BATAS_PARAMETER.maksPertanyaanAiHarian.min}</span>
                  <span>Maks: {BATAS_PARAMETER.maksPertanyaanAiHarian.max} Tanya/Hari</span>
                </div>
              </div>
            </div>

            {/* 5. BATAS NILAI TUNTAS (KKM) KELULUSAN */}
            <div className="p-5 rounded-3xl bg-surface-container border border-outline-variant space-y-4 flex flex-col justify-between md:col-span-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant">
                    Default UT: Skor {BATAS_PARAMETER.batasNilaiKkm.default}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    {BATAS_PARAMETER.batasNilaiKkm.label}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {BATAS_PARAMETER.batasNilaiKkm.keterangan}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 max-w-xl">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={BATAS_PARAMETER.batasNilaiKkm.min}
                    max={BATAS_PARAMETER.batasNilaiKkm.max}
                    step={5}
                    value={kuota.batasNilaiKkm}
                    onChange={(e) => handleFieldChange("batasNilaiKkm", parseInt(e.target.value))}
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 w-28 shrink-0">
                    <input
                      type="number"
                      min={BATAS_PARAMETER.batasNilaiKkm.min}
                      max={BATAS_PARAMETER.batasNilaiKkm.max}
                      value={kuota.batasNilaiKkm}
                      onChange={(e) => handleFieldChange("batasNilaiKkm", parseInt(e.target.value))}
                      className="w-16 min-h-10 text-center font-mono font-bold rounded-xl bg-surface border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                    <span className="text-xs font-mono text-on-surface-variant">Poin</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>Min: Skor {BATAS_PARAMETER.batasNilaiKkm.min}</span>
                  <span>Maks: Skor {BATAS_PARAMETER.batasNilaiKkm.max}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CATATAN PENGARUH SISTEM */}
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant flex items-start gap-3 text-xs text-on-surface-variant">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-on-surface">Pemberitahuan Sistem (BR-29):</p>
              <p className="leading-relaxed">
                Perubahan kuota berlaku seketika untuk semua mahasiswa yang mengunggah dokumen baru, mengajukan pertanyaan ke asisten AI, dan menyelesaikan kuis topik. Pengguna yang sudah melampaui kuota baru akan diminta menghapus modul lama jika ingin mengunggah kembali.
              </p>
            </div>
          </div>

          {/* TOMBOL AKSI SIMPAN & RESET */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => setKonfirmasiReset(true)}
              className="min-h-12 px-6 rounded-full border border-outline-variant text-xs font-semibold hover:bg-surface-variant text-on-surface transition cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset ke Default UT</span>
            </button>

            <button
              type="submit"
              disabled={sedangSimpan}
              className="min-h-12 px-8 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{sedangSimpan ? "Menyimpan..." : "Simpan Pengaturan Kuota"}</span>
            </button>
          </div>
        </form>

        {/* MODAL KONFIRMASI RESET KE DEFAULT */}
        {konfirmasiReset && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  Kembalikan ke Default Sistem UT?
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Semua parameter kuota akan dikembalikan ke nilai standar awal Universitas Terbuka:
                  5 dokumen, 25 MB file, 100 halaman, 50 tanya AI/hari, dan KKM skor 70.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setKonfirmasiReset(false)}
                  className="min-h-11 px-5 rounded-full border border-outline-variant text-xs font-medium hover:bg-surface-variant transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-11 px-5 rounded-full bg-amber-500 text-black text-xs font-bold hover:opacity-90 transition cursor-pointer"
                >
                  Ya, Kembalikan ke Default
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
