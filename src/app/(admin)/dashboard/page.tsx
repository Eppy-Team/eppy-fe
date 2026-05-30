"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardChatbot, exportReport } from "@/lib/api";
import Link from "next/link";

const navItems = [
  { label: "Produk", url: "https://www.epson.co.id/id/viewcon/corporatesite/product/maincontent/index" },
  { label: "Solusi", url: "https://www.epson.co.id/id/viewcon/corporatesite/solution/maincontent/index" },
  { label: "Tempat Pembelian", url: "https://www.epson.co.id/id/viewcon/corporatesite/wheretobuy/maincontent/index" },
  { label: "Dukungan", url: "https://www.epson.co.id/id/viewcon/corporatesite/support/maincontent/index" },
  { label: "Keberlanjutan", url: "https://www.epson.co.id/id/viewcon/corporatesite/sustainability/maincontent/index" },
];

const AdminNavbar = ({ router }: { router: ReturnType<typeof useRouter> }) => (
  <nav className="w-full bg-white border-b px-8 py-3 flex items-center justify-between sticky top-0 z-50"
    style={{ borderColor: "#D4E6F7" }}>
    <button onClick={() => router.push("/dashboard")} className="flex items-center gap-3">
      <img src="/images/eppy-logo.png" alt="Eppy" className="w-10 h-10 object-contain" />
      <span className="font-bold text-2xl tracking-tight" style={{ color: "#003087" }}>Eppy</span>
    </button>
    <div className="flex items-center gap-8">
      {navItems.map((item) => (
        <Link key={item.label} href={item.url} target="_blank" rel="noopener noreferrer"
          className="text-sm text-gray-700 font-medium transition-colors hover:text-blue-700">
          {item.label}
        </Link>
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
        {items.map((item) => {
          const isActive = active === item.path;
          return (
            <button key={item.label} onClick={() => router.push(item.path)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full text-left"
              style={{ backgroundColor: isActive ? "#DDEAF6" : "transparent", color: isActive ? "#003087" : "#374151" }}>
              {item.icon}{item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

const CustomDropdown = ({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white min-w-36"
        style={{ backgroundColor: "#003087", borderRadius: "8px" }}>
        {value}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <>
          {/* overlay untuk close saat klik luar */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 w-full bg-white z-20 overflow-hidden"
            style={{ border: "1px solid #D4E6F7", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: "140px" }}>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
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

const PieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <div className="w-[180px] h-[180px] rounded-full bg-gray-100" />;
  let cumulative = 0;
  const slices = data.map((d) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = 100 + 90 * Math.cos(startAngle);
    const y1 = 100 + 90 * Math.sin(startAngle);
    const x2 = 100 + 90 * Math.cos(endAngle);
    const y2 = 100 + 90 * Math.sin(endAngle);
    const largeArc = d.value / total > 0.5 ? 1 : 0;
    return { ...d, path: `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z` };
  });
  return (
    <svg width="180" height="180" viewBox="0 0 200 200">
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
    </svg>
  );
};

const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
  "Puas": { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  "Tidak Puas": { bg: "#fff1f2", color: "#e11d48", dot: "#f43f5e" },
  "Lanjut ke Tiket": { bg: "#f0f9ff", color: "#0070C0", dot: "#0070C0" },
};

const statusApiToLabel: Record<string, string> = {
  "HELPFUL": "Puas",
  "NOT_HELPFUL": "Tidak Puas",
  "helpful": "Puas",
  "notHelpful": "Tidak Puas",
};

// SESUDAH
const statusApiMap: Record<string, string | undefined> = {
  "Status": undefined,
  "Puas": "HELPFUL",
  "Tidak Puas": "NOT_HELPFUL",
};

const getPeriodeDates = (periode: string) => {
  const today = new Date();
  // Gunakan waktu lokal, bukan UTC
  const pad = (n: number) => String(n).padStart(2, "0");
  const toStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = toStr(today);

  if (periode === "Hari Ini") {
    return { startDate: todayStr, endDate: todayStr };
  } else if (periode === "Minggu Ini") {
    const start = new Date(today);
    start.setDate(today.getDate() - 7);
    return { startDate: toStr(start), endDate: todayStr };
  } else if (periode === "Bulan Ini") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate: toStr(start), endDate: todayStr };
  }
  return { startDate: undefined, endDate: undefined };
};

type ConversationRow = {
  id: string;
  userName: string;
  userEmail: string;
  status: string;
  createdAt: string;
  conversationId?: string;
  rawDate?: string;
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

      const res = await getDashboardChatbot(currentPage, perPage, apiStatus, startDate, endDate);
      const data = res.data;

      const rawList = data?.conversations || data?.data || [];

      const currentStatusLabel =
        apiStatus === "HELPFUL" ? "Puas" :
          apiStatus === "NOT_HELPFUL" ? "Tidak Puas" :
            "Puas";

      let mapped: ConversationRow[] = rawList.map((item: any) => ({
        id: item.id,
        userName: item.user?.name || "-",
        userEmail: item.user?.email || "-",
        status: currentStatusLabel,
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
          : "-",
        conversationId: item.id,
        rawDate: item.createdAt ? item.createdAt.split("T")[0] : "",
      }));

      // Filter periode di frontend
      if (startDate && endDate) {
        mapped = mapped.filter((item: any) => {
          return item.rawDate >= startDate && item.rawDate <= endDate;
        });
      }

      setRows(mapped);
      setTotalData(mapped.length);
      setTotalPages(Math.ceil(mapped.length / perPage) || 1);

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
      const startDate = "2024-01-01";
      const blob = await exportReport("excel", startDate, today);
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

  const headers = ["PENGGUNA", "STATUS", "TANGGAL", "AKSI"];

  return (
    <div className="flex flex-col" style={{ height: "100vh", overflow: "hidden" }}>
      <AdminNavbar router={router} />
      <div className="flex" style={{ height: "calc(100vh - 57px)", overflow: "hidden" }}>
        <AdminSidebar active="/dashboard" router={router} />

        <main className="flex-1 p-8" style={{ height: "100%", overflowY: "auto", backgroundColor: "#F0F7FF" }}>
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
              <PieChart data={pieKepuasan} />
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
                <span className="text-sm font-medium text-gray-700">Status</span>
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
                {headers.map((h) => (
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
                  const s = statusConfig[row.status] ?? statusConfig["Puas"];
                  return (
                    <div key={row.id} className="grid grid-cols-4 px-6 py-3 items-center hover:bg-blue-50 transition-colors"
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
                          {row.status}
                        </span>
                      </div>

                      <div className="flex justify-center">
                        <span className="text-sm text-gray-600">{row.createdAt}</span>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={() => router.push(`/dashboard/conversation/${row.conversationId}`)}
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #D4E6F7" }}>
              <span className="text-sm text-gray-500">
                Menampilkan {totalData === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, totalData)} dari {totalData}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-1.5 text-sm rounded border transition-colors disabled:opacity-40"
                  style={{ borderColor: "#D4E6F7" }}>
                  Prev
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                  className="px-4 py-1.5 text-sm rounded border transition-colors disabled:opacity-40"
                  style={{ borderColor: "#D4E6F7" }}>
                  Next
                </button>
              </div>
            </div>
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
    </div>
  );
}