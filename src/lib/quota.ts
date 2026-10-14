/**
 * Pengaturan Kuota & Parameter Sistem (BP-12, BR-29)
 * Standar Tim Capstone STSI4440 Universitas Terbuka
 */

export interface PengaturanKuota {
  maksDokumen: number; // BR-29: 1 - 50 dokumen (default: 5)
  maksUkuranMb: number; // BR-29: 5 - 100 MB (default: 25)
  maksHalaman: number; // BR-29: 10 - 1.000 halaman (default: 100)
  maksPertanyaanAiHarian: number; // BR-29: 10 - 200 pertanyaan/hari (default: 50)
  batasNilaiKkm: number; // BR-13: Nilai kelulusan latihan 50 - 90 (default: 70)
  terakhirDiperbarui?: string; // ISO String
  diperbaruiOleh?: string;
}

export const BATAS_PARAMETER = {
  maksDokumen: {
    min: 1,
    max: 50,
    default: 5,
    satuan: "Dokumen",
    label: "Batas Dokumen per Mahasiswa",
    keterangan: "Jumlah maksimal modul PDF yang boleh disimpan setiap mahasiswa (BR-04, BR-29)",
  },
  maksUkuranMb: {
    min: 5,
    max: 100,
    default: 25,
    satuan: "MB",
    label: "Maksimal Ukuran File PDF",
    keterangan: "Batas kapasitas per berkas modul yang diunggah mahasiswa (BR-02, BR-29)",
  },
  maksHalaman: {
    min: 10,
    max: 1000,
    default: 100,
    satuan: "Halaman",
    label: "Maksimal Halaman per Dokumen",
    keterangan: "Jumlah halaman maksimal yang dapat diekstraksi dan diproses AI (BR-06, BR-29)",
  },
  maksPertanyaanAiHarian: {
    min: 10,
    max: 200,
    default: 50,
    satuan: "Pertanyaan / Hari",
    label: "Batas Harian Tanya AI",
    keterangan: "Kuota interaksi tanya jawab asisten modul per hari per mahasiswa (BR-26, BR-29)",
  },
  batasNilaiKkm: {
    min: 50,
    max: 90,
    default: 70,
    satuan: "Poin (Skor)",
    label: "Batas Nilai Tuntas (KKM)",
    keterangan: "Skor minimum untuk menyelesaikan topik tanpa perlu remedial (BR-13)",
  },
} as const;

export const DEFAULT_PENGATURAN_KUOTA: PengaturanKuota = {
  maksDokumen: 5,
  maksUkuranMb: 25,
  maksHalaman: 100,
  maksPertanyaanAiHarian: 50,
  batasNilaiKkm: 70,
};

const STORAGE_KEY = "pahami_pengaturan_kuota_v1";

export function getPengaturanKuota(): PengaturanKuota {
  if (typeof window === "undefined") return { ...DEFAULT_PENGATURAN_KUOTA };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PENGATURAN_KUOTA };
    const parsed = JSON.parse(raw);
    return {
      maksDokumen:
        typeof parsed.maksDokumen === "number" && !isNaN(parsed.maksDokumen)
          ? parsed.maksDokumen
          : DEFAULT_PENGATURAN_KUOTA.maksDokumen,
      maksUkuranMb:
        typeof parsed.maksUkuranMb === "number" && !isNaN(parsed.maksUkuranMb)
          ? parsed.maksUkuranMb
          : DEFAULT_PENGATURAN_KUOTA.maksUkuranMb,
      maksHalaman:
        typeof parsed.maksHalaman === "number" && !isNaN(parsed.maksHalaman)
          ? parsed.maksHalaman
          : DEFAULT_PENGATURAN_KUOTA.maksHalaman,
      maksPertanyaanAiHarian:
        typeof parsed.maksPertanyaanAiHarian === "number" && !isNaN(parsed.maksPertanyaanAiHarian)
          ? parsed.maksPertanyaanAiHarian
          : DEFAULT_PENGATURAN_KUOTA.maksPertanyaanAiHarian,
      batasNilaiKkm:
        typeof parsed.batasNilaiKkm === "number" && !isNaN(parsed.batasNilaiKkm)
          ? parsed.batasNilaiKkm
          : DEFAULT_PENGATURAN_KUOTA.batasNilaiKkm,
      terakhirDiperbarui: parsed.terakhirDiperbarui,
      diperbaruiOleh: parsed.diperbaruiOleh,
    };
  } catch {
    return { ...DEFAULT_PENGATURAN_KUOTA };
  }
}

