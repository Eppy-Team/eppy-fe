"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AuthGuard from "@/components/AuthGuard";
import { getDetailTicket } from "@/lib/api";

const faqCategories = [
    { label: "Printer", key: "printer", img: "/images/printer.png" },
    { label: "Dukungan Pemindai", key: "scanner", img: "/images/scanner.png" },
    { label: "Proyektor", key: "projector", img: "/images/proyektor.png" },
];

type Ticket = {
    id: string;
    title: string;
    description: string;
    status: string;
    adminResponse: string | null;
    createdAt: string;
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case "OPEN": return { bg: "#dcfce7", color: "#16a34a", label: "Baru" };
        case "ON_PROGRESS": return { bg: "#fef9c3", color: "#ca8a04", label: "Proses" };
        case "RESOLVED": return { bg: "#dbeafe", color: "#1d4ed8", label: "Selesai" };
        case "CLOSED": return { bg: "#f3f4f6", color: "#6b7280", label: "Ditutup" };
        default: return { bg: "#f3f4f6", color: "#6b7280", label: status };
    }
};

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const ticketId = params.ticketId as string;

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await getDetailTicket(ticketId);
                setTicket(res.data);
            } catch {
                setError("Tiket tidak ditemukan.");
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [ticketId]);

    return (
        <AuthGuard requiredRole="USER">
            <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F0F7FF" }}>
                <ChatSidebar />

                <div className="flex flex-1 overflow-hidden p-4 gap-3">
                    <main className="flex-1 flex flex-col overflow-hidden bg-white"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}>
                        <div className="flex-1 overflow-y-auto p-8">

                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                                        style={{ borderColor: "#003087", borderTopColor: "transparent" }} />
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <p className="text-sm text-red-500">{error}</p>
                                    <button onClick={() => router.push("/tickets")}
                                        className="text-sm hover:underline" style={{ color: "#003087" }}>
                                        ← Kembali ke Cari Tiket
                                    </button>
                                </div>
                            ) : ticket ? (
                                <>
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-3xl font-bold" style={{ color: "#003087" }}>
                                            #{ticket.id.slice(0, 5).toUpperCase()}
                                        </h2>
                                        <span className="text-xs font-medium px-3 py-1 rounded-full"
                                            style={{
                                                backgroundColor: getStatusStyle(ticket.status).bg,
                                                color: getStatusStyle(ticket.status).color,
                                            }}>
                                            {getStatusStyle(ticket.status).label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{ticket.title}</p>
                                    <p className="text-xs text-gray-400 mb-6">
                                        {new Date(ticket.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric", month: "long", year: "numeric",
                                            hour: "2-digit", minute: "2-digit"
                                        })}
                                    </p>

                                    {/* Percakapan */}
                                    <div className="flex flex-col gap-4">
                                        {/* Pertanyaan user */}
                                        <div className="flex justify-end">
                                            <div className="px-4 py-2.5 text-sm text-gray-700 max-w-lg"
                                                style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 2px 12px", backgroundColor: "#EBF4FF" }}>
                                                {ticket.description}
                                            </div>
                                        </div>

                                        {/* Jawaban admin */}
                                        {ticket.adminResponse ? (
                                            <div className="flex justify-start">
                                                <div className="px-4 py-3 text-sm text-gray-700 max-w-lg whitespace-pre-line"
                                                    style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}>
                                                    {ticket.adminResponse}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-start">
                                                <div className="px-4 py-3 text-sm text-gray-400 italic"
                                                    style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}>
                                                    Menunggu respons dari tim support...
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => router.push("/tickets")}
                                        className="mt-8 text-sm hover:underline"
                                        style={{ color: "#003087" }}>
                                        ← Cari tiket lain
                                    </button>
                                </>
                            ) : null}
                        </div>
                    </main>

                    {/* FAQ kanan */}
                    <aside className="w-56 bg-white shrink-0 p-4"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}>
                        <h3 className="font-bold text-lg mb-4" style={{ color: "#003087" }}>FAQ</h3>
                        <div className="flex flex-col gap-3">
                            {faqCategories.map((cat, i) => (
                                <button key={i} onClick={() => router.push(`/faq/${cat.key}`)}
                                    className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-all text-left w-full"
                                    style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}>
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