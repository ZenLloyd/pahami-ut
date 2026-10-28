/**
 * Simulasi Penyimpanan Autentikasi Klien (Client Storage)
 * Sesuai Aturan Bisnis BP-01, BP-02, BR-22, BR-23, BR-25 Capstone STSI4440
 */

export interface Pengguna {
  nama: string;
  email: string;
  kataSandi: string;
  role: "mahasiswa" | "admin";
  isAktif: boolean;
  dibuatPada: string;
  terakhirAktif?: string;
  jumlahDokumen?: number;
}

const STORAGE_KEY_USERS = "pahami_users_db";
const STORAGE_KEY_SESSION = "pahami_session";
const STORAGE_KEY_VERSION = "pahami_db_version";
const DB_VERSION = "v4_pengguna_uji_tim";

// Data Awal Bawaan Sistem (Mendukung akun demo UT & akun uji tim Wasil)
const DEFAULT_USERS: Pengguna[] = [
  {
    nama: "Abdurahman Ghozali",
    email: "mahasiswa@ecampus.ut.ac.id",
    kataSandi: "rahasia123",
    role: "mahasiswa",
    isAktif: true,
    dibuatPada: "2026-10-01T08:00:00Z",
    terakhirAktif: "2026-10-14T19:30:00Z",
    jumlahDokumen: 1,
  },
  {
    nama: "Mahasiswa Uji Pahami",
    email: "uji.pahami+1@example.com",
    kataSandi: "rahasia123",
    role: "mahasiswa",
    isAktif: true,
    dibuatPada: "2026-10-15T08:00:00Z",
    terakhirAktif: "2026-10-28T16:50:00Z",
    jumlahDokumen: 2,
  },
  {
    nama: "Anisa Putri",
    email: "anisaputri@ecampus.ut.ac.id",
    kataSandi: "rahasia123",
    role: "mahasiswa",
    isAktif: true,
    dibuatPada: "2026-10-03T10:15:00Z",
    terakhirAktif: "2026-10-13T14:20:00Z",
    jumlahDokumen: 4,
  },
  {
    nama: "Joko Susilo",
    email: "josusilo@ecampus.ut.ac.id",
    kataSandi: "rahasia123",
    role: "mahasiswa",
    isAktif: true,
    dibuatPada: "2026-10-05T11:45:00Z",
    terakhirAktif: "2026-10-12T16:00:00Z",
    jumlahDokumen: 3,
  },
  {
    nama: "Siti Rahma",
    email: "siti.rahma@ecampus.ut.ac.id",
    kataSandi: "rahasia123",
    role: "mahasiswa",
    isAktif: true,
    dibuatPada: "2026-10-06T09:30:00Z",
    terakhirAktif: "2026-10-10T11:10:00Z",
    jumlahDokumen: 2,
  },
  {
    nama: "Budi Santoso",
    email: "budsant@ecampus.ut.ac.id",
    kataSandi: "rahasia123",
    role: "mahasiswa",
    isAktif: false, // BR-23: Akun nonaktif
    dibuatPada: "2026-10-07T13:00:00Z",
    terakhirAktif: "2026-10-08T08:45:00Z",
    jumlahDokumen: 1,
  },
  {
    nama: "Admin Pengelola",
    email: "admin@ecampus.ut.ac.id",
    kataSandi: "admin123",
    role: "admin",
    isAktif: true,
    dibuatPada: "2026-09-01T00:00:00Z",
    terakhirAktif: "2026-10-14T20:00:00Z",
  },
  {
    nama: "Admin Uji Pahami",
    email: "uji.pahami+admin@example.com",
    kataSandi: "rahasia123",
    role: "admin",
    isAktif: true,
    dibuatPada: "2026-09-15T00:00:00Z",
    terakhirAktif: "2026-10-28T16:52:00Z",
  },
];

export function getDaftarPengguna(): Pengguna[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const currentVersion = localStorage.getItem(STORAGE_KEY_VERSION);
    const raw = localStorage.getItem(STORAGE_KEY_USERS);

    if (!raw || currentVersion !== DB_VERSION) {
      let users: Pengguna[] = DEFAULT_USERS;
      if (raw) {
        try {
          const existing: Pengguna[] = JSON.parse(raw);
          // Pertahankan akun baru yang pernah didaftarkan user sendiri
          const customUsers = existing.filter(
            (u) =>
              u.email.toLowerCase() !== "mahasiswa@ecampus.ut.ac.id" &&
              u.email.toLowerCase() !== "nonaktif@ecampus.ut.ac.id" &&
              u.email.toLowerCase() !== "budsant@ecampus.ut.ac.id" &&
              u.email.toLowerCase() !== "admin@ecampus.ut.ac.id"
          );
          users = [...DEFAULT_USERS, ...customUsers];
        } catch {
          users = DEFAULT_USERS;
        }
      }
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEY_VERSION, DB_VERSION);
      return users;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

export function simpanPenggunaBaru(nama: string, email: string, kataSandi: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Browser tidak didukung" };
  const users = getDaftarPengguna();
  const emailCek = email.trim().toLowerCase();

  // Cek keunikan email (BR-22 / MSG-A05)
  const sudahAda = users.some((u) => u.email.toLowerCase() === emailCek);
  if (sudahAda) {
    return { success: false, error: "EMAIL_DUPLIKAT" };
  }

  const penggunaBaru: Pengguna = {
    nama: nama.trim(),
    email: emailCek,
    kataSandi,
    role: "mahasiswa", // BR-25: Default peran pendaftaran publik adalah mahasiswa
    isAktif: true,
    dibuatPada: new Date().toISOString(),
  };

  users.push(penggunaBaru);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

  // Set sesi login langsung setelah daftar (Langkah 5 BP-01)
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(penggunaBaru));

  return { success: true };
}

