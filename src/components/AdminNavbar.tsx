"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutModal } from "@/components/LogoutModal";
import { LogoUT } from "@/components/LogoUT";
import { LayoutDashboard, Users, Sliders, LogOut } from "lucide-react";

export function AdminNavbar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    {
      label: "Dashboard (S-14)",
      href: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      label: "Pengguna (S-15)",
      href: "/admin/pengguna",
      icon: Users,
      isActive: pathname === "/admin/pengguna",
    },
    {
      label: "Pengaturan Kuota (S-16)",
      href: "/admin/kuota",
      icon: Sliders,
      isActive: pathname === "/admin/kuota",
    },
  ];

  return (
    <>
      <header className="h-16 border-b border-outline-variant bg-surface-container px-3 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 select-none">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/admin" className="flex items-center gap-2.5 hover:opacity-85 transition">
            <LogoUT />
            <span className="font-semibold text-sm sm:text-base text-on-surface tracking-tight">
              Pahami Admin
            </span>
            <span className="text-[10px] font-mono text-primary bg-primary-container/60 px-2.5 py-0.5 rounded-full border border-primary/30 hidden sm:inline">
              Role: Admin
            </span>
          </Link>

          {/* Navigasi Desktop M3 */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 ${
                  item.isActive
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
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

      {/* Navigasi Bar Mobile khusus Admin */}
      <nav
        aria-label="Navigasi Admin Bawah HP"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container/95 backdrop-blur-md border-t border-outline-variant flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)] px-2 select-none"
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
                {item.label.split(" ")[0]}
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
