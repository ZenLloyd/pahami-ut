/**
 * Penyimpanan dokumen modul hasil upload (S-11) — simulasi client-side.
 * Akan diganti API backend (POST /api/documents) saat integrasi.
 */

export const MAKS_UKURAN_MB = 50; // BR-02
export const MAKS_DOKUMEN = 5; // BR-04
const KEY = "pahami_dokumen_upload";

export interface TopikDokumen {
  id: string;
  judul: string;
  halamanMulai: number;
  halamanAkhir: number;
  status: "BELUM" | "BERJALAN" | "SELESAI";
}

export interface DokumenUpload {
  id: string;
  namaFile: string;
  judul: string;
  ukuranBytes: number;
  totalHalaman: number;
  diunggahPada: string; // ISO
  status: "SIAP" | "DIPROSES" | "GAGAL";
  topik: TopikDokumen[];
}

export function getDokumenUpload(): DokumenUpload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DokumenUpload[]) : [];
  } catch {
    return [];
  }
}

export function getDokumenById(id: string): DokumenUpload | null {
  return getDokumenUpload().find((d) => d.id === id) ?? null;
}

export function simpanDokumen(dok: DokumenUpload): void {
  const semua = getDokumenUpload();
  localStorage.setItem(KEY, JSON.stringify([dok, ...semua]));
}

export function hapusDokumen(id: string): void {
  const semua = getDokumenUpload().filter((d) => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(semua));
}

export type HasilValidasi = { ok: true } | { ok: false; pesan: string };

/** BR-01: hanya PDF · BR-02: maks 50 MB */
export function validasiFile(file: File): HasilValidasi {
  const adalahPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!adalahPdf) {
    return { ok: false, pesan: "Format file harus PDF. Pilih file berekstensi .pdf." };
  }
  if (file.size > MAKS_UKURAN_MB * 1024 * 1024) {
    return {
      ok: false,
      pesan: `Ukuran file maksimal ${MAKS_UKURAN_MB} MB. File kamu ${formatUkuran(file.size)}.`,
    };
  }
  if (file.size === 0) {
    return { ok: false, pesan: "File kosong. Pilih file PDF yang valid." };
  }
  return { ok: true };
}

export function formatUkuran(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Judul dari nama file: "msim4201_modul_02.pdf" -> "Msim4201 Modul 02" */
export function judulDariNamaFile(nama: string): string {
  return nama
    .replace(/\.pdf$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Simulasi pemecahan topik (4–15 Kegiatan Belajar, sesuai panduan).
 * Backend nyata akan membaca daftar isi PDF; di sini dibagi rata.
 */
export function buatTopikSimulasi(totalHalaman: number): TopikDokumen[] {
  const jumlah = Math.min(15, Math.max(4, Math.round(totalHalaman / 12)));
  const per = Math.ceil(totalHalaman / jumlah);
  return Array.from({ length: jumlah }, (_, i) => {
    const mulai = i * per + 1;
    const akhir = Math.min(totalHalaman, (i + 1) * per);
    return {
      id: `kb-${i + 1}`,
      judul: `Kegiatan Belajar ${i + 1}`,
      halamanMulai: mulai,
      halamanAkhir: akhir,
      status: "BELUM" as const,
    };
  }).filter((t) => t.halamanMulai <= totalHalaman);
}

export function perkirakanHalaman(ukuranBytes: number): number {
  return Math.min(400, Math.max(24, Math.round(ukuranBytes / (30 * 1024))));
}
