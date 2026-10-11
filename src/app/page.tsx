import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Lock,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* 1. NAVIGASI ATAS */}
      <header className="h-16 border-b border-outline-variant bg-surface/90 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center text-sm tracking-tighter shadow-sm">
            UT
          </div>
          <span className="font-semibold text-base tracking-tight text-on-surface">
            Pahami
          </span>
          <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container-high border border-outline-variant px-2.5 py-0.5 rounded-full ml-1 hidden sm:inline">
            STSI4440
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/masuk"
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs text-on-surface hover:text-primary transition font-medium"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition shadow-sm"
          >
            Mulai Gratis ↗
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-on-surface max-w-3xl mx-auto leading-tight">
          Belajar Mandiri Modul Tebal, Tanpa Halusinasi AI.
        </h1>

        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Pahami ratusan halaman BMP UT per topik ringkas, uji pemahaman lewat kuis terarah, dan tanyakan konsep sulit pada asisten AI yang menjawab <strong>hanya dari modul resmi lengkap dengan sitasi nomor halaman</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/daftar"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>Daftar Akun Mahasiswa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/masuk"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant font-medium text-xs transition"
          >
            Masuk ke Akun Terdaftar
          </Link>
        </div>

        {/* Hero Visual Card: PDF -> Topik -> Jawaban Bersitasi */}
        <div className="pt-8">
          <div className="p-5 sm:p-7 rounded-2xl bg-surface-container border border-outline-variant shadow-2xl text-left max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-outline-variant text-xs text-on-surface-variant font-mono">
              <span className="text-primary font-medium">Alur Belajar Cerdas</span>
              <span>Dokumen: MSIM4201_Modul2.pdf</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4 text-xs">
              <div className="p-3.5 rounded-xl bg-surface border border-outline-variant space-y-1">
                <div className="font-mono text-on-surface-variant text-[10px]">TAHAP 1</div>
                <div className="font-semibold text-on-surface">1. Unggah Modul</div>
                <div className="text-on-surface-variant text-[11px]">PDF dipotong & diindeks otomatis jadi topik terarah.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-outline-variant space-y-1">
                <div className="font-mono text-on-surface-variant text-[10px]">TAHAP 2</div>
                <div className="font-semibold text-on-surface">2. Belajar & Kuis</div>
                <div className="text-on-surface-variant text-[11px]">Ringkasan materi + 5 latihan deteksi topik lemah.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-outline-variant space-y-1">
                <div className="font-mono text-on-surface-variant text-[10px]">TAHAP 3</div>
                <div className="font-semibold text-on-surface">3. Tanya AI Bersitasi</div>
                <div className="text-primary text-[11px] font-mono">Jawaban + Chip Rujukan [Hal. 14 ↗]</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PERBANDINGAN: AI UMUM VS SISTEM INI */}
      <section className="border-y border-outline-variant bg-surface-container/50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-primary uppercase">Kenapa Harus Sistem Ini?</span>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface mt-1">
              Perbandingan dengan AI Publik Umum
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI Umum */}
            <div className="p-6 rounded-2xl bg-surface border border-outline-variant space-y-4">
              <div className="flex items-center gap-2 text-error font-semibold text-sm">
                <XCircle className="w-5 h-5" />
                <span>AI Publik Biasa (ChatGPT / Gemini Bebas)</span>
              </div>
              <ul className="space-y-3 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="text-error font-mono font-bold">✕</span>
                  <span><strong>Rentan Halusinasi:</strong> Menjawab dari internet luas tanpa tahu kurikulum BMP UT.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error font-mono font-bold">✕</span>
                  <span><strong>Tanpa Rujukan Halaman:</strong> Mahasiswa bingung mencocokkan ke buku modul aslinya.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error font-mono font-bold">✕</span>
                  <span><strong>Buta Evaluasi:</strong> Tidak memetakan topik mana yang mahasiswa masih lemah.</span>
                </li>
              </ul>
            </div>

            {/* Sistem Modul Mandiri M3 */}
            <div className="p-6 rounded-2xl bg-surface-container border border-primary/40 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Pahami (Sistem Pembelajaran Mandiri UT)</span>
              </div>
              <ul className="space-y-3 text-xs text-on-surface">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono font-bold">✓</span>
                  <span><strong>100% Bersumber dari Buku:</strong> Menolak menjawab hal di luar dokumen modul BMP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono font-bold">✓</span>
                  <span><strong>Sitasi Nomor Halaman Pasti:</strong> Klik rujukan langsung melompat ke paragraf PDF asli.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono font-bold">✓</span>
                  <span><strong>Detektor Topik Lemah:</strong> Mengarahkan belajar ulang pada materi yang nilainya rendah.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 6 KARTU FITUR RESMI (Dokumen Halaman 10) */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center">
          <span className="text-xs font-mono text-on-surface-variant uppercase">Fitur Lengkap</span>
          <h2 className="text-2xl font-bold tracking-tight text-on-surface mt-1">
            Enam Kemampuan Utama Aplikasi
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-on-surface">1. Topik Otomatis</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Memecah modul BMP ratusan halaman menjadi 4–15 topik kegiatan belajar yang rapi dan berurutan.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <FileText className="w-5 h-5 text-secondary" />
            <h3 className="text-sm font-semibold text-on-surface">2. Ringkasan Terstruktur</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Konsep inti, poin penting, contoh sehari-hari, dan nomor halaman rujukan resmi.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-on-surface">3. Latihan & Pembahasan</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              5 soal pilihan ganda adaptif per topik dengan pembahasan langsung dan rujukan buku.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-on-surface">4. AI Bersitasi Halaman</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tanya konsep apapun, AI menjawab bertahap (streaming) dan mencantumkan nomor halaman modul.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <TrendingUp className="w-5 h-5 text-error" />
            <h3 className="text-sm font-semibold text-on-surface">5. Matriks Progres</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Grafik penguasaan materi dan peringatan otomatis untuk topik yang nilainya masih lemah.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant space-y-2">
            <Lock className="w-5 h-5 text-on-surface-variant" />
            <h3 className="text-sm font-semibold text-on-surface">6. Dokumen Privat</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Modul tersimpan aman di ruang privat masing-masing mahasiswa (Row Level Security).
            </p>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-outline-variant bg-surface-container py-8 text-xs text-on-surface-variant">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-on-surface font-semibold">
              Capstone STSI4440 • Kelompok B
            </div>
            <div>Program Studi Sistem Informasi — Universitas Terbuka (2026)</div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/masuk" className="hover:text-primary transition">Masuk</Link>
            <Link href="/daftar" className="hover:text-primary transition">Daftar</Link>
            <Link href="/beranda" className="hover:text-primary transition">Demo Beranda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
