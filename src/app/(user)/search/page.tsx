"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AuthGuard from "@/components/AuthGuard";
import { searchMessage } from "@/lib/api";

const faqCategories = [
  { label: "Printer", key: "printer", img: "/images/printer.png" },
  { label: "Dukungan Pemindai", key: "scanner", img: "/images/scanner.png" },
  { label: "Proyektor", key: "projector", img: "/images/proyektor.png" },
];

type SearchResult = {
  id: string;
  title: string;
  createdAt: string;
  matchCount: number;
  lastMatchedMessage?: {
    id: string;
    content: string;
  };
};

export default function SearchPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const res = await searchMessage(search.trim());
        setResults(res.data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F0F7FF" }}>
        <ChatSidebar />

        <div className="flex flex-1 overflow-hidden p-4 gap-3">
          <main
            className="flex-1 flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}
          >
            <div className="flex-1 overflow-y-auto p-8">
              <h2 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                Cari Pesan
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Cari riwayat percakapan Anda sebelumnya
              </p>

              {/* Search bar */}
              <div className="mb-6 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari percakapan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none"
                  style={{ border: "1px solid #B8D0E8", borderRadius: "8px" }}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: "#003087", borderTopColor: "transparent" }} />
                  </div>
                )}
              </div>

              {/* Hasil pencarian */}
              <div className="flex flex-col gap-2">
                {!hasSearched ? (
                  <p className="text-sm text-gray-400">Ketik untuk mulai mencari percakapan.</p>
                ) : loading ? null : results.length === 0 ? (
                  <p className="text-sm text-gray-400">Tidak ada percakapan ditemukan untuk "{search}".</p>
                ) : (
                  <>
                    <p className="text-xs text-gray-400 mb-2">
                      Ditemukan {results.length} percakapan
                    </p>
                    {results.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => router.push(`/chat?conversationId=${item.id}`)}
                        className="flex flex-col px-4 py-3 text-left hover:bg-blue-50 transition-colors w-full"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "8px", backgroundColor: "white" }}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-sm font-medium truncate" style={{ color: "#003087" }}>
                            {item.title || "Percakapan"}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0 ml-4">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </span>
                        </div>
                        {item.lastMatchedMessage && (
                          <p className="text-xs text-gray-400 truncate">
                            {item.lastMatchedMessage.content}
                          </p>
                        )}
                        <span className="text-xs mt-1" style={{ color: "#0070C0" }}>
                          {item.matchCount} pesan cocok
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </main>

          {/* Panel FAQ Kanan */}
          <aside
            className="w-56 bg-white shrink-0 p-4"
            style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: "#003087" }}>FAQ</h3>
            <div className="flex flex-col gap-3">
              {faqCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/faq/${cat.key}`)}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-all text-left w-full"
                  style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}
                >
                  <img src={cat.img} alt={cat.label} className="w-10 h-10 object-contain" />
                  <span className="text-sm font-medium" style={{ color: "#003087" }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}