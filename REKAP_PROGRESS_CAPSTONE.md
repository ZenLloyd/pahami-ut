# LAPORAN REKAP KEMAJUAN FRONTEND CAPSTONE STSI4440
## APLIKASI ASISTEN BELAJAR MANDIRI MODUL UT ("PAHAMI") — KELOMPOK B

---

## 1. Identitas & Susunan Tim Kelompok B

| Kode | Peran | Nama | NIM | Tanggung Jawab Utama |
| :---: | :--- | :--- | :---: | :--- |
| **PM** | Project Manager + FE & BE | **Wasil Mawardi** | 48875372 | Jadwal, koordinasi, kontak mitra, Bab I & V, Berita Acara, PPT, Support Fullstack ke FE, BE |
| **ANL** | Analis Sistem | **Shella Lutfiana** | 50776342 | Wawancara, kebutuhan, use case/BPMN, Bab II–III, artikel ilmiah |
| **UIX** | UI/UX + Frontend | **Latif Muhith W** | 51316387 | Wireframe, mockup, implementasi tampilan aplikasi, poster |
| **BE** | Backend + Database | **Cici Oktaviani** | 51552757 | ERD, logic/API, repo backend, deploy, Bab III implementasi |
| **QA** | QA + Dokumentasi | **Fahri Ramadhan** | 049672806 | Skenario uji, black-box testing, UAT & SUS, Bab IV pengujian, video demo |

---

## 2. Ringkasan Status Proyek Frontend (PIC: Latif Muhith W)

