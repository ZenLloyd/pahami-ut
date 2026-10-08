import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { mockWeakTopics, mockModules, mockRecentCitations } from "@/data/mockData";
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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {/* S-06: Sapaan & Status Mahasiswa */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-800/80">
          <div>
            <div className="text-xs font-mono text-sky-400 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Halo, Latif! Selamat belajar mandiri hari ini.</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Beranda Mahasiswa
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Layar S-06 • Pantau topik aktif, lanjutkan modul terakhir, dan kelola dokumen BMP UT.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF (S-11)</span>
            </Link>

            <Link
              href="/learning/mod-02"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition shadow-sm"
            >
              <span>Lanjutkan Belajar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* WEAK SPOT ALERT (BR-13, BR-35) */}
        <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 md:p-5 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-zinc-100">
                    Peringatan Diagnostik: 2 Topik Membutuhkan Penguatan
                  </h2>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Akurasi &lt; 60% (BR-13)
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                  Berdasarkan evaluasi kuis mandiri terakhir, kamu disarankan mempelajari ulang konsep modul di bawah ini sebelum ujian:
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-500 shrink-0">
              Terakhir dianalisis: Hari ini, 18:30
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-amber-500/15">
            {mockWeakTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-3 rounded-md bg-[#121215] border border-zinc-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-medium text-zinc-200">
                    {topic.topicName}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    {topic.moduleTitle} • {topic.pageRange} • Akurasi:{" "}
                    <span
                      className={
                        topic.status === "CRITICAL"
                          ? "text-rose-400 font-semibold"
                          : "text-amber-400 font-semibold"
                      }
                    >
                      {topic.accuracy}%
                    </span>
                  </div>
                </div>
                <Link
                  href="/learning/mod-02"
                  className="px-2.5 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium whitespace-nowrap transition flex items-center gap-1"
                >
                  <span>Buka Topik</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 4 KARTU STATISTIK RESMI (BR-13 s.d. BR-15) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg bg-[#121215] border border-zinc-800">
            <div className="text-xs font-mono text-zinc-500 uppercase">Dokumen Tersimpan</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-zinc-100 mt-2">
              4 <span className="text-sm font-normal text-zinc-500">/ 5 Kuota</span>
            </div>
            <div className="text-xs text-sky-400 mt-1 font-mono">
              BR-04: Maks 5 dokumen
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#121215] border border-zinc-800">
            <div className="text-xs font-mono text-zinc-500 uppercase">Topik Selesai</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400 mt-2">
              10 <span className="text-sm font-normal text-zinc-500">/ 14 Topik</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 font-mono">
              Skor kuis ≥ 70
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#121215] border border-zinc-800">
            <div className="text-xs font-mono text-zinc-500 uppercase">Rata-rata Skor</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-zinc-100 mt-2">
              78.4 <span className="text-sm font-normal text-zinc-500">/ 100</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 font-mono">
              Batas Aman UT: ≥ 70
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#121215] border border-zinc-800">
            <div className="text-xs font-mono text-zinc-500 uppercase">Topik Perlu Diulang</div>
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-400 mt-2">
              2 Topik
            </div>
            <div className="text-xs text-zinc-400 mt-1 font-mono">
              Akurasi &lt; 60%
            </div>
          </div>
        </section>

        {/* DAFTAR DOKUMEN DENGAN 3 VARIAN STATUS (BR-07, Dokumen Hal 11) */}
        <section className="rounded-lg bg-[#121215] border border-zinc-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Daftar Dokumen Modul (BMP UT)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Dokumen privat mahasiswa yang telah diolah dan diindeks AI
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
              4 dari 5 Dokumen Terpakai
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-mono">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Modul</th>
                  <th className="py-2.5 px-4 font-medium">Judul Dokumen</th>
                  <th className="py-2.5 px-4 font-medium">Progres Topik</th>
                  <th className="py-2.5 px-4 font-medium">Status Dokumen</th>
                  <th className="py-2.5 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {mockModules.map((mod) => (
                  <tr
                    key={mod.id}
                    className={`transition ${
                      mod.id === "mod-02"
                        ? "bg-sky-500/5 hover:bg-sky-500/10"
                        : "hover:bg-zinc-900/40"
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-medium text-zinc-300">
                      {mod.code}
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span>{mod.title}</span>
                        {mod.id === "mod-02" && (
                          <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-1 rounded font-mono">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {mod.learningActivitiesCount} Topik • {mod.totalPages} Halaman
                      </div>
                    </td>
                    <td className="py-3 px-4 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              mod.status === "MASTERED"
                                ? "bg-emerald-400"
                                : mod.status === "IN_PROGRESS"
                                ? "bg-sky-400"
                                : mod.status === "NEEDS_REVIEW"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                            style={{ width: `${mod.masteryPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[11px] text-zinc-400">
                          {mod.masteryPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Siap Dipelajari
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/learning/${mod.id}`}
                        className="inline-flex items-center gap-1 text-zinc-300 hover:text-white font-medium"
                      >
                        <span>Detail</span>
                        <ArrowRight className="w-3 h-3" />
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
