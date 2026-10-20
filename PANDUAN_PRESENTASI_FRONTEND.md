# PANDUAN & NASKAH PRESENTASI CAPSTONE STSI4440
## BAGIAN UI/UX & FRONTEND DEVELOPMENT (PIC: LATIF MUHITH W)
**Aplikasi**: Pahami — Asisten Belajar Mandiri Modul BMP Universitas Terbuka  
**Repositori**: [github.com/ZenLloyd/pahami-ut](https://github.com/ZenLloyd/pahami-ut) | **Demo**: [pahami-ut.vercel.app](https://pahami-ut.vercel.app)

---

## 1. Strategi & Alokasi Waktu (Estimasi 3–5 Menit)

Presentasi bagian Frontend berfokus pada **tiga hal**:
1. **Mengapa desainnya seperti ini?** (Filosofi UI/UX, kenyamanan membaca mahasiswa UT).
2. **Fitur apa saja yang dibangun?** (Demo alur belajar mahasiswa & admin).
3. **Bagaimana kualitas kodenya?** (Arsitektur Next.js 16, TypeScript, kepatuhan Aturan Bisnis `BR`).

---

## 2. Naskah Ucap Kata Demi Kata (*Spoken Script*)

### Bagian 1: Pembukaan & Filosofi UI/UX (00:00 - 00:45)
> *"Terima kasih atas kesempatannya. Perkenalkan, saya Latif Muhith Wardhana, selaku PIC UI/UX dan Frontend pada proyek Capstone ini.*
>
> *Dalam merancang antarmuka aplikasi **Pahami**, fokus utama kami adalah menjawab masalah mahasiswa UT yang sering mengalami kelelahan mata dan kognitif saat membaca modul BMP ratusan halaman secara mandiri.*
>
> *Oleh karena itu, kami menerapkan sistem desain **Google Material Design 3 (M3)** dengan palet warna resmi **Deep Teal (`#1F6F5C`)**—warna hijau teduh yang terbukti secara visual nyaman untuk membaca jangka panjang (*low eye-strain*). Seluruh antarmuka kami bangun dengan prinsip **Mobile-First Responsive**, sehingga mahasiswa dapat belajar dengan nyaman baik lewat smartphone di sela-sela aktivitas, maupun di laptop saat sesi belajar intensif."*

---

### Bagian 2: Demo Alur Kunci Mahasiswa (00:45 - 02:15)
*(Tampilkan layar browser di https://pahami-ut.vercel.app)*

> *"Berikut adalah alur belajar yang telah kami implementasikan secara lengkap:*
>
> 1. **Layar S-05 (Upload Modul Cerdas)**: 
>    *Ketika mahasiswa mengunggah PDF modul, sistem memvalidasi batas kapasitas (25 MB) dan mengekstrak teks menjadi 5 tahapan animasi stepper. Modul dipotong otomatis menjadi kegiatan-kegiatan belajar kecil yang terarah.*
> 2. **Layar S-07 & S-08 (Jalur Belajar & Ruang Baca)**: 
>    *Di sini mahasiswa tidak lagi melihat teks tebal yang monoton, melainkan poin kunci (*key takeaways*), kata kunci, dan penjelasan konsep yang ringkas.*
> 3. **Layar S-11 (Asisten AI Grounded Bersitasi)**: 
>    *Saat mahasiswa bingung, mereka bisa membuka drawer Tanya AI. AI kami bukan ChatGPT umum yang rentan berhalusinasi, melainkan **terikat 100% pada isi buku modul**, dan selalu menyertakan **Chip Sitasi Halaman `[Hal. xx ↗]`** agar mahasiswa dapat langsung mencocokkan ke modul asli.*
> 4. **Layar S-09, S-10, & S-12 (Kuis & Progres Remedial)**: 
>    *Mahasiswa dievaluasi melalui 5 kuis adaptif. Sesuai Aturan Bisnis `BR-13`, batas nilai tuntas kelulusan kami tetapkan pada KKM 70. Di Layar S-12, grafik bar dilengkapi garis batas KKM 70. Jika nilai di bawah 70, topik otomatis masuk ke seksi **'Perlu Penguatan'** dengan tombol aksi 'Baca Ulang' dan 'Ulangi Latihan'."*

---

### Bagian 3: Demo Alur Pengelolaan Administrator (02:15 - 03:00)
*(Buka layar https://pahami-ut.vercel.app/admin)*

> *"Selain mahasiswa, kami juga membangun panel administrator yang lengkap:*
>
> 1. **Layar S-14 (Dashboard Monitoring)**: 
>    *Menampilkan metrik agregat total pengguna, dokumen PDF, volume pertanyaan AI, dan estimasi biaya komputasi AI (~Rp300/tanya sesuai `BR-27`). Sesuai aturan privasi `BR-06`, admin hanya melihat data statistik dan tidak dapat membaca isi dokumen privat mahasiswa.*
> 2. **Layar S-15 (Kelola Pengguna)**: 
>    *Admin dapat memoderasi akun mahasiswa dengan fitur pencarian instan dan penonaktifan akun dengan modal konfirmasi `MSG-M01`. Kami juga menerapkan proteksi `BR-24` di mana akun admin kebal dan terkunci permanen.*
> 3. **Layar S-16 (Pengaturan Kuota Dinamis)**: 
>    *Admin dapat menyesuaikan kuota dokumen (1–50), batas ukuran file, hingga batas tanya AI per hari via slider interaktif yang langsung tersinkronisasi ke seluruh layar mahasiswa."*

---

### Bagian 4: Sorotan Kode & Kualitas Teknis Frontend (03:00 - 04:00)
*(Buka Visual Studio Code dan tunjukkan struktur folder `src/`)*

> *"Dari segi arsitektur teknis dan kode pemrograman:*
>
> 1. **Tech Stack Modern**: 
>    *Kami menggunakan **Next.js 16 (App Router + Turbopack)** dengan **Tailwind CSS v4** dan **TypeScript**. Seluruh 27 rute berhasil dikompilasi statis dan lolos build production 100% tanpa error.*
> 2. **Kepatuhan Katalog Pesan (`messages.ts`)**: 
>    *Kami tidak melakukan hardcode teks pesan error di komponen. Semua notifikasi, peringatan, dan empty state dikelola terpusat di `src/lib/messages.ts` (dari `MSG-V01` sampai `MSG-E04`), menjamin konsistensi UX di seluruh aplikasi.*
> 3. **Traceability Matriks Bisnis**: 
>    *Setiap aturan bisnis dari `BR-01` sampai `BR-36` tertanam jelas di kode logic, misalnya fungsi `statusTopik()` di `dokumen.ts` untuk KKM 70, proteksi kuota di `quota.ts`, serta validasi kekuatan kata sandi di `auth.ts`.*
> 4. **API Ready**: 
>    *Struktur state management dan penyimpanan mock telah dirancang modular, sehingga ketika tim Backend menyelesaikan endpoint REST API, peralihan dari storage lokal ke live API dapat dilakukan tanpa mengubah struktur komponen antarmuka."*

---

### Bagian 5: Penutup (04:00 - 04:20)
> *"Secara keseluruhan, seluruh 16 layar yang disyaratkan oleh dokumen tim telah selesai diimplementasikan 100% dan sudah aktif digunakan. Demikian presentasi dari bagian UI/UX dan Frontend, selanjutnya saya kembalikan ke rekan saya untuk bagian Backend / QA. Terima kasih."*

---

## 3. Contekan Menjawab Pertanyaan Dosen Penguji (*Q&A Cheat Sheet*)

### Q1: *"Kenapa memilih Next.js 16 dan bukan React SPA biasa (Vite)?"*
> **Jawaban**: 
> *"Next.js 16 dengan Turbopack memberikan keunggulan performa kompilasi yang sangat cepat, optimasi rute otomatis (Partial Prerendering / Static Generation), dan struktur App Router yang rapi. Selain itu, Next.js memudahkan transisi ke Server-Side Rendering (SSR) dan Server Actions saat integrasi backend penuh nanti."*

### Q2: *"Bagaimana Anda memastikan aplikasi ini ramah pengguna di ponsel (Mobile-Friendly)?"*
> **Jawaban**: 
> *"Kami merancang dengan pendekatan Mobile-First. Kami menggunakan Bottom Navigation Bar di mobile yang berganti menjadi Navbar di desktop, ukuran target sentuh tombol minimal 48px, drawer tanya AI yang responsif (full-height sheet di ponsel), serta tabel data yang otomatis bertransformasi menjadi kartu (cards) pada layar kecil."*

### Q3: *"Bagaimana aplikasi menjaga integritas data jika backend belum terhubung penuh?"*
> **Jawaban**: 
> *"Kami membangun state management berbasis storage adapter yang reaktif di `src/lib/dokumen.ts` dan `src/lib/quota.ts`. Semua data tersimpan terstruktur dalam format JSON yang identik dengan skema tabel database Supabase/PostgreSQL yang dirancang rekan kami di backend. Jadi ketika endpoint backend live, kami hanya perlu menukar fungsi adapter tanpa merombak tampilan UI."*

### Q4: *"Kenapa AI harus dibatasi hanya pada dokumen PDF yang diunggah?"*
> **Jawaban**: 
> *"Tujuan aplikasi ini adalah membantu mahasiswa lulus ujian mata kuliah UT. Materi ujian UT bersumber dari Buku Materi Pokok (BMP). Jika menggunakan model AI bebas di internet, jawabannya sering tidak sesuai dengan definisi yang diujikan dalam kurikulum UT dan rentan halusinasi. Dengan pendekatan RAG Grounded bersitasi halaman, jawaban dijamin 100% valid dari modul UT."*
