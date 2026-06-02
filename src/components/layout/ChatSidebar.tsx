"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAllConversations, getDetailConversation } from "@/lib/api";

type MessageType =
  | { type: "user"; content: string }
  | { type: "bot"; content: string; messageId?: string; feedbackGiven?: "HELPFUL" | "NOT_HELPFUL" | null }
  | { type: "escalation" }
  | { type: "escalation-confirmed" };

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
};

type Props = {
  activeConversationId?: string | null;
  onSelectConversation?: (id: string, msgs: MessageType[]) => void;
  onNewChat?: () => void;
};

const menuItems = [
  {
    label: "Pesan Eppy Baru (AI)",
    path: "/chat",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Cari Pesan",
    path: "/search",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: "Cari Tiket",
    path: "/tickets",
    icon: (
      <img src="/images/headset-icon.png" alt="Tiket" className="w-4 h-4 object-contain" />
    ),
  },
];

export default function ChatSidebar({ activeConversationId = null, onSelectConversation, onNewChat }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userName, setUserName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("eppy_name");
    const email = localStorage.getItem("eppy_email");
    if (name) setUserName(name);
    if (email) setUserEmail(email);
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("eppy_name");
    if (name) setUserName(name);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await getAllConversations();
        setConversations(res.data || []);
      } catch {
        // abaikan error
      }
    };
    fetchConversations();
  }, [activeConversationId]);

  const handleSelectConversation = async (conv: Conversation) => {
    try {
      const res = await getDetailConversation(conv.id);
      const msgs: MessageType[] = (res.data || []).map((m: { role: string; content: string }) => ({
        type: m.role === "USER" ? "user" : "bot",
        content: m.content,
      }));
      onSelectConversation?.(conv.id, msgs);
    } catch {
      onSelectConversation?.(conv.id, []);
    }
  };

  return (
    <aside
      className="w-64 bg-white flex flex-col h-full shrink-0"
      style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
    >
      {/* Menu Utama */}
      <div className="p-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const active =
            (item.label === "Pesan Eppy Baru (AI)" && pathname === "/chat") ||
            (item.label === "Cari Pesan" && pathname === "/search") ||
            (item.label === "Cari Tiket" && pathname === "/tickets");

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Pesan Eppy Baru (AI)") {
                  if (onNewChat) onNewChat(); else router.push('/chat');
                } else {
                  router.push(item.path);
                }
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left"
              style={{
                backgroundColor: active ? "#003087" : "transparent",
                color: active ? "white" : "#1a1a2e",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t mx-4" style={{ borderColor: "#D4E6F7" }} />

      {/* Riwayat */}
      <div className="p-4 flex flex-col gap-1 overflow-y-auto flex-1">
        <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700">
          <img src="/images/pesan-anda-icon.png" alt="Pesan Anda" className="w-4 h-4 object-contain" />
          Pesan Anda
        </div>
        {conversations.length === 0 ? (
          <p className="text-xs text-gray-400 px-3">Belum ada percakapan</p>
        ) : (
          (() => {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const groups: Record<string, Conversation[]> = {};
            conversations.forEach((conv) => {
              const date = new Date(conv.createdAt);
              const isToday = date.toDateString() === today.toDateString();
              const isYesterday = date.toDateString() === yesterday.toDateString();
              const key = isToday ? "Hari Ini" : isYesterday ? "Kemarin" : date.toLocaleDateString("id-ID", { day: "numeric", month: "long" });
              if (!groups[key]) groups[key] = [];
              groups[key].push(conv);
            });

            return Object.entries(groups).map(([group, convs]) => (
              <div key={group}>
                <p className="text-xs font-semibold text-gray-400 px-3 py-1 mt-2 uppercase tracking-wide">
                  {group}
                </p>
                {convs.map((conv) => {
                  const isActive = activeConversationId === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-blue-50"
                      style={{
                        backgroundColor: isActive ? "#DDEAF6" : "transparent",
                      }}
                    >
                      <p
                        className="text-sm truncate"
                        style={{
                          color: isActive ? "#003087" : "#374151",
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {conv.title || "Percakapan"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(conv.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </button>
                  );
                })}
              </div>
            ));
          })()
        )}
      </div>

      {/* User di bawah */}
      <div className="px-4 py-4 border-t relative" style={{ borderColor: "#D4E6F7" }}>
        <button
          onClick={() => setShowProfile((v) => !v)}
          className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#003087" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-sm font-semibold truncate" style={{ color: "#003087" }}>
            {userName || "Pengguna"}
          </span>
        </button>

        {/* Popup profil */}
        {showProfile && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
            <div
              className="absolute bottom-16 left-2 right-2 z-20 p-4 flex flex-col items-center gap-3"
              style={{ backgroundColor: "#DDEAF6", borderRadius: "12px", border: "1px solid #003087", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-sm font-bold" style={{ color: "#003087" }}>{userName || "Pengguna"}</p>
                <p className="text-xs text-gray-500">{userEmail || ""}</p>
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => { setShowProfile(false); router.push("/forgot-password"); }}
                  className="flex-1 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap"
                  style={{ backgroundColor: "#0070C0", borderRadius: "8px" }}
                >
                  Ubah Kata Sandi
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("eppy_token");
                    localStorage.removeItem("eppy_role");
                    localStorage.removeItem("eppy_name");
                    localStorage.removeItem("eppy_email");
                    setShowProfile(false);
                    router.push("/login");
                  }}
                  className="flex-1 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#0070C0", borderRadius: "8px" }}
                >
                  Keluar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside >
  );
}