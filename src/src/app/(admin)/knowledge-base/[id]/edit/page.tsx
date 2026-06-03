"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getKnowledgeById, updateKnowledge } from "@/lib/api";
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

export default function EditKnowledgePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<KBItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", category: "", file: null as File | null });
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await getKnowledgeById(id);
        const item = res.data;
        setData(item);
        setForm({ title: item.title, category: item.category, file: null });
      } catch {
        showToast("Gagal memuat data. Silakan coba lagi.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, showToast]);

  const handleSave = async () => {
    if (!form.title || !form.category) return;
    setSaving(true);
    try {
      await updateKnowledge(id, form.title, form.category, form.file);
      showToast("Data berhasil diperbarui.", "success");
      setTimeout(() => router.push("/knowledge-base"), 1000);
    } catch {
      showToast("Gagal memperbarui data. Silakan coba lagi.", "error");
    } finally {
      setSaving(false);
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
        <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F0F7FF" }}>
        <AdminSidebar active="/knowledge-base" />
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#F0F7FF" }}>
          {loading ? (
            <p className="text-sm text-gray-500">Memuat data...</p>
          ) : !data ? (
            <p className="text-sm text-gray-500">Data tidak ditemukan.</p>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-8" style={{ border: "2px solid #B8D0E8" }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#003087" }}>
                  Ubah Data Knowledge Base
                </h2>
                <p className="text-sm text-gray-600 mb-6">Silakan isi formulir di bawah ini untuk mengubah data</p>
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Judul <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Masukkan judul knowledge"
                      className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 rounded-lg focus:outline-none"
                      style={{ border: "2px solid #B8D0E8" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Contoh: Printer, Scanner, Proyektor"
                      className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 rounded-lg focus:outline-none"
                      style={{ border: "2px solid #B8D0E8" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      File PDF <span className="text-gray-500">(opsional)</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      id="pdf-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setForm((prev) => ({ ...prev, file }));
                      }}
                    />
                    <label
                      htmlFor="pdf-upload"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className="flex flex-col items-center justify-center w-full py-8 cursor-pointer transition-all duration-200 rounded-lg"
                      style={{
                        border: isDragging ? "2px dashed #003087" : "2px dashed #B8D0E8",
                        backgroundColor: isDragging ? "#DDEAF6" : "white",
                        transform: isDragging ? "scale(1.01)" : "scale(1)",
                        boxShadow: isDragging ? "0 0 0 4px rgba(0,48,135,0.08)" : "none",
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#003087"
                        strokeWidth="1.5"
                        className="mb-2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                      {form.file ? (
                        <span className="text-sm font-medium" style={{ color: "#003087" }}>
                          ✅ {form.file.name}
                        </span>
                      ) : isDragging ? (
                        <span className="text-sm font-medium" style={{ color: "#003087" }}>
                          Lepaskan file di sini...
                        </span>
                      ) : (
                        <span className="text-sm font-medium" style={{ color: "#003087" }}>
                          Unggah PDF Disini (opsional)
                        </span>
                      )}
                    </label>
                  </div>
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={() => router.push("/knowledge-base")}
                      className="px-8 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors rounded-lg"
                      style={{ border: "2px solid #B8D0E8" }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-8 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 rounded-lg"
                      style={{ backgroundColor: "#0070C0" }}
                    >
                      {saving ? "Menyimpan..." : "Ubah Data"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </RoleGuard>
      </AuthGuard>
  );
}
