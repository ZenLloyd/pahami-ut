"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  type DokumenUpload,
  getDokumenUpload,
  ringkasDokumen,
  statusTopik,
  topikDisarankan,
  ubahNamaDokumen,
  hapusDokumen,
  formatUkuran,
  MAKS_DOKUMEN,
  getMaksDokumen,
  BATAS_SELESAI,
} from "@/lib/dokumen";
import { getSesiSaatIni, EVENT_SESI_BERUBAH } from "@/lib/auth";
import { SYSTEM_MESSAGES as MSG } from "@/lib/messages";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Edit3,
  FileText,
  GraduationCap,
  MoreVertical,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";

export function BerandaClient() {
  const [daftar, setDaftar] = useState<DokumenUpload[]>([]);
  const [namaUser, setNamaUser] = useState("Mahasiswa");
  const [siap, setSiap] = useState(false);
  const [maksDokumen, setMaksDokumen] = useState(MAKS_DOKUMEN);

  // Dialog Edit & Hapus
  const [dokEdit, setDokEdit] = useState<DokumenUpload | null>(null);
  const [judulInput, setJudulInput] = useState("");
  const [errEdit, setErrEdit] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");
  const [dokHapus, setDokHapus] = useState<DokumenUpload | null>(null);

  // Menu popup per dokumen id
  const [menuAktif, setMenuAktif] = useState<string | null>(null);

  function muatData() {
    setDaftar(getDokumenUpload());
    setMaksDokumen(getMaksDokumen());
    const s = getSesiSaatIni();
    if (s) setNamaUser(s.nama);
  }

  useEffect(() => {
    muatData();
    setSiap(true);
    window.addEventListener(EVENT_SESI_BERUBAH, muatData);
    return () => window.removeEventListener(EVENT_SESI_BERUBAH, muatData);
  }, []);

  const namaDepan = namaUser.trim().split(" ")[0] || "Mahasiswa";
  const jumlahDokumen = daftar.filter((d) => d.status !== "GAGAL").length;
  const kuotaPenuh = jumlahDokumen >= maksDokumen;

  // Statistik gabungan seluruh dokumen (S-06)
  const ringkasanSemua = daftar.map(ringkasDokumen);
  const totalTopikSemua = ringkasanSemua.reduce((a, b) => a + b.total, 0);
  const topikSelesaiSemua = ringkasanSemua.reduce((a, b) => a + b.selesai, 0);
  const semuaTopikDilatih = daftar
    .flatMap((d) => d.topik)
    .filter((t) => t.skorTerakhir !== undefined);
  const rataRataSkorSemua = semuaTopikDilatih.length
    ? Math.round(semuaTopikDilatih.reduce((a, t) => a + (t.skorTerakhir ?? 0), 0) / semuaTopikDilatih.length)
    : null;

  // Kumpulan topik lemah dari semua dokumen (BR-13)
  const semuaTopikLemah = daftar.flatMap((d) =>
    d.topik
      .filter((t) => statusTopik(t) === "lemah")
      .map((t) => ({ ...t, dokId: d.id, dokJudul: d.judul }))
  );

  // Aktivitas terakhir (BR-34): cari dokumen dengan aktivitas terbaru
  const aktivitasTerakhir = (() => {
    const kandidat = daftar
      .filter((d) => d.status === "SIAP" && d.aktivitasTerakhir)
      .sort((a, b) =>
        (b.aktivitasTerakhir?.waktu ?? "").localeCompare(a.aktivitasTerakhir?.waktu ?? "")
      );
    if (kandidat.length === 0) return null;
    const dokTerpilih = kandidat[0];
    const topikTerpilih = dokTerpilih.topik.find(
      (t) => t.id === dokTerpilih.aktivitasTerakhir?.topikId
    );
    if (!topikTerpilih) return null;
    return {
      dokumen: dokTerpilih,
      topik: topikTerpilih,
    };
  })();

  function handleSimpanEdit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!dokEdit) return;
    const res = ubahNamaDokumen(dokEdit.id, judulInput);
    if (!res.ok) {
      setErrEdit(res.pesan);
      return;
    }
    setPesanSukses("Nama dokumen berhasil diubah."); // MSG-D01
    setDokEdit(null);
    setErrEdit("");
    muatData();
    setTimeout(() => setPesanSukses(""), 3500);
  }

  function handleKonfirmasiHapus() {
    if (!dokHapus) return;
    hapusDokumen(dokHapus.id);
    setDokHapus(null);
    setPesanSukses("Dokumen berhasil dihapus."); // MSG-D03
    muatData();
    setTimeout(() => setPesanSukses(""), 3500);
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-6">
        {/* S-06: Sapaan {nama depan} & Tombol Upload PDF (BR-04) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-outline-variant">
          <div>
            <div className="text-xs font-mono text-primary mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Halo, {namaDepan}! Tetap semangat belajar mandiri hari ini.</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Beranda Mahasiswa
            </h1>
            <p className="text-xs text-on-surface-variant mt-1 max-w-2xl">
              Layar S-06 • Pantau capaian topik modul, latihan kuis mandiri, dan kelola dokumen belajarmu.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Tombol Upload PDF dengan proteksi kuota (BR-04) */}
            {kuotaPenuh ? (
              <button
                disabled
                title={`Kuota dokumen kamu sudah penuh (${maksDokumen} dokumen). Hapus dokumen lama untuk mengunggah yang baru.`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant opacity-50 cursor-not-allowed text-xs font-medium"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF</span>
                <span className="text-[10px] font-mono">(Penuh)</span>
              </button>
            ) : (
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF</span>
              </Link>
            )}

            <Link
              href="/progres"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant text-xs font-medium transition"
            >
              <span>Lihat Progres</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* PESAN SUKSES / NOTIFIKASI */}
        {pesanSukses && (
          <div
            role="status"
            className="flex items-center gap-2 p-3.5 rounded-2xl bg-primary/10 border border-primary/30 text-xs text-primary"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pesanSukses}</span>
          </div>
        )}

        {/* KONDISI KOSONG (MSG-E01): Belum ada dokumen */}
        {siap && daftar.length === 0 && (
          <section className="rounded-3xl border border-outline-variant bg-surface-container p-8 md:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h2 className="text-base font-bold text-on-surface">Belum Ada Dokumen</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {MSG.MSG_E01}
              </p>
            </div>
            <div>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 min-h-12 px-6 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Upload PDF Pertama</span>
              </Link>
            </div>
          </section>
        )}

        {/* JIKA SUDAH ADA DOKUMEN */}
        {daftar.length > 0 && (
          <>
            {/* KARTU LANJUTKAN BELAJAR (BR-34): Disembunyikan bila belum ada aktivitas */}
            {aktivitasTerakhir && (
              <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-primary font-semibold uppercase tracking-wider">
                          Lanjutkan Belajar (Aktivitas Terakhir)
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-on-surface mt-0.5">
                        {aktivitasTerakhir.topik.judul}
                      </h2>
                      <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                        {aktivitasTerakhir.dokumen.judul} • Hal. {aktivitasTerakhir.topik.halamanMulai}–{aktivitasTerakhir.topik.halamanAkhir}
                        {aktivitasTerakhir.topik.skorTerakhir !== undefined && (
                          <span> • Skor Terakhir: {aktivitasTerakhir.topik.skorTerakhir}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/learning/${aktivitasTerakhir.dokumen.id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs transition shadow-sm shrink-0"
                  >
                    <span>Lanjut Belajar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </section>
            )}

            {/* 4 KARTU STATISTIK RESMI (BR-13 s.d. BR-15) */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
                <div className="text-xs font-mono text-on-surface-variant uppercase">
                  Dokumen Tersimpan
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight text-on-surface mt-2">
                  {jumlahDokumen}{" "}
                  <span className="text-sm font-normal text-on-surface-variant">
                    / {maksDokumen} Kuota
                  </span>
                </div>
                <div className="text-xs text-primary mt-1 font-mono">
                  {jumlahDokumen} dari {maksDokumen} dokumen terpakai
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
                <div className="text-xs font-mono text-on-surface-variant uppercase">
                  Topik Selesai
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight text-primary mt-2">
                  {topikSelesaiSemua}{" "}
                  <span className="text-sm font-normal text-on-surface-variant">
                    / {totalTopikSemua} Topik
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant mt-1 font-mono">
                  Skor ≥ {BATAS_SELESAI} (BR-13)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
                <div className="text-xs font-mono text-on-surface-variant uppercase">
                  Rata-rata Skor
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight text-on-surface mt-2">
                  {rataRataSkorSemua !== null ? rataRataSkorSemua : "-"}{" "}
                  <span className="text-sm font-normal text-on-surface-variant">
                    / 100
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant mt-1 font-mono">
                  Batas Lulus: ≥ {BATAS_SELESAI}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
                <div className="text-xs font-mono text-on-surface-variant uppercase">
                  Topik Perlu Diulang
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight text-amber-300 mt-2">
                  {semuaTopikLemah.length} Topik
                </div>
                <div className="text-xs text-on-surface-variant mt-1 font-mono">
                  Akurasi belum optimal
                </div>
              </div>
            </section>

            {/* PERINGATAN TOPIK LEMAH (BR-13) / MSG-E03 JIKA BERSIH */}
            {semuaTopikLemah.length > 0 ? (
              <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-on-surface">
                      Diagnostik Belajar: {semuaTopikLemah.length} Topik Perlu Penguatan (BR-13)
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Berdasarkan latihan mandiri, kamu disarankan mempelajari ulang konsep di bawah ini:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {semuaTopikLemah.slice(0, 4).map((topic) => (
                    <div
                      key={`${topic.dokId}-${topic.id}`}
                      className="p-3.5 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-on-surface truncate">
                          {topic.judul}
                        </div>
                        <div className="text-[11px] text-on-surface-variant font-mono mt-0.5 truncate">
                          {topic.dokJudul} • Skor:{" "}
                          <span className="text-amber-300 font-semibold">
                            {topic.skorTerakhir ?? "-"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link
                          href={`/learning/${topic.dokId}`}
                          className="px-3 py-1.5 text-xs rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant font-medium transition"
                        >
                          Pelajari
                        </Link>
                        <Link
                          href={`/latihan/${topic.dokId}/${topic.id}`}
                          className="px-3 py-1.5 text-xs rounded-full bg-primary text-on-primary font-semibold transition"
                        >
                          Latihan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : semuaTopikDilatih.length > 0 ? (
              <section className="p-4 rounded-2xl bg-surface-container border border-outline-variant flex items-center gap-3 text-xs text-primary">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{MSG.MSG_E03}</span>
              </section>
            ) : null}

            {/* DAFTAR DOKUMEN MODUL MAHASISWA (S-06) */}
            <section className="rounded-2xl bg-surface-container border border-outline-variant">
              <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-sm font-semibold text-on-surface">
                    Daftar Dokumen Modul (BMP UT)
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Dokumen privat mahasiswa yang diolah dan siap dipelajari
                  </p>
                </div>
                <span className="text-xs font-mono text-on-surface-variant bg-surface-container-high border border-outline-variant px-2.5 py-1 rounded-full">
                  {jumlahDokumen} dari {maksDokumen} Dokumen Terpakai
                </span>
              </div>

              {/* List Kartu Dokumen (Varian Siap, Diproses, Gagal) */}
              <ul className="divide-y divide-outline-variant/60 rounded-b-2xl">
                {daftar.map((d) => {
                  const r = ringkasDokumen(d);
                  const isMenuBuka = menuAktif === d.id;

                  return (
                    <li
                      key={d.id}
                      className={`p-4 md:p-5 hover:bg-surface-container-high/40 transition first:rounded-none last:rounded-b-2xl ${
                        isMenuBuka ? "relative z-30" : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                href={`/dokumen/${d.id}`}
                                className="text-sm font-semibold text-on-surface hover:text-primary transition truncate"
                              >
                                {d.judul}
                              </Link>
                              {d.status === "SIAP" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  Siap dipelajari
                                </span>
                              ) : d.status === "DIPROSES" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container text-on-surface text-[10px] font-mono">
                                  Sedang diproses
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/20 text-error text-[10px] font-mono">
                                  Gagal diproses
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">
                              {d.namaFile} • {d.totalHalaman} Halaman • {formatUkuran(d.ukuranBytes)}
                            </p>
                          </div>
                        </div>

                        {/* Progres Topik & Menu Tindakan */}
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="text-right hidden sm:block">
                            <div className="text-xs font-mono font-semibold">
                              {r.selesai} / {r.total} Topik Selesai
                            </div>
                            <div className="w-28 bg-surface-variant h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-300"
                                style={{ width: `${r.persen}%` }}
                              />
                            </div>
                          </div>

                          <Link
                            href={`/dokumen/${d.id}`}
                            className="min-h-10 px-4 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant text-xs font-medium inline-flex items-center gap-1.5 transition"
                          >
                            <span>Detail</span>
                            <ArrowRight className="w-3.5 h-3.5 text-primary" />
                          </Link>

                          {/* Menu ... (Ganti Nama, Hapus Dokumen) */}
                          <div className="relative">
                            <button
                              onClick={() => setMenuAktif(isMenuBuka ? null : d.id)}
                              className="w-9 h-9 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface transition cursor-pointer"
                              title="Tindakan dokumen"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuBuka && (
                              <>
                                {/* Backdrop transparan untuk klik-luar */}
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() => setMenuAktif(null)}
                                />

                                <div className="absolute right-0 top-11 z-40 w-48 rounded-2xl bg-surface-container-high border border-outline-variant shadow-2xl p-1.5 text-xs space-y-1">
                                  <button
                                    onClick={() => {
                                      setDokEdit(d);
                                      setJudulInput(d.judul);
                                      setErrEdit("");
                                      setMenuAktif(null);
                                    }}
                                    className="w-full px-3 py-2.5 rounded-xl text-left hover:bg-surface-variant flex items-center gap-2 cursor-pointer font-medium text-on-surface"
                                  >
                                    <Edit3 className="w-4 h-4 text-primary" />
                                    <span>Ganti Nama</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDokHapus(d);
                                      setMenuAktif(null);
                                    }}
                                    className="w-full px-3 py-2.5 rounded-xl text-left text-error hover:bg-error/15 flex items-center gap-2 cursor-pointer font-medium"
                                  >
                                    <Trash2 className="w-4 h-4 text-error" />
                                    <span>Hapus Dokumen</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}
      </main>

      {/* DIALOG GANTI NAMA (BP-09 · BR-21 · MSG-D01) */}
      {dokEdit && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-edit-beranda"
        >
          <form
            onSubmit={handleSimpanEdit}
            className="w-full max-w-md rounded-3xl bg-surface-container-high border border-outline-variant p-6 space-y-4"
          >
            <h2 id="judul-edit-beranda" className="text-base font-bold">Ganti Nama Dokumen</h2>
            <p className="text-xs text-on-surface-variant">
              Sesuaikan nama modul agar lebih mudah dikenali (3–100 karakter).
            </p>
            <div>
              <input
                type="text"
                value={judulInput}
                onChange={(e) => setJudulInput(e.target.value)}
                className="w-full min-h-12 px-4 rounded-2xl bg-surface border border-outline focus:border-primary text-sm text-on-surface focus:outline-none"
                placeholder="Masukkan judul dokumen..."
                maxLength={100}
                autoFocus
              />
              {errEdit && (
                <p className="text-xs text-error mt-1.5">{errEdit}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDokEdit(null)}
                className="min-h-12 px-5 rounded-full text-sm font-medium hover:bg-surface-variant cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-12 px-6 rounded-full bg-primary text-on-primary text-sm font-semibold cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DIALOG HAPUS DOKUMEN (MSG-D02, MSG-D03) */}
      {dokHapus && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-hapus-beranda"
        >
          <div className="w-full max-w-md rounded-3xl bg-surface-container-high border border-outline-variant p-6 space-y-4">
            <h2 id="judul-hapus-beranda" className="text-base font-bold text-error">Hapus Dokumen?</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Hapus &quot;{dokHapus.judul}&quot;? Semua topik, kuis, dan riwayat tanya AI yang terkait akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setDokHapus(null)}
                className="min-h-12 px-5 rounded-full text-sm font-medium hover:bg-surface-variant cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleKonfirmasiHapus}
                className="min-h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