- **Status Pengerjaan**: **100% Selesai (16 dari 16 Layar Terimplementasi)**
- **Kepatuhan Dokumen Acuan**: 100% mematuhi *Panduan Standar Tim v1.0* dan *Breakdown Proses Bisnis v1.0*.
- **Tech Stack**: Next.js 16 (App Router + Turbopack), Tailwind CSS v4, Material Design 3 (Opsi A: Teal `#1F6F5C`), Lucide React.
- **Hasil Build Production**: Lulus bersih tanpa error (`27/27` rute berhasil di-*generate*).
- **Repositori & Deployment**:
  - **GitHub Repo**: [`ZenLloyd/pahami-ut`](https://github.com/ZenLloyd/pahami-ut) (Branch `main`)
  - **Live URL (Vercel)**: [`pahami-ut.vercel.app`](https://pahami-ut.vercel.app)
  - **Arsip Backup Lokal**: `pahami-ut-frontend-source.zip`

---

## 3. Matriks Keterlacakan Lengkap (Traceability Matrix)

Pemetaan antara **Layar (S-01 s.d. S-16)**, **Proses Bisnis (BP-01 s.d. BP-12)**, **Aturan Bisnis (BR-01 s.d. BR-36)**, dan berkas kode implementasinya:

| ID Layar | Nama Layar & Fitur | Proses Bisnis (BP) | Aturan Bisnis (BR) | File Implementasi Utama | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **S-01** | Masuk (Login) Mahasiswa & Admin | BP-01 | BR-18, BR-19, BR-20, BR-23 | `src/app/masuk/page.tsx`<br>`src/lib/auth.ts` | **Selesai** |
| **S-02** | Pendaftaran Akun Mahasiswa Baru | BP-01 | BR-18, BR-22, BR-36 | `src/app/daftar/page.tsx`<br>`src/lib/auth.ts` | **Selesai** |
| **S-03** | Lupa Kata Sandi (Permintaan OTP/Token) | BP-02 | BR-18, BR-22 | `src/app/lupa-sandi/page.tsx` | **Selesai** |
| **S-04** | Atur Ulang Kata Sandi | BP-02 | BR-22 | `src/app/atur-ulang-sandi/page.tsx` | **Selesai** |
| **S-05** | Unggah Dokumen BMP UT (PDF) | BP-03 | BR-01, BR-02, BR-03, BR-04, BR-05, BR-06, BR-07 | `src/app/upload/page.tsx`<br>`src/lib/pdf-proses.ts`<br>`src/lib/dokumen.ts` | **Selesai** |
| **S-06** | Beranda Mahasiswa & Monitoring Modul | BP-04 | BR-04, BR-21, BR-34, BR-35 | `src/app/beranda/BerandaClient.tsx`<br>`src/components/StatistikBerandaSection.tsx` | **Selesai** |
| **S-07** | Detail Dokumen Modul & Jalur Belajar | BP-04 | BR-13, BR-21, BR-35 | `src/app/dokumen/[id]/DetailDokumenClient.tsx` | **Selesai** |
| **S-08** | Ruang Belajar (Poin Kunci & Penjelasan) | BP-05 | BR-08, BR-09, BR-10, BR-11, BR-12 | `src/app/learning/[moduleId]/LearningRoomClient.tsx` | **Selesai** |
| **S-09** | Latihan Soal Kuis Pilihan Ganda | BP-06 | BR-13, BR-14, BR-15, BR-16 | `src/app/latihan/[id]/[topikId]/LatihanClient.tsx` | **Selesai** |
| **S-10** | Hasil Latihan & Pembahasan Soal | BP-06 | BR-13, BR-14, BR-16 | `src/app/latihan/[id]/[topikId]/LatihanClient.tsx` | **Selesai** |
| **S-11** | Tanya Modul Asisten AI (Floating Drawer) | BP-07 | BR-25, BR-26, BR-27, BR-28 | `src/components/TanyaAIDrawer.tsx` | **Selesai** |
| **S-12** | Progres Belajar Mahasiswa (KKM 70 & Remedial) | BP-08 | BR-13, BR-16, BR-34 | `src/app/progres/ProgresClient.tsx` | **Selesai** |
| **S-13** | Profil Mahasiswa & Admin | BP-09, BP-10 | BR-04, BR-17, BR-22, BR-36 | `src/app/profil/ProfilClient.tsx` | **Selesai** |
| **S-14** | Dashboard Ringkasan & Monitoring Admin | BP-11 | BR-27, BR-30, BR-31, BR-32, BR-33 | `src/app/admin/page.tsx` | **Selesai** |
| **S-15** | Kelola Pengguna & Penonaktifan Akun | BP-11 | BR-23, BR-24 | `src/app/admin/pengguna/PenggunaClient.tsx`<br>`src/lib/auth.ts` | **Selesai** |
| **S-16** | Pengaturan Kuota & Parameter Sistem Admin | BP-12 | BR-13, BR-26, BR-29 | `src/app/admin/kuota/KuotaClient.tsx`<br>`src/lib/quota.ts` | **Selesai** |

---

## 4. Penerapan Katalog Pesan Sistem Standar Tim (`MSG-xx`)

Seluruh pesan notifikasi, peringatan, dan empty state mengacu 100% pada katalog resmi di [`src/lib/messages.ts`](src/lib/messages.ts):

- **Validasi & Akun**: `MSG-V01` s.d. `MSG-V03`, `MSG-A01` s.d. `MSG-A04`, `MSG-P01` s.d. `MSG-P03`.
- **Admin**:
  - `MSG-M01`: Konfirmasi nonaktifkan akun mahasiswa.
  - `MSG-M02` & `MSG-M03`: Notifikasi sukses aktif/nonaktif akun.
  - `MSG-S01`: *"Pengaturan kuota berhasil disimpan."*
- **Dokumen & PDF**:
  - `MSG-U01`: Format harus PDF.
  - `MSG-U02`: Peringatan batas MB file.
  - `MSG-U03`: *"Kuota dokumen kamu sudah penuh (X dokumen). Hapus dokumen lama untuk mengunggah yang baru."*
  - `MSG-U07`: Deteksi scan PDF tanpa teks.
  - `MSG-U08`: Sukses ekstrak topik modul BMP.
- **Latihan & Kuis**: `MSG-L01` s.d. `MSG-L06` (termasuk peringatan keluar sebelum selesai `MSG-L03`).
- **Tanya AI**: `MSG-C02` (kuota habis harian), `MSG-C03` (pertanyaan di luar konteks buku modul).
- **Empty State**:
  - `MSG-E01`: Belum ada dokumen di beranda.
  - `MSG-E02`: Belum ada latihan di progres belajar.
  - `MSG-E03`: Mantap! Tidak ada topik yang perlu diulang (semua lulus $\ge 70$).
  - `MSG-E04`: Tidak ada pengguna cocok dengan kata kunci pencarian.

---

## 5. Panduan Lanjutan Koordinasi untuk Rekan Tim

| Rekan Tim | Hal yang Siap Digunakan dari Frontend Saat Ini |
| :--- | :--- |
| **Wasil Mawardi (PM)** | Frontend siap dipresentasikan kapan saja kepada dosen pembimbing. Tidak ada fitur yang "bolong" atau berupa alert dummy. Semua alur bisnis selesai tepat waktu. |
| **Shella Lutfiana (ANL)** | Struktur alur 16 layar dan 12 BP sudah sinkron. Shella dapat langsung mengambil alur UI untuk melengkapi diagram BPMN, use-case description, dan lampiran Bab II & Bab III. |
| **Cici Oktaviani (BE)** | Struktur data model mock di `src/lib/dokumen.ts`, `src/lib/auth.ts`, dan `src/lib/quota.ts` dapat langsung dipakai Cici sebagai acuan skema tabel database (PostgreSQL/Supabase) dan endpoint REST API backend. |
| **Fahri Ramadhan (QA)** | Fahri bisa langsung menyusun tabel pengujian Black-Box Testing, UAT (User Acceptance Testing), dan SUS (System Usability Scale) di Bab IV dengan menguji langsung aplikasi di `pahami-ut.vercel.app`. |
