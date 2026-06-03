"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDetailConversation } from "@/lib/api";

export default function AdminConversationPage() {
    const params = useParams();
    const conversationId = params.conversationId as string;

    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const res = await getDetailConversation(conversationId);
                setMessages(res.data || []);
                console.log("messages api =", res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [conversationId]);

    if (loading) {
        return (
            <div className="p-8">
                Memuat percakapan...
            </div>
        );
    }

    console.log("messages =", messages);
    return (
        <div className="min-h-screen bg-[#F0F7FF] p-8">
            <h1 className="text-2xl font-bold text-[#003087] mb-6">
                Detail Percakapan
            </h1>

            <div className="bg-white rounded-xl p-6 space-y-4">
                {messages.map((message: any) => (
                    <div key={message.id}>
                        <div
                            className={`max-w-[75%] px-4 py-3 rounded-xl ${message.role === "USER"
                                ? "bg-[#003087] text-white ml-auto"
                                : "bg-gray-100 text-gray-800"
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}