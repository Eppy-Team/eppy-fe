"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AuthGuard from "@/components/AuthGuard";

const faqCategories = [
  { label: "Printer", key: "printer", img: "/images/printer.png" },
  { label: "Dukungan Pemindai", key: "scanner", img: "/images/scanner.png" },
  { label: "Proyektor", key: "projector", img: "/images/proyektor.png" },
];

const dummyHistory = [
  { id: 1, pertanyaan: "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?", tanggal: "17 Apr 2026" },
  { id: 2, pertanyaan: "Mengapa tinta tidak keluar padahal masih penuh?", tanggal: "16 Apr 2026" },
  { id: 3, pertanyaan: "Bagaimana cara menggunakan Epson iPrint?", tanggal: "15 Apr 2026" },
  { id: 4, pertanyaan: "Error saat instalasi driver Epson L1250", tanggal: "14 Apr 2026" },
  { id: 5, pertanyaan: "Hasil cetak buram di bagian kiri", tanggal: "13 Apr 2026" },
];

export default function SearchPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = dummyHistory.filter((h) =>
    h.pertanyaan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen" style={{ backgroundColor: "#DDEAF6" }}>
        <Navbar />

        <div className="flex flex-1 overflow-hidden p-4 gap-3">
          <ChatSidebar />

          <main
            className="flex-1 flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <div className="flex-1 overflow-y-auto p-8">
              <h2 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                Cari Pesan
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Cari riwayat percakapan Anda sebelumnya
              </p>

              {/* Search bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Cari percakapan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none"
                  style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                />
              </div>

              {/* List riwayat */}
              <div className="flex flex-col gap-2">
                {filtered.length === 0 ? (
                  <p className="text-sm text-gray-400">Tidak ada percakapan ditemukan.</p>
                ) : (
                  filtered.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => router.push("/chat")}
                      className="flex items-center justify-between px-4 py-3 text-left hover:bg-epson-light transition-colors w-full"
                      style={{ border: "1px solid #D4E6F7", borderRadius: "4px", backgroundColor: "white" }}
                    >
                      <span className="text-sm text-gray-700 truncate">{item.pertanyaan}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-4">{item.tanggal}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </main>

          {/* Panel FAQ Kanan */}
          <aside
            className="w-56 bg-white shrink-0 p-4"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <h3 className="font-bold text-gray-800 text-lg mb-4">FAQ</h3>
            <div className="flex flex-col gap-3">
              {faqCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/faq/${cat.key}`)}
                  className="flex items-center gap-3 p-3 hover:bg-epson-light transition-all text-left w-full"
                  style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
                >
                  <img src={cat.img} alt={cat.label} className="w-10 h-10 object-contain" />
                  <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}