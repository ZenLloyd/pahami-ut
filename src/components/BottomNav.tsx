"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, BarChart3, Upload, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Beranda", href: "/beranda", icon: Layers },
  { label: "Upload", href: "/upload", icon: Upload },
  { label: "Progres", href: "/progres", icon: BarChart3 },
  { label: "Profil", href: "/profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi Bawah HP"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container/95 backdrop-blur-md border-t border-outline-variant flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)] px-2 select-none"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const aktif = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 active:scale-95 transition ${
              aktif ? "text-primary font-semibold" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <div
              className={`w-12 h-7 flex items-center justify-center rounded-full transition ${
                aktif ? "bg-primary-container text-on-primary-container" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