export function verifikasiLogin(email: string, kataSandi: string): {
  success: boolean;
  status?: "SUKSES" | "SALAH" | "NONAKTIF";
  user?: Pengguna;
} {
  const users = getDaftarPengguna();
  const emailCek = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === emailCek);

  // Jika user tidak ada ATAU kata sandi tidak cocok persis -> SALAH (MSG-A01)
  if (!user || user.kataSandi !== kataSandi) {
    return { success: false, status: "SALAH" };
  }

  // Jika akun dinonaktifkan admin -> NONAKTIF (MSG-A02 / BR-23)
  if (!user.isAktif) {
    return { success: false, status: "NONAKTIF", user };
  }

  // Sukses login -> simpan sesi
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
  }

  return { success: true, status: "SUKSES", user };
}

export function getSesiSaatIni(): Pengguna | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function hapusSesi(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }
}

/** Dikirim ke window setiap data sesi berubah, agar Navbar ikut diperbarui. */
export const EVENT_SESI_BERUBAH = "pahami:sesi-berubah";

function simpanPerubahanPengguna(emailAkun: string, ubah: (u: Pengguna) => Pengguna): Pengguna | null {
  const users = getDaftarPengguna();
  const idx = users.findIndex((u) => u.email.toLowerCase() === emailAkun.toLowerCase());
  if (idx === -1) return null;
  const baru = ubah(users[idx]);
  users[idx] = baru;
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(baru));
  window.dispatchEvent(new Event(EVENT_SESI_BERUBAH));
  return baru;
}

/** BP-10: ubah nama (3-60 karakter, divalidasi oleh pemanggil). Email tidak dapat diubah (BR-36). */
export function ubahNamaPengguna(emailAkun: string, namaBaru: string): Pengguna | null {
  return simpanPerubahanPengguna(emailAkun, (u) => ({ ...u, nama: namaBaru.trim() }));
}

/** BP-10: ubah kata sandi setelah sandi lama diverifikasi. */
export function ubahKataSandi(
  emailAkun: string,
  sandiLama: string,
  sandiBaru: string,
): { ok: true } | { ok: false; alasan: "SANDI_LAMA_SALAH" | "AKUN_TIDAK_ADA" } {
  const user = getDaftarPengguna().find((u) => u.email.toLowerCase() === emailAkun.toLowerCase());
  if (!user) return { ok: false, alasan: "AKUN_TIDAK_ADA" };
  if (user.kataSandi !== sandiLama) return { ok: false, alasan: "SANDI_LAMA_SALAH" };
  simpanPerubahanPengguna(emailAkun, (u) => ({ ...u, kataSandi: sandiBaru }));
  return { ok: true };
}

/**
 * BP-11 & BR-23: Aktifkan / Nonaktifkan akun pengguna oleh Admin.
 * BR-24: Akun admin tidak dapat dinonaktifkan.
 */
export function toggleStatusPengguna(
  emailTarget: string
): { ok: true; user: Pengguna } | { ok: false; alasan: string } {
  const users = getDaftarPengguna();
  const idx = users.findIndex((u) => u.email.toLowerCase() === emailTarget.toLowerCase());
  if (idx === -1) return { ok: false, alasan: "Pengguna tidak ditemukan." };

  const target = users[idx];
  if (target.role === "admin") {
    return { ok: false, alasan: "Akun admin tidak dapat dinonaktifkan (BR-24)." };
  }

  const baru: Pengguna = {
    ...target,
    isAktif: !target.isAktif,
  };
  users[idx] = baru;
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

  // Jika akun target yang sedang login, akhiri sesinya bila dinonaktifkan (BR-23)
  const sesi = getSesiSaatIni();
  if (sesi && sesi.email.toLowerCase() === target.email.toLowerCase()) {
    if (!baru.isAktif) {
      hapusSesi();
    } else {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(baru));
    }
    window.dispatchEvent(new Event(EVENT_SESI_BERUBAH));
  }

  return { ok: true, user: baru };
}
