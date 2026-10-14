"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { type DokumenUpload, getDokumenUpload, statusTopik, ringkasDokumen, BATAS_SELESAI } from "@/lib/dokumen";
import { ArrowRight, RotateCcw, CheckCircle2, BookOpen } from "lucide-react";
import { SYSTEM_MESSAGES as MSG } from "@/lib/messages";

function formatWaktu(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProgresClient() {
  const [daftar, setDaftar] = useState<DokumenUpload[]>([]);
  const [dipilih, setDipilih] = useState("");
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    const d = getDokumenUpload();
    setDaftar(d);
    if (d.length > 0) setDipilih(d[0].id);
    setSiap(true);
  }, []);

  const dok = daftar.find((d) => d.id === dipilih) ?? null;
  const topik = dok?.topik ?? [];
  const r = dok ? ringkasDokumen(dok) : { total: 0, selesai: 0, lemah: 0, rataSkor: null, persen: 0 };
  const dikerjakan = topik.filter((t) => t.skorTerakhir !== undefined);
  const perluPenguatan = topik.filter((t) => statusTopik(t) === "lemah");
  const riwayat = topik
    .flatMap((t) => (t.riwayatSkor ?? []).map((rw) => ({ ...rw, judul: t.judul })))
    .sort((a, b) => b.waktu.localeCompare(a.waktu))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-mono text-primary">Layar S-12 • Progres Belajar</p>
          <h1 className="text-2xl font-bold tracking-tight">Progres Belajar</h1>
        </header>

        {siap && daftar.length === 0 && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center space-y-3">
            <p className="text-sm font-semibold">Belum ada modul</p>
            <p className="text-xs text-on-surface-variant">
              Unggah modul dan kerjakan latihan untuk melihat progres belajarmu.
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
            {daftar.length > 1 && (
              <label className="block text-xs text-on-surface-variant space-y-1">
                Modul
                <select
                  value={dipilih}
                  onChange={(e) => setDipilih(e.target.value)}
                  className="block w-full min-h-12 rounded-xl border border-outline-variant bg-surface-container px-3 text-sm text-on-surface"
                >
                  {daftar.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.judul}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <section className="grid grid-cols-3 gap-3">
              {[
                { label: "Topik selesai", nilai: `${r.selesai}/${r.total}` },
                { label: "Latihan dikerjakan", nilai: `${dikerjakan.length}/${r.total}` },
                { label: "Rata-rata skor", nilai: r.rataSkor !== null ? String(r.rataSkor) : "-" },
              ].map((k) => (
                <div key={k.label} className="rounded-2xl border border-outline-variant bg-surface-container p-4">
                  <p className="text-2xl font-bold font-mono text-primary">{k.nilai}</p>
                  <p className="text-[11px] text-on-surface-variant mt-1">{k.label}</p>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Skor Terakhir per Topik</h2>
                <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant bg-surface px-2.5 py-1 rounded-full border border-outline-variant/60 font-medium self-start sm:self-auto">
                  <span className="w-1 h-2.5 bg-on-surface/70 rounded-full inline-block" />
                  <span>Batas Tuntas (KKM): Skor {BATAS_SELESAI}</span>
                </div>
              </div>
              <ul className="space-y-3">
                {topik.map((t) => {
                  const skor = t.skorTerakhir;
                  const st = statusTopik(t);
                  const lulus = st === "selesai";
                  return (
                    <li key={t.id} className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate">{t.judul}</span>
                        <span className="font-mono text-on-surface-variant shrink-0">
                          {skor === undefined ? "Belum dikerjakan" : skor}
                        </span>
                      </div>
                      <div
                        className="relative h-3 rounded-full bg-surface-variant overflow-hidden"
                        role="img"
                        aria-label={`${t.judul}: ${skor === undefined ? "belum dikerjakan" : `skor ${skor}`}`}
                      >
                        {skor !== undefined && (
                          <div
                            className={`h-full rounded-full ${lulus ? "bg-primary" : "bg-error"}`}
                            style={{ width: `${skor}%` }}
                          />
                        )}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-on-surface/60"
                          style={{ left: `${BATAS_SELESAI}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* DAFTAR PERLU PENGUATAN (BR-13) / MSG-E02 / MSG-E03 */}
            <section className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-3">
              <h2 className="text-sm font-semibold">Perlu Penguatan</h2>
              {dikerjakan.length === 0 ? (
                <div className="p-4 rounded-xl bg-surface border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 shrink-0 text-primary" />
                    <span>{MSG.MSG_E02}</span>
                  </div>
                  {topik.length > 0 && (
                    <Link
                      href={`/latihan/${dok.id}/${topik[0].id}`}
                      className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold shrink-0 hover:opacity-90 transition text-center"
                    >
                      Mulai Latihan Pertama
                    </Link>
                  )}
                </div>
              ) : perluPenguatan.length > 0 ? (
                <ul className="space-y-2">
                  {perluPenguatan.map((t) => (
                    <li
                      key={t.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface p-3 border border-outline-variant"
                    >
                      <div className="text-xs">
                        <p className="font-semibold">{t.judul}</p>
                        <p className="text-on-surface-variant font-mono">
                          skor terakhir {t.skorTerakhir ?? "-"}, batas {BATAS_SELESAI}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/learning/${dok.id}`}
                          className="min-h-12 px-4 rounded-full border border-outline-variant text-xs font-medium inline-flex items-center gap-1.5 hover:bg-surface-container-high"
                        >
                          Baca Ulang <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/latihan/${dok.id}/${t.id}`}
                          className="min-h-12 px-4 rounded-full bg-primary text-on-primary text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Ulangi Latihan
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 rounded-xl bg-surface border border-outline-variant/60 flex items-center gap-2.5 text-xs text-primary">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{MSG.MSG_E03}</span>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-3">
              <h2 className="text-sm font-semibold">Riwayat Latihan</h2>
              {riwayat.length === 0 ? (
                <p className="text-xs text-on-surface-variant">
                  Belum ada latihan yang dikerjakan. Mulai dari salah satu topik di Jalur Belajar.
                </p>
              ) : (
                <ul className="divide-y divide-outline-variant/60">
                  {riwayat.map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-xs">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{r.judul}</p>
                        <p className="font-mono text-[10px] text-on-surface-variant">{formatWaktu(r.waktu)}</p>
                      </div>
                      <span
                        className={`font-mono px-2.5 py-0.5 rounded-full text-[11px] ${
                          r.skor >= BATAS_SELESAI ? "bg-primary-container text-on-primary-container" : "bg-error/15 text-error"
                        }`}
                      >
                        {r.skor}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
