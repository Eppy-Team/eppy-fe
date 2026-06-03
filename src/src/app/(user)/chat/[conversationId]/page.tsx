"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";
import { getDetailConversation } from "@/lib/api";

type Message = {
    id: string;
    role: "USER" | "ASSISTANT";
    content: string;
    imageUrl: string | null;
    createdAt: string;
};

export default function ChatDetailPage() {
    const router = useRouter();
    const params = useParams();
    const conversationId = params.conversationId as string;
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getDetailConversation(conversationId);
                setMessages(res.data || []);
            } catch {
                // abaikan error
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <AuthGuard>
        <RoleGuard allowedRoles={["USER", "ADMIN"]}>
            <div className="flex flex-col h-screen" style={{ backgroundColor: "#DDEAF6" }}>
                <Navbar />
                <div className="flex-1 flex flex-col overflow-hidden p-4">
                    <div
                        className="flex-1 flex flex-col overflow-hidden bg-white"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "#D4E6F7" }}>
                            <button
                                onClick={() => router.back()}
                                className="text-sm hover:underline"
                                style={{ color: "#003087" }}
                            >
                                ←
                            </button>
                            <h2 className="text-sm font-semibold text-gray-700">Detail Percakapan</h2>
                            <span className="text-xs text-gray-400 font-mono">{conversationId}</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4">
                            {loading ? (
                                <p className="text-sm text-gray-500">Memuat percakapan...</p>
                            ) : messages.length === 0 ? (
                                <p className="text-sm text-gray-500">Tidak ada pesan.</p>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className="px-4 py-2.5 text-sm text-gray-700 max-w-xl whitespace-pre-line"
                                            style={{
                                                border: "1px solid #D4E6F7",
                                                borderRadius: msg.role === "USER" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                                                backgroundColor: "white",
                                            }}
                                        >
                                            {msg.content}
                                            {msg.imageUrl && (
                                                <img src={msg.imageUrl} alt="attachment" className="mt-2 max-w-xs rounded" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </div>
                </div>
            </div>
        </RoleGuard>
      </AuthGuard>
    );
}