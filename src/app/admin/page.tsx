"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutModal } from "@/components/LogoutModal";
import {
  Users,
  FileText,
  MessageSquare,
  DollarSign,
  ShieldAlert,
  LogOut,
  TrendingUp,
  Settings,
  UserCheck,
  Calendar,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [rentangHari, setRentangHari] = useState<"7" | "30">("7");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock Data Pengguna Terbaru (Sesuai Dokumen S-14)
  const penggunaTerbaru = [
    {
      nama: "Muhammad Latif",
      email: "mahasiswa@ecampus.ut.ac.id",
      bergabung: "8 Okt 2026",
      dokumen: 4,
      status: "Aktif",
    },
    {
      nama: "Oktavina Putri",
      email: "oktavina@ecampus.ut.ac.id",
      bergabung: "8 Okt 2026",
      dokumen: 5,
      status: "Aktif",
    },
    {
      nama: "Wasil PM",
      email: "wasil@ecampus.ut.ac.id",
      bergabung: "7 Okt 2026",
      dokumen: 3,
      status: "Aktif",
    },
    {
      nama: "Siti Rahma",
      email: "siti.rahma@ecampus.ut.ac.id",
      bergabung: "6 Okt 2026",
      dokumen: 2,
      status: "Aktif",
    },
    {
      nama: "Budi Santoso",
      email: "nonaktif@ecampus.ut.ac.id",
      bergabung: "5 Okt 2026",
      dokumen: 1,
      status: "Nonaktif",
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* TOP HEADER ADMIN */}
      <header className="h-16 border-b border-outline-variant bg-surface-container px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center text-sm tracking-tighter shadow-sm">
              UT
            </div>
            <span className="font-semibold text-base text-on-surface tracking-tight">
              Pahami Admin
            </span>
            <span className="text-[10px] font-mono text-primary bg-primary-container/60 px-2.5 py-0.5 rounded-full border border-primary/30 hidden sm:inline">
              Role: Admin
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container font-semibold">
              Dashboard (S-14)
            </span>
            <button
              onClick={() => alert("Menu Pengguna (S-15) akan dibuka pada sprint manajemen pengguna.")}
              className="px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition cursor-pointer"
            >
              Pengguna (S-15)
            </button>
            <button
              onClick={() => alert("Menu Pengaturan Kuota (S-16) akan dibuka pada sprint pengaturan.")}
              className="px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition cursor-pointer"
            >
              Pengaturan Kuota (S-16)
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant hidden sm:inline font-mono">
            admin@ecampus.ut.ac.id
          </span>
          <ThemeToggle />
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-error text-xs font-medium border border-outline-variant transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

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
              128 <span className="text-xs font-normal text-on-surface-variant">Akun</span>
            </div>
            <div className="text-[11px] text-primary font-mono flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> 94 Aktif (7 Hari Terakhir)
            </div>
          </div>

          {/* 2. Total Dokumen */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-mono uppercase">Total Dokumen</span>
              <FileText className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">
              342 <span className="text-xs font-normal text-on-surface-variant">PDF</span>
            </div>
            <div className="text-[11px] text-on-surface-variant font-mono">
              320 Siap • 18 Proses • 4 Gagal
            </div>
          </div>

          {/* 3. Pertanyaan AI */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-mono uppercase">Tanya AI ({rentangHari} Hari)</span>
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">
              {rentangHari === "7" ? "612" : "2.410"} <span className="text-xs font-normal text-on-surface-variant">Tanya</span>
            </div>
            <div className="text-[11px] text-primary font-mono flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Rata-rata 87 / hari
            </div>
          </div>

          {/* 4. Estimasi Biaya AI */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-mono uppercase">Estimasi Biaya AI</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface">
              {rentangHari === "7" ? "Rp183.600" : "Rp723.000"}
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
              { day: "Sen", val: 65 },
              { day: "Sel", val: 82 },
              { day: "Rab", val: 95 },
              { day: "Kam", val: 110 },
              { day: "Jum", val: 88 },
              { day: "Sab", val: 120 },
              { day: "Min", val: 135 },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-on-surface-variant">{d.val}</span>
                <div
                  style={{ height: `${(d.val / 140) * 100}%` }}
                  className="w-full max-w-[36px] bg-primary rounded-t-lg transition-all duration-300 hover:opacity-85"
                ></div>
                <span className="text-[10px] font-mono text-on-surface-variant">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PENGGUNA TERBARU (5 Akun Sesuai Dokumen S-14) */}
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
            <button
              onClick={() => alert("Membuka daftar lengkap semua pengguna (S-15).")}
              className="text-xs text-primary hover:underline font-medium cursor-pointer"
            >
              Lihat Semua Pengguna ↗
            </button>
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
                {penggunaTerbaru.map((p, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-high/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-on-surface">
                      {p.nama}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant font-mono">
                      {p.email}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">
                      {p.bergabung}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-on-surface">
                      {p.dokumen} / 5 Dokumen
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          p.status === "Aktif"
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-error/15 text-error"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === "Aktif" ? "bg-primary" : "bg-error"
                          }`}
                        ></span>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Dialog Konfirmasi Keluar M3 Admin */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        userName="Administrator UT"
        userRole="Admin"
      />
    </div>
  );
}
