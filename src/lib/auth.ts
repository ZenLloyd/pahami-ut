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
}

const STORAGE_KEY_USERS = "pahami_users_db";
const STORAGE_KEY_SESSION = "pahami_session";

// Data Awal Bawaan Sistem
const DEFAULT_USERS: Pengguna[] = [
  {
    nama: "Abdurahman Ghozali",
    email: "mahasiswa@ecampus.ut.ac.id",
    kataSandi: "rahasia123",
    role: "mahasiswa",
    isAktif: true,
    dibuatPada: "2026-10-08T00:00:00Z",
  },
  {
    nama: "Budi Santoso",
    email: "nonaktif@ecampus.ut.ac.id",
    kataSandi: "rahasia123",
    role: "mahasiswa",
    isAktif: false, // BR-23: Akun nonaktif
    dibuatPada: "2026-10-08T00:00:00Z",
  },
  {
    nama: "Admin Pengelola",
    email: "admin@ecampus.ut.ac.id",
    kataSandi: "admin123",
    role: "admin",
    isAktif: true,
    dibuatPada: "2026-10-08T00:00:00Z",
  },
];

export function getDaftarPengguna(): Pengguna[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
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
