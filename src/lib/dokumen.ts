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
  ringkasan?: string[];
  kataKunci?: string[];
  kalimatLatihan?: string[];
  skorTerakhir?: number;
  riwayatSkor?: { skor: number; waktu: string }[]; // ISO, terlama -> terbaru
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
  topikTerdeteksi?: boolean;
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

/** BR-21: ubah nama dokumen (3–100 karakter) */
export function ubahNamaDokumen(id: string, judulBaru: string): { ok: true; dok: DokumenUpload } | { ok: false; pesan: string } {
  const judul = judulBaru.trim();
  if (judul.length < 3 || judul.length > 100) {
    return { ok: false, pesan: "Judul dokumen harus 3–100 karakter." };
  }
  const semua = getDokumenUpload();
  const dok = semua.find((d) => d.id === id);
  if (!dok) return { ok: false, pesan: "Dokumen tidak ditemukan." };
  dok.judul = judul;
  localStorage.setItem(KEY, JSON.stringify(semua));
  return { ok: true, dok };
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

export function ubahStatusTopik(dokId: string, topikId: string, status: TopikDokumen['status']): DokumenUpload | null {
  const semua = getDokumenUpload();
  const dok = semua.find((d) => d.id === dokId);
  if (!dok) return null;
  dok.topik = dok.topik.map((t) => (t.id === topikId ? { ...t, status } : t));
  localStorage.setItem(KEY, JSON.stringify(semua));
  return dok;
}

export function simpanSkorTopik(dokId: string, topikId: string, skor: number): DokumenUpload | null {
  const semua = getDokumenUpload();
  const dok = semua.find((d) => d.id === dokId);
  if (!dok) return null;
  dok.topik = dok.topik.map((t) =>
    t.id === topikId
      ? {
          ...t,
          skorTerakhir: skor,
          status: skor >= 70 ? 'SELESAI' : 'BERJALAN',
          riwayatSkor: [...(t.riwayatSkor ?? []), { skor, waktu: new Date().toISOString() }],
        }
      : t,
  );
  localStorage.setItem(KEY, JSON.stringify(semua));
  return dok;
}
