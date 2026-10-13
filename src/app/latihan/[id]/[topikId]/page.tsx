import { Suspense } from "react";
import { LatihanClient } from "./LatihanClient";

export default function LatihanPage() {
  return (
    <Suspense fallback={null}>
      <LatihanClient />
    </Suspense>
  );
}
