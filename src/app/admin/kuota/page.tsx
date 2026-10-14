import type { Metadata } from "next";
import { KuotaClient } from "./KuotaClient";

export const metadata: Metadata = {
  title: "Pengaturan Kuota Sistem | Pahami UT Admin",
  description: "Layar S-16: Pengaturan Kuota & Parameter Sistem (BP-12, BR-29) Capstone STSI4440 Universitas Terbuka",
};

export default function AdminKuotaPage() {
  return <KuotaClient />;
}
