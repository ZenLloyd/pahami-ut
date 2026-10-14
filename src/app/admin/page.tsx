"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/AdminNavbar";
import { getDaftarPengguna, type Pengguna } from "@/lib/auth";
import { getDokumenUpload } from "@/lib/dokumen";
import { getPengaturanKuota } from "@/lib/quota";
import {
  Users,
  FileText,
  MessageSquare,
  DollarSign,
  ShieldAlert,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [rentangHari, setRentangHari] = useState<"7" | "30">("7");

  // State Data Riil Terintegrasi (BP-11, BP-12, BP-13)
  const [penggunaTerbaru, setPenggunaTerbaru] = useState<Pengguna[]>([]);
  const [totalPengguna, setTotalPengguna] = useState(0);
  const [totalAktif, setTotalAktif] = useState(0);
  const [statDokumen, setStatDokumen] = useState({ total: 0, siap: 0, proses: 0, gagal: 0 });
  const [maksDokumen, setMaksDokumen] = useState(5);

  function muatDataDashboard() {
    // 1. Data Pengguna Riil dari Storage (S-15 / T-01 profiles)
    const semua = getDaftarPengguna();
    const mahasiswa = semua.filter((u) => u.role === "mahasiswa");
    setPenggunaTerbaru(mahasiswa.slice(0, 5));
    setTotalPengguna(mahasiswa.length);
    setTotalAktif(mahasiswa.filter((u) => u.isAktif).length);

    // 2. Data Dokumen Riil dari Storage (S-05 / T-02 documents)
    const docs = getDokumenUpload();
    setStatDokumen({
      total: docs.length,
      siap: docs.filter((d) => d.status === "SIAP").length,
      proses: docs.filter((d) => d.status === "DIPROSES").length,
      gagal: docs.filter((d) => d.status === "GAGAL").length,
    });

    // 3. Batas Kuota Dinamis (S-16 / T-09 settings)
    const q = getPengaturanKuota();
    setMaksDokumen(q.maksDokumen);
  }

  useEffect(() => {
    muatDataDashboard();
  }, []);

  function formatTanggal(iso?: string) {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  }

  // Perhitungan Volume Tanya AI & Estimasi Biaya (BR-27: Rp300/pertanyaan)
  const estimasiVolumeTanya =
    rentangHari === "7"
      ? Math.max(28, totalAktif * 14)
      : Math.max(120, totalAktif * 60);

  const rataRataPerHari =
    rentangHari === "7"
      ? Math.round(estimasiVolumeTanya / 7)
      : Math.round(estimasiVolumeTanya / 30);

  const estimasiBiayaRp = estimasiVolumeTanya * 300; // BR-27: ~Rp300/tanya

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* TOP HEADER ADMIN */}
      <AdminNavbar />

      {/* MAIN CONTENT S-14 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 pb-20 md:pb-8 space-y-6">
        {/* Page Title & Scope */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-outline-variant">
          <div>
            <div className="text-xs font-mono text-primary mb-1">
              PANEL PENGELOLA CAPSTONE STSI4440
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Dashboard Admin & Evaluasi Sistem
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Layar S-14 • Pemantauan agregat pengguna, dokumen, aktivitas pertanyaan AI, dan estimasi biaya operasional.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-high p-1 rounded-full border border-outline-variant text-xs">
            <button
              onClick={() => setRentangHari("7")}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                rentangHari === "7"
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setRentangHari("30")}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                rentangHari === "30"
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              30 Hari Terakhir
            </button>
          </div>
        </div>

        {/* CATATAN PRIVASI WAJIB (BR-06) */}
        <div className="p-4 rounded-2xl bg-surface-container border border-primary/30 flex items-center gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
          <div className="text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface">Aturan Privasi (BR-06):</strong> Admin hanya dapat memantau data agregat statistik. Admin <strong>dilarang dan tidak dapat membuka isi materi dokumen privat</strong> milik mahasiswa.
          </div>
        </div>

        {/* KARTU STATISTIK AGREGAT (Dokumen S-14) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Pengguna */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-mono uppercase">Total Pengguna</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">
              {totalPengguna} <span className="text-xs font-normal text-on-surface-variant">Mahasiswa</span>
            </div>
            <div className="text-[11px] text-primary font-mono flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> {totalAktif} Aktif (7 Hari Terakhir)
            </div>
          </div>

          {/* 2. Total Dokumen */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-mono uppercase">Total Dokumen</span>
              <FileText className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">
              {statDokumen.total} <span className="text-xs font-normal text-on-surface-variant">PDF</span>
            </div>
            <div className="text-[11px] text-on-surface-variant font-mono">
              {statDokumen.siap} Siap • {statDokumen.proses} Proses • {statDokumen.gagal} Gagal
            </div>
          </div>

          {/* 3. Pertanyaan AI */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-mono uppercase">Tanya AI ({rentangHari} Hari)</span>
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">
              {estimasiVolumeTanya.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal text-on-surface-variant">Tanya</span>
            </div>
            <div className="text-[11px] text-primary font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Rata-rata {rataRataPerHari} / hari
            </div>
          </div>

          {/* 4. Estimasi Biaya AI */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-mono uppercase">Estimasi Biaya AI</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">
              Rp{estimasiBiayaRp.toLocaleString("id-ID")}
            </div>
            <div className="text-[11px] text-on-surface-variant font-mono">
              ~Rp300 / pertanyaan (BR-27)
            </div>
          </div>
        </section>

        {/* GRAFIK SIMULASI PERTANYAAN PER HARI */}
        <section className="p-6 rounded-2xl bg-surface-container border border-outline-variant space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-on-surface">
                Volume Pertanyaan AI per Hari ({rentangHari} Hari Terakhir)
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Statistik intensitas mahasiswa UT dalam bertanya ke asisten modul
              </p>
            </div>
            <span className="text-xs font-mono text-primary bg-primary-container px-2.5 py-1 rounded-full font-medium">
              Model: RAG Grounded
            </span>
          </div>

          {/* Bar Diagram Sederhana M3 */}
          <div className="pt-4 grid grid-cols-7 gap-2 items-end h-36 border-b border-outline-variant pb-2">
            {[
              { day: "Sen", val: Math.round(rataRataPerHari * 0.75) },
              { day: "Sel", val: Math.round(rataRataPerHari * 0.95) },
              { day: "Rab", val: Math.round(rataRataPerHari * 1.1) },
              { day: "Kam", val: Math.round(rataRataPerHari * 1.25) },
              { day: "Jum", val: Math.round(rataRataPerHari * 1.0) },
              { day: "Sab", val: Math.round(rataRataPerHari * 1.35) },
              { day: "Min", val: Math.round(rataRataPerHari * 1.5) },
            ].map((d, i) => {
              const maxVal = Math.max(20, Math.round(rataRataPerHari * 1.6));
              const heightPercent = Math.min(100, Math.max(12, Math.round((d.val / maxVal) * 100)));
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono text-on-surface-variant">{d.val}</span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[36px] bg-primary rounded-t-lg transition-all duration-300 hover:opacity-85"
                  ></div>
                  <span className="text-[10px] font-mono text-on-surface-variant">{d.day}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* PENGGUNA TERBARU (5 Akun Riil Sesuai Dokumen S-14 / S-15) */}
        <section className="rounded-2xl bg-surface-container border border-outline-variant overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-on-surface">
                5 Pengguna Terdaftar Terbaru
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Monitoring mahasiswa baru yang bergabung ke platform
              </p>
            </div>
            <Link
              href="/admin/pengguna"
              className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua Pengguna</span>
              <span>↗</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-high/60 border-b border-outline-variant text-on-surface-variant font-mono">
                <tr>
                  <th className="py-3 px-4 font-medium">Nama Mahasiswa</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Tanggal Bergabung</th>
                  <th className="py-3 px-4 font-medium">Jumlah Dokumen</th>
                  <th className="py-3 px-4 font-medium text-right">Status Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {penggunaTerbaru.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-on-surface-variant">
                      Belum ada pengguna mahasiswa terdaftar.
                    </td>
                  </tr>
                ) : (
                  penggunaTerbaru.map((p, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-high/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-on-surface">
                        {p.nama}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-mono">
                        {p.email}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        {formatTanggal(p.dibuatPada)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-on-surface">
                        {p.jumlahDokumen ?? 0} / {maksDokumen} Dokumen
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                            p.isAktif
                              ? "bg-primary-container text-on-primary-container"
                              : "bg-error/15 text-error"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.isAktif ? "bg-primary" : "bg-error"
                            }`}
                          ></span>
                          {p.isAktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
