/**
 * Pembuat soal latihan tanpa AI (isian rumpang -> pilihan ganda).
 * Satu kata penting dihilangkan dari kalimat modul; pengecoh diambil dari
 * kata penting lain di dokumen yang sama. Soal berkualitas tinggi nanti
 * dibuat oleh AI backend (kontrak: POST /api/quiz/generate).
 */
import type { DokumenUpload, TopikDokumen } from "@/lib/dokumen";

export interface SoalLatihan {
  id: string;
  kalimat: string; // dengan "_____" menggantikan jawaban
  kalimatAsli: string;
  pilihan: string[];
  indexBenar: number;
  halaman: string;
}

const SKIP = new Set(
  "adalah yaitu yakni dengan karena sehingga tersebut dalam untuk dapat akan pada dari yang dan atau juga serta sebagai oleh agar bahwa lebih".split(" "),
);

function acak<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function kataKandidat(kalimat: string): string[] {
  return (kalimat.match(/[A-Za-zÀ-ÿ]{6,}/g) ?? []).filter(
    (w) => !SKIP.has(w.toLowerCase()),
  );
}

export function buatSoal(dok: DokumenUpload, topik: TopikDokumen, jumlah = 5): SoalLatihan[] {
  const sumber = (topik.kalimatLatihan?.length ? topik.kalimatLatihan : topik.ringkasan) ?? [];
  const halaman = `Hal. ${topik.halamanMulai}–${topik.halamanAkhir}`;

  // kolam pengecoh: kata kunci & kata panjang dari seluruh dokumen
  const kolam = new Set<string>();
  dok.topik.forEach((t) => {
    t.kataKunci?.forEach((k) => kolam.add(k.toLowerCase()));
    [...(t.kalimatLatihan ?? []), ...(t.ringkasan ?? [])].forEach((k) =>
      kataKandidat(k).forEach((w) => kolam.add(w.toLowerCase())),
    );
  });

  const kunciTopik = new Set((topik.kataKunci ?? []).map((k) => k.toLowerCase()));
  const hasil: SoalLatihan[] = [];

  for (const kalimat of acak(sumber)) {
    if (hasil.length >= jumlah) break;
    const kandidat = kataKandidat(kalimat);
    if (kandidat.length === 0) continue;
    const target =
      kandidat.find((w) => kunciTopik.has(w.toLowerCase())) ??
      [...kandidat].sort((a, b) => b.length - a.length)[0];
    const t = target.toLowerCase();

    const pengecoh = acak([...kolam].filter((w) => w !== t && !kalimat.toLowerCase().includes(w))).slice(0, 3);
    if (pengecoh.length < 3) continue;

    const pilihan = acak([t, ...pengecoh]);
    const rumpang = kalimat.replace(new RegExp(`\\b${target}\\b`, "i"), "_____");
    if (rumpang === kalimat) continue;

    hasil.push({
      id: `s-${hasil.length + 1}`,
      kalimat: rumpang,
      kalimatAsli: kalimat,
      pilihan,
      indexBenar: pilihan.indexOf(t),
      halaman,
    });
  }
  return hasil;
}

export function pesanSkor(skor: number): string {
  if (skor >= 80) return "Sangat baik! Kamu sudah menguasai topik ini.";
  if (skor >= 70) return "Bagus, kamu sudah lulus batas aman 70.";
  if (skor >= 60) return "Hampir! Baca ulang materinya sebentar lalu coba lagi.";
  return "Topik ini perlu diulang. Baca materinya lagi lalu coba latihan kembali.";
}
