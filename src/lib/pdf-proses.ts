/**
 * Pemrosesan PDF di sisi klien (tanpa AI/backend):
 * - membaca teks per halaman dengan pdf.js
 * - mendeteksi "Kegiatan Belajar N" sebagai pembagi topik
 * - membuat ringkasan ekstraktif (kalimat terpenting berdasarkan frekuensi kata)
 */
import type { TopikDokumen } from "@/lib/dokumen";
import { buatTopikSimulasi } from "@/lib/dokumen";

const STOPWORDS = new Set(
  (
    "yang dan di ke dari untuk pada dengan adalah ini itu atau juga dalam akan " +
    "dapat oleh sebagai karena tidak ada saya kita kamu anda mereka dia nya " +
    "agar bahwa sehingga serta lebih telah sudah masih sangat seperti yaitu " +
    "yakni antara setiap suatu para tersebut dalam maka jika bila apabila " +
    "modul kegiatan belajar halaman bab hal"
  ).split(" "),
);

export interface HasilProses {
  totalHalaman: number;
  topik: TopikDokumen[];
  adaTeks: boolean;
  terdeteksiOtomatis: boolean;
}

export class PdfTanpaTeksError extends Error {}

type OnProgress = (persen: number, tahap: number) => void;

export async function prosesPdf(file: File, onProgress: OnProgress): Promise<HasilProses> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  onProgress(3, 0);
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const total = pdf.numPages;

  const teksHalaman: string[] = [];
  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const teks = content.items
      .map((it) => ("str" in it ? it.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    teksHalaman.push(teks);
    onProgress(5 + Math.round((i / total) * 60), 1);
  }

  const semuaTeks = teksHalaman.join(" ");
  if (semuaTeks.length < 200) {
    throw new PdfTanpaTeksError(
      "PDF ini tidak memiliki teks yang bisa dibaca (kemungkinan hasil scan/gambar). Gunakan PDF yang teksnya bisa diseleksi.",
    );
  }

  onProgress(70, 2);
  const batas = deteksiBatasTopik(teksHalaman);
  const terdeteksiOtomatis = batas !== null;
  const kerangka: TopikDokumen[] = batas
    ? batas.map((b, i) => ({
        id: `kb-${b.nomor}`,
        judul: `Kegiatan Belajar ${b.nomor}`,
        halamanMulai: b.halaman,
        halamanAkhir: i + 1 < batas.length ? batas[i + 1].halaman - 1 : total,
        status: "BELUM" as const,
      }))
    : buatTopikSimulasi(total);

  onProgress(82, 3);
  const topik = kerangka.map((t) => {
    const teks = teksHalaman.slice(t.halamanMulai - 1, t.halamanAkhir).join(" ");
    return { ...t, ...rangkum(teks) };
  });

  onProgress(100, 4);
  return { totalHalaman: total, topik, adaTeks: true, terdeteksiOtomatis };
}

/** Cari halaman tempat tiap "Kegiatan Belajar N" dimulai (judul di awal halaman). */
function deteksiBatasTopik(
  teksHalaman: string[],
): { nomor: number; halaman: number }[] | null {
  const ditemukan = new Map<number, number>();
  teksHalaman.forEach((teks, idx) => {
    const awal = teks.slice(0, 160);
    const m = awal.match(/kegiatan\s+belajar\s+(\d{1,2})/i);
    if (m) {
      const n = Number(m[1]);
      if (!ditemukan.has(n)) ditemukan.set(n, idx + 1);
    }
  });
  if (ditemukan.size < 2) return null;
  const urut = [...ditemukan.entries()]
    .map(([nomor, halaman]) => ({ nomor, halaman }))
    .sort((a, b) => a.halaman - b.halaman);
  // pastikan urutan nomor naik; kalau kacau (mis. daftar isi), batalkan deteksi
  for (let i = 1; i < urut.length; i++) {
    if (urut[i].nomor <= urut[i - 1].nomor || urut[i].halaman === urut[i - 1].halaman) {
      return null;
    }
  }
  return urut.length > 15 ? urut.slice(0, 15) : urut;
}

function rangkum(teks: string): { ringkasan: string[]; kataKunci: string[] } {
  const kalimat = teks
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((k) => k.trim())
    .filter((k) => k.length >= 40 && k.length <= 320);

  const frek = new Map<string, number>();
  for (const w of teks.toLowerCase().match(/[a-zà-ÿ]{4,}/g) ?? []) {
    if (!STOPWORDS.has(w)) frek.set(w, (frek.get(w) ?? 0) + 1);
  }

  const kataKunci = [...frek.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);

  const skor = kalimat.map((k, i) => {
    const kata = k.toLowerCase().match(/[a-zà-ÿ]{4,}/g) ?? [];
    const s = kata.reduce((acc, w) => acc + (frek.get(w) ?? 0), 0) / Math.sqrt(kata.length || 1);
    return { k, i, s };
  });

  const ringkasan = skor
    .sort((a, b) => b.s - a.s)
    .slice(0, 4)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.k);

  return { ringkasan, kataKunci };
}
