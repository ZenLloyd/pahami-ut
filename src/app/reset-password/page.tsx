import { Suspense } from "react";
import { ResetPasswordClient } from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090b] text-zinc-400 flex items-center justify-center text-xs font-mono">
          Memuat formulir atur ulang kata sandi…
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