export function simpanPengaturanKuota(
  data: Partial<PengaturanKuota>,
  namaAdmin: string = "Admin Pengelola"
): { sukses: boolean; pesan?: string } {
  if (typeof window === "undefined") {
    return { sukses: false, pesan: "Window browser tidak tersedia." };
  }

  // Validasi Batas Nilai
  if (
    data.maksDokumen !== undefined &&
    (data.maksDokumen < BATAS_PARAMETER.maksDokumen.min ||
      data.maksDokumen > BATAS_PARAMETER.maksDokumen.max)
  ) {
    return {
      sukses: false,
      pesan: `Batas dokumen harus berada di antara ${BATAS_PARAMETER.maksDokumen.min} dan ${BATAS_PARAMETER.maksDokumen.max} dokumen.`,
    };
  }

  if (
    data.maksUkuranMb !== undefined &&
    (data.maksUkuranMb < BATAS_PARAMETER.maksUkuranMb.min ||
      data.maksUkuranMb > BATAS_PARAMETER.maksUkuranMb.max)
  ) {
    return {
      sukses: false,
      pesan: `Maksimal ukuran file harus berada di antara ${BATAS_PARAMETER.maksUkuranMb.min} dan ${BATAS_PARAMETER.maksUkuranMb.max} MB.`,
    };
  }

  if (
    data.maksHalaman !== undefined &&
    (data.maksHalaman < BATAS_PARAMETER.maksHalaman.min ||
      data.maksHalaman > BATAS_PARAMETER.maksHalaman.max)
  ) {
    return {
      sukses: false,
      pesan: `Batas halaman harus berada di antara ${BATAS_PARAMETER.maksHalaman.min} dan ${BATAS_PARAMETER.maksHalaman.max} halaman.`,
    };
  }

  if (
    data.maksPertanyaanAiHarian !== undefined &&
    (data.maksPertanyaanAiHarian < BATAS_PARAMETER.maksPertanyaanAiHarian.min ||
      data.maksPertanyaanAiHarian > BATAS_PARAMETER.maksPertanyaanAiHarian.max)
  ) {
    return {
      sukses: false,
      pesan: `Batas tanya AI harus berada di antara ${BATAS_PARAMETER.maksPertanyaanAiHarian.min} dan ${BATAS_PARAMETER.maksPertanyaanAiHarian.max} pertanyaan/hari.`,
    };
  }

  if (
    data.batasNilaiKkm !== undefined &&
    (data.batasNilaiKkm < BATAS_PARAMETER.batasNilaiKkm.min ||
      data.batasNilaiKkm > BATAS_PARAMETER.batasNilaiKkm.max)
  ) {
    return {
      sukses: false,
      pesan: `Batas KKM harus berada di antara skor ${BATAS_PARAMETER.batasNilaiKkm.min} dan ${BATAS_PARAMETER.batasNilaiKkm.max}.`,
    };
  }

  const existing = getPengaturanKuota();
  const baru: PengaturanKuota = {
    ...existing,
    ...data,
    terakhirDiperbarui: new Date().toISOString(),
    diperbaruiOleh: namaAdmin,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(baru));
    return { sukses: true };
  } catch {
    return { sukses: false, pesan: "Gagal menyimpan konfigurasi ke penyimpanan lokal." };
  }
}

export function resetPengaturanKuota(
  namaAdmin: string = "Admin Pengelola"
): PengaturanKuota {
  const defaultBaru: PengaturanKuota = {
    ...DEFAULT_PENGATURAN_KUOTA,
    terakhirDiperbarui: new Date().toISOString(),
    diperbaruiOleh: namaAdmin,
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBaru));
    } catch {
      // ignore
    }
  }
  return defaultBaru;
}
