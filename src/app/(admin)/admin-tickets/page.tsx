"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { getAllTicketsAdmin, updateTicketStatus, respondTicket } from "@/lib/api";

const AdminNavbar = ({ router }: { router: ReturnType<typeof useRouter> }) => (
  <nav className="w-full bg-white border-b px-8 py-3 flex items-center justify-between sticky top-0 z-50"
    style={{ borderColor: "#D4E6F7" }}>
    <button onClick={() => router.push("/dashboard")}>
      <span className="font-bold text-2xl tracking-tight" style={{ color: "#003087" }}>EPSON</span>
    </button>
    <div className="flex items-center gap-8">
      {["Produk", "Solusi", "Tempat Pembelian", "Dukungan", "Keberlanjutan"].map((item) => (
        <button key={item} className="text-sm text-gray-700 font-medium">{item}</button>
      ))}
    </div>
    <button onClick={() => router.push("/login")}
      className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80"
      style={{ backgroundColor: "#003087" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </button>
  </nav>
);

const AdminSidebar = ({ active, router }: { active: string; router: ReturnType<typeof useRouter> }) => {
  const items = [
    { label: "Dashboard Chatbot", path: "/dashboard", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
    { label: "Dashboard Tiket", path: "/admin-tickets", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12v10H4V12" /><path d="M22 7H2v5h20V7z" /></svg> },
    { label: "Knowledge Based", path: "/knowledge-base", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
  ];
  return (
    <aside className="w-56 bg-white flex flex-col shrink-0"
      style={{ borderRight: "1px solid #D4E6F7", position: "sticky", top: "57px", height: "calc(100vh - 57px)", overflowY: "auto" }}>
      <div className="p-4 flex flex-col gap-1">
        {items.map((item) => (
          <button key={item.label} onClick={() => router.push(item.path)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full text-left"
            style={{ backgroundColor: active === item.path ? "#DDEAF6" : "transparent", color: active === item.path ? "#003087" : "#374151" }}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
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

export default function AdminTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchTickets = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getAllTicketsAdmin(p, 10);
      setTickets(res.data || []);
      if (res.meta) setTotalPages(res.meta.totalPages || 1);
    } catch {
      // abaikan error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(page); }, [page]);

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      await updateTicketStatus(ticketId, status);
      setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status } : t));
      if (selectedTicket?.id === ticketId) setSelectedTicket((prev) => prev ? { ...prev, status } : prev);
    } catch {
      alert("Gagal update status.");
    }
  };

  const handleRespond = async () => {
    if (!selectedTicket || !response.trim()) return;
    setSaving(true);
    try {
      await respondTicket(selectedTicket.id, response);
      setSelectedTicket((prev) => prev ? { ...prev, adminResponse: response, status: "RESOLVED" } : prev);
      setTickets((prev) => prev.map((t) => t.id === selectedTicket.id ? { ...t, adminResponse: response, status: "RESOLVED" } : t));
      setResponse("");
    } catch {
      alert("Gagal mengirim respons.");
    } finally {
      setSaving(false);
    }
  };

  const totalTickets = tickets.length;
  const newTickets = tickets.filter((t) => t.status === "OPEN").length;
  const activeTickets = tickets.filter((t) => t.status === "ON_PROGRESS").length;
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;

  return (
    <AuthGuard>
      <div className="flex flex-col" style={{ height: "100vh", overflow: "hidden" }}>
        <AdminNavbar router={router} />
        <div className="flex" style={{ height: "calc(100vh - 57px)", overflow: "hidden" }}>
          <AdminSidebar active="/admin-tickets" router={router} />
          <main className="flex-1 p-8" style={{ height: "100%", overflowY: "auto" }}>
            <h1 className="text-2xl font-bold mb-6" style={{ color: "#003087" }}>Dashboard Tiket</h1>

            {!selectedTicket ? (
              <div className="bg-white rounded-xl p-6 mb-4" style={{ border: "1px solid #D4E6F7" }}>
                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Total Tiket", value: totalTickets },
                    { label: "Tiket Baru", value: newTickets },
                    { label: "Tiket Aktif", value: activeTickets },
                    { label: "Tiket Selesai", value: resolvedTickets },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg p-4 text-center" style={{ border: "1px solid #D4E6F7" }}>
                      <p className="text-xs text-gray-500 mb-2">{s.label}</p>
                      <p className="text-2xl font-bold" style={{ color: "#003087" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Tabel */}
                {loading ? (
                  <p className="text-sm text-gray-500 text-center py-8">Memuat tiket...</p>
                ) : tickets.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">Belum ada tiket.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #D4E6F7" }}>
                        {["JUDUL", "STATUS", "TANGGAL", "AKSI"].map((h) => (
                          <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((row) => {
                        const s = getStatusStyle(row.status);
                        return (
                          <tr key={row.id} className="hover:bg-blue-50 transition-colors" style={{ borderBottom: "1px solid #F0F7FF" }}>
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-800 text-sm truncate max-w-xs">{row.title}</p>
                              <p className="text-xs text-gray-400 truncate max-w-xs">{row.description}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-xs font-medium px-3 py-1 rounded-full"
                                style={{ backgroundColor: s.bg, color: s.color }}>
                                {s.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {new Date(row.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="py-3 px-4">
                              <button onClick={() => { setSelectedTicket(row); setResponse(""); }}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-full hover:opacity-90"
                                style={{ backgroundColor: "#003087" }}>
                                Lihat Detail
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #D4E6F7" }}>
                  <span className="text-sm text-gray-500">Halaman {page} dari {totalPages}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="px-4 py-1.5 text-sm rounded border transition-colors disabled:opacity-40"
                      style={{ borderColor: "#D4E6F7" }}>Prev</button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="px-4 py-1.5 text-sm rounded border transition-colors disabled:opacity-40"
                      style={{ borderColor: "#D4E6F7" }}>Next</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8" style={{ border: "1px solid #D4E6F7" }}>
                <button onClick={() => setSelectedTicket(null)} className="text-sm mb-6 hover:underline" style={{ color: "#003087" }}>
                  ← Kembali ke daftar tiket
                </button>

                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold" style={{ color: "#003087" }}>{selectedTicket.title}</h2>
                  <div className="flex gap-2">
                    {["OPEN", "ON_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
                      <button key={s} onClick={() => handleUpdateStatus(selectedTicket.id, s)}
                        className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                        style={{
                          backgroundColor: selectedTicket.status === s ? getStatusStyle(s).bg : "#f3f4f6",
                          color: selectedTicket.status === s ? getStatusStyle(s).color : "#6b7280",
                          border: selectedTicket.status === s ? `1px solid ${getStatusStyle(s).color}` : "1px solid #e5e7eb",
                        }}>
                        {getStatusStyle(s).label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                  {new Date(selectedTicket.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex justify-end">
                    <div className="px-4 py-2.5 text-sm text-gray-700 max-w-lg"
                      style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 2px 12px", backgroundColor: "#f8fbff" }}>
                      {selectedTicket.description}
                    </div>
                  </div>
                  {selectedTicket.adminResponse && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 text-sm text-gray-700 max-w-lg whitespace-pre-line"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}>
                        {selectedTicket.adminResponse}
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Respons */}
                {selectedTicket.status !== "CLOSED" && (
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700">Kirim Respons</label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Tulis respons untuk pengguna..."
                      rows={4}
                      className="w-full px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none resize-none"
                      style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                    />
                    <div className="flex justify-end">
                      <button onClick={handleRespond} disabled={saving || !response.trim()}
                        className="px-8 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: "#003087", borderRadius: "4px" }}>
                        {saving ? "Mengirim..." : "Kirim Respons"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}