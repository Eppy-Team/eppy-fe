"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";

export default function NewTicketPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    produk: "",
    deskripsi: "",
    file: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ticketId = "#00234";

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setForm((prev) => ({ ...prev, file: file.name }));
    }
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#DDEAF6" }}>
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          {!submitted ? (
            <div
              className="bg-white w-full max-w-xl px-12 py-10"
              style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
            >
              <h1 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                Buat Tiket Baru
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                Silakan isi formulir di bawah ini untuk membuat tiket baru.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Produk */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Produk <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="produk"
                      value={form.produk}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 text-sm text-gray-500 bg-white appearance-none focus:outline-none"
                      style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                    >
                      <option value="">Produk</option>
                      <option value="printer">Printer</option>
                      <option value="scanner">Pemindai</option>
                      <option value="projector">Proyektor</option>
                      <option value="other">Lainnya</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Deskripsi Pertanyaan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    placeholder="Masukkan deskripsi kegiatan Anda..."
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 bg-white focus:outline-none resize-none"
                    style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                  />
                </div>

                {/* Upload File */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tambah File
                  </label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setForm({ ...form, file: file.name });
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center w-full py-4 cursor-pointer transition-all duration-200"
                    style={{
                      border: isDragging ? "2px dashed #003087" : "2px dashed #B8D0E8",
                      borderRadius: "4px",
                      backgroundColor: isDragging ? "#DDEAF6" : "white",
                      transform: isDragging ? "scale(1.01)" : "scale(1)",
                      boxShadow: isDragging ? "0 0 0 4px rgba(0,48,135,0.08)" : "none",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke={isDragging ? "#003087" : "#003087"} strokeWidth="1.5" className="mb-1">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    {form.file ? (
                      <span className="text-sm font-medium" style={{ color: "#003087" }}>
                        ✅ {form.file}
                      </span>
                    ) : isDragging ? (
                      <span className="text-sm font-medium" style={{ color: "#003087" }}>
                        Lepaskan file di sini...
                      </span>
                    ) : (
                      <>
                        <span className="text-sm font-medium" style={{ color: "#003087" }}>
                          Unggah File Disini
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">(.png/.jpg)</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Tombol */}
                <div className="flex justify-center mt-2">
                  <button
                    type="submit"
                    className="px-16 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#0070C0", borderRadius: "4px" }}
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div
              className="bg-white w-full max-w-lg px-12 py-12 text-center"
              style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
            >
              <h1 className="text-3xl font-bold mb-4" style={{ color: "#003087" }}>
                Tiket Berhasil Dibuat
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                Terima kasih, permintaan bantuan kamu sudah kami terima.
              </p>
              <p className="text-sm text-gray-600 mb-2">Nomor tiket kamu adalah :</p>
              <p className="text-3xl font-bold mb-6" style={{ color: "#003087" }}>
                {ticketId}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                ❤️ Tim Customer Service Epson akan menghubungi kamu melalui email dalam waktu maksimal{" "}
                <strong>2×24 jam.</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Kamu bisa memantau status tiket melalui tautan berikut:
              </p>
              <button
                onClick={() => router.push("/tickets")}
                className="text-sm font-medium hover:underline"
                style={{ color: "#003087" }}
              >
                🔗 Lihat Status Tiket
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}