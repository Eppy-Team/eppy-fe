"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

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
    <aside
      className="w-56 bg-white flex flex-col shrink-0"
      style={{
        borderRight: "1px solid #D4E6F7",
        position: "sticky",
        top: "57px",
        height: "calc(100vh - 57px)",
        overflowY: "auto",
      }}
    >
      <div className="p-4 flex flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.path;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full text-left"
              style={{
                backgroundColor: isActive ? "#DDEAF6" : "transparent",
                color: isActive ? "#003087" : "#374151",
              }}
            >
              {item.icon}{item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

const CustomDropdown = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white min-w-28"
          style={{ backgroundColor: "#003087", borderRadius: "8px" }}
        >
          {value}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {open && (
          <div
            className="absolute top-full mt-1 w-full bg-white z-10 overflow-hidden"
            style={{ border: "1px solid #D4E6F7", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-center px-4 py-2 text-sm hover:bg-epson-light transition-colors"
                style={{ color: value === opt ? "#003087" : "#374151", fontWeight: value === opt ? "600" : "400" }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

const dummyData = Array.from({ length: 124 }, (_, i) => ({
  id: i + 1,
  nama: "Dwi Lestari",
  email: "dwi.batu@kopirasa.com",
  produk: "Printer",
  status: "Baru",
  tanggal: "10 Maret 2021",
}));

const PieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
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
    <svg width="200" height="200" viewBox="0 0 200 200">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} />
      ))}
    </svg>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [produkFilter, setProdukFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = dummyData.filter((d) => {
    const matchProduk = produkFilter === "Semua" || d.produk === produkFilter;
    const matchStatus = statusFilter === "Status" || d.status === statusFilter;
    return matchProduk && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const pieKategori = [
    { label: "Printer", value: 45, color: "#003087" },
    { label: "Pemindai", value: 25, color: "#0070C0" },
    { label: "Proyektor", value: 20, color: "#5BA3D9" },
    { label: "Lainnya", value: 10, color: "#D4E6F7" },
  ];

  const pieKepuasan = [
    { label: "Puas", value: 79, color: "#003087" },
    { label: "Tidak puas", value: 21, color: "#5BA3D9" },
  ];

  return (
    <div className="flex flex-col" style={{ height: "100vh", overflow: "hidden" }}>
      <AdminNavbar router={router} />

      <div className="flex" style={{ height: "calc(100vh - 57px)", overflow: "hidden" }}>
        <AdminSidebar active="/dashboard" router={router} />

        <main className="flex-1 p-8" style={{ height: "100%", overflowY: "auto" }}>
          <h1 className="text-2xl font-bold mb-6" style={{ color: "#003087" }}>Dashboard Chatbot</h1>

          <div className="bg-white rounded-xl p-6 mb-4" style={{ border: "1px solid #D4E6F7" }}>

            {/* Pie Charts */}
            <div className="flex gap-8 mb-8 justify-around items-center px-8">
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-2">
                  {pieKategori.map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-gray-600">{d.label}</span>
                    </div>
                  ))}
                </div>
                <PieChart data={pieKategori} />
              </div>

              <div style={{ width: "1px", height: "120px", backgroundColor: "#D4E6F7" }} />

              <div className="flex items-center gap-8">
                <PieChart data={pieKepuasan} />
                <div className="flex flex-col gap-2">
                  {pieKepuasan.map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-gray-600">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-6 mb-5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Produk</span>
                <CustomDropdown
                  value={produkFilter}
                  options={["Semua", "Printer", "Pemindai", "Proyektor"]}
                  onChange={(v) => { setProdukFilter(v); setPage(1); }}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <CustomDropdown
                  value={statusFilter}
                  options={["Status", "Baru", "Proses", "Selesai"]}
                  onChange={(v) => { setStatusFilter(v); setPage(1); }}
                />
              </div>
            </div>

            {/* Tabel */}
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #D4E6F7" }}>
                  {["PENGGUNA", "PRODUK", "STATUS", "TANGGAL", "AKSI"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => (
                  <tr key={row.id} className="hover:bg-epson-light transition-colors" style={{ borderBottom: "1px solid #F0F7FF" }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                          style={{ backgroundColor: "#D4E6F7", color: "#003087" }}>
                          {row.nama[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{row.nama}</p>
                          <p className="text-xs text-gray-500">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{ border: "1px solid #D4E6F7", color: "#003087" }}>
                        {row.produk}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium w-fit">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                        <span style={{ color: "#16a34a" }}>{row.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{row.tanggal}</td>
                    <td className="py-3 px-4">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-full hover:opacity-90"
                        style={{ backgroundColor: "#003087" }}>
                        Lihat Chatbot
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #D4E6F7" }}>
              <span className="text-sm text-gray-500">
                Menampilkan {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} dari {filtered.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-1.5 text-sm rounded border transition-colors disabled:opacity-40"
                  style={{ borderColor: "#D4E6F7" }}
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-4 py-1.5 text-sm rounded border transition-colors disabled:opacity-40"
                  style={{ borderColor: "#D4E6F7" }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Tombol Download */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#003087" }}>
              Download
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