"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type DokumenUpload, getDokumenUpload } from "@/lib/dokumen";
import { ArrowRight, FileText } from "lucide-react";

/** Daftar dokumen hasil upload mahasiswa (S-06), dibaca dari penyimpanan lokal. */
export function DokumenUploadSection() {
  const [daftar, setDaftar] = useState<DokumenUpload[]>([]);

  useEffect(() => {
    setDaftar(getDokumenUpload());
  }, []);

  if (daftar.length === 0) return null;

  return (
    <section className="rounded-2xl bg-surface-container border border-outline-variant overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant">
        <h2 className="text-sm font-semibold">Modul yang Kamu Unggah</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Dokumen PDF pribadi yang sudah diproses
        </p>
      </div>
      <ul className="divide-y divide-outline-variant/60">
        {daftar.map((d) => (
          <li key={d.id}>
            <Link
              href={`/dokumen/${d.id}`}
              className="flex items-center gap-3 p-4 hover:bg-surface-container-high/50 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{d.judul}</p>
                <p className="text-[11px] font-mono text-on-surface-variant">
                  {d.topik.length} Topik • {d.totalHalaman} Halaman
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container/60 text-on-primary-container text-[10px] font-mono shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Siap
              </span>
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
