"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDetailConversation } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminConversationPage() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.conversationId as string;

    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const res = await getDetailConversation(conversationId);
                setMessages(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversation();
    }, [conversationId]);

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F0F7FF" }}>
            <AdminSidebar active="/dashboard" />

            <main className="flex-1 overflow-y-auto p-8">
                {/* Tombol kembali */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
                    style={{ color: "#003087" }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#003087" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Kembali ke Dashboard
                </button>

                <h1 className="text-2xl font-bold mb-6" style={{ color: "#003087" }}>
                    Detail Percakapan
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: "#003087", borderTopColor: "transparent" }} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #D4E6F7" }}>
                        <p className="text-sm text-gray-400">Tidak ada pesan dalam percakapan ini.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-6 flex flex-col gap-4" style={{ border: "1px solid #D4E6F7" }}>
                        {messages.map((message: any) => (
                            <div key={message.id} className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className="max-w-[75%] px-4 py-3 text-sm"
                                    style={{
                                        borderRadius: message.role === "USER" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                                        backgroundColor: message.role === "USER" ? "#003087" : "white",
                                        color: message.role === "USER" ? "white" : "#374151",
                                        border: message.role === "USER" ? "none" : "1px solid #D4E6F7",
                                    }}
                                >
                                    {message.role === "USER" ? (
                                        message.content
                                    ) : (
                                        <ReactMarkdown
                                            components={{
                                                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                p: ({ children }) => <p className="mb-1">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc pl-4 mb-1">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-1">{children}</ol>,
                                                li: ({ children }) => <li className="mb-0.5">{children}</li>,
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}