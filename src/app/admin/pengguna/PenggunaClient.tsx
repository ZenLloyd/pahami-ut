"use client";

import { useEffect, useState, useMemo } from "react";
import { AdminNavbar } from "@/components/AdminNavbar";
import {
  type Pengguna,
  getDaftarPengguna,
  toggleStatusPengguna,
  EVENT_SESI_BERUBAH,
} from "@/lib/auth";
import { SYSTEM_MESSAGES as MSG } from "@/lib/messages";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  X,
  Shield,
  GraduationCap,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";

type FilterStatus = "SEMUA" | "AKTIF" | "NONAKTIF";

export function PenggunaClient() {
  const [daftar, setDaftar] = useState<Pengguna[]>([]);
  const [pencarian, setPencarian] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("SEMUA");
  const [siap, setSiap] = useState(false);

  // Dialog konfirmasi nonaktifkan akun (MSG-M01)
  const [konfirmasiNonaktif, setKonfirmasiNonaktif] = useState<Pengguna | null>(null);

  // Pesan feedback (MSG-M02, MSG-M03)
  const [pesanSukses, setPesanSukses] = useState("");
  const [pesanError, setPesanError] = useState("");

  function muatPengguna() {
    setDaftar(getDaftarPengguna());
  }

  useEffect(() => {
    muatPengguna();
    setSiap(true);
    window.addEventListener(EVENT_SESI_BERUBAH, muatPengguna);
    return () => window.removeEventListener(EVENT_SESI_BERUBAH, muatPengguna);
  }, []);

  // Filter & Search Logic
  const dataFiltered = useMemo(() => {
    return daftar.filter((u) => {
      // Filter status
      if (filter === "AKTIF" && !u.isAktif) return false;
      if (filter === "NONAKTIF" && u.isAktif) return false;

      // Filter query pencarian (nama atau email)
      if (pencarian.trim()) {
        const q = pencarian.toLowerCase();
        const namaCocok = u.nama.toLowerCase().includes(q);
        const emailCocok = u.email.toLowerCase().includes(q);
        if (!namaCocok && !emailCocok) return false;
      }

      return true;
    });
  }, [daftar, filter, pencarian]);

  // Statistik Ringkasan Pengguna (S-15)
  const totalPengguna = daftar.length;
  const totalAktif = daftar.filter((u) => u.isAktif).length;
  const totalNonaktif = daftar.filter((u) => !u.isAktif).length;

  function tampilkanToastSukses(teks: string) {
    setPesanSukses(teks);
    setPesanError("");
    setTimeout(() => setPesanSukses(""), 4000);
  }

  function handleToggleStatus(u: Pengguna) {
    if (u.role === "admin") {
      setPesanError("Akun admin tidak dapat dinonaktifkan (BR-24).");
      setTimeout(() => setPesanError(""), 3500);
      return;
    }

    if (u.isAktif) {
      // Jika akun sedang aktif, munculkan modal konfirmasi MSG-M01
      setKonfirmasiNonaktif(u);
    } else {
      // Jika akun nonaktif, langsung aktifkan kembali
      const res = toggleStatusPengguna(u.email);
      if (res.ok) {
        muatPengguna();
        tampilkanToastSukses(MSG.MSG_M03(u.nama));
      } else {
        setPesanError(res.alasan);
      }
    }
  }

  function konfirmasiNonaktifkanAksi() {
    if (!konfirmasiNonaktif) return;
    const res = toggleStatusPengguna(konfirmasiNonaktif.email);
    if (res.ok) {
      muatPengguna();
      tampilkanToastSukses(MSG.MSG_M02(konfirmasiNonaktif.nama));
    } else {
      setPesanError(res.alasan);
    }
    setKonfirmasiNonaktif(null);
  }

  function formatTanggal(iso?: string) {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  }

  function formatWaktu(iso?: string) {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      <AdminNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-8 space-y-6">
        {/* Header Layar S-15 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-outline-variant">
          <div>
            <div className="text-xs font-mono text-primary mb-1">
              Layar S-15 • Pengelolaan Pengguna (BP-11, BR-23, BR-24)
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Kelola Pengguna
            </h1>
            <p className="text-xs text-on-surface-variant mt-1 max-w-2xl">
              Pantau seluruh akun terdaftar di sistem Pahami, lakukan pencarian nama/email mahasiswa, dan kelola status aktif/nonaktif akun.
            </p>
          </div>
        </div>

        {/* FEEDBACK TOAST / ALERT */}
        {pesanSukses && (
          <div
            role="status"
            className="flex items-center gap-2 p-3.5 rounded-2xl bg-primary/10 border border-primary/30 text-xs text-primary transition animate-in fade-in duration-200"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pesanSukses}</span>
          </div>
        )}

        {pesanError && (
          <div
            role="alert"
            className="flex items-center gap-2 p-3.5 rounded-2xl bg-error/10 border border-error/30 text-xs text-error transition animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pesanError}</span>
          </div>
        )}

        {/* RINGKASAN TOTAL PENGGUNA (S-15) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-on-surface-variant uppercase">
                Total Pengguna
              </span>
              <Users className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-on-surface mt-2">
              {totalPengguna}
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
              Terdaftar dalam sistem Pahami
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-on-surface-variant uppercase">
                Pengguna Aktif
              </span>
              <UserCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-primary mt-2">
              {totalAktif}
            </div>
            <p className="text-[11px] text-primary mt-1 font-mono">
              Bisa mengakses modul & kuis
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-on-surface-variant uppercase">
                Pengguna Nonaktif
              </span>
              <UserX className="w-4 h-4 text-error" />
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-error mt-2">
              {totalNonaktif}
            </div>
            <p className="text-[11px] text-error mt-1 font-mono">
              Akses login diblokir (BR-23)
            </p>
          </div>
        </section>

        {/* PENCARIAN & FILTER TAB (S-15) */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Filter Tab M3 */}
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-full border border-outline-variant text-xs self-start sm:self-auto">
            <button
              onClick={() => setFilter("SEMUA")}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 ${
                filter === "SEMUA"
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span>Semua</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-container-high/80">
                {totalPengguna}
              </span>
            </button>
            <button
              onClick={() => setFilter("AKTIF")}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 ${
                filter === "AKTIF"
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span>Aktif</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-container-high/80">
                {totalAktif}
              </span>
            </button>
            <button
              onClick={() => setFilter("NONAKTIF")}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer flex items-center gap-1.5 ${
                filter === "NONAKTIF"
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span>Nonaktif</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-container-high/80">
                {totalNonaktif}
              </span>
            </button>
          </div>

          {/* Kolom Pencarian Nama atau Email */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full min-h-11 pl-10 pr-9 rounded-full bg-surface-container border border-outline text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
            />
            {pencarian && (
              <button
                onClick={() => setPencarian("")}
                className="w-7 h-7 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                title="Hapus kata kunci pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* DAFTAR PENGGUNA (TABEL DESKTOP & KARTU MOBILE) */}
        <section className="rounded-2xl bg-surface-container border border-outline-variant overflow-hidden">
          {/* STATE HASIL CARI KOSONG (MSG-E04) */}
          {dataFiltered.length === 0 ? (
            <div className="p-8 md:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high text-on-surface-variant flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-on-surface">Pencarian Tidak Ditemukan</p>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                {MSG.MSG_E04}
              </p>
              {pencarian && (
                <button
                  onClick={() => setPencarian("")}
                  className="inline-flex items-center gap-1.5 min-h-10 px-4 rounded-full border border-outline-variant bg-surface text-xs font-medium hover:bg-surface-container-high transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Pencarian</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* TAMPILAN MOBILE: KARTU PENGGUNA */}
              <div className="md:hidden divide-y divide-outline-variant/60">
                {dataFiltered.map((u) => {
                  const isAdmin = u.role === "admin";
                  return (
                    <div key={u.email} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-on-surface truncate">
                              {u.nama}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                                isAdmin
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : "bg-surface-variant text-on-surface-variant border border-outline-variant"
                              }`}
                            >
                              {isAdmin ? "Admin" : "Mahasiswa"}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-on-surface-variant mt-0.5 truncate">
                            {u.email}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium shrink-0 ${
                            u.isAktif
                              ? "bg-primary-container text-on-primary-container"
                              : "bg-error/15 text-error"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.isAktif ? "bg-primary" : "bg-error"
                            }`}
                          />
                          {u.isAktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-on-surface-variant bg-surface p-2.5 rounded-xl border border-outline-variant/50">
                        <div>
                          <span className="block text-[10px] text-on-surface-variant">Dokumen</span>
                          <span className="text-on-surface font-semibold">
                            {isAdmin ? "-" : `${u.jumlahDokumen ?? 0} Dokumen`}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-on-surface-variant">Terakhir Aktif</span>
                          <span className="text-on-surface">
                            {formatTanggal(u.terakhirAktif || u.dibuatPada)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-end">
                        {isAdmin ? (
                          <span className="text-[11px] font-mono text-on-surface-variant inline-flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Dilindungi (BR-24)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`w-full min-h-10 px-4 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                              u.isAktif
                                ? "bg-error/10 text-error border border-error/30 hover:bg-error/20"
                                : "bg-primary text-on-primary hover:opacity-90 shadow-sm"
                            }`}
                          >
                            {u.isAktif ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                <span>Nonaktifkan Akun</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Aktifkan Akun</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TAMPILAN DESKTOP: TABEL PENGGUNA */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-high/60 border-b border-outline-variant text-on-surface-variant font-mono">
                    <tr>
                      <th className="py-3.5 px-4 font-medium">Nama & Email</th>
                      <th className="py-3.5 px-4 font-medium">Peran</th>
                      <th className="py-3.5 px-4 font-medium">Jumlah Dokumen</th>
                      <th className="py-3.5 px-4 font-medium">Bergabung</th>
                      <th className="py-3.5 px-4 font-medium">Terakhir Aktif</th>
                      <th className="py-3.5 px-4 font-medium text-center">Status</th>
                      <th className="py-3.5 px-4 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {dataFiltered.map((u) => {
                      const isAdmin = u.role === "admin";
                      return (
                        <tr
                          key={u.email}
                          className="hover:bg-surface-container-high/40 transition"
                        >
                          <td className="py-3.5 px-4 text-on-surface">
                            <div className="font-semibold text-sm">{u.nama}</div>
                            <div className="font-mono text-[11px] text-on-surface-variant mt-0.5">
                              {u.email}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                                isAdmin
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : "bg-surface-variant text-on-surface-variant border border-outline-variant"
                              }`}
                            >
                              {isAdmin ? <Shield className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                              <span>{isAdmin ? "Admin" : "Mahasiswa"}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-on-surface">
                            {isAdmin ? "-" : `${u.jumlahDokumen ?? 0} Dokumen`}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                            {formatTanggal(u.dibuatPada)}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                            {formatWaktu(u.terakhirAktif || u.dibuatPada)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                                u.isAktif
                                  ? "bg-primary-container text-on-primary-container"
                                  : "bg-error/15 text-error"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.isAktif ? "bg-primary" : "bg-error"
                                }`}
                              />
                              {u.isAktif ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {isAdmin ? (
                              <span
                                title="Akun admin tidak dapat dinonaktifkan (BR-24)"
                                className="text-[11px] font-mono text-on-surface-variant inline-flex items-center gap-1 select-none opacity-60"
                              >
                                <Lock className="w-3 h-3" /> Terkunci
                              </span>
                            ) : (
                              <button
                                onClick={() => handleToggleStatus(u)}
                                className={`min-h-9 px-3.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer ${
                                  u.isAktif
                                    ? "bg-surface hover:bg-error/10 text-error border border-error/30"
                                    : "bg-primary text-on-primary hover:opacity-90 shadow-sm"
                                }`}
                              >
                                {u.isAktif ? (
                                  <>
                                    <UserX className="w-3 h-3" />
                                    <span>Nonaktifkan</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3 h-3" />
                                    <span>Aktifkan</span>
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* FOOTER INFORMASI TOTAL */}
              <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-high/30 flex items-center justify-between text-xs font-mono text-on-surface-variant">
                <span>Menampilkan {dataFiltered.length} dari {totalPengguna} pengguna</span>
                <span>Paging: 20 per halaman</span>
              </div>
            </>
          )}
        </section>
      </main>

      {/* DIALOG KONFIRMASI NONAKTIFKAN PENGGUNA (BR-23 · MSG-M01) */}
      {konfirmasiNonaktif && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-nonaktif-akun"
        >
          <div className="w-full max-w-md rounded-3xl bg-surface-container-high border border-outline-variant p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-error/20 text-error flex items-center justify-center">
              <UserX className="w-6 h-6" />
            </div>

            <div>
              <h2 id="judul-nonaktif-akun" className="text-base font-bold text-on-surface">
                Nonaktifkan Akun Pengguna?
              </h2>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                {MSG.MSG_M01(konfirmasiNonaktif.nama)}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-surface border border-outline-variant/60 text-xs font-mono space-y-1">
              <div><span className="text-on-surface-variant">Nama: </span>{konfirmasiNonaktif.nama}</div>
              <div><span className="text-on-surface-variant">Email: </span>{konfirmasiNonaktif.email}</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setKonfirmasiNonaktif(null)}
                className="min-h-12 px-5 rounded-full text-sm font-medium hover:bg-surface-variant cursor-pointer text-on-surface"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={konfirmasiNonaktifkanAksi}
                className="min-h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer"
              >
                Nonaktifkan Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
