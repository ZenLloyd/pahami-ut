import { Suspense } from "react";
import { DetailDokumenClient } from "./DetailDokumenClient";

export default function DetailDokumenPage() {
  return (
    <Suspense fallback={null}>
      <DetailDokumenClient />
    </Suspense>
  );
}
