"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AuthGuard from "@/components/AuthGuard";
import { getAllTickets, getDetailTicket } from "@/lib/api";

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

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getAllTickets(1, 20);
        setTickets(res.data || []);
      } catch {
        // abaikan error
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleViewTicket = async (ticketId: string) => {
    setLoadingDetail(true);
    try {
      const res = await getDetailTicket(ticketId);
      setSelectedTicket(res.data);
    } catch {
      // abaikan error
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return { bg: "#dcfce7", color: "#16a34a", label: "Baru" };
      case "ON_PROGRESS": return { bg: "#fef9c3", color: "#ca8a04", label: "Proses" };
      case "RESOLVED": return { bg: "#dbeafe", color: "#1d4ed8", label: "Selesai" };
      case "CLOSED": return { bg: "#f3f4f6", color: "#6b7280", label: "Ditutup" };
      default: return { bg: "#f3f4f6", color: "#6b7280", label: status };
    }
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen" style={{ backgroundColor: "#DDEAF6" }}>
        <Navbar />
        <div className="flex flex-1 overflow-hidden p-4 gap-3">
          <ChatSidebar />

          <main className="flex-1 flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}>
            <div className="flex-1 overflow-y-auto p-8">
              {!selectedTicket ? (
                <div className="w-full">
                  <h2 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>Tiket Saya</h2>
                  <p className="text-sm text-gray-500 mb-8">Daftar tiket yang telah Anda buat</p>

                  {loading ? (
                    <p className="text-sm text-gray-500">Memuat tiket...</p>
                  ) : tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <p className="text-sm text-gray-500">Belum ada tiket yang dibuat.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {tickets.map((ticket) => {
                        const statusStyle = getStatusColor(ticket.status);
                        return (
                          <div key={ticket.id}
                            className="flex items-center justify-between px-5 py-4 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                            style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}
                            onClick={() => handleViewTicket(ticket.id)}
                          >
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-medium text-gray-800">{ticket.title}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(ticket.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium px-3 py-1 rounded-full"
                                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                {statusStyle.label}
                              </span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  {loadingDetail ? (
                    <p className="text-sm text-gray-500">Memuat detail tiket...</p>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-bold" style={{ color: "#003087" }}>
                          {selectedTicket.title}
                        </h2>
                        <span className="text-xs font-medium px-3 py-1 rounded-full"
                          style={{ ...(() => { const s = getStatusColor(selectedTicket.status); return { backgroundColor: s.bg, color: s.color }; })() }}>
                          {getStatusColor(selectedTicket.status).label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-6">
                        {new Date(selectedTicket.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </p>

                      <div className="flex flex-col gap-4">
                        <div className="flex justify-end">
                          <div className="px-4 py-2.5 text-sm text-gray-700 max-w-sm"
                            style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 2px 12px", backgroundColor: "white" }}>
                            {selectedTicket.description}
                          </div>
                        </div>

                        {selectedTicket.adminResponse && (
                          <div className="flex justify-start">
                            <div className="px-4 py-3 text-sm text-gray-700 max-w-xl whitespace-pre-line"
                              style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}>
                              {selectedTicket.adminResponse}
                            </div>
                          </div>
                        )}

                        {!selectedTicket.adminResponse && (
                          <div className="flex justify-start">
                            <div className="px-4 py-3 text-sm text-gray-400 italic"
                              style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}>
                              Menunggu respons dari tim support...
                            </div>
                          </div>
                        )}
                      </div>

                      <button onClick={() => setSelectedTicket(null)}
                        className="mt-6 text-sm hover:underline"
                        style={{ color: "#003087" }}>
                        ← Kembali ke daftar tiket
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </main>

          <aside className="w-56 bg-white shrink-0 p-4"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}>
            <h3 className="font-bold text-gray-800 text-lg mb-4">FAQ</h3>
            <div className="flex flex-col gap-3">
              {faqCategories.map((cat, i) => (
                <button key={i} onClick={() => router.push(`/faq/${cat.key}`)}
                  className="flex items-center gap-3 p-3 hover:bg-epson-light transition-all text-left w-full"
                  style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}>
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