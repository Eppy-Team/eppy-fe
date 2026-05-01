"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AuthGuard from "@/components/AuthGuard";

type MessageType =
  | { type: "user"; content: string }
  | { type: "bot"; content: string }
  | { type: "feedback" }
  | { type: "escalation" }
  | { type: "escalation-confirmed" };

const suggestions = [
  "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?",
  "Mengapa tinta tidak keluar padahal masih penuh?",
  "Bagaimana cara menggunakan Epson iPrint untuk mencetak dokumen?",
];

const faqCategories = [
  { label: "Printer", key: "printer", img: "/images/printer.png" },
  { label: "Dukungan Pemindai", key: "scanner", img: "/images/scanner.png" },
  { label: "Proyektor", key: "projector", img: "/images/proyektor.png" },
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [escalationAnswered, setEscalationAnswered] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: text }]);
    setInput("");
    setIsTyping(true);
    setFeedbackGiven(false);
    setEscalationAnswered(false);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "Untuk menghubungkan printer Epson ke jaringan Wi-Fi, ikuti langkah-langkah berikut:\n1. Nyalakan printer Epson.\n   Pastikan printer dalam keadaan hidup dan tidak sedang mencetak.\n2. Tekan tombol Wi-Fi pada printer.\n   Tahan hingga lampu indikator Wi-Fi mulai berkedip.\n3. Gunakan WPS (jika router mendukung):\n   • Tekan tombol WPS pada router dalam waktu 2 menit.\n   • Tunggu hingga lampu Wi-Fi pada printer berhenti berkedip dan menyala stabil.\n4. Jika tanpa WPS (manual setup):\n   • Hubungkan laptop/PC ke jaringan Wi-Fi yang sama.\n   • Jalankan Epson Printer Setup Utility di komputer.\n   • Pilih Wireless Connection → Set up printer for the first time.\n5. Konfirmasi koneksi.\n   Setelah berhasil, coba cetak Network Status Sheet.",
        },
        { type: "feedback" },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFeedback = (helpful: boolean) => {
    if (feedbackGiven) return;
    setFeedbackGiven(true);

    if (!helpful) {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: "❌ Tidak, belum membantu" },
        {
          type: "bot",
          content:
            "Mohon maaf, saya belum dapat menemukan solusi yang sesuai. Apakah Anda ingin membuat tiket baru",
        },
        { type: "escalation" },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: "✅ Ya, membantu" },
      ]);
    }
  };

  const handleEscalation = (confirm: boolean) => {
    if (escalationAnswered) return;
    setEscalationAnswered(true);

    if (confirm) {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: "✅ Ya, Buatkan Saya Tiket Baru" },
        { type: "escalation-confirmed" },
      ]);
      setTimeout(() => router.push("/tickets/new"), 1000);
    } else {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: "❌ Tidak" },
      ]);
    }
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen" style={{ backgroundColor: "#DDEAF6" }}>
        <Navbar />

        <div className="flex flex-1 overflow-hidden p-4 gap-3">
          {/* Sidebar Kiri */}
          <ChatSidebar />

          {/* Area Chat Tengah */}
          <main
            className="flex-1 flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4">
              {messages.length === 0 ? (
                /* Tampilan Awal */
                <div className="flex flex-col gap-5 mt-16">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <img src="/images/eppy-logo.png" alt="Eppy" className="w-10 h-10 object-contain" />
                      <h2 className="text-4xl font-bold" style={{ color: "#003087" }}>Eppy</h2>
                    </div>
                    <p className="text-sm text-gray-500">
                      Eppy, solusi cepat untuk setiap pertanyaan Epson Anda!
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        className="text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-epson-light transition-all w-fit"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "4px", backgroundColor: "white" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Bubble Chat */
                <div className="flex flex-col gap-4 w-full">
                  {messages.map((msg, i) => {
                    if (msg.type === "user") {
                      return (
                        <div key={i} className="flex justify-end">
                          <div
                            className="px-4 py-2.5 text-sm text-gray-700 max-w-sm"
                            style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 2px 12px", backgroundColor: "white" }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    }

                    if (msg.type === "bot") {
                      return (
                        <div key={i} className="flex justify-start">
                          <div
                            className="px-4 py-3 text-sm text-gray-700 max-w-xl whitespace-pre-line"
                            style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    }

                    if (msg.type === "feedback") {
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <p className="text-sm text-gray-600">Apakah jawaban ini membantu?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleFeedback(true)}
                              disabled={feedbackGiven}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
                              style={{ border: "1px solid #D4E6F7", borderRadius: "4px", backgroundColor: "white" }}
                            >
                              ✅ Ya, membantu
                            </button>
                            <button
                              onClick={() => handleFeedback(false)}
                              disabled={feedbackGiven}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
                              style={{ border: "1px solid #D4E6F7", borderRadius: "4px", backgroundColor: "white" }}
                            >
                              ❌ Tidak, belum membantu
                            </button>
                          </div>
                        </div>
                      );
                    }

                    if (msg.type === "escalation") {
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <p className="text-sm text-gray-600 font-medium">
                            Apakah Anda Ingin Membuat Tiket ?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEscalation(true)}
                              disabled={escalationAnswered}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
                              style={{ border: "1px solid #D4E6F7", borderRadius: "4px", backgroundColor: "white" }}
                            >
                              ✅ Ya, Buatkan Saya Tiket Baru
                            </button>
                            <button
                              onClick={() => handleEscalation(false)}
                              disabled={escalationAnswered}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
                              style={{ border: "1px solid #D4E6F7", borderRadius: "4px", backgroundColor: "white" }}
                            >
                              ❌ Tidak
                            </button>
                          </div>
                        </div>
                      );
                    }

                    if (msg.type === "escalation-confirmed") {
                      return (
                        <div key={i} className="flex justify-start">
                          <div
                            className="px-4 py-2.5 text-sm text-gray-600 italic"
                            style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}
                          >
                            Mengarahkan ke halaman tiket...
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div
                        className="px-4 py-3"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}
                      >
                        <div className="flex gap-1 items-center h-4">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full animate-bounce"
                              style={{ backgroundColor: "#0070C0", animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t" style={{ borderColor: "#D4E6F7" }}>
              <div
                className="flex items-center gap-3 px-4 py-3 bg-white"
                style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
              >
                <input
                  type="text"
                  placeholder="Mulai Mencari..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ width: "32px", height: "32px", backgroundColor: "#003087", borderRadius: "4px" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
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