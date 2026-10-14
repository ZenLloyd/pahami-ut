"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import {
  MAKS_DOKUMEN,
  MAKS_UKURAN_MB,
  formatUkuran,
  getDokumenUpload,
  judulDariNamaFile,
  simpanDokumen,
  validasiFile,
} from "@/lib/dokumen";
import { PdfTanpaTeksError, prosesPdf } from "@/lib/pdf-proses";
import { SYSTEM_MESSAGES as MSG } from "@/lib/messages";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  RotateCcw,
  UploadCloud,
  X,
} from "lucide-react";

const TAHAP = [
  "Memeriksa format & ukuran file",
  "Membaca teks & halaman modul",
  "Mengenali daftar isi & kegiatan belajar",
  "Memecah materi per bagian",
  "Menyiapkan indeks untuk Tanya AI",
];

type Fase = "AWAL" | "PROSES" | "SUKSES" | "GAGAL";

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const dibatalkan = useRef(false);

  const [fase, setFase] = useState<Fase>("AWAL");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [tahap, setTahap] = useState(0);
  const [persen, setPersen] = useState(0);
  const [idBaru, setIdBaru] = useState("");
  const [terpakai, setTerpakai] = useState(0);

  useEffect(() => {
    setTerpakai(getDokumenUpload().filter((d) => d.status !== "GAGAL").length);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const kuotaPenuh = terpakai >= MAKS_DOKUMEN;

  const pilihFile = useCallback((f: File | undefined | null) => {
    if (!f) return;
    const hasil = validasiFile(f);
    if (!hasil.ok) {
      setFile(null);
      setError(hasil.pesan);
      return;
    }
    setError("");
    setFile(f);
  }, []);

  function mulaiProses() {
    if (!file || kuotaPenuh) return;
    setFase("PROSES");
    setTahap(0);
    setPersen(0);

    dibatalkan.current = false;
    jalankan(file);
  }

  async function jalankan(f: File) {
    try {
      const hasil = await prosesPdf(f, (p, t) => {
        setPersen(p);
        setTahap(t);
      });
      if (dibatalkan.current) return;
      const id = `up-${Date.now()}`;
      simpanDokumen({
        id,
        namaFile: f.name,
        judul: judulDariNamaFile(f.name),
        ukuranBytes: f.size,
        totalHalaman: hasil.totalHalaman,
        diunggahPada: new Date().toISOString(),
        status: "SIAP",
        topik: hasil.topik,
        topikTerdeteksi: hasil.terdeteksiOtomatis,
      });
      setIdBaru(id);
      setFase("SUKSES");
    } catch (e) {
      setError(
        e instanceof PdfTanpaTeksError
          ? e.message
          : "Dokumen gagal diproses. Pastikan PDF tidak rusak atau dikunci kata sandi, lalu coba lagi.",
      );
      setFase("GAGAL");
    }
  }

  function ulang() {
    dibatalkan.current = true;
    if (timer.current) clearInterval(timer.current);
    setFase("AWAL");
    setFile(null);
    setError("");
    setPersen(0);
    setTahap(0);
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-6">
        <div>
          <Link
            href="/beranda"
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Unggah Modul PDF</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Layar S-11 • Unggah BMP UT berformat PDF (maks. {MAKS_UKURAN_MB} MB).
            Dokumen kamu bersifat privat dan diolah agar bisa ditanyakan ke AI.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs font-mono rounded-xl border border-outline-variant bg-surface-container px-4 py-2.5">
          <span className="text-on-surface-variant">Kuota dokumen</span>
          <span className={kuotaPenuh ? "text-error font-semibold" : "text-primary font-semibold"}>
            {terpakai} / {MAKS_DOKUMEN} terpakai
          </span>
        </div>

        {kuotaPenuh && fase === "AWAL" && (
          <div className="flex items-start gap-2.5 rounded-xl border border-error/40 bg-error-container/20 p-4 text-xs">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <p>{MSG.MSG_U03(MAKS_DOKUMEN)}</p>
          </div>
        )}

        {/* STATE AWAL & FILE TERPILIH */}
        {(fase === "AWAL" || fase === "GAGAL") && (
          <section className="space-y-4">
            <div
              role="button"
              tabIndex={0}
              aria-label="Area unggah PDF"
              onClick={() => !kuotaPenuh && inputRef.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !kuotaPenuh) {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (!kuotaPenuh) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!kuotaPenuh) pilihFile(e.dataTransfer.files?.[0]);
              }}
              className={`rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                kuotaPenuh
                  ? "opacity-50 cursor-not-allowed border-outline-variant"
                  : dragging
                    ? "border-primary bg-primary/10 cursor-copy"
                    : "border-outline hover:border-primary hover:bg-surface-container cursor-pointer"
              }`}
            >
              <UploadCloud className="w-10 h-10 mx-auto text-primary" />
              <p className="mt-3 text-sm font-semibold">
                Tarik file PDF ke sini, atau klik untuk memilih
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                Hanya .pdf • Maks. {MAKS_UKURAN_MB} MB
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  pilihFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-error/40 bg-error-container/20 p-3.5 text-xs"
              >
                <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {file && (
              <div className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container p-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{file.name}</p>
                  <p className="text-xs font-mono text-on-surface-variant">
                    {formatUkuran(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  aria-label="Hapus pilihan file"
                  className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={mulaiProses}
              disabled={!file || kuotaPenuh}
              className="w-full sm:w-auto min-h-12 px-6 rounded-full bg-primary text-on-primary font-semibold text-sm transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Unggah & Proses
            </button>
          </section>
        )}

        {/* STATE PROSES: 5 TAHAP */}
        {fase === "PROSES" && (
          <section className="rounded-3xl border border-outline-variant bg-surface-container p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm font-semibold truncate">{file?.name}</p>
              <span className="ml-auto text-xs font-mono text-primary">{persen}%</span>
            </div>

            <div
              className="w-full h-2 rounded-full bg-surface-variant overflow-hidden"
              role="progressbar"
              aria-valuenow={persen}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${persen}%` }}
              />
            </div>

            <ol className="space-y-3">
              {TAHAP.map((t, i) => {
                const done = i < tahap;
                const aktif = i === tahap;
                return (
                  <li key={t} className="flex items-center gap-3 text-xs">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        done
                          ? "bg-primary text-on-primary"
                          : aktif
                            ? "border-2 border-primary text-primary"
                            : "border border-outline-variant text-on-surface-variant"
                      }`}
                    >
                      {done ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : aktif ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span className="font-mono">{i + 1}</span>
                      )}
                    </span>
                    <span className={aktif ? "font-semibold" : done ? "" : "text-on-surface-variant"}>
                      {t}
                    </span>
                  </li>
                );
              })}
            </ol>

            <button
              onClick={ulang}
              className="text-xs text-on-surface-variant hover:text-on-surface underline cursor-pointer"
            >
              Batalkan
            </button>
          </section>
        )}

        {/* STATE SUKSES */}
        {fase === "SUKSES" && (
          <section className="rounded-3xl border border-primary/40 bg-primary/5 p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 mx-auto text-primary" />
            <div>
              <h2 className="text-lg font-bold">Modul siap dipelajari!</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {file?.name} sudah diolah menjadi topik-topik belajar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={() => router.push(`/dokumen/${idBaru}`)}
                className="min-h-12 px-6 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition cursor-pointer"
              >
                Lihat Detail Dokumen
              </button>
              <button
                onClick={ulang}
                className="min-h-12 px-6 rounded-full border border-outline-variant bg-surface-container-high text-sm font-medium hover:bg-surface-variant transition cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Unggah Lagi
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
