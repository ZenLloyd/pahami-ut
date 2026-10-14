import { Suspense } from "react";
import { BerandaClient } from "./BerandaClient";

export default function BerandaPage() {
  return (
    <Suspense fallback={null}>
      <BerandaClient />
    </Suspense>
  );
}
