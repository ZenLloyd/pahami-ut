"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { type DokumenUpload, getDokumenById, simpanSkorTopik } from "@/lib/dokumen";
import { type SoalLatihan, buatSoal, pesanSkor } from "@/lib/latihan";
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";

const BATAS_LULUS = 70;

export function LatihanClient() {
  const { id, topikId } = useParams<{ id: string; topikId: string }>();
  const [dok, setDok] = useState<DokumenUpload | null>(null);
  const [siap, setSiap] = useState(false);
  const [soal, setSoal] = useState<SoalLatihan[]>([]);
  const [idx, setIdx] = useState(0);
  const [pilih, setPilih] = useState<number | null>(null);
  const [diperiksa, setDiperiksa] = useState(false);
  const [benar, setBenar] = useState(0);
  const [selesai, setSelesai] = useState(false);

  const mulai = useCallback((d: DokumenUpload) => {
    const t = d.topik.find((x) => x.id === topikId);
    setSoal(t ? buatSoal(d, t) : []);
    setIdx(0);
    setPilih(null);
    setDiperiksa(false);
    setBenar(0);
    setSelesai(false);
  }, [topikId]);

  useEffect(() => {
    const d = getDokumenById(id);
    setDok(d);
    if (d) mulai(d);
    setSiap(true);
  }, [id, mulai]);

  const topik = dok?.topik.find((x) => x.id === topikId);
  const s = soal[idx];
  const skor = soal.length ? Math.round((benar / soal.length) * 100) : 0;

  const periksa = useCallback(() => {
    if (pilih === null || diperiksa || !s) return;
    setDiperiksa(true);
    if (pilih === s.indexBenar) setBenar((b) => b + 1);
  }, [pilih, diperiksa, s]);

  const lanjut = useCallback(() => {
    if (idx + 1 < soal.length) {
      setIdx(idx + 1);
      setPilih(null);
      setDiperiksa(false);
    } else {
      const total = Math.round(((benar) / soal.length) * 100);
      simpanSkorTopik(id, topikId, total);
      setSelesai(true);
    }
  }, [idx, soal.length, benar, id, topikId]);

  // Pintasan keyboard: 1-4 pilih, Enter periksa/lanjut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (selesai || !s) return;
      if (!diperiksa && ["1", "2", "3", "4"].includes(e.key)) {
        const n = Number(e.key) - 1;
        if (n < s.pilihan.length) setPilih(n);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (diperiksa) lanjut();
        else periksa();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s, diperiksa, selesai, periksa, lanjut]);

  const kembali = `/learning/${id}`;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-5">
        <Link
          href={kembali}
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Ruang Belajar
        </Link>

        {siap && (!dok || !topik) && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center text-sm">
            Topik tidak ditemukan.
          </div>
        )}

        {dok && topik && soal.length < 3 && siap && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center space-y-3">
            <p className="text-sm font-semibold">Materi belum cukup untuk dibuat soal</p>
            <p className="text-xs text-on-surface-variant">
              {topik.judul} hanya memiliki sedikit teks. Coba topik lain atau unggah modul dengan teks lebih lengkap.
            </p>
          </div>
        )}

        {dok && topik && soal.length >= 3 && !selesai && s && (
          <>
            <header>
              <p className="text-xs font-mono text-primary">Layar S-09 • Latihan</p>
              <h1 className="text-xl font-bold tracking-tight">{topik.judul}</h1>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                Soal {idx + 1} dari {soal.length} • {s.halaman}
              </p>
              <div className="h-1.5 rounded-full bg-surface-variant mt-3 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((idx + (diperiksa ? 1 : 0)) / soal.length) * 100}%` }}
                />
              </div>
            </header>

            <section className="rounded-3xl border border-outline-variant bg-surface-container p-5 md:p-6 space-y-5">
              <p className="text-sm leading-relaxed">
                Lengkapi kalimat dari modul berikut:
              </p>
              <p className="text-base font-medium leading-relaxed">{s.kalimat}</p>

              <ul className="space-y-2.5" role="radiogroup" aria-label="Pilihan jawaban">
                {s.pilihan.map((p, i) => {
                  const terpilih = pilih === i;
                  const adalahBenar = diperiksa && i === s.indexBenar;
                  const salah = diperiksa && terpilih && i !== s.indexBenar;
                  return (
                    <li key={p}>
                      <button
                        role="radio"
                        aria-checked={terpilih}
                        disabled={diperiksa}
                        onClick={() => setPilih(i)}
                        className={`w-full min-h-12 px-4 rounded-2xl border text-left text-sm flex items-center gap-3 transition cursor-pointer disabled:cursor-default ${
                          adalahBenar
                            ? "border-primary bg-primary/15"
                            : salah
                              ? "border-error bg-error-container/25"
                              : terpilih
                                ? "border-primary bg-primary/10"
                                : "border-outline-variant hover:bg-surface-container-high"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full border border-outline flex items-center justify-center text-[11px] font-mono shrink-0">
                          {adalahBenar ? <Check className="w-3.5 h-3.5 text-primary" /> : salah ? <X className="w-3.5 h-3.5 text-error" /> : i + 1}
                        </span>
                        <span>{p}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {diperiksa && (
                <div
                  role="status"
                  className={`rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                    pilih === s.indexBenar ? "bg-primary/10" : "bg-error-container/20"
                  }`}
                >
                  <p className="font-semibold text-sm">
                    {pilih === s.indexBenar ? "Benar!" : `Kurang tepat. Jawabannya: ${s.pilihan[s.indexBenar]}`}
                  </p>
                  <p className="text-on-surface-variant">Pembahasan (kalimat asli modul, {s.halaman}):</p>
                  <p className="italic">&quot;{s.kalimatAsli}&quot;</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <span className="hidden sm:inline text-[11px] font-mono text-on-surface-variant">
                  Tekan 1–4 untuk memilih • ↵ lanjut
                </span>
                {!diperiksa ? (
                  <button
                    onClick={periksa}
                    disabled={pilih === null}
                    className="ml-auto min-h-12 px-6 rounded-full bg-primary text-on-primary font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <button
                    onClick={lanjut}
                    className="ml-auto min-h-12 px-6 rounded-full bg-primary text-on-primary font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    {idx + 1 < soal.length ? "Soal Berikutnya" : "Lihat Hasil"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </section>
            <p className="text-[11px] text-on-surface-variant">
              Soal dibuat otomatis dari kalimat modul (isian rumpang), belum memakai AI.
            </p>
          </>
        )}

        {dok && topik && selesai && (
          <section className="rounded-3xl border border-outline-variant bg-surface-container p-6 text-center space-y-4">
            <p className="text-xs font-mono text-primary">Layar S-10 • Hasil Latihan</p>
            <div
              className={`text-5xl font-bold font-mono ${
                skor >= BATAS_LULUS ? "text-primary" : skor >= 60 ? "text-amber-300" : "text-error"
              }`}
            >
              {skor}
            </div>
            <p className="text-xs text-on-surface-variant font-mono">
              {benar} dari {soal.length} benar • batas aman {BATAS_LULUS}
            </p>
            <span
              className={`inline-block text-[11px] font-mono px-3 py-1 rounded-full ${
                skor >= BATAS_LULUS
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {skor >= BATAS_LULUS ? `${topik.judul}: Selesai` : `${topik.judul}: Perlu diulang`}
            </span>
            <p className="text-sm">{pesanSkor(skor)}</p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                onClick={() => dok && mulai(dok)}
                className="min-h-12 px-6 rounded-full border border-outline-variant bg-surface-container-high text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi Latihan
              </button>
              <Link
                href={kembali}
                className="min-h-12 px-6 rounded-full bg-primary text-on-primary text-sm font-semibold inline-flex items-center justify-center"
              >
                Kembali ke Ruang Belajar
              </Link>
              <Link
                href={`/dokumen/${id}`}
                className="min-h-12 px-6 rounded-full border border-outline-variant text-sm font-medium inline-flex items-center justify-center"
              >
                Lihat Jalur Belajar
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
