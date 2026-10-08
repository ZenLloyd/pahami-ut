"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { mockInitialMessages } from "@/data/mockData";
import { ChatMessage } from "@/types";
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
} from "lucide-react";

export function LearningRoomClient({ moduleId }: { moduleId: string }) {
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<"split" | "reader">("split");
  const [messages, setMessages] = useState<ChatMessage[]>(mockInitialMessages);
  const [inputPrompt, setInputPrompt] = useState("");

  const citationTargetRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 70), 160));
  };

  const handleCitationClick = () => {
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
    setInputPrompt("");

    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: `Berdasarkan Modul 02 BMP Struktur Data (Halaman 14–16), pertanyaanmu berkaitan dengan batas memori stack. Operasi push harus selalu memeriksa apakah kapasitas memori penuh sebelum menambahkan elemen baru guna mencegah Stack Overflow.`,
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
        suggestedFollowups: ["Bagaimana pencegahan underflow pada pop()?"],
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 700);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#09090b] text-zinc-100 text-sm select-none">
      {/* TOP NAVBAR / HEADER */}
      <header className="h-13 border-b border-zinc-800 bg-[#121215] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 pr-3 border-r border-zinc-800 hover:opacity-80 transition"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
            <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center text-xs tracking-tighter shadow-sm">
              UT
            </div>
            <span className="font-semibold text-zinc-100 tracking-tight text-xs hidden sm:inline">
              Sistem Modul Mandiri
            </span>
          </Link>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Link href="/" className="hover:text-zinc-200">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-400">MSIM4201</span>
            <span>/</span>
            <span className="text-zinc-200 font-medium bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/50">
              Modul 02: KB 1 (Stack & Queue)
            </span>
          </nav>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md p-0.5">
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 text-xs rounded flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "split"
                  ? "bg-zinc-800 text-zinc-100 font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode("reader")}
              className={`px-2.5 py-1 text-xs rounded flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "reader"
                  ? "bg-zinc-800 text-zinc-100 font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fokus Baca</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: DOCUMENT / MODULE VIEWER */}
        <section
          className={`flex flex-col border-r border-zinc-800 bg-[#09090b] transition-all duration-200 ${
            viewMode === "reader" ? "w-full" : "w-[60%]"
          }`}
        >
          {/* Module Toolbar */}
          <div className="h-10 border-b border-zinc-800 bg-[#121215] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                MSIM4201_Modul_02.pdf
              </span>
              <span className="text-xs text-zinc-400 font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                Halaman 14 dari 84
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800 transition"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800 transition"
                title="Halaman Berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="h-3 w-[1px] bg-zinc-800 mx-1"></div>

              {/* Interactive Zoom Controls */}
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded px-1 py-0.5 gap-0.5">
                <button
                  onClick={() => handleZoom(-10)}
                  className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800 transition cursor-pointer"
                  title="Perkecil (Zoom Out)"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setZoom(100)}
                  className="text-[11px] text-zinc-300 hover:text-white px-1.5 py-0.5 rounded hover:bg-zinc-800 font-mono flex items-center gap-1 cursor-pointer"
                  title="Reset ke 100%"
                >
                  <span>{zoom}%</span>
                  <RotateCcw className="w-2.5 h-2.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => handleZoom(10)}
                  className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800 transition cursor-pointer"
                  title="Perbesar (Zoom In)"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="h-3 w-[1px] bg-zinc-800 mx-1"></div>

              <button
                onClick={() => alert("Membuka berkas dokumen asli BMP UT")}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800 transition"
                title="Buka Dokumen Asli"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module Reader Body */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-[#0c0c0e]"
          >
            <div
              style={{ transform: `scale(${zoom / 100})` }}
              className="max-w-2xl mx-auto bg-[#121215] border border-zinc-800 rounded-lg p-8 md:p-10 shadow-2xl text-zinc-300 leading-relaxed font-sans select-text transition-transform duration-150 origin-top"
            >
              {/* Document Header */}
              <div className="border-b border-zinc-800 pb-4 mb-6">
                <div className="text-[11px] font-mono tracking-wider text-sky-400 uppercase font-semibold">
                  Kegiatan Belajar 1
                </div>
                <h1 className="text-xl font-bold text-zinc-100 tracking-tight mt-1">
                  Konsep Dasar Stack (Tumpukan) & Prinsip LIFO
                </h1>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Buku Materi Pokok UT • MSIM4201 / Modul 2 / Halaman 14
                </p>
              </div>

              {/* Content Paragraphs */}
              <p className="mb-4 text-[13px] leading-6 text-zinc-300">
                Secara konseptual,{" "}
                <strong className="text-zinc-100 font-semibold">
                  Stack (tumpukan)
                </strong>{" "}
                adalah struktur data linear di mana penambahan elemen baru dan
                penghapusan elemen selalu dilakukan pada satu ujung yang sama,
                yang dikenal sebagai bagian atas (<em>top of stack</em>).
              </p>

              {/* Highlight Target for AI Citation */}
              <div
                ref={citationTargetRef}
                className="p-3 my-4 rounded border border-sky-500/30 bg-sky-500/5 text-zinc-200 transition-all duration-300"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-sky-400 font-mono font-medium mb-1">
                  <span>📌</span> Rujukan Resmi Modul — Halaman 14 Paragraf 3:
                </div>
                <p className="text-[13px] leading-6 italic text-zinc-200">
                  &quot;Karakteristik utama dari struktur Stack adalah
                  kepatuhannya terhadap aturan{" "}
                  <strong>Last In, First Out (LIFO)</strong>. Artinya, elemen
                  yang paling terakhir dimasukkan ke dalam struktur memori adalah
                  elemen pertama yang harus dikeluarkan saat operasi pop
                  dipanggil.&quot;
                </p>
              </div>

              <p className="mb-4 text-[13px] leading-6 text-zinc-300">
                Operasi dasar pada stack mencakup dua operasi fundamental:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800">
                  <div className="font-mono text-xs font-semibold text-zinc-100">
                    1. Operasi Push
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Menambahkan elemen baru ke posisi paling atas tumpukan jika
                    kapasitas memori belum penuh (overflow check).
                  </p>
                </div>
                <div className="p-3 rounded-md bg-zinc-900 border border-zinc-800">
                  <div className="font-mono text-xs font-semibold text-zinc-100">
                    2. Operasi Pop
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Mengambil atau menghapus elemen teratas dari tumpukan jika
                    tumpukan tidak kosong (underflow check).
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 mt-8 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>MSIM4201 / Modul 02</span>
                <span>Halaman 14</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: AI COPILOT & TUTOR */}
        {viewMode === "split" && (
          <section className="w-[40%] flex flex-col bg-[#121215] border-l border-zinc-800">
            {/* Header Status */}
            <div className="h-10 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 bg-[#121215]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-xs font-semibold text-zinc-200">
                  Asisten Modul AI
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/50">
                  RAG Grounded
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 font-mono">
                  Cakupan: Modul 02
                </span>
                <button
                  onClick={() => setMessages([])}
                  className="text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800 transition cursor-pointer"
                  title="Bersihkan Percakapan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <div className="max-w-[85%] bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3.5 py-2.5 text-xs leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full bg-[#18181b] border border-zinc-800 rounded-lg p-3.5 shadow-sm space-y-3">
                      {/* Source Strip */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800/80 text-[11px] text-zinc-400 font-mono flex-wrap">
                          <span className="text-sky-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Rujukan Ditemukan:</span>
                          </span>
                          {msg.citations.map((c) => (
                            <button
                              key={c.id}
                              onClick={handleCitationClick}
                              className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/60 hover:bg-sky-900/60 transition cursor-pointer"
                              title="Klik untuk melihat paragraf di modul"
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
                      <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                        {msg.text}
                      </div>

                      {/* Prompt Kuis Adaptif */}
                      {msg.quizPrompt && (
                        <div className="mt-3 p-2.5 rounded bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400 text-xs">💡</span>
                            <span className="text-[11px] text-zinc-300">
                              Uji pemahamanmu tentang materi ini dengan 1 soal kuis?
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              alert(
                                "Membuka latihan kuis diagnostik untuk konsep LIFO."
                              )
                            }
                            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-medium text-zinc-100 border border-zinc-700 transition cursor-pointer"
                          >
                            Mulai Kuis
                          </button>
                        </div>
                      )}

                      {/* Footnote */}
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40 text-[10px] text-zinc-500 font-mono">
                        <span>Model RAG UT-BMP v1.2</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Follow-up Pills */}
            <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-t border-zinc-800/60 bg-[#121215] text-[11px]">
              <span className="text-zinc-500 shrink-0 font-mono text-[10px]">
                Lanjut:
              </span>
              <button
                onClick={() =>
                  setInputPrompt("Berikan contoh kodingan Stack di Python")
                }
                className="px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 whitespace-nowrap transition cursor-pointer"
              >
                Contoh Stack di Python
              </button>
              <button
                onClick={() =>
                  setInputPrompt("Apa bedanya operasi peek dan pop?")
                }
                className="px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 whitespace-nowrap transition cursor-pointer"
              >
                Beda peek vs pop
              </button>
            </div>

            {/* Chat Input Area */}
            <div className="p-3 border-t border-zinc-800 bg-[#121215]">
              <div className="bg-zinc-900/90 border border-zinc-800 focus-within:border-zinc-500 rounded-lg p-2.5 transition">
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
                  placeholder="Tanyakan materi dari Modul 2 ini... (misal: kondisi overflow)"
                  className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 mt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span className="font-mono text-[10px]">
                      Filter: KB 1 (Hal 1–30)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                      ↵ Kirim
                    </span>
                    <button
                      onClick={handleSendMessage}
                      className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center gap-1 transition shadow-sm cursor-pointer"
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
