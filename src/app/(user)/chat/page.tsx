"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AuthGuard from "@/components/AuthGuard";
import { createConversation, sendChat, createTicket, sendFeedback } from "@/lib/api";
import ReactMarkdown from "react-markdown";

type MessageType =
  | { type: "user"; content: string }
  | { type: "bot"; content: string; messageId?: string; feedbackGiven?: "HELPFUL" | "NOT_HELPFUL" | null }
  | { type: "escalation" }
  | { type: "escalation-confirmed" };

const suggestions = [
  "Bagaimana cara melakukan scan dokumen double-sided dan menyimpannya sebagai PDF?",
  "Bagaimana cara mengatasi paper jam pada ADF scanner?",
  "Bagaimana cara melakukan scan beberapa kuitansi sekaligus agar otomatis terpisah menjadi file individual?",
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
  const [escalationAnswered, setEscalationAnswered] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async (text: string, image?: File) => {
    if (!text.trim() && !image) return;

    setMessages((prev) => [...prev, { type: "user", content: text }]);
    setInput("");
    clearImage();
    setIsTyping(true);
    setEscalationAnswered(false);
    setLastUserMessage(text);

    try {
      let conversationId = activeConversationId;

      if (!conversationId) {
        const res = await createConversation(text.slice(0, 50));
        conversationId = res.data?.id;
        setActiveConversationId(conversationId);
      }

      const res = await sendChat(conversationId!, text, image);

      const botContent = res.data?.assistantMessage?.content || "Maaf, tidak ada respons.";
      const messageId = res.data?.assistantMessage?.id || null;

      setLastMessageId(messageId);

      setMessages((prev) => [
        ...prev,
        { type: "bot", content: botContent, messageId, feedbackGiven: null },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: err.message || "Maaf, terjadi kesalahan. Silakan coba lagi." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = async (messageId: string, feedback: "HELPFUL" | "NOT_HELPFUL") => {
    if (!activeConversationId || !messageId) return;

    try {
      await sendFeedback(activeConversationId, messageId, feedback);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.type === "bot" && msg.messageId === messageId
            ? { ...msg, feedbackGiven: feedback }
            : msg
        )
      );

      if (feedback === "NOT_HELPFUL") {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: "Mohon maaf, saya belum dapat menemukan solusi yang sesuai. Apakah Anda ingin membuat tiket baru?",
            messageId: undefined,
            feedbackGiven: null,
          },
          { type: "escalation" },
        ]);
      }
    } catch {
      // abaikan error
    }
  };

  const handleEscalation = async (confirm: boolean) => {
    if (escalationAnswered) return;
    setEscalationAnswered(true);

    if (confirm) {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: "✅ Ya, Buatkan Saya Tiket Baru" },
        { type: "escalation-confirmed" },
      ]);

      try {
        await createTicket(
          lastUserMessage.slice(0, 100),
          lastUserMessage,
          "General",
          activeConversationId!,
          lastMessageId!
        );
        setTimeout(() => router.push("/tickets/new"), 1000);
      } catch {
        setTimeout(() => router.push("/tickets/new"), 1000);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: "❌ Tidak" },
      ]);
    }
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Parse bold: **teks** → <strong>teks</strong>
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen" style={{ backgroundColor: "#DDEAF6" }}>
        <Navbar />

        <div className="flex flex-1 overflow-hidden p-4 gap-3">
          <ChatSidebar
            activeConversationId={activeConversationId}
            onSelectConversation={(id, msgs) => {
              setActiveConversationId(id);
              setMessages(msgs);
              setEscalationAnswered(false);
            }}
            onNewChat={() => {
              setActiveConversationId(null);
              setMessages([]);
              setEscalationAnswered(false);
            }}
          />

          <main
            className="flex-1 flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4">
              {messages.length === 0 ? (
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
                <div className="flex flex-col gap-4 w-full">
                  {messages.map((msg, i) => {
                    if (msg.type === "user") {
                      return (
                        <div key={i} className="flex justify-end">
                          <div
                            className="px-4 py-2.5 text-sm text-gray-700 max-w-sm"
                            style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 2px 12px", backgroundColor: "white" }}
                          >
                            {renderMarkdown(msg.content)}
                          </div>
                        </div>
                      );
                    }
                    if (msg.type === "bot") {
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <div className="flex justify-start">
                            <div
                              className="px-4 py-3 text-sm text-gray-700 max-w-xl"
                              style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}
                            >
                              <ReactMarkdown
                                components={{
                                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                  p: ({ children }) => <p className="mb-1">{children}</p>,
                                  ul: ({ children }) => <ul className="list-disc pl-4 mb-1">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-1">{children}</ol>,
                                  li: ({ children }) => <li className="mb-0.5">{children}</li>,
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          </div>

                          {/* Feedback buttons */}
                          {msg.messageId && (
                            <div className="flex flex-col gap-2">
                              {msg.feedbackGiven === null ? (
                                <>
                                  <p className="text-sm text-gray-600">Apakah jawaban ini membantu?</p>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleFeedback(msg.messageId!, "HELPFUL")}
                                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50"
                                      style={{ border: "1px solid #D4E6F7", borderRadius: "4px", backgroundColor: "white" }}
                                    >
                                      ✅ Ya, membantu
                                    </button>
                                    <button
                                      onClick={() => handleFeedback(msg.messageId!, "NOT_HELPFUL")}
                                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50"
                                      style={{ border: "1px solid #D4E6F7", borderRadius: "4px", backgroundColor: "white" }}
                                    >
                                      ❌ Tidak, belum membantu
                                    </button>
                                  </div>
                                </>
                              ) : msg.feedbackGiven === "HELPFUL" ? (
                                <p className="text-sm" style={{ color: "#16a34a" }}>✅ Terima kasih atas feedbacknya!</p>
                              ) : (
                                <p className="text-sm" style={{ color: "#e11d48" }}>❌ Feedback terkirim</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                    if (msg.type === "escalation") {
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <p className="text-sm text-gray-600 font-medium">
                            Apakah Anda Ingin Membuat Tiket?
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
                            Membuat tiket... Mengarahkan ke halaman tiket...
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}

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
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="px-4 pt-3 flex items-center gap-2">
                <div className="relative w-16 h-16">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded"
                    style={{ border: "1px solid #D4E6F7" }}
                  />
                  <button
                    onClick={clearImage}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: "#e11d48" }}
                  >
                    ✕
                  </button>
                </div>
                <span className="text-xs text-gray-500">{selectedImage?.name}</span>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t" style={{ borderColor: "#D4E6F7" }}>
              <div
                className="flex items-center gap-3 px-4 py-3 bg-white"
                style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center hover:opacity-70 transition-opacity shrink-0"
                  title="Lampirkan gambar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Mulai Mencari..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage(input, selectedImage ?? undefined);
                  }}
                  className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                />

                <button
                  onClick={() => sendMessage(input, selectedImage ?? undefined)}
                  disabled={isTyping}
                  className="flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50 shrink-0"
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