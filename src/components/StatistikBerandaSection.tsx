"use client";

import { useEffect, useState } from "react";
import { mockModules } from "@/data/mockData";
import { MAKS_DOKUMEN, getDokumenUpload } from "@/lib/dokumen";

export function StatistikBerandaSection() {
  const [totalDok, setTotalDok] = useState(mockModules.length);

  useEffect(() => {
    const uploaded = getDokumenUpload();
    setTotalDok(mockModules.length + uploaded.length);
  }, []);

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
        <div className="text-xs font-mono text-on-surface-variant uppercase">
          Dokumen Tersimpan
        </div>
        <div className="text-2xl font-bold font-mono tracking-tight text-on-surface mt-2">
          {totalDok}{" "}
          <span className="text-sm font-normal text-on-surface-variant">
            / {MAKS_DOKUMEN} Kuota
          </span>
        </div>
        <div className="text-xs text-primary mt-1 font-mono">
          BR-04: Maks {MAKS_DOKUMEN} dokumen
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
        <div className="text-xs font-mono text-on-surface-variant uppercase">
          Topik Selesai
        </div>
        <div className="text-2xl font-bold font-mono tracking-tight text-primary mt-2">
          10{" "}
          <span className="text-sm font-normal text-on-surface-variant">
            / 14 Topik
          </span>
        </div>
        <div className="text-xs text-on-surface-variant mt-1 font-mono">
          Skor kuis ≥ 70
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
        <div className="text-xs font-mono text-on-surface-variant uppercase">
          Rata-rata Skor
        </div>
        <div className="text-2xl font-bold font-mono tracking-tight text-on-surface mt-2">
          78.4{" "}
          <span className="text-sm font-normal text-on-surface-variant">
            / 100
          </span>
        </div>
        <div className="text-xs text-on-surface-variant mt-1 font-mono">
          Batas Aman UT: ≥ 70
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
        <div className="text-xs font-mono text-on-surface-variant uppercase">
          Topik Perlu Diulang
        </div>
        <div className="text-2xl font-bold font-mono tracking-tight text-amber-300 mt-2">
          2 Topik
        </div>
        <div className="text-xs text-on-surface-variant mt-1 font-mono">
          Akurasi &lt; 60%
        </div>
      </div>
    </section>
  );
}
