/**
 * Katalog Pesan Sistem Resmi
 * Berdasarkan Dokumen Capstone STSI4440 v1.0 (Bagian 6)
 */

export const SYSTEM_MESSAGES = {
  // Validasi Form (MSG-Vxx)
  MSG_V01: (field: string) => `${field} wajib diisi.`,
  MSG_V02: "Format email belum benar, contoh: nama@ecampus.ut.ac.id.",
  MSG_V03: "Nama harus 3–60 karakter.",
  MSG_V04: "Kata sandi minimal 8 karakter dan berisi huruf serta angka.",
  MSG_V05: "Konfirmasi kata sandi tidak sama.",

  // Autentikasi & Akun (MSG-Axx)
  MSG_A01: "Email atau kata sandi salah.",
  MSG_A02: "Akun kamu sedang dinonaktifkan. Hubungi admin untuk informasi lebih lanjut.",
  MSG_A05: "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.",
  MSG_A06: "Jika email terdaftar, tautan atur ulang kata sandi telah dikirim. Periksa juga folder spam.",
  MSG_A07: "Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.",
  MSG_A08: "Tautan sudah kedaluwarsa atau sudah dipakai. Minta tautan baru.",

  // Profil (MSG-Pxx)
  MSG_P01: "Profil berhasil disimpan.",
  MSG_P02: "Kata sandi berhasil diubah.",
  MSG_P03: "Kata sandi lama tidak sesuai.",

  // Pengelolaan Pengguna Admin (MSG-Mxx) & Kuota (MSG-Sxx)
  MSG_M01: (nama: string) => `Nonaktifkan akun ${nama}? Pengguna tidak akan bisa masuk sampai diaktifkan kembali.`,
  MSG_M02: (nama: string) => `Akun ${nama} berhasil dinonaktifkan.`,
  MSG_M03: (nama: string) => `Akun ${nama} berhasil diaktifkan kembali.`,
  MSG_S01: "Pengaturan kuota berhasil disimpan.",

  // Dokumen & Upload (MSG-Uxx)
  MSG_U01: "Hanya file PDF yang dapat diunggah.",
  MSG_U02: (maxMb: number) => `Ukuran file melebihi batas ${maxMb} MB.`,
  MSG_U03: (maxDocs: number) => `Kuota dokumen kamu sudah penuh (${maxDocs} dokumen). Hapus dokumen lama untuk mengunggah yang baru.`,
  MSG_U05: "Unggahan terputus. Periksa koneksi lalu coba lagi.",
  MSG_U06: (maxPages: number, pages: number) => `Dokumen memiliki ${pages} halaman, melebihi batas ${maxPages} halaman.`,
  MSG_U07: "PDF ini berupa hasil scan (gambar) sehingga teksnya tidak dapat dibaca. Unggah PDF berbasis teks.",
  MSG_U08: (title: string, topicsCount: number) => `"${title}" siap dipelajari! Ada ${topicsCount} topik untukmu.`,
  MSG_U09: "Dokumen gagal diproses karena gangguan sistem. Silakan unggah ulang.",

  // Materi Topik (MSG-Bxx)
  MSG_B01: "Materi belum bisa disiapkan. Coba lagi sebentar lagi.",
  MSG_B02: "Menyiapkan materi dari buku… (hanya sekali untuk topik ini)",

  // Latihan & Kuis (MSG-Lxx)
  MSG_L01: "Menyiapkan soal latihan dari buku…",
  MSG_L02: "Soal belum bisa dibuat. Coba lagi.",
  MSG_L03: "Keluar dari latihan? Jawabanmu belum disimpan.",
  MSG_L04: "Topik selesai! Pemahamanmu sudah baik.",
  MSG_L05: "Hampir! Pelajari lagi bagian yang salah lalu coba sekali lagi.",
  MSG_L06: "Topik ini perlu diulang. Baca kembali materinya, kamu pasti bisa.",

  // Tanya AI & Kuota (MSG-Cxx)
  MSG_C02: (max: number) => `Kuota pertanyaan hari ini sudah habis (${max}). Kuota terisi lagi pukul 00.00 WIB.`,
  MSG_C03: "Maaf, aku tidak menemukan pembahasan tentang hal itu di dokumen ini. Coba kata kunci lain atau tanyakan hal yang ada di materi.",
  MSG_C04: "Asisten AI sedang tidak dapat menjawab. Coba lagi.",

  // Empty States (MSG-Exx)
  MSG_E01: "Belum ada dokumen. Unggah PDF pertamamu untuk mulai belajar.",
  MSG_E02: "Belum ada latihan. Kerjakan latihan pertama untuk melihat progresmu.",
  MSG_E03: "Mantap! Tidak ada topik yang perlu diulang.",
  MSG_E04: "Tidak ada pengguna yang cocok dengan pencarian.",

  // Global Error (MSG-Gxx)
  MSG_G01: "Terjadi gangguan koneksi. Coba lagi.",
  MSG_G02: "Data belum bisa dimuat.",
} as const;
