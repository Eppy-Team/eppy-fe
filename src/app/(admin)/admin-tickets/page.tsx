"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getAllTicketsAdmin, updateTicketStatus, respondTicket } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

const CustomDropdown = ({ value, options, onChange }: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white min-w-36"
        style={{ backgroundColor: "#003087", borderRadius: "8px" }}>
        {selectedLabel}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 w-full bg-white z-20 overflow-hidden"
            style={{ border: "1px solid #D4E6F7", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "140px" }}>
            {options.map((opt) => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full text-center px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                style={{ color: value === opt.value ? "#003087" : "#374151", fontWeight: value === opt.value ? "600" : "400" }}>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
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
  user?: { name: string; email: string };
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "OPEN": return { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e", label: "Baru" };
    case "ON_PROGRESS": return { bg: "#dbeafe", color: "#1d4ed8", dot: "#3b82f6", label: "Diproses" };
    case "RESOLVED": return { bg: "#fef9c3", color: "#ca8a04", dot: "#eab308", label: "Selesai" };
    case "CLOSED": return { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af", label: "Ditutup" };
    default: return { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af", label: status };
  }
};

const STATUS_OPTIONS = [
  { label: "Status", value: "" },
  { label: "Baru", value: "OPEN" },
  { label: "Diproses", value: "ON_PROGRESS" },
  { label: "Selesai", value: "RESOLVED" },
  { label: "Ditutup", value: "CLOSED" },
];

const PERIOD_OPTIONS = [
  { label: "Periode", value: "" },
  { label: "Hari Ini", value: "today" },
  { label: "Minggu Ini", value: "week" },
  { label: "Bulan Ini", value: "month" },
];

export default function AdminTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("");
  const [avgResponseTime, setAvgResponseTime] = useState("--:--:--");
  const { toast, showToast, hideToast } = useToast();
  const perPage = 10;

  const fetchTickets = async (p = 1, status = "", periode = "") => {
    setLoading(true);
    try {
      // Jika ada filter aktif, fetch semua data sekaligus agar client-side filter bisa bekerja
      const limitToUse = (status || periode) ? 999 : perPage;
      const res = await getAllTicketsAdmin(1, limitToUse, status || undefined);
      let data: Ticket[] = res.data || [];
      setAvgResponseTime(res.meta?.avgResponseTime || "--:--:--");

      // Filter status di client-side sebagai fallback jika API tidak memfilter
      if (status) {
        data = data.filter((t) => t.status === status);
      }

      if (periode) {
        const now = new Date();
        data = data.filter((t) => {
          const created = new Date(t.createdAt);
          if (periode === "today") return created.toDateString() === now.toDateString();
          if (periode === "week") {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return created >= weekAgo;
          }
          if (periode === "month") return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          return true;
        });
      }

      setTickets(data);
      // Gunakan total dari data yang sudah difilter jika ada filter aktif
      const total = (status || periode) ? data.length : (res.meta?.total || data.length);
      setTotalData(total);
      setTotalPages((status || periode) ? 1 : (res.meta?.totalPages || Math.ceil(total / perPage) || 1));
    } catch {
      showToast("Gagal memuat tiket.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(page, statusFilter, periodeFilter);
  }, [page, statusFilter, periodeFilter]);

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      await updateTicketStatus(ticketId, status);
      setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status } : t));
      if (selectedTicket?.id === ticketId) setSelectedTicket((prev) => prev ? { ...prev, status } : prev);
      showToast("Status tiket berhasil diupdate.", "success");
    } catch {
      showToast("Gagal update status tiket.", "error");
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
      showToast("Respons berhasil dikirim.", "success");
    } catch (err: any) {
      showToast(err.message || "Gagal mengirim respons.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard requiredRole="ADMIN">
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F0F7FF" }}>
        <AdminSidebar active="/admin-tickets" />

        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-bold mb-6" style={{ color: "#003087" }}>Dashboard Tiket</h1>

          {!selectedTicket ? (
            <div className="bg-white rounded-xl p-6 mb-4" style={{ border: "1px solid #D4E6F7" }}>
              {/* Stat Cards */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                {[
                  { label: "Total Tiket", value: totalData },
                  { label: "Tiket Baru", value: tickets.filter((t) => t.status === "OPEN").length },
                  { label: "Tiket Aktif", value: tickets.filter((t) => t.status === "ON_PROGRESS").length },
                  { label: "Tiket Selesai", value: tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length },
                  { label: "Waktu Balas", value: avgResponseTime, small: true },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg p-4 text-center" style={{ border: "1px solid #D4E6F7" }}>
                    <p className="text-xs text-gray-500 mb-2 font-medium">{s.label}</p>
                    <p className={`font-bold ${s.small ? "text-lg" : "text-2xl"}`} style={{ color: "#003087" }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Filter */}
              <div className="flex items-center gap-6 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Periode</span>
                  <CustomDropdown
                    value={periodeFilter}
                    options={PERIOD_OPTIONS}
                    onChange={(v) => { setPeriodeFilter(v); setPage(1); }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <CustomDropdown
                    value={statusFilter}
                    options={STATUS_OPTIONS}
                    onChange={(v) => { setStatusFilter(v); setPage(1); }}
                  />
                </div>
              </div>

              {/* Tabel */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: "#003087", borderTopColor: "transparent" }} />
                </div>
              ) : tickets.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Tidak ada tiket ditemukan.</p>
              ) : (
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D4E6F7" }}>
                  <div className="grid grid-cols-4 px-6 py-3 bg-white" style={{ borderBottom: "1px solid #D4E6F7" }}>
                    {["PENGGUNA", "STATUS", "TANGGAL", "AKSI"].map((h) => (
                      <div key={h} className="flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-500 tracking-wide px-4 py-1.5 rounded-full"
                          style={{ backgroundColor: "#F0F7FF", border: "1px solid #D4E6F7" }}>
                          {h}
                        </span>
                      </div>
                    ))}
                  </div>
                  {tickets.map((row) => {
                    const s = getStatusStyle(row.status);
                    return (
                      <div key={row.id}
                        className="grid grid-cols-4 px-6 py-3 items-center hover:bg-blue-50 transition-colors"
                        style={{ borderBottom: "1px solid #F0F7FF" }}>
                        {/* Pengguna */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                            style={{ backgroundColor: "#D4E6F7", color: "#003087" }}>
                            {(row.user?.name || row.title)?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm truncate max-w-[150px]">
                              {row.user?.name || row.title || "-"}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                              {row.user?.email || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex justify-center">
                          <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                            style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.dot}` }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                            {s.label}
                          </span>
                        </div>

                        {/* Tanggal */}
                        <div className="flex justify-center">
                          <span className="text-sm text-gray-600">
                            {new Date(row.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>

                        {/* Aksi */}
                        <div className="flex justify-center">
                          <button onClick={() => { setSelectedTicket(row); setResponse(""); }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-full hover:opacity-90"
                            style={{ backgroundColor: "#003087" }}>
                            Lihat Detail
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination - hanya tampil jika lebih dari 1 halaman */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #D4E6F7" }}>
                  <span className="text-sm text-gray-500">
                    Menampilkan {totalData === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, totalData)} dari {totalData} tiket
                  </span>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="px-4 py-1.5 text-sm rounded border transition-colors disabled:opacity-40"
                      style={{ borderColor: "#D4E6F7" }}>Prev</button>
                    <span className="text-sm text-gray-600">{page} / {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                      className="px-4 py-1.5 text-sm rounded border transition-colors disabled:opacity-40"
                      style={{ borderColor: "#D4E6F7" }}>Next</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Detail Tiket */
            <div className="bg-white rounded-xl p-8" style={{ border: "1px solid #D4E6F7" }}>
              <button onClick={() => setSelectedTicket(null)} className="text-sm mb-6 hover:underline" style={{ color: "#003087" }}>
                ← Kembali ke daftar tiket
              </button>

              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: "#003087" }}>{selectedTicket.title}</h2>
                  <p className="text-sm font-medium mt-0.5" style={{ color: "#003087" }}>#{selectedTicket.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="flex gap-2">
                  {["OPEN", "ON_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
                    <button key={s} onClick={() => handleUpdateStatus(selectedTicket.id, s)}
                      className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                      style={{
                        backgroundColor: selectedTicket.status === s ? getStatusStyle(s).bg : "#f3f4f6",
                        color: selectedTicket.status === s ? getStatusStyle(s).color : "#6b7280",
                        border: selectedTicket.status === s ? `1px solid ${getStatusStyle(s).dot}` : "1px solid #e5e7eb",
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
                    style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 2px 12px", backgroundColor: "#EBF4FF" }}>
                    {selectedTicket.description}
                  </div>
                </div>
                {selectedTicket.adminResponse ? (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 text-sm text-gray-700 max-w-lg whitespace-pre-line"
                      style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}>
                      {selectedTicket.adminResponse}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 text-sm text-gray-400 italic"
                      style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}>
                      Belum ada respons...
                    </div>
                  </div>
                )}
              </div>

              {selectedTicket.status !== "CLOSED" && selectedTicket.status !== "RESOLVED" && (
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-gray-700">Kirim Respons</label>
                  <textarea value={response} onChange={(e) => setResponse(e.target.value)}
                    placeholder="Tulis respons untuk pengguna..."
                    rows={4}
                    className="w-full px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none resize-none"
                    style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }} />
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </AuthGuard>
  );
}