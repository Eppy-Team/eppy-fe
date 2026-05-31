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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
            style={{ borderRight: "1px solid #D4E6F7" }}
        >
            {/* Logo */}
            <div className="px-5 py-5 flex items-center gap-2">
                <img src="/images/eppy-logo.png" alt="Eppy" className="w-8 h-8 object-contain" />
                <span className="font-bold text-xl" style={{ color: "#003087" }}>Eppy</span>
            </div>

            {/* Menu Utama */}
            <div className="px-3 flex flex-col gap-1">
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
                                    if (onNewChat) onNewChat();
                                    else router.push("/chat");
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
            <div className="border-t mx-4 mt-3" style={{ borderColor: "#D4E6F7" }} />

            {/* Riwayat */}
            <div className="px-3 py-3 flex flex-col gap-1 overflow-y-auto flex-1">
                <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
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
                            const key = isToday
                                ? "Hari Ini"
                                : isYesterday
                                    ? "Kemarin"
                                    : date.toLocaleDateString("id-ID", { day: "numeric", month: "long" });
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
                                            style={{ backgroundColor: isActive ? "#DDEAF6" : "transparent" }}
                                        >
                                            <p
                                                className="text-sm truncate"
                                                style={{ color: isActive ? "#003087" : "#374151", fontWeight: isActive ? 600 : 400 }}
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
            <div className="px-4 py-4 border-t" style={{ borderColor: "#D4E6F7" }}>
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                        style={{ backgroundColor: "#003087" }}
                    >
                        {userName ? userName[0].toUpperCase() : "U"}
                    </div>
                    <span className="text-sm font-semibold truncate" style={{ color: "#003087" }}>
                        {userName || "Pengguna"}
                    </span>
                </div>
            </div>
        </aside>
    );
}