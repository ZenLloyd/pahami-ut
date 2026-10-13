"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import {
  type DokumenUpload,
  formatUkuran,
  getDokumenById,
  hapusDokumen,
  ubahNamaDokumen,
} from "@/lib/dokumen";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Edit3, FileText, Trash2, CheckCircle2 } from "lucide-react";

const LABEL_STATUS = {
  BELUM: { teks: "Belum dipelajari", kelas: "bg-surface-variant text-on-surface-variant" },
  BERJALAN: { teks: "Sedang dipelajari", kelas: "bg-tertiary-container text-on-surface" },
  SELESAI: { teks: "Selesai", kelas: "bg-primary-container text-on-primary-container" },
} as const;

export function DetailDokumenClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [dok, setDok] = useState<DokumenUpload | null>(null);
  const [siap, setSiap] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [dialogEdit, setDialogEdit] = useState(false);
  const [judulInput, setJudulInput] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");
  const [errorEdit, setErrorEdit] = useState("");

  useEffect(() => {
    const d = getDokumenById(id);
    setDok(d);
    if (d) setJudulInput(d.judul);
    setSiap(true);
  }, [id]);

  function hapus() {
    hapusDokumen(id);
    router.push("/beranda");
  }

  function handleSimpanNama() {
    if (!dok) return;
    const res = ubahNamaDokumen(dok.id, judulInput);
    if (!res.ok) {
      setErrorEdit(res.pesan);
      return;
    }
    setDok({ ...res.dok });
    setDialogEdit(false);
    setErrorEdit("");
    setPesanSukses("Nama dokumen berhasil diubah."); // MSG-D01
    setTimeout(() => setPesanSukses(""), 3500);
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-6">
        <Link
          href="/beranda"
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
        </Link>

        {siap && !dok && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center space-y-3">
            <p className="text-sm font-semibold">Dokumen tidak ditemukan</p>
            <p className="text-xs text-on-surface-variant">
              Dokumen mungkin sudah dihapus atau tersimpan di perangkat lain.
            </p>
            <Link
              href="/upload"
              className="inline-flex min-h-12 items-center px-6 rounded-full bg-primary text-on-primary text-sm font-semibold"
            >
              Unggah Modul
            </Link>
          </div>
        )}

        {dok && (
          <>
            <header className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-primary">Layar S-07 • Detail Dokumen</p>
                <h1 className="text-2xl font-bold tracking-tight break-words">{dok.judul}</h1>
                <p className="text-xs font-mono text-on-surface-variant mt-1">
                  {dok.totalHalaman} halaman • {formatUkuran(dok.ukuranBytes)} • {dok.topik.length} kegiatan belajar
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {dok.topikTerdeteksi
                    ? "Topik dikenali dari judul “Kegiatan Belajar” di PDF."
                    : "Judul Kegiatan Belajar tidak ditemukan di PDF, jadi dokumen dibagi rata."}{" "}
                  Ringkasan disusun otomatis dari kalimat terpenting, belum memakai AI.
                </p>
              </div>
            </header>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Jalur Belajar</h2>
              <ol className="space-y-2.5">
                {dok.topik.map((t, i) => {
                  const st = LABEL_STATUS[t.status];
                  return (
                    <li
                      key={t.id}
                      className="rounded-2xl border border-outline-variant bg-surface-container overflow-hidden"
                    >
                      <details className="group">
                        <summary className="flex items-center gap-3 p-4 cursor-pointer list-none min-h-14 [&::-webkit-details-marker]:hidden">
                          <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-mono shrink-0">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">{t.judul}</p>
                            <p className="text-[11px] font-mono text-on-surface-variant">
                              Hal. {t.halamanMulai}–{t.halamanAkhir}
                            </p>
                          </div>
                          <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full shrink-0 ${st.kelas}`}>
                            {st.teks}
                            {t.skorTerakhir !== undefined ? ` • ${t.skorTerakhir}` : ""}
                          </span>
                          <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0 transition group-open:rotate-180" />
                        </summary>
                        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-outline-variant/60">
                          {t.ringkasan && t.ringkasan.length > 0 ? (
                            <>
                              <p className="text-[11px] font-mono text-primary pt-3">
                                Ringkasan otomatis
                              </p>
                              <ul className="space-y-2 list-disc pl-4 text-xs leading-relaxed text-on-surface">
                                {t.ringkasan.map((k, j) => (
                                  <li key={j}>{k}</li>
                                ))}
                              </ul>
                              {t.kataKunci && t.kataKunci.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {t.kataKunci.map((w) => (
                                    <span
                                      key={w}
                                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant"
                                    >
                                      {w}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-on-surface-variant pt-3">
                              Bagian ini tidak memiliki cukup teks untuk diringkas.
                            </p>
                          )}
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ol>
            </section>

            {pesanSukses && (
              <div
                role="status"
                className="flex items-center gap-2 p-3.5 rounded-2xl bg-primary/10 border border-primary/30 text-xs text-primary"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{pesanSukses}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href={`/learning/${dok.id}`}
                className="min-h-12 px-6 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <BookOpen className="w-4 h-4" /> Buka Ruang Belajar <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setJudulInput(dok.judul);
                  setErrorEdit("");
                  setDialogEdit(true);
                }}
                className="min-h-12 px-5 rounded-full border border-outline-variant bg-surface-container-high text-on-surface text-sm font-medium hover:bg-surface-variant transition inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" /> Ganti Nama
              </button>
              <button
                onClick={() => setKonfirmasi(true)}
                className="min-h-12 px-5 rounded-full border border-error/50 text-error text-sm font-medium hover:bg-error-container/20 transition inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Hapus Dokumen
              </button>
            </div>
          </>
        )}
      </main>

      {/* DIALOG GANTI NAMA (BP-09 · BR-21 · MSG-D01) */}
      {dialogEdit && dok && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-edit"
        >
          <div className="w-full max-w-md rounded-3xl bg-surface-container-high border border-outline-variant p-6 space-y-4">
            <h2 id="judul-edit" className="text-base font-bold">Ganti Nama Dokumen</h2>
            <p className="text-xs text-on-surface-variant">
              Sesuaikan nama modul agar lebih mudah dikenali (3–100 karakter).
            </p>
            <div>
              <input
                type="text"
                value={judulInput}
                onChange={(e) => setJudulInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSimpanNama();
                }}
                className="w-full min-h-12 px-4 rounded-2xl bg-surface border border-outline focus:border-primary text-sm text-on-surface focus:outline-none"
                placeholder="Masukkan judul dokumen..."
                maxLength={100}
              />
              {errorEdit && (
                <p className="text-xs text-error mt-1.5">{errorEdit}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDialogEdit(false)}
                className="min-h-12 px-5 rounded-full text-sm font-medium hover:bg-surface-variant cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSimpanNama}
                className="min-h-12 px-6 rounded-full bg-primary text-on-primary text-sm font-semibold hover:opacity-90 cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG HAPUS DOKUMEN (BP-09 · BR-20 · MSG-D02) */}
      {konfirmasi && dok && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-hapus"
        >
          <div className="w-full max-w-sm rounded-3xl bg-surface-container-high border border-outline-variant p-6 space-y-4">
            <h2 id="judul-hapus" className="text-base font-bold">Hapus Dokumen?</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Hapus &quot;{dok.judul}&quot;? Semua topik, latihan, dan riwayat tanya AI dokumen ini ikut terhapus dan tidak bisa dikembalikan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setKonfirmasi(false)}
                className="min-h-12 px-5 rounded-full text-sm font-medium hover:bg-surface-variant cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={hapus}
                className="min-h-12 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
