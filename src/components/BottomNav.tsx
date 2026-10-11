"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mockStudent } from "@/data/mockData";
import { LogoutModal } from "@/components/LogoutModal";
import { BookOpen, Layers, CheckCircle2, User } from "lucide-react";

export function BottomNav({ onOpenLogout }: { onOpenLogout?: () => void }) {
  const pathname = usePathname();
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  const handleProfileClick = onOpenLogout || (() => setInternalModalOpen(true));

  const navItems = [
    {
      label: "Beranda",
      href: "/beranda",
      icon: Layers,
      isActive: pathname === "/beranda",
    },
    {
      label: "Ruang Belajar",
      href: "/learning/mod-02",
      icon: BookOpen,
      isActive: pathname.startsWith("/learning"),
    },
    {
      label: "Latihan",
      href: "#latihan",
      icon: CheckCircle2,
      isActive: false,
      onClick: () => alert("Fitur Latihan Kuis akan aktif di Paket Fitur 4."),
    },
    {
      label: "Profil",
      href: "#profil",
      icon: User,
      isActive: false,
      onClick: handleProfileClick,
    },
  ];

  return (
    <>
      <nav
        aria-label="Navigasi Bawah HP"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container/95 backdrop-blur-md border-t border-outline-variant flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)] px-2 select-none"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 text-on-surface-variant hover:text-on-surface active:scale-95 transition cursor-pointer"
              >
                <div className="w-10 h-7 flex items-center justify-center rounded-full transition">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
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
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {!onOpenLogout && (
        <LogoutModal
          isOpen={internalModalOpen}
          onClose={() => setInternalModalOpen(false)}
          userName={mockStudent.name}
          userRole="Mahasiswa"
        />
      )}
    </>
  );
}
