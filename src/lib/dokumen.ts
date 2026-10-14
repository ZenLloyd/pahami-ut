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
  aktivitasTerakhir?: { topikId: string; waktu: string }; // BR-34
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

function catatAktivitasDi(dok: DokumenUpload, topikId: string) {
  dok.aktivitasTerakhir = { topikId, waktu: new Date().toISOString() };
}

/** BR-34: catat topik yang terakhir dibuka/dilatih. */
export function catatAktivitas(dokId: string, topikId: string): void {
  const semua = getDokumenUpload();
  const dok = semua.find((d) => d.id === dokId);
  if (!dok) return;
  catatAktivitasDi(dok, topikId);
  localStorage.setItem(KEY, JSON.stringify(semua));
}

export function ubahStatusTopik(dokId: string, topikId: string, status: TopikDokumen['status']): DokumenUpload | null {
  const semua = getDokumenUpload();
  const dok = semua.find((d) => d.id === dokId);
  if (!dok) return null;
  dok.topik = dok.topik.map((t) => (t.id === topikId ? { ...t, status } : t));
  localStorage.setItem(KEY, JSON.stringify(semua));
  return dok;
}

export const BATAS_SELESAI = 70; // BR-13
export const BATAS_LEMAH = 60; // BR-13

export type StatusTopik = "belum" | "selesai" | "lemah";

/**
 * BR-13: belum = belum pernah latihan; selesai = pernah skor >= 70 dan skor
 * terakhir >= 60; lemah = selain itu.
 */
export function statusTopik(t: TopikDokumen): StatusTopik {
  const semuaSkor = t.riwayatSkor?.map((r) => r.skor) ?? (t.skorTerakhir !== undefined ? [t.skorTerakhir] : []);
  if (semuaSkor.length === 0) return "belum";
  const terakhir = semuaSkor[semuaSkor.length - 1];
  return Math.max(...semuaSkor) >= BATAS_SELESAI && terakhir >= BATAS_LEMAH ? "selesai" : "lemah";
}

/** BR-14 (progres %), BR-15 (rata-rata skor terakhir topik yang pernah dilatih). */
export function ringkasDokumen(d: DokumenUpload) {
  const status = d.topik.map(statusTopik);
  const selesai = status.filter((s) => s === "selesai").length;
  const lemah = status.filter((s) => s === "lemah").length;
  const dilatih = d.topik.filter((t) => t.skorTerakhir !== undefined);
  const rataSkor = dilatih.length
    ? Math.round(dilatih.reduce((a, t) => a + (t.skorTerakhir ?? 0), 0) / dilatih.length)
    : null;
  return {
    total: d.topik.length,
    selesai,
    lemah,
    rataSkor,
    persen: d.topik.length ? Math.round((selesai / d.topik.length) * 100) : 0,
  };
}

/** BR-35: topik pertama (urutan terkecil) berstatus belum atau lemah. */
export function topikDisarankan(d: DokumenUpload): TopikDokumen | undefined {
  return d.topik.find((t) => statusTopik(t) !== "selesai");
}

export function simpanSkorTopik(dokId: string, topikId: string, skor: number): DokumenUpload | null {
  const semua = getDokumenUpload();
  const dok = semua.find((d) => d.id === dokId);
  if (!dok) return null;
  dok.topik = dok.topik.map((t) => {
    if (t.id !== topikId) return t;
    const diperbarui: TopikDokumen = {
      ...t,
      skorTerakhir: skor,
      riwayatSkor: [...(t.riwayatSkor ?? []), { skor, waktu: new Date().toISOString() }],
    };
    return { ...diperbarui, status: statusTopik(diperbarui) === "selesai" ? "SELESAI" : "BERJALAN" };
  });
  catatAktivitasDi(dok, topikId);
  localStorage.setItem(KEY, JSON.stringify(semua));
  return dok;
}
