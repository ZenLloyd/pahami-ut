"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSesiSaatIni, EVENT_SESI_BERUBAH } from "@/lib/auth";
import { getDokumenUpload, getMaksDokumen, MAKS_DOKUMEN, type DokumenUpload } from "@/lib/dokumen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNav } from "@/components/BottomNav";
import { LogoutModal } from "@/components/LogoutModal";
import { LogoUT } from "@/components/LogoUT";
import {
  Layers,
  BarChart3,
  Upload,
  LogOut,
  User,
  FileText,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

const SIDEBAR_PREF_KEY = "pahami_sidebar_collapsed";

export function Navbar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [nama, setNama] = useState("Mahasiswa");
  const [email, setEmail] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dokumenList, setDokumenList] = useState<DokumenUpload[]>([]);
  const [maksDokumen, setMaksDokumen] = useState(MAKS_DOKUMEN);

  useEffect(() => {
    const muat = () => {
      const s = getSesiSaatIni();
      if (s) {
        setNama(s.nama);
        setEmail(s.email);
      }
      setDokumenList(getDokumenUpload().filter((d) => d.status !== "GAGAL"));
      setMaksDokumen(getMaksDokumen());
    };
    muat();

    try {
      const savedPref = localStorage.getItem(SIDEBAR_PREF_KEY);
      if (savedPref === "true") setCollapsed(true);
    } catch {
      // ignore
    }

    window.addEventListener(EVENT_SESI_BERUBAH, muat);
    return () => window.removeEventListener(EVENT_SESI_BERUBAH, muat);
  }, [pathname]);

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_PREF_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const firstDocId = dokumenList[0]?.id || "mod-01";
  const jumlahDokumen = dokumenList.length;
  const persenKuota = Math.min(100, Math.round((jumlahDokumen / (maksDokumen || 1)) * 100));

  const mainMenuItems = [
    {
      label: "Beranda",
      href: "/beranda",
      icon: Layers,
      badge: "S-06",
      isActive: pathname === "/beranda" || pathname === "/dashboard",
    },
    {
      label: "Upload Modul PDF",
      href: "/upload",
      icon: Upload,
      badge: "S-11",
      isActive: pathname === "/upload",
    },
    {
      label: "Progres Belajar",
      href: "/progres",
      icon: BarChart3,
      badge: "S-12",
      isActive: pathname === "/progres",
    },
    {
      label: "Ruang Baca & AI",
      href: `/learning/${firstDocId}`,
      icon: Sparkles,
      badge: "S-08",
      isActive: pathname.startsWith("/learning"),
    },
  ];

  const accountMenuItems = [
    {
      label: "Profil & Sandi",
      href: "/profil",
      icon: User,
      badge: "S-13",
      isActive: pathname === "/profil",
    },
  ];

  const halamanSekarang =
    pathname === "/beranda"
      ? "Beranda Mahasiswa (S-06)"
      : pathname === "/upload"
      ? "Unggah Dokumen PDF (S-11)"
      : pathname === "/progres"
      ? "Progres Belajar & Evaluasi (S-12)"
      : pathname === "/profil"
      ? "Profil & Keamanan Akun (S-13)"
      : pathname.startsWith("/dokumen/")
      ? "Detail Dokumen & Jalur Belajar (S-07)"
      : pathname.startsWith("/latihan/")
      ? "Latihan Soal & Pembahasan (S-09 / S-10)"
      : "Ruang Belajar Mandiri";

  return (
    <>
      {/* 1. SIDEBAR KIRI DESKTOP (Material Design 3 Navigation Drawer / Rail) */}
      <aside
        data-app-sidebar={collapsed ? "collapsed" : "expanded"}
        aria-label="Navigasi Samping Utama"
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 z-50 bg-surface-container border-r border-outline-variant select-none transition-all duration-200 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-3.5 border-b border-outline-variant flex items-center justify-between shrink-0">
          {!collapsed && (
            <Link href="/beranda" className="flex items-center gap-2.5 hover:opacity-85 transition min-w-0">
              <LogoUT />
              <div className="truncate">
                <span className="font-bold text-on-surface tracking-tight text-sm block leading-none">
                  Pahami
                </span>
                <span className="text-[10px] font-mono text-primary mt-0.5 block">
                  Mahasiswa UT
                </span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/beranda" className="mx-auto hover:opacity-85 transition" title="Pahami UT">
              <LogoUT />
            </Link>
          )}

          {!collapsed && (
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition cursor-pointer shrink-0"
              title="Kecilkan Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tombol Expand jika Collapsed */}
        {collapsed && (
          <div className="px-2 pt-3 flex justify-center">
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition cursor-pointer"
              title="Perluas Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Daftar Menu Navigasi */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Grup 1: Menu Utama */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-on-surface-variant/80">
                Menu Belajar
              </div>
            )}
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? `${item.label} (${item.badge})` : undefined}
                  className={`flex items-center gap-3 rounded-2xl text-xs font-medium transition ${
                    collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3.5 py-2.5"
                  } ${
                    item.isActive
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="text-[10px] font-mono opacity-75">{item.badge}</span>
                    </>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Grup 2: Modul Terbaru Mahasiswa (Tampil saat Expanded) */}
          {!collapsed && dokumenList.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 pb-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-on-surface-variant/80">
                <span>Modul Saya</span>
                <span>{jumlahDokumen}/{maksDokumen}</span>
              </div>
              {dokumenList.slice(0, 3).map((dok) => {
                const aktifDok = pathname === `/dokumen/${dok.id}`;
                return (
                  <Link
                    key={dok.id}
                    href={`/dokumen/${dok.id}`}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs transition ${
                      aktifDok
                        ? "bg-secondary-container text-on-surface font-semibold"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate flex-1">{dok.judul}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Grup 3: Akun & Pengaturan */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-on-surface-variant/80">
                Pengaturan Akun
              </div>
            )}
            {accountMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? `${item.label} (${item.badge})` : undefined}
                  className={`flex items-center gap-3 rounded-2xl text-xs font-medium transition ${
                    collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3.5 py-2.5"
                  } ${
                    item.isActive
                      ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="text-[10px] font-mono opacity-75">{item.badge}</span>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Ringkasan Kuota & Profil */}
        <div className="p-3 border-t border-outline-variant space-y-3 shrink-0">
          {!collapsed && (
            <div className="p-3 rounded-2xl bg-surface border border-outline-variant/70 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-on-surface-variant font-medium">Kuota Dokumen</span>
                <span className="font-mono font-semibold text-primary">
                  {jumlahDokumen}/{maksDokumen}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-variant overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    persenKuota >= 80 ? "bg-error" : "bg-primary"
                  }`}
                  style={{ width: `${persenKuota}%` }}
                />
              </div>
            </div>
          )}

          <div
            className={`flex items-center ${
              collapsed ? "flex-col gap-2" : "justify-between gap-2 px-1"
            }`}
          >
            <Link
              href="/profil"
              className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition"
              title={nama}
            >
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {nama.slice(0, 2).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-on-surface truncate">{nama}</div>
                  <div className="text-[10px] font-mono text-on-surface-variant truncate">
                    {email || "Mahasiswa UT"}
                  </div>
                </div>
              )}
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-8 h-8 rounded-full hover:bg-error/15 text-error flex items-center justify-center transition cursor-pointer shrink-0"
              title="Keluar dari Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. TOP HEADER BAR */}
      <header className="h-16 border-b border-outline-variant bg-surface-container px-3 sm:px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 select-none">
        <div className="flex items-center gap-3">
          {/* Tombol Buka Drawer Sidebar di Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo di Mobile */}
          <Link href="/beranda" className="md:hidden flex items-center gap-2">
            <LogoUT />
            <span className="font-semibold text-on-surface tracking-tight text-sm">Pahami</span>
          </Link>

          {/* Judul Layar Aktif di Desktop */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-semibold text-on-surface">{halamanSekarang}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="h-4 w-[1px] bg-outline-variant"></div>

          <Link
            href="/profil"
            className="flex items-center gap-2 pl-0.5 sm:pl-1 hover:opacity-85 transition"
          >
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs shadow-sm">
              {nama.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-on-surface leading-tight">{nama}</div>
              <div className="text-[10px] font-mono text-on-surface-variant">{email}</div>
            </div>
          </Link>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-error text-xs font-medium border border-outline-variant transition flex items-center gap-1.5 cursor-pointer ml-0.5"
            title="Keluar dari Akun"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* 3. DRAWER SIDEBAR MOBILE (Slide-over saat klik tombol hamburger di HP) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-surface-container h-full border-r border-outline-variant flex flex-col justify-between p-4 z-10">
            <div className="space-y-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2.5">
                  <LogoUT />
                  <div>
                    <span className="font-bold text-sm text-on-surface block leading-none">
                      Pahami
                    </span>
                    <span className="text-[10px] font-mono text-primary">Mahasiswa UT</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-mono uppercase text-on-surface-variant">
                  Menu Belajar
                </div>
                {[...mainMenuItems, ...accountMenuItems].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition ${
                        item.isActive
                          ? "bg-primary-container text-on-primary-container font-semibold"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      <span className="text-[10px] font-mono opacity-75">{item.badge}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant space-y-3">
              <div className="p-3 rounded-2xl bg-surface border border-outline-variant/70 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-on-surface-variant">Kuota Dokumen</span>
                  <span className="font-mono font-semibold text-primary">
                    {jumlahDokumen}/{maksDokumen}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-variant overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${persenKuota}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BAR BAWAH KHUSUS HP */}
      <BottomNav />

      {/* 5. DIALOG KONFIRMASI KELUAR */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        userName={nama}
        userRole="Mahasiswa"
      />
    </>
  );
}
