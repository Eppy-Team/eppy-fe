"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardChatbot, exportReport } from "@/lib/api";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";

const CustomDropdown = ({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white min-w-36"
        style={{ backgroundColor: "#003087", borderRadius: "8px" }}>
        {value}
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
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-center px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                style={{ color: value === opt ? "#003087" : "#374151", fontWeight: value === opt ? "600" : "400" }}>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PieChart = ({ data, onSliceClick }: {
  data: { label: string; value: number; color: string }[];
  onSliceClick?: (label: string) => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <div className="w-[180px] h-[180px] rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Tidak ada data</div>;

  let cumulative = 0;
  const slices = data.map((d) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const r = 90;
    const x1 = 100 + r * Math.cos(startAngle);
    const y1 = 100 + r * Math.sin(startAngle);
    const x2 = 100 + r * Math.cos(endAngle);
    const y2 = 100 + r * Math.sin(endAngle);
    const largeArc = d.value / total > 0.5 ? 1 : 0;
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    return {
      ...d,
      path: `M 100 100 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      midAngle,
      percent: ((d.value / total) * 100).toFixed(1),
    };
  });

  return (
    <div className="relative">
      <svg
        width="180" height="180" viewBox="0 0 200 200"
        style={{ cursor: "pointer" }}
      >
        {slices.map((s, i) => {
          const isHovered = hoveredIndex === i;
          const offset = isHovered ? 8 : 0;
          const tx = offset * Math.cos(s.midAngle);
          const ty = offset * Math.sin(s.midAngle);
          return (
            <path
              key={i}
              d={s.path}
              fill={s.color}
              transform={`translate(${tx}, ${ty})`}
              style={{
                transition: "transform 0.2s ease",
                filter: isHovered ? "brightness(1.1)" : "none",
              }}
              onMouseEnter={(e) => {
                setHoveredIndex(i);
                const rect = (e.currentTarget.closest("svg") as SVGElement).getBoundingClientRect();
                setTooltip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
              onMouseMove={(e) => {
                const rect = (e.currentTarget.closest("svg") as SVGElement).getBoundingClientRect();
                setTooltip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
              onMouseLeave={() => { setHoveredIndex(null); setTooltip(null); }}
              onClick={() => onSliceClick?.(s.label)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && tooltip && (
        <div
          className="absolute z-30 pointer-events-none px-3 py-2 text-xs text-white rounded-lg shadow-lg"
          style={{
            backgroundColor: "#003087",
            left: tooltip.x + 12,
            top: tooltip.y - 36,
            whiteSpace: "nowrap",
          }}
        >
          <p className="font-semibold">{slices[hoveredIndex].label}</p>
          <p>{slices[hoveredIndex].value} percakapan ({slices[hoveredIndex].percent}%)</p>
        </div>
      )}
    </div>
  );
};

const statusConfig: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  "HELPFUL": { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e", label: "Puas" },
  "NOT_HELPFUL": { bg: "#fff1f2", color: "#e11d48", dot: "#f43f5e", label: "Tidak Puas" },
  "null": { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af", label: "Belum dinilai" },
};

const statusApiMap: Record<string, string | undefined> = {
  "Status": undefined,
  "Puas": "HELPFUL",
  "Tidak Puas": "NOT_HELPFUL",
};

const getPeriodeDates = (periode: string) => {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const toStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = toStr(today);
  if (periode === "Hari Ini") return { startDate: todayStr, endDate: todayStr };
  if (periode === "Minggu Ini") { const s = new Date(today); s.setDate(today.getDate() - 7); return { startDate: toStr(s), endDate: todayStr }; }
  if (periode === "Bulan Ini") { const s = new Date(today.getFullYear(), today.getMonth(), 1); return { startDate: toStr(s), endDate: todayStr }; }
  return { startDate: undefined, endDate: undefined };
};

type ConversationRow = {
  id: string;
  userName: string;
  userEmail: string;
  lastFeedback: string | null;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [periodeFilter, setPeriodeFilter] = useState("Periode");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pieData, setPieData] = useState({ helpful: 0, notHelpful: 0 });
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchData = async (currentPage: number, status: string, periode: string) => {
    setLoading(true);
    try {
      const apiStatus = statusApiMap[status];
      const { startDate, endDate } = getPeriodeDates(periode);
      const hasFilter = status !== "Status" || periode !== "Periode";
      const limitToUse = hasFilter ? 999 : perPage;
      const res = await getDashboardChatbot(1, limitToUse, apiStatus, startDate, endDate);
      const data = res.data;
      const meta = res.meta;
      let rawList: any[] = data?.conversations || [];

      // Filter client-side untuk periode
      if (periode !== "Periode") {
        const now = new Date();
        rawList = rawList.filter((item: any) => {
          if (!item.createdAt) return false;
          const created = new Date(item.createdAt);
          if (periode === "Hari Ini") return created.toDateString() === now.toDateString();
          if (periode === "Minggu Ini") {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return created >= weekAgo;
          }
          if (periode === "Bulan Ini") return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          return true;
        });
      }

      // Filter client-side untuk status
      if (status !== "Status" && apiStatus) {
        rawList = rawList.filter((item: any) => item.lastFeedback === apiStatus);
      }

      // Pagination manual setelah filter
      const totalFiltered = rawList.length;
      const start = (currentPage - 1) * perPage;
      const paginated = hasFilter ? rawList.slice(start, start + perPage) : rawList;

      const mapped: ConversationRow[] = paginated.map((item: any) => ({
        id: item.id,
        userName: item.user?.name || "-",
        userEmail: item.user?.email || "-",
        lastFeedback: item.lastFeedback ?? "null",
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
          : "-",
      }));

      setRows(mapped);
      setTotalData(hasFilter ? totalFiltered : (meta?.total || 0));
      setTotalPages(hasFilter ? (Math.ceil(totalFiltered / perPage) || 1) : (meta?.totalPages || 1));

      if (data?.satisfactionChart) {
        setPieData({
          helpful: data.satisfactionChart.helpful || 0,
          notHelpful: data.satisfactionChart.notHelpful || 0,
        });
      }
    } catch (err) {
      console.error("Gagal fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, statusFilter, periodeFilter);
  }, [page, statusFilter, periodeFilter]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const blob = await exportReport("excel", "2024-01-01", today);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-chatbot-${today}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal download:", err);
    } finally {
      setDownloading(false);
    }
  };

  const pieKepuasan = [
    { label: "Puas", value: pieData.helpful, color: "#003087" },
    { label: "Tidak puas", value: pieData.notHelpful, color: "#5BA3D9" },
  ];

  return (
    <AuthGuard>
        <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F0F7FF" }}>
        <AdminSidebar active="/dashboard" />

        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-bold mb-6" style={{ color: "#003087" }}>Dashboard Chatbot</h1>

          <div className="bg-white rounded-xl p-6 mb-4" style={{ border: "1px solid #D4E6F7" }}>
            {/* Pie Chart */}
            <div className="flex items-center justify-center gap-10 mb-8">
              <div className="flex flex-col gap-2">
                {pieKepuasan.map((d) => (
                  <div key={d.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-sm text-gray-600">{d.label}</span>
                  </div>
                ))}
              </div>
              <PieChart
                data={pieKepuasan}
                onSliceClick={(label) => {
                  const map: Record<string, string> = { "Puas": "Puas", "Tidak puas": "Tidak Puas" };
                  const val = map[label];
                  if (val) { setStatusFilter(val); setPage(1); }
                }}
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-6 mb-5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Periode</span>
                <CustomDropdown
                  value={periodeFilter}
                  options={["Periode", "Hari Ini", "Minggu Ini", "Bulan Ini"]}
                  onChange={(v) => { setPeriodeFilter(v); setPage(1); }}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Status : </span>
                <CustomDropdown
                  value={statusFilter}
                  options={["Status", "Puas", "Tidak Puas"]}
                  onChange={(v) => { setStatusFilter(v); setPage(1); }}
                />
              </div>
            </div>

            {/* Tabel */}
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

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: "#003087", borderTopColor: "transparent" }} />
                </div>
              ) : rows.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <p className="text-sm text-gray-400">Tidak ada data</p>
                </div>
              ) : (
                rows.map((row) => {
                  const s = statusConfig[row.lastFeedback ?? "null"] ?? statusConfig["null"];
                  return (
                    <div key={row.id}
                      className="grid grid-cols-4 px-6 py-3 items-center hover:bg-blue-50 transition-colors"
                      style={{ borderBottom: "1px solid #F0F7FF" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                          style={{ backgroundColor: "#D4E6F7", color: "#003087" }}>
                          {row.userName[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{row.userName}</p>
                          <p className="text-xs text-gray-500">{row.userEmail}</p>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                          style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.dot}` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                          {s.label}
                        </span>
                      </div>

                      <div className="flex justify-center">
                        <span className="text-sm text-gray-600">{row.createdAt}</span>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={() => router.push(`/dashboard/conversation/${row.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-full hover:opacity-90"
                          style={{ backgroundColor: "#003087" }}>
                          Lihat Chatbot
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination - hanya tampil jika lebih dari 1 halaman */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #D4E6F7" }}>
                <span className="text-sm text-gray-500">
                  Menampilkan {totalData === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, totalData)} dari {totalData}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-40 hover:bg-blue-50"
                    style={{ borderColor: "#D4E6F7" }}>
                    Prev
                  </button>
                  <span className="text-sm text-gray-500">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-1.5 text-sm rounded-lg border transition-colors disabled:opacity-40 hover:bg-blue-50"
                    style={{ borderColor: "#D4E6F7" }}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Download */}
          <div className="flex justify-end">
            <button onClick={handleDownload} disabled={downloading}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#003087" }}>
              {downloading ? "Mengunduh..." : "Download"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
        </main>
      </div>
    </RoleGuard>
      </AuthGuard>
  );
}