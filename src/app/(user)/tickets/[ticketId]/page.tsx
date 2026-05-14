"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { getDetailTicket } from "@/lib/api";

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
    const router = useRouter();
    const params = useParams();
    const ticketId = params.ticketId as string;
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await getDetailTicket(ticketId);
                setTicket(res.data);
            } catch {
                // abaikan error
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [ticketId]);

    return (
        <AuthGuard>
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#DDEAF6" }}>
                <Navbar />
                <div className="flex-1 flex items-start justify-center px-4 py-8">
                    <div
                        className="bg-white w-full max-w-2xl px-10 py-8"
                        style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                    >
                        <button
                            onClick={() => router.back()}
                            className="text-sm mb-6 hover:underline block"
                            style={{ color: "#003087" }}
                        >
                            ← Kembali
                        </button>

                        {loading ? (
                            <p className="text-sm text-gray-500">Memuat tiket...</p>
                        ) : !ticket ? (
                            <p className="text-sm text-gray-500">Tiket tidak ditemukan.</p>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold" style={{ color: "#003087" }}>{ticket.title}</h1>
                                    <span
                                        className="text-xs font-medium px-3 py-1 rounded-full"
                                        style={{
                                            backgroundColor: getStatusStyle(ticket.status).bg,
                                            color: getStatusStyle(ticket.status).color,
                                        }}
                                    >
                                        {getStatusStyle(ticket.status).label}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-6">
                                    {new Date(ticket.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-end">
                                        <div
                                            className="px-4 py-2.5 text-sm text-gray-700 max-w-sm"
                                            style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 2px 12px", backgroundColor: "#f8fbff" }}
                                        >
                                            {ticket.description}
                                        </div>
                                    </div>

                                    {ticket.adminResponse ? (
                                        <div className="flex justify-start">
                                            <div
                                                className="px-4 py-3 text-sm text-gray-700 max-w-sm whitespace-pre-line"
                                                style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}
                                            >
                                                {ticket.adminResponse}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-start">
                                            <div
                                                className="px-4 py-3 text-sm text-gray-400 italic"
                                                style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}
                                            >
                                                Menunggu respons dari tim support...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}