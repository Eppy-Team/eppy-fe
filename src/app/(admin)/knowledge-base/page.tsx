"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { getAllKnowledges, createKnowledge, deleteKnowledge } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

type KBItem = {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  embeddingStatus: string;
  createdAt: string;
};

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
    <button
      onClick={() => router.push("/login")}
      className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
      style={{ backgroundColor: "#003087" }}
    >
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
    <aside className="w-64 bg-white flex flex-col shrink-0"
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

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [data, setData] = useState<KBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", file: null as File | null });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllKnowledges();
        setData(res.data || []);
      } catch {
        // abaikan error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.category || !form.file) return;
    setSaving(true);
    try {
      const res = await createKnowledge(form.title, form.category, form.file);
      setData((prev) => [res.data, ...prev]);
      setShowForm(false);
      setForm({ title: "", category: "", file: null });
    } catch {
      showToast("Gagal menyimpan data. Silakan coba lagi.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteKnowledge(id);
      setData((prev) => prev.filter((d) => d.id !== id));
      setDeleteId(null);
      setOpenId(null);
    } catch {
      showToast("Gagal menghapus data. Silakan coba lagi.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") setForm((prev) => ({ ...prev, file }));
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#DDEAF6" }}>
        <AdminNavbar router={router} />
        <div className="flex" style={{ minHeight: "calc(100vh - 57px)" }}>
          <AdminSidebar active="/knowledge-base" router={router} />
          <main className="flex-1 p-8 overflow-y-auto">
            {!showForm ? (
              <div className="w-full pr-8">
                {loading ? (
                  <p className="text-sm text-gray-500">Memuat data...</p>
                ) : data.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada data knowledge base.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {data.map((item) => {
                      const isOpen = openId === item.id;
                      return (
                        <div key={item.id} style={{ border: "1px solid #D4E6F7", borderRadius: "8px", overflow: "hidden", backgroundColor: "white" }}>
                          <button onClick={() => setOpenId(isOpen ? null : item.id)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                            style={{ backgroundColor: isOpen ? "#DDEAF6" : "white" }}>
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium" style={{ color: isOpen ? "#003087" : "#374151" }}>{item.title}</span>
                              <span className="text-xs text-gray-400">{item.category}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: item.embeddingStatus === "DONE" ? "#dcfce7" : "#fef9c3", color: item.embeddingStatus === "DONE" ? "#16a34a" : "#ca8a04" }}>
                                {item.embeddingStatus === "DONE" ? "Siap" : "Proses"}
                              </span>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke={isOpen ? "#003087" : "#6b7280"} strokeWidth="2"
                                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>
                          </button>
                          {isOpen && (
                            <div style={{ borderTop: "1px solid #D4E6F7" }}>
                              <div className="px-5 py-4 text-sm text-gray-700">
                                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  📄 Lihat File PDF
                                </a>
                              </div>
                              <div className="px-5 pb-4 flex justify-end">
                                <button onClick={() => setDeleteId(item.id)}
                                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                                  style={{ backgroundColor: "#003087" }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6" /><path d="M14 11v6" />
                                  </svg>
                                  Hapus Data
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <button onClick={() => { setForm({ title: "", category: "", file: null }); setShowForm(true); }}
                  className="fixed bottom-8 right-8 w-14 h-14 rounded-full text-white text-3xl flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#003087" }}>
                  +
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-10" style={{ border: "1px solid #D4E6F7" }}>
                  <h2 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>Tambah Data</h2>
                  <p className="text-sm text-gray-500 mb-8">Silakan isi formulir di bawah ini untuk menambah data</p>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul <span className="text-red-500">*</span></label>
                      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Masukkan judul knowledge"
                        className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none"
                        style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori <span className="text-red-500">*</span></label>
                      <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        placeholder="Contoh: Printer, Scanner, Proyektor"
                        className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none"
                        style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">File PDF <span className="text-red-500">*</span></label>
                      <input type="file" accept=".pdf" id="pdf-upload" className="hidden"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) setForm((prev) => ({ ...prev, file })); }} />
                      <label htmlFor="pdf-upload" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                        className="flex flex-col items-center justify-center w-full py-8 cursor-pointer transition-all duration-200"
                        style={{
                          border: isDragging ? "2px dashed #003087" : "2px dashed #B8D0E8",
                          borderRadius: "4px",
                          backgroundColor: isDragging ? "#DDEAF6" : "white",
                          transform: isDragging ? "scale(1.01)" : "scale(1)",
                          boxShadow: isDragging ? "0 0 0 4px rgba(0,48,135,0.08)" : "none",
                        }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003087" strokeWidth="1.5" className="mb-2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        {form.file ? (
                          <span className="text-sm font-medium" style={{ color: "#003087" }}>✅ {form.file.name}</span>
                        ) : isDragging ? (
                          <span className="text-sm font-medium" style={{ color: "#003087" }}>Lepaskan file di sini...</span>
                        ) : (
                          <span className="text-sm font-medium" style={{ color: "#003087" }}>Unggah PDF Disini</span>
                        )}
                      </label>
                    </div>
                    <div className="flex justify-center gap-3 mt-2">
                      <button onClick={() => setShowForm(false)}
                        className="px-8 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}>
                        Batal
                      </button>
                      <button onClick={handleSave} disabled={saving}
                        className="px-8 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: "#7EB3E0", borderRadius: "4px" }}>
                        {saving ? "Menyimpan..." : "Tambah Data"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {deleteId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" /><path d="M14 11v6" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus Data?</h2>
              <p className="text-sm text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{ border: "1px solid #D4E6F7" }}>
                  Batal
                </button>
                <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50">
                  {deleting ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </AuthGuard>
  );
}