"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutModal } from "@/components/LogoutModal";
import { LogoUT } from "@/components/LogoUT";
import {
  LayoutDashboard,
  Users,
  Sliders,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

const ADMIN_SIDEBAR_PREF_KEY = "pahami_admin_sidebar_collapsed";

export function AdminNavbar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SIDEBAR_PREF_KEY);
      if (saved === "true") setCollapsed(true);
    } catch {
      // ignore
    }
  }, []);

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(ADMIN_SIDEBAR_PREF_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  const navItems = [
    {
      label: "Dashboard Statistik",
      shortLabel: "Dashboard",
      href: "/admin",
      badge: "S-14",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      label: "Kelola Pengguna",
      shortLabel: "Pengguna",
      href: "/admin/pengguna",
      badge: "S-15",
      icon: Users,
      isActive: pathname === "/admin/pengguna",
    },
    {
      label: "Pengaturan Kuota",
      shortLabel: "Kuota",
      href: "/admin/kuota",
      badge: "S-16",
      icon: Sliders,
      isActive: pathname === "/admin/kuota",
    },
  ];

  const halamanSekarang =
    pathname === "/admin"
      ? "Dashboard Statistik & Evaluasi (S-14)"
      : pathname === "/admin/pengguna"
      ? "Kelola Pengguna & Status Akun (S-15)"
      : pathname === "/admin/kuota"
      ? "Pengaturan Kuota & Parameter Sistem (S-16)"
      : "Panel Pengelola Admin";

  return (
    <>
      {/* 1. SIDEBAR KIRI DESKTOP ADMIN (Material Design 3 Navigation Drawer / Rail) */}
      <aside
        data-app-sidebar={collapsed ? "collapsed" : "expanded"}
        aria-label="Navigasi Samping Admin"
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 z-50 bg-surface-container border-r border-outline-variant select-none transition-all duration-200 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-3.5 border-b border-outline-variant flex items-center justify-between shrink-0">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2.5 hover:opacity-85 transition min-w-0">
              <LogoUT />
              <div className="truncate">
                <span className="font-bold text-on-surface tracking-tight text-sm block leading-none">
                  Pahami Admin
                </span>
                <span className="text-[10px] font-mono text-primary mt-0.5 block">
                  Role: Administrator
                </span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto hover:opacity-85 transition" title="Pahami Admin">
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

        {/* Menu Navigasi Admin */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-on-surface-variant/80">
                Manajemen & Evaluasi
              </div>
            )}
            {navItems.map((item) => {
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

          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-on-surface-variant/80">
                Akses Cepat
              </div>
            )}
            <Link
              href="/beranda"
              title={collapsed ? "Pratinjau Mode Mahasiswa" : undefined}
              className={`flex items-center gap-3 rounded-2xl text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition ${
                collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3.5 py-2.5"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">Lihat Mode Mahasiswa</span>}
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-outline-variant shrink-0">
          <div
            className={`flex items-center ${
              collapsed ? "flex-col gap-2" : "justify-between gap-2 px-1"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                AD
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-on-surface truncate">
                    Admin Pengelola
                  </div>
                  <div className="text-[10px] font-mono text-on-surface-variant truncate">
                    admin@ecampus.ut.ac.id
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-8 h-8 rounded-full hover:bg-error/15 text-error flex items-center justify-center transition cursor-pointer shrink-0"
              title="Keluar dari Akun Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. TOP HEADER BAR */}
      <header className="h-16 border-b border-outline-variant bg-surface-container px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 select-none">
        <div className="flex items-center gap-3">
          {/* Tombol Buka Drawer di Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
            aria-label="Buka Menu Admin"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="md:hidden flex items-center gap-2">
            <LogoUT />
            <span className="font-semibold text-sm text-on-surface tracking-tight">
              Pahami Admin
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-semibold text-on-surface">{halamanSekarang}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="h-4 w-[1px] bg-outline-variant"></div>

          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs shadow-sm">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-on-surface leading-tight">
                Admin Pengelola
              </div>
              <div className="text-[10px] font-mono text-on-surface-variant">
                admin@ecampus.ut.ac.id
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-error text-xs font-medium border border-outline-variant transition flex items-center gap-1.5 cursor-pointer ml-1"
            title="Keluar dari Akun Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* 3. DRAWER SIDEBAR MOBILE ADMIN */}
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
                      Pahami Admin
                    </span>
                    <span className="text-[10px] font-mono text-primary">Administrator</span>
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
                  Manajemen Sistem
                </div>
                {navItems.map((item) => {
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
          </div>
        </div>
      )}

      {/* 4. NAVIGASI BAR BAWAH MOBILE KHUSUS ADMIN */}
      <nav
        aria-label="Navigasi Admin Bawah HP"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container/95 backdrop-blur-md border-t border-outline-variant flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)] px-2 select-none"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 active:scale-95 transition ${
                item.isActive
                  ? "text-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <div
                className={`w-12 h-7 flex items-center justify-center rounded-full transition ${
                  item.isActive ? "bg-primary-container text-on-primary-container" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[70px]">
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </nav>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        userName="Admin Pengelola"
        userRole="Admin"
      />
    </>
  );
}
