import { Suspense } from "react";
import { LearningRoomClient } from "./LearningRoomClient";

export function generateStaticParams() {
  return [
    { moduleId: "mod-01" },
    { moduleId: "mod-02" },
    { moduleId: "mod-03" },
    { moduleId: "mod-04" },
  ];
}

export default async function LearningPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;

  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#09090b] text-zinc-400 flex items-center justify-center text-xs font-mono">
          Memuat Ruang Belajar Modul UT...
        </div>
      }
    >
      <LearningRoomClient moduleId={moduleId} />
    </Suspense>
  );
}
