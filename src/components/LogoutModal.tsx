"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hapusSesi } from "@/lib/auth";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userRole?: string;
}

export function LogoutModal({
  isOpen,
  onClose,
  userName,
  userRole = "Mahasiswa",
}: LogoutModalProps) {
  const router = useRouter();

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    hapusSesi();
    onClose();
    router.push("/masuk");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-surface-container border border-outline-variant p-6 shadow-2xl text-on-surface relative scale-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-2xl bg-error/15 text-error flex items-center justify-center mb-4">
          <LogOut className="w-5 h-5" />
        </div>

        <h3 id="logout-dialog-title" className="text-base font-bold tracking-tight text-on-surface">
          Konfirmasi Keluar
        </h3>

        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
          Apakah Anda yakin ingin keluar dari akun {userName ? <strong className="text-on-surface">{userName}</strong> : ""}{" "}
          ({userRole})? Anda perlu masuk kembali untuk mengakses materi pembelajaran.
        </p>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium text-on-surface hover:bg-surface-variant transition cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleConfirmLogout}
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ya, Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
