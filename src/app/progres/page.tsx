import { Suspense } from "react";
import { ProgresClient } from "./ProgresClient";

export default function ProgresPage() {
  return (
    <Suspense fallback={null}>
      <ProgresClient />
    </Suspense>
  );
}
