"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { mockInitialMessages } from "@/data/mockData";
import { ChatMessage } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoUT } from "@/components/LogoUT";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Minus,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Split,
  Maximize2,
  Trash2,
  MessageSquare,
  CheckCircle,
  FileText,
} from "lucide-react";
import { getDokumenById, ubahStatusTopik, type DokumenUpload } from "@/lib/dokumen";
import { useEffect } from "react";

export function LearningRoomClient({ moduleId }: { moduleId: string }) {
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<"split" | "reader">("split");
  const [mobileTab, setMobileTab] = useState<"materi" | "ai">("materi");
  const [uploadedDoc, setUploadedDoc] = useState<DokumenUpload | null>(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>(mockInitialMessages);
  const [inputPrompt, setInputPrompt] = useState("");

  const citationTargetRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cek apakah moduleId merujuk pada dokumen yang di-upload
    const doc = getDokumenById(moduleId);
    if (doc) {
      setUploadedDoc(doc);
      // Buat percakapan awal yang relevan dengan dokumen yang di-upload
      const topikAwal = doc.topik[0];
      const ringkasanTeks = topikAwal?.ringkasan && topikAwal.ringkasan.length > 0
        ? topikAwal.ringkasan.join(" ")
        : "Dokumen ini berhasil diproses dan siap ditanyakan.";

      setMessages([
        {
          id: "msg-welcome",
          sender: "ai",
          text: `Halo! Saya asisten AI untuk dokumen **${doc.judul}**.\n\nBerikut ringkasan inti untuk ${topikAwal?.judul || "Kegiatan Belajar 1"} (Hal. ${topikAwal?.halamanMulai || 1}–${topikAwal?.halamanAkhir || doc.totalHalaman}):\n\n${ringkasanTeks}\n\nSilakan tanyakan hal apa pun seputar modul ini!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          citations: [
            {
              id: "cit-init",
              moduleId: doc.id,
              moduleCode: doc.judul,
              page: topikAwal?.halamanMulai || 1,
              snippet: topikAwal?.ringkasan?.[0] || doc.judul,
            },
          ],
          suggestedFollowups: topikAwal?.kataKunci && topikAwal.kataKunci.length > 0
            ? topikAwal.kataKunci.slice(0, 3).map((k) => `Jelaskan lebih detail tentang ${k}`)
            : ["Rangkumkan poin-poin utama kegiatan belajar ini"],
        },
      ]);
    }
  }, [moduleId]);

  useEffect(() => {
    if (!uploadedDoc) return;
    const t = uploadedDoc.topik[activeTopicIndex];
    if (t && t.status === "BELUM") {
      const hasil = ubahStatusTopik(uploadedDoc.id, t.id, "BERJALAN");
      if (hasil) setUploadedDoc({ ...hasil });
    }
  }, [uploadedDoc, activeTopicIndex]);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 70), 160));
  };

  const handleCitationClick = (page?: number) => {
    if (uploadedDoc && page !== undefined) {
      const idx = uploadedDoc.topik.findIndex(
        (t) => page >= t.halamanMulai && page <= t.halamanAkhir,
      );
      if (idx >= 0) setActiveTopicIndex(idx);
      scrollContainerRef.current?.scrollTo({ top: 0 });
    }
    setMobileTab("materi");
    setTimeout(() => {
      if (citationTargetRef.current) {
        citationTargetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        citationTargetRef.current.classList.add("citation-highlight");
        setTimeout(() => {
          citationTargetRef.current?.classList.remove("citation-highlight");
        }, 2500);
      }
    }, 150);
  };

  const handleSendMessage = () => {
    if (!inputPrompt.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputPrompt,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputPrompt;
    setInputPrompt("");

    setTimeout(() => {
      if (uploadedDoc) {
        const currentTopic = uploadedDoc.topik[activeTopicIndex] || uploadedDoc.topik[0];
        const kataTanya = (currentInput.toLowerCase().match(/[a-zà-ÿ]{4,}/g) ?? []).filter(
          (w) => !["apakah", "jelaskan", "rangkum", "bagian", "bedanya", "tentang"].includes(w),
        );
        const kandidat = currentTopic?.ringkasan ?? [];
        const terbaik = kandidat
          .map((k) => ({ k, s: kataTanya.filter((w) => k.toLowerCase().includes(w)).length }))
          .sort((a, b) => b.s - a.s)[0];
        const ringkasanSnippet =
          terbaik?.k || "Pembahasan materi terkait konsep modul.";
        const aiReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "ai",
          text: `Berdasarkan dokumen **${uploadedDoc.judul}** pada ${currentTopic?.judul || "Kegiatan Belajar"} (Halaman ${currentTopic?.halamanMulai || 1}–${currentTopic?.halamanAkhir || uploadedDoc.totalHalaman}):\n\nUntuk pertanyaan *"${currentInput}"*, materi dalam dokumen menekankan: ${ringkasanSnippet}\n\n*(Catatan: RAG live pipeline saat ini membaca ringkasan ekstraktif dari teks PDF Anda)*.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          citations: [
            {
              id: `cit-${Date.now()}`,
              moduleId: uploadedDoc.id,
              moduleCode: uploadedDoc.judul,
              page: currentTopic?.halamanMulai || 1,
              snippet: ringkasanSnippet,
            },
          ],
          suggestedFollowups: currentTopic?.kataKunci?.slice(0, 2).map((k) => `Apa relevansi ${k}?`) || [
            "Lanjut ke topik berikutnya",
          ],
        };
        setMessages((prev) => [...prev, aiReply]);
      } else {
        const aiReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "ai",
          text: `Berdasarkan Modul 02 BMP Struktur Data (Halaman 14–16), pertanyaanmu berkaitan dengan batas kapasitas stack. Operasi push harus selalu memeriksa apakah batas memori penuh (overflow check) sebelum menambahkan elemen baru guna mencegah kegagalan sistem.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          citations: [
            {
              id: `cit-${Date.now()}`,
              moduleId: moduleId,
              moduleCode: "Modul 02",
              page: 14,
              snippet:
                "Karakteristik utama Stack adalah kepatuhan terhadap aturan Last In, First Out (LIFO)...",
            },
          ],
          suggestedFollowups: ["Bagaimana penanganan underflow pada operasi pop()?"],
        };
        setMessages((prev) => [...prev, aiReply]);
      }
    }, 700);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-surface text-on-surface text-sm select-none">
      {/* TOP NAVBAR / HEADER */}
      <header className="h-14 border-b border-outline-variant bg-surface-container px-3 sm:px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <Link
            href="/beranda"
            className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-outline-variant hover:opacity-85 transition shrink-0"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
            <LogoUT className="h-5 w-auto object-contain" width={26} height={21} />
            <span className="font-semibold text-on-surface tracking-tight text-xs hidden sm:inline">
              Pahami
            </span>
          </Link>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono truncate">
            <Link href="/beranda" className="hover:text-on-surface hidden sm:inline">
              Beranda
            </Link>
            <span className="hidden sm:inline">/</span>
            {uploadedDoc ? (
              <>
                <Link href={`/dokumen/${uploadedDoc.id}`} className="hover:text-on-surface truncate">
                  {uploadedDoc.namaFile}
                </Link>
                <span>/</span>
                <span className="text-on-surface font-medium bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant truncate">
                  {uploadedDoc.topik[activeTopicIndex]?.judul || "Kegiatan Belajar"}
                </span>
              </>
            ) : (
              <>
                <span className="truncate">MSIM4201</span>
                <span>/</span>
                <span className="text-on-surface font-medium bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant truncate">
                  Modul 02: KB 1
                </span>
              </>
            )}
          </nav>
        </div>

        {/* View Switchers & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          {/* Desktop Dual Mode Switcher */}
          <div className="hidden md:flex items-center bg-surface border border-outline-variant rounded-full p-0.5">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1 text-xs rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "split"
                  ? "bg-primary text-on-primary font-medium"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode("reader")}
              className={`px-3 py-1 text-xs rounded-full flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "reader"
                  ? "bg-primary text-on-primary font-medium"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fokus Baca</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TAB SWITCHER (Per Dokumen Panduan Tim: HP: tab Materi / Tanya AI) */}
      <div className="md:hidden flex items-center border-b border-outline-variant bg-surface-container shrink-0">
        <button
          onClick={() => setMobileTab("materi")}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
            mobileTab === "materi"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Materi Modul</span>
        </button>

        <button
          onClick={() => setMobileTab("ai")}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
            mobileTab === "ai"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Tanya AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANEL: DOCUMENT / MODULE VIEWER */}
        <section
          className={`flex-col border-r border-outline-variant bg-surface transition-all duration-200 ${
            mobileTab === "materi" ? "flex w-full" : "hidden md:flex"
          } ${
            viewMode === "reader" ? "md:w-full" : "md:w-[60%]"
          }`}
        >
          {/* Module Toolbar */}
          <div className="h-10 border-b border-outline-variant bg-surface-container px-3 sm:px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 truncate">
              <span className="text-xs font-medium text-on-surface flex items-center gap-1.5 truncate">
                <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">
                  {uploadedDoc ? uploadedDoc.namaFile : "MSIM4201_Modul_02.pdf"}
                </span>
              </span>
              <span className="text-[11px] text-on-surface-variant font-mono bg-surface border border-outline-variant px-1.5 py-0.5 rounded shrink-0">
                {uploadedDoc
                  ? `Hal. ${uploadedDoc.topik[activeTopicIndex]?.halamanMulai || 1} / ${uploadedDoc.totalHalaman}`
                  : "Hal. 14 / 84"}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  if (uploadedDoc) {
                    setActiveTopicIndex((prev) => Math.max(0, prev - 1));
                  }
                }}
                disabled={uploadedDoc ? activeTopicIndex === 0 : false}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-variant transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Kegiatan Belajar Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (uploadedDoc) {
                    setActiveTopicIndex((prev) =>
                      Math.min(uploadedDoc.topik.length - 1, prev + 1)
                    );
                  }
                }}
                disabled={
                  uploadedDoc
                    ? activeTopicIndex >= uploadedDoc.topik.length - 1
                    : false
                }
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-variant transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Kegiatan Belajar Berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="h-3 w-[1px] bg-outline-variant mx-1"></div>

              {/* Interactive Zoom Controls */}
              <div className="flex items-center bg-surface border border-outline-variant rounded-full px-1 py-0.5 gap-0.5">
                <button
                  onClick={() => handleZoom(-10)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition cursor-pointer"
                  title="Perkecil (Zoom Out)"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setZoom(100)}
                  className="text-[11px] text-on-surface hover:text-primary px-1.5 py-0.5 rounded-full font-mono flex items-center gap-1 cursor-pointer"
                  title="Reset ke 100%"
                >
                  <span>{zoom}%</span>
                  <RotateCcw className="w-2.5 h-2.5 text-on-surface-variant" />
                </button>
                <button
                  onClick={() => handleZoom(10)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant transition cursor-pointer"
                  title="Perbesar (Zoom In)"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="h-3 w-[1px] bg-outline-variant mx-1 hidden sm:block"></div>

              <button
                onClick={() => alert("Membuka berkas dokumen asli BMP UT")}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-variant transition hidden sm:inline-flex"
                title="Buka Dokumen Asli"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module Reader Body */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-auto custom-scrollbar p-4 sm:p-8 md:p-10 bg-surface-container-lowest"
          >
            <div
              style={{ zoom: `${zoom}%` }}
              className="max-w-2xl mx-auto bg-surface-container border border-outline-variant rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl text-on-surface leading-relaxed font-sans select-text transition-all duration-150 my-2"
            >
              {uploadedDoc ? (
                <>
                  {/* Document Header Uploaded */}
                  <div className="border-b border-outline-variant pb-4 mb-6">
                    <div className="text-[11px] font-mono tracking-wider text-primary uppercase font-semibold">
                      {uploadedDoc.topik[activeTopicIndex]?.judul || `Kegiatan Belajar ${activeTopicIndex + 1}`}
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight mt-1">
                      {uploadedDoc.judul}
                    </h1>
                    <p className="text-xs text-on-surface-variant font-mono mt-1">
                      {uploadedDoc.namaFile} • Hal. {uploadedDoc.topik[activeTopicIndex]?.halamanMulai || 1}–{uploadedDoc.topik[activeTopicIndex]?.halamanAkhir || uploadedDoc.totalHalaman} dari {uploadedDoc.totalHalaman}
                    </p>
                  </div>

                  {/* Highlight Target for AI Citation */}
                  <div
                    ref={citationTargetRef}
                    className="p-3.5 my-4 rounded-xl border border-primary/30 bg-primary/10 text-on-surface transition-all duration-300"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-primary font-mono font-medium mb-1">
                      <span>📌</span> Rujukan Inti Materi — Halaman {uploadedDoc.topik[activeTopicIndex]?.halamanMulai || 1}:
                    </div>
                    <p className="text-xs sm:text-[13px] leading-6 italic text-on-surface">
                      &quot;{uploadedDoc.topik[activeTopicIndex]?.ringkasan?.[0] || "Materi pada kegiatan belajar ini membahas konsep dasar modul yang diunggah."}&quot;
                    </p>
                  </div>

                  {/* Poin-Poin Ringkasan Otomatis dari Dokumen */}
                  <div className="space-y-3 my-4">
                    <h3 className="text-xs font-semibold text-primary uppercase font-mono tracking-wider">
                      Inti Pembahasan Topik
                    </h3>
                    {uploadedDoc.topik[activeTopicIndex]?.ringkasan && uploadedDoc.topik[activeTopicIndex].ringkasan!.length > 0 ? (
                      <ul className="space-y-2.5 list-disc pl-4 text-xs sm:text-[13px] leading-relaxed text-on-surface">
                        {uploadedDoc.topik[activeTopicIndex].ringkasan!.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-on-surface-variant italic">
                        Materi pada kegiatan belajar ini belum diekstrak kalimat intinya. Silakan tanyakan konsep spesifik melalui asisten AI di sebelah kanan.
                      </p>
                    )}
                  </div>

                  {/* Kata Kunci Relevan */}
                  {uploadedDoc.topik[activeTopicIndex]?.kataKunci && uploadedDoc.topik[activeTopicIndex].kataKunci!.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-outline-variant/60">
                      <div className="text-[11px] font-mono text-on-surface-variant mb-2">
                        Konsep & Kata Kunci:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {uploadedDoc.topik[activeTopicIndex].kataKunci!.map((w) => (
                          <span
                            key={w}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-surface border border-outline-variant text-primary font-medium"
                          >
                            #{w}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-outline-variant pt-4 mt-8 flex items-center justify-between text-xs text-on-surface-variant font-mono">
                    <span>{uploadedDoc.namaFile}</span>
                    <span>Hal. {uploadedDoc.topik[activeTopicIndex]?.halamanMulai || 1}–{uploadedDoc.topik[activeTopicIndex]?.halamanAkhir || uploadedDoc.totalHalaman}</span>
                  </div>

                  {uploadedDoc.topik[activeTopicIndex] && (
                    <button
                      onClick={() => {
                        const t = uploadedDoc.topik[activeTopicIndex];
                        const baru = t.status === "SELESAI" ? "BERJALAN" : "SELESAI";
                        const hasil = ubahStatusTopik(uploadedDoc.id, t.id, baru);
                        if (hasil) setUploadedDoc({ ...hasil });
                      }}
                      className={`mt-4 w-full min-h-12 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition cursor-pointer ${
                        uploadedDoc.topik[activeTopicIndex].status === "SELESAI"
                          ? "border border-outline-variant bg-surface-container-high text-on-surface"
                          : "bg-primary text-on-primary hover:opacity-90"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {uploadedDoc.topik[activeTopicIndex].status === "SELESAI"
                        ? "Selesai — klik untuk batalkan"
                        : "Tandai Selesai Dipelajari"}
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* Document Header Default Mock */}
                  <div className="border-b border-outline-variant pb-4 mb-6">
                    <div className="text-[11px] font-mono tracking-wider text-primary uppercase font-semibold">
                      Kegiatan Belajar 1
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight mt-1">
                      Konsep Dasar Stack (Tumpukan) & Prinsip LIFO
                    </h1>
                    <p className="text-xs text-on-surface-variant font-mono mt-1">
                      Buku Materi Pokok UT • MSIM4201 / Modul 2 / Halaman 14
                    </p>
                  </div>

                  {/* Content Paragraphs */}
                  <p className="mb-4 text-xs sm:text-[13px] leading-6 text-on-surface">
                    Secara konseptual,{" "}
                    <strong className="text-primary font-semibold">
                      Stack (tumpukan)
                    </strong>{" "}
                    adalah struktur data linear di mana penambahan elemen baru dan
                    penghapusan elemen selalu dilakukan pada satu ujung yang sama,
                    yang dikenal sebagai bagian atas (<em>top of stack</em>).
                  </p>

                  {/* Highlight Target for AI Citation */}
                  <div
                    ref={citationTargetRef}
                    className="p-3.5 my-4 rounded-xl border border-primary/30 bg-primary/10 text-on-surface transition-all duration-300"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] text-primary font-mono font-medium mb-1">
                      <span>📌</span> Rujukan Resmi Modul — Halaman 14 Paragraf 3:
                    </div>
                    <p className="text-xs sm:text-[13px] leading-6 italic text-on-surface">
                      &quot;Karakteristik utama dari struktur Stack adalah
                      kepatuhannya terhadap aturan{" "}
                      <strong>Last In, First Out (LIFO)</strong>. Artinya, elemen
                      yang paling terakhir dimasukkan ke dalam struktur memori adalah
                      elemen pertama yang harus dikeluarkan saat operasi pop
                      dipanggil.&quot;
                    </p>
                  </div>

                  <p className="mb-4 text-xs sm:text-[13px] leading-6 text-on-surface">
                    Operasi dasar pada stack mencakup dua operasi fundamental:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-surface border border-outline-variant">
                      <div className="font-mono text-xs font-semibold text-primary">
                        1. Operasi Push
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Menambahkan elemen baru ke posisi paling atas tumpukan jika
                        kapasitas memori belum penuh (overflow check).
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface border border-outline-variant">
                      <div className="font-mono text-xs font-semibold text-primary">
                        2. Operasi Pop
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Mengambil atau menghapus elemen teratas dari tumpukan jika
                        tumpukan tidak kosong (underflow check).
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-4 mt-8 flex items-center justify-between text-xs text-on-surface-variant font-mono">
                    <span>MSIM4201 / Modul 02</span>
                    <span>Halaman 14</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Floating Button on Mobile to Jump to AI */}
          <div className="md:hidden fixed bottom-4 right-4 z-40">
            <button
              onClick={() => setMobileTab("ai")}
              className="px-4 py-2.5 rounded-full bg-primary text-on-primary font-semibold text-xs shadow-lg flex items-center gap-2 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tanya AI Modul</span>
            </button>
          </div>
        </section>

        {/* RIGHT PANEL: AI COPILOT & TUTOR */}
        {(viewMode === "split" || mobileTab === "ai") && (
          <section
            className={`flex-col bg-surface-container border-l border-outline-variant ${
              mobileTab === "ai" ? "flex w-full" : "hidden md:flex"
            } ${
              viewMode === "reader" ? "md:hidden" : "md:w-[40%]"
            }`}
          >
            {/* Header Status */}
            <div className="h-10 border-b border-outline-variant px-4 flex items-center justify-between shrink-0 bg-surface-container">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-on-surface">
                  Asisten Modul AI
                </span>
                <span className="text-[10px] font-mono text-primary bg-primary-container px-1.5 py-0.5 rounded border border-primary/20">
                  RAG Grounded
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-on-surface-variant font-mono hidden sm:inline truncate max-w-[180px]">
                  Cakupan: {uploadedDoc ? uploadedDoc.judul : "Modul 02"}
                </span>
                <button
                  onClick={() => setMessages([])}
                  className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-variant transition cursor-pointer"
                  title="Bersihkan Percakapan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <div className="max-w-[85%] bg-primary text-on-primary rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full bg-surface border border-outline-variant rounded-2xl p-3.5 shadow-sm space-y-3">
                      {/* Source Strip */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="flex items-center gap-2 pb-2.5 border-b border-outline-variant text-[11px] text-on-surface-variant font-mono flex-wrap">
                          <span className="text-primary flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Rujukan Ditemukan:</span>
                          </span>
                          {msg.citations.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleCitationClick(c.page)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container hover:opacity-85 transition cursor-pointer"
                              title="Klik untuk membuka paragraf di modul"
                            >
                              <span>
                                {c.moduleCode} • Hal. {c.page}
                              </span>
                              <span className="text-[10px]">↗</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Content */}
                      <div className="text-xs text-on-surface leading-relaxed whitespace-pre-line">
                        {msg.text}
                      </div>

                      {/* Prompt Kuis Adaptif */}
                      {msg.quizPrompt && (
                        <div className="mt-3 p-2.5 rounded-xl bg-surface-container-high border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400 text-xs">💡</span>
                            <span className="text-[11px] text-on-surface-variant">
                              Uji pemahamanmu tentang materi ini dengan 1 soal kuis?
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              alert(
                                "Membuka latihan kuis diagnostik untuk konsep LIFO."
                              )
                            }
                            className="px-2.5 py-1 rounded-full bg-primary hover:opacity-90 text-[11px] font-medium text-on-primary transition cursor-pointer whitespace-nowrap"
                          >
                            Mulai Kuis
                          </button>
                        </div>
                      )}

                      {/* Footnote */}
                      <div className="flex items-center justify-between pt-1 border-t border-outline-variant text-[10px] text-on-surface-variant font-mono">
                        <span>Model RAG UT-BMP v1.2</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] text-on-surface-variant font-mono mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Follow-up Pills */}
            <div className="px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-t border-outline-variant bg-surface-container text-[11px]">
              <span className="text-on-surface-variant shrink-0 font-mono text-[10px]">
                Lanjut:
              </span>
              {(uploadedDoc
                ? [
                    ...(uploadedDoc.topik[activeTopicIndex]?.kataKunci ?? [])
                      .slice(0, 3)
                      .map((k) => ({ label: `Apa itu ${k}?`, prompt: `Apa itu ${k}?` })),
                    {
                      label: "Rangkum bagian ini",
                      prompt: `Rangkum ${uploadedDoc.topik[activeTopicIndex]?.judul ?? "bagian ini"}`,
                    },
                  ]
                : [
                    { label: "Contoh Stack di Python", prompt: "Berikan contoh kodingan Stack di Python" },
                    { label: "Beda peek vs pop", prompt: "Apa bedanya operasi peek dan pop?" },
                  ]
              ).map((s) => (
                <button
                  key={s.label}
                  onClick={() => setInputPrompt(s.prompt)}
                  className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-variant text-on-surface border border-outline-variant whitespace-nowrap transition cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Chat Input Area with Safe Area Bottom */}
            <div className="p-3 border-t border-outline-variant bg-surface-container pb-[max(env(safe-area-inset-bottom,0px),12px)]">
              <div className="bg-surface border border-outline-variant focus-within:border-primary rounded-2xl p-2.5 transition">
                <textarea
                  rows={2}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    uploadedDoc
                      ? `Tanyakan materi seputar ${uploadedDoc.judul}...`
                      : "Tanyakan materi dari Modul 2 ini... (misal: kondisi overflow)"
                  }
                  className="w-full bg-transparent text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant mt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="font-mono text-[10px]">
                      Filter:{" "}
                      {uploadedDoc
                        ? `${uploadedDoc.topik[activeTopicIndex]?.judul || "KB"} (Hal ${uploadedDoc.topik[activeTopicIndex]?.halamanMulai || 1}–${uploadedDoc.topik[activeTopicIndex]?.halamanAkhir || uploadedDoc.totalHalaman})`
                        : "KB 1 (Hal 1–30)"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-on-surface-variant font-mono hidden sm:inline">
                      ↵ Kirim
                    </span>
                    <button
                      onClick={handleSendMessage}
                      className="px-3 py-1.5 rounded-full bg-primary hover:opacity-90 text-on-primary font-semibold text-xs flex items-center gap-1 transition shadow-sm cursor-pointer"
                    >
                      <span>Tanya</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
