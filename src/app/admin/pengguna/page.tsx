import { Suspense } from "react";
import { PenggunaClient } from "./PenggunaClient";

export default function PenggunaAdminPage() {
  return (
    <Suspense fallback={null}>
      <PenggunaClient />
    </Suspense>
  );
}
