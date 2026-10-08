import { StudentProfile, WeakTopic, ModuleMastery, AICitation, ChatMessage } from "@/types";

export const mockStudent: StudentProfile = {
  name: "Latif K.",
  nim: "043819281",
  programStudi: "Sistem Informasi (S1)",
  semester: "2026.1 (Ganjil)",
};

export const mockWeakTopics: WeakTopic[] = [
  {
    id: "top-041",
    moduleId: "mod-04",
    moduleTitle: "Modul 04: Pohon Biner (Tree)",
    topicName: "Binary Tree Traversal (Inorder, Preorder, Postorder)",
    pageRange: "Hal. 45–52",
    accuracy: 38,
    status: "CRITICAL",
  },
  {
    id: "top-032",
    moduleId: "mod-03",
    moduleTitle: "Modul 03: Linked List",
    topicName: "Doubly Linked List Pointer Reversal & Traversal",
    pageRange: "Hal. 22–28",
    accuracy: 52,
    status: "WARNING",
  },
];

export const mockModules: ModuleMastery[] = [
  {
    id: "mod-01",
    code: "Modul 01",
    title: "Pengantar ADT, Array & Pointer Memori",
    sks: 3,
    totalPages: 42,
    masteryPercent: 95,
    status: "MASTERED",
    learningActivitiesCount: 3,
  },
  {
    id: "mod-02",
    code: "Modul 02",
    title: "Struktur Stack & Queue (Prinsip LIFO & FIFO)",
    sks: 3,
    totalPages: 84,
    masteryPercent: 65,
    status: "IN_PROGRESS",
    learningActivitiesCount: 2,
  },
  {
    id: "mod-03",
    code: "Modul 03",
    title: "Senarai Berantai (Single & Doubly Linked List)",
    sks: 3,
    totalPages: 68,
    masteryPercent: 52,
    status: "NEEDS_REVIEW",
    learningActivitiesCount: 2,
  },
  {
    id: "mod-04",
    code: "Modul 04",
    title: "Pohon Biner (Binary Search Tree & Balancing)",
    sks: 3,
    totalPages: 92,
    masteryPercent: 38,
    status: "WEAK",
    learningActivitiesCount: 3,
  },
];

export const mockRecentCitations: AICitation[] = [
  {
    id: "cit-1",
    moduleId: "mod-02",
    moduleCode: "Modul 02",
    page: 14,
    paragraphIndex: 3,
    queryTopic: "Perbedaan LIFO di Stack vs FIFO di Queue",
    snippet: "Karakteristik utama Stack adalah aturan Last In, First Out (LIFO)...",
    timestamp: "Hari ini, 19:42",
  },
  {
    id: "cit-2",
    moduleId: "mod-02",
    moduleCode: "Modul 02",
    page: 16,
    paragraphIndex: 1,
    queryTopic: "Kondisi Stack Underflow dan Overflow",
    snippet: "Operasi pop pada stack kosong akan memicu kondisi stack underflow...",
    timestamp: "Kemarin, 21:15",
  },
  {
    id: "cit-3",
    moduleId: "mod-03",
    moduleCode: "Modul 03",
    page: 29,
    paragraphIndex: 2,
    queryTopic: "Kasus Memory Leak pada Single Linked List",
    snippet: "Penghapusan simpul tanpa merealokasi pointer next dapat menimbulkan isolated memory block...",
    timestamp: "2 hari lalu",
  },
];

export const mockInitialMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "user",
    text: "Jelaskan bedanya aturan LIFO di Stack dengan FIFO di Queue, dan ada di halaman berapa pembahasannya di modul?",
    timestamp: "19:42",
  },
  {
    id: "msg-2",
    sender: "ai",
    text: "Berdasarkan isi Modul 2 BMP Struktur Data UT (MSIM4201), perbedaan mendasar kedua struktur data tersebut terletak pada pola antrean akses elemen memori:\n\n1. **Stack (LIFO - Last In, First Out):** Elemen yang terakhir dimasukkan ke tumpukan adalah elemen yang pertama kali keluar saat dipanggil operasi `pop()`. Analogi modul: tumpukan piring atau tombol undo.\n2. **Queue (FIFO - First In, First Out):** Elemen yang pertama kali masuk akan diproses dan dikeluarkan lebih awal saat operasi `dequeue()`. Analogi modul: antrean loket kasir.",
    timestamp: "19:42",
    citations: [
      {
        id: "cit-01",
        moduleId: "mod-02",
        moduleCode: "Modul 02",
        page: 14,
        snippet: "Karakteristik utama dari struktur Stack adalah kepatuhannya terhadap aturan Last In, First Out (LIFO)...",
      },
      {
        id: "cit-02",
        moduleId: "mod-02",
        moduleCode: "Modul 02",
        page: 19,
        snippet: "Struktur antrean (Queue) beroperasi dengan prinsip First In, First Out (FIFO)...",
      },
    ],
    suggestedFollowups: [
      "Berikan contoh implementasi Stack di Python",
      "Apa yang dimaksud kondisi Stack Overflow?",
    ],
    quizPrompt: {
      topic: "Konsep LIFO & Stack Operations",
      questionCount: 1,
    },
  },
];
