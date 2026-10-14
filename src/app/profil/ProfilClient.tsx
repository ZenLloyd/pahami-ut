"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { type Pengguna, getSesiSaatIni, ubahKataSandi, ubahNamaPengguna } from "@/lib/auth";
import { getDokumenUpload } from "@/lib/dokumen";
import { getPengaturanKuota, DEFAULT_PENGATURAN_KUOTA } from "@/lib/quota";
import { SYSTEM_MESSAGES as MSG } from "@/lib/messages";

const inputKelas =
  "block w-full min-h-12 rounded-xl border border-outline-variant bg-surface px-3 text-sm text-on-surface disabled:opacity-60";

function sandiKuat(s: string) {
  return s.length >= 8 && /[A-Za-z]/.test(s) && /\d/.test(s); // BR-22
}

export function ProfilClient() {
  const [user, setUser] = useState<Pengguna | null>(null);
  const [siap, setSiap] = useState(false);
  const [jumlahDokumen, setJumlahDokumen] = useState(0);
  const [maksDokumen, setMaksDokumen] = useState(DEFAULT_PENGATURAN_KUOTA.maksDokumen);
  const [maksTanya, setMaksTanya] = useState(DEFAULT_PENGATURAN_KUOTA.maksPertanyaanAiHarian);

  const [nama, setNama] = useState("");
  const [errNama, setErrNama] = useState("");
  const [infoProfil, setInfoProfil] = useState("");

  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [errSandi, setErrSandi] = useState<{ lama?: string; baru?: string; konfirmasi?: string }>({});
  const [infoSandi, setInfoSandi] = useState("");

  useEffect(() => {
    const s = getSesiSaatIni();
    setUser(s);
    if (s) setNama(s.nama);
    setJumlahDokumen(getDokumenUpload().filter((d) => d.status !== "GAGAL").length);
    const q = getPengaturanKuota();
    setMaksDokumen(q.maksDokumen);
    setMaksTanya(q.maksPertanyaanAiHarian);
    setSiap(true);
  }, []);

  function simpanProfil(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const n = nama.trim();
    if (n.length < 3 || n.length > 60) {
      setErrNama(MSG.MSG_V03);
      setInfoProfil("");
      return;
    }
    const hasil = ubahNamaPengguna(user.email, n);
    if (hasil) {
      setUser(hasil);
      setNama(hasil.nama);
    }
    setErrNama("");
    setInfoProfil(MSG.MSG_P01);
  }

  function simpanSandi(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const err: typeof errSandi = {};
    if (!lama) err.lama = MSG.MSG_V01("Kata sandi lama");
    if (!baru) err.baru = MSG.MSG_V01("Kata sandi baru");
    else if (!sandiKuat(baru)) err.baru = MSG.MSG_V04;
    if (!konfirmasi) err.konfirmasi = MSG.MSG_V01("Konfirmasi kata sandi");
    else if (konfirmasi !== baru) err.konfirmasi = MSG.MSG_V05;
    setInfoSandi("");
    if (Object.keys(err).length > 0) {
      setErrSandi(err);
      return;
    }
    const hasil = ubahKataSandi(user.email, lama, baru);
    if (!hasil.ok) {
      setErrSandi({ lama: MSG.MSG_P03 });
      return;
    }
    setErrSandi({});
    setLama("");
    setBaru("");
    setKonfirmasi("");
    setInfoSandi(MSG.MSG_P02);
  }

  const persenDokumen = Math.round((jumlahDokumen / (maksDokumen || 1)) * 100);
  const isMahasiswa = user?.role === "mahasiswa";

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-mono text-primary">Layar S-13 • Profil</p>
          <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
        </header>

        {siap && !user && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center text-sm">
            Sesi tidak ditemukan. Silakan masuk kembali.
          </div>
        )}

        {user && (
          <>
            <form
              onSubmit={simpanProfil}
              noValidate
              className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-4"
            >
              <h2 className="text-sm font-semibold">Data Diri</h2>
              <label className="block text-xs text-on-surface-variant space-y-1">
                Nama
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className={inputKelas}
                  aria-invalid={!!errNama}
                />
                {errNama && <span className="block text-error">{errNama}</span>}
              </label>
              <label className="block text-xs text-on-surface-variant space-y-1">
                Email
                <input value={user.email} disabled className={inputKelas} />
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="submit"
                  className="min-h-12 px-6 rounded-full bg-primary text-on-primary text-sm font-semibold cursor-pointer"
                >
                  Simpan
                </button>
                {infoProfil && (
                  <span role="status" className="text-xs text-primary">
                    {infoProfil}
                  </span>
                )}
              </div>
            </form>

            <form
              onSubmit={simpanSandi}
              noValidate
              className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-4"
            >
              <h2 className="text-sm font-semibold">Ubah Kata Sandi</h2>
              {[
                { label: "Kata sandi lama", nilai: lama, set: setLama, err: errSandi.lama, ac: "current-password" },
                { label: "Kata sandi baru", nilai: baru, set: setBaru, err: errSandi.baru, ac: "new-password" },
                { label: "Konfirmasi kata sandi baru", nilai: konfirmasi, set: setKonfirmasi, err: errSandi.konfirmasi, ac: "new-password" },
              ].map((f) => (
                <label key={f.label} className="block text-xs text-on-surface-variant space-y-1">
                  {f.label}
                  <input
                    type="password"
                    value={f.nilai}
                    onChange={(e) => f.set(e.target.value)}
                    autoComplete={f.ac}
                    className={inputKelas}
                    aria-invalid={!!f.err}
                  />
                  {f.err && <span className="block text-error">{f.err}</span>}
                </label>
              ))}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="submit"
                  className="min-h-12 px-6 rounded-full bg-primary text-on-primary text-sm font-semibold cursor-pointer"
                >
                  Ubah kata sandi
                </button>
                {infoSandi && (
                  <span role="status" className="text-xs text-primary">
                    {infoSandi}
                  </span>
                )}
              </div>
            </form>

            {isMahasiswa && (
              <section className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-4">
                <h2 className="text-sm font-semibold">Kuota</h2>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span>Dokumen terpakai</span>
                    <span className="font-mono">
                      {jumlahDokumen} dari {maksDokumen}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
                    <div
                      className={`h-full rounded-full ${persenDokumen >= 80 ? "bg-error" : "bg-primary"}`}
                      style={{ width: `${Math.min(100, persenDokumen)}%` }}
                    />
                  </div>
                  {persenDokumen >= 80 && (
                    <p className="text-[11px] text-error">Kuota dokumen hampir penuh.</p>
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <span>Pertanyaan AI hari ini</span>
                  <span className="font-mono">0 dari {maksTanya}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Hitungan pertanyaan AI baru akurat setelah Tanya AI terhubung ke server. Kuota terisi lagi pukul 00.00 WIB.
                </p>
              </section>
            )}

            <section className="rounded-2xl border border-outline-variant bg-surface-container p-5 space-y-2 text-xs">
              <h2 className="text-sm font-semibold mb-2">Info Akun</h2>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Peran</span>
                <span className="capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Bergabung sejak</span>
                <span>
                  {new Date(user.dibuatPada).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status</span>
                <span>{user.isAktif ? "Aktif" : "Nonaktif"}</span>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
