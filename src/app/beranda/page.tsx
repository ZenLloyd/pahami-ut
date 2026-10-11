import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { mockWeakTopics, mockModules } from "@/data/mockData";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  FileText,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";

export default function BerandaMahasiswaPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-6">
        {/* S-06: Sapaan & Status Mahasiswa */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-outline-variant">
          <div>
            <div className="text-xs font-mono text-primary mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Halo, Latif! Selamat belajar mandiri hari ini.</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Beranda Mahasiswa
            </h1>
            <p className="text-xs text-on-surface-variant mt-1 max-w-2xl">
              Layar S-06 • Pantau materi BMP UT, cek topik lemah, dan lanjutkan belajar modul aktif.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant text-xs font-medium transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF (S-11)</span>
            </Link>

            <Link
              href="/learning/mod-02"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition shadow-sm"
            >
              <span>Lanjutkan Belajar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* WEAK SPOT ALERT (BR-13, BR-35) */}
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-on-surface">
                    Peringatan Diagnostik: 2 Topik Membutuhkan Penguatan
                  </h2>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Akurasi &lt; 60% (BR-13)
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                  Berdasarkan evaluasi kuis mandiri terakhir, kamu disarankan mempelajari ulang konsep modul di bawah ini sebelum ujian:
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-on-surface-variant shrink-0">
              Terakhir dianalisis: Hari ini, 18:30
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-amber-500/20">
            {mockWeakTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-3.5 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-on-surface">
                    {topic.topicName}
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                    {topic.moduleTitle} • {topic.pageRange} • Akurasi:{" "}
                    <span
                      className={
                        topic.status === "CRITICAL"
                          ? "text-error font-semibold"
                          : "text-amber-300 font-semibold"
                      }
                    >
                      {topic.accuracy}%
                    </span>
                  </div>
                </div>
                <Link
                  href="/learning/mod-02"
                  className="px-3 py-1.5 text-xs rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant font-medium whitespace-nowrap transition flex items-center gap-1"
                >
                  <span>Buka Topik</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 4 KARTU STATISTIK RESMI (BR-13 s.d. BR-15) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
            <div className="text-xs font-mono text-on-surface-variant uppercase">Dokumen Tersimpan</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface mt-2">
              4 <span className="text-sm font-normal text-on-surface-variant">/ 5 Kuota</span>
            </div>
            <div className="text-xs text-primary mt-1 font-mono">
              BR-04: Maks 5 dokumen
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
            <div className="text-xs font-mono text-on-surface-variant uppercase">Topik Selesai</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-primary mt-2">
              10 <span className="text-sm font-normal text-on-surface-variant">/ 14 Topik</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-1 font-mono">
              Skor kuis ≥ 70
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
            <div className="text-xs font-mono text-on-surface-variant uppercase">Rata-rata Skor</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface mt-2">
              78.4 <span className="text-sm font-normal text-on-surface-variant">/ 100</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-1 font-mono">
              Batas Aman UT: ≥ 70
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
            <div className="text-xs font-mono text-on-surface-variant uppercase">Topik Perlu Diulang</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-300 mt-2">
              2 Topik
            </div>
            <div className="text-xs text-on-surface-variant mt-1 font-mono">
              Akurasi &lt; 60%
            </div>
          </div>
        </section>

        {/* DAFTAR DOKUMEN MODUL DENGAN 3 VARIAN STATUS (Dokumen Hal 11) */}
        <section className="rounded-2xl bg-surface-container border border-outline-variant overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-on-surface">
                Daftar Dokumen Modul (BMP UT)
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Dokumen privat mahasiswa yang telah diolah dan diindeks AI
              </p>
            </div>
            <span className="text-xs font-mono text-on-surface-variant bg-surface-container-high border border-outline-variant px-2.5 py-1 rounded-full">
              4 dari 5 Dokumen Terpakai
            </span>
          </div>

          {/* Varian Tampilan HP: Mobile Card List */}
          <div className="md:hidden divide-y divide-outline-variant/60">
            {mockModules.map((mod) => (
              <div
                key={mod.id}
                className={`p-4 space-y-3 transition ${
                  mod.id === "mod-02" ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {mod.code}
                      </span>
                      {mod.id === "mod-02" && (
                        <span className="text-[10px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-mono font-semibold">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-on-surface mt-0.5">
                      {mod.title}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container/60 text-on-primary-container text-[10px] font-mono shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Siap
                  </span>
                </div>

                <div className="text-[11px] text-on-surface-variant font-mono flex items-center justify-between">
                  <span>{mod.learningActivitiesCount} Topik • {mod.totalPages} Halaman</span>
                  <span>{mod.masteryPercent}% Penguasaan</span>
                </div>

                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      mod.status === "MASTERED"
                        ? "bg-primary"
                        : mod.status === "IN_PROGRESS"
                        ? "bg-primary"
                        : mod.status === "NEEDS_REVIEW"
                        ? "bg-amber-400"
                        : "bg-error"
                    }`}
                    style={{ width: `${mod.masteryPercent}%` }}
                  ></div>
                </div>

                <div className="pt-1">
                  <Link
                    href={`/learning/${mod.id}`}
                    className="w-full py-2 px-3 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <span>Buka Ruang Belajar</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Varian Tampilan Desktop: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-high/60 border-b border-outline-variant text-on-surface-variant font-mono">
                <tr>
                  <th className="py-3 px-4 font-medium">Modul</th>
                  <th className="py-3 px-4 font-medium">Judul Dokumen</th>
                  <th className="py-3 px-4 font-medium">Progres Topik</th>
                  <th className="py-3 px-4 font-medium">Status Dokumen</th>
                  <th className="py-3 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {mockModules.map((mod) => (
                  <tr
                    key={mod.id}
                    className={`transition ${
                      mod.id === "mod-02"
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-surface-container-high/50"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-primary">
                      {mod.code}
                    </td>
                    <td className="py-3.5 px-4 text-on-surface">
                      <div className="flex items-center gap-2 font-medium">
                        <span>{mod.title}</span>
                        {mod.id === "mod-02" && (
                          <span className="text-[10px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-mono font-semibold">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                        {mod.learningActivitiesCount} Topik • {mod.totalPages} Halaman
                      </div>
                    </td>
                    <td className="py-3.5 px-4 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-surface-variant h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              mod.status === "MASTERED"
                                ? "bg-primary"
                                : mod.status === "IN_PROGRESS"
                                ? "bg-primary"
                                : mod.status === "NEEDS_REVIEW"
                                ? "bg-amber-400"
                                : "bg-error"
                            }`}
                            style={{ width: `${mod.masteryPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[11px] text-on-surface-variant">
                          {mod.masteryPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-container/60 text-on-primary-container text-[10px] font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Siap Dipelajari
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/learning/${mod.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                      >
                        <span>Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
