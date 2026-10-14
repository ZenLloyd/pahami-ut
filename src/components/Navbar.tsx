"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSesiSaatIni, EVENT_SESI_BERUBAH } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNav } from "@/components/BottomNav";
import { LogoutModal } from "@/components/LogoutModal";
import { LogoUT } from "@/components/LogoUT";
import { Layers, BarChart3, Upload, LogOut } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [nama, setNama] = useState("Mahasiswa");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const muat = () => {
      const s = getSesiSaatIni();
      if (s) {
        setNama(s.nama);
        setEmail(s.email);
      }
    };
    muat();
    window.addEventListener(EVENT_SESI_BERUBAH, muat);
    return () => window.removeEventListener(EVENT_SESI_BERUBAH, muat);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-outline-variant bg-surface-container px-3 sm:px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 select-none">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/beranda" className="flex items-center gap-2.5 hover:opacity-85 transition">
            <LogoUT />
            <span className="font-semibold text-on-surface tracking-tight text-sm">
              Pahami
            </span>
            <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full border border-outline-variant hidden sm:inline">
              Mahasiswa
            </span>
          </Link>

          {/* Navigation Tabs M3 */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs">
            <Link
              href="/beranda"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition ${
                pathname === "/beranda"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Beranda
            </Link>

            <Link
              href="/upload"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition ${
                pathname === "/upload"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload PDF
            </Link>

            <Link
              href="/progres"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition ${
                pathname === "/progres"
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Progres
            </Link>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Dark / Light M3) */}
          <ThemeToggle />

          <div className="h-4 w-[1px] bg-outline-variant"></div>

          {/* User Profile Pill -> S-13 */}
          <Link href="/profil" className="flex items-center gap-2 pl-0.5 sm:pl-1 hover:opacity-85 transition">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs shadow-sm">
              {nama.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-on-surface leading-tight">{nama}</div>
              <div className="text-[10px] font-mono text-on-surface-variant">{email}</div>
            </div>
          </Link>

          {/* Tombol Keluar Mahasiswa (Sama Seperti di Admin) */}
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

      {/* Bar Bawah Khusus HP (M3 Compact Window Class) */}
      <BottomNav />

      {/* Dialog Konfirmasi Keluar M3 */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        userName={nama}
        userRole="Mahasiswa"
      />
    </>
  );
}
