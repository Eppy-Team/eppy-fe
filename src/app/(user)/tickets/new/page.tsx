"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthNavbar from "@/components/layout/AuthNavbar";
import AuthGuard from "@/components/AuthGuard";
import { createTicket } from "@/lib/api";

const productOptions = ["Printer", "Scanner", "Proyektor"];

function NewTicketForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const conversationId = searchParams.get("conversationId") || "";
    const messageId = searchParams.get("messageId") || "";
    const prefillDesc = searchParams.get("desc") || "";

    const [product, setProduct] = useState("");
    const [description, setDescription] = useState(prefillDesc);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openDropdown, setOpenDropdown] = useState(false);

    useEffect(() => {
        if (prefillDesc) setDescription(prefillDesc);
    }, [prefillDesc]);

    const handleSubmit = async () => {
        if (!product || !description.trim()) {
            setError("Produk dan deskripsi wajib diisi.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const title = `[${product}] ${description.slice(0, 60)}`;
            const res = await createTicket(title, description, conversationId, messageId);
            const newTicketId = res.data?.id;
            router.push(`/tickets/${newTicketId}`);
        } catch (err: any) {
            setError(err.message || "Gagal membuat tiket.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#EEF3FA" }}>
                <AuthNavbar />

                <div className="flex flex-1 items-center justify-center px-4 py-12">
                    <div className="w-full max-w-xl bg-white rounded-2xl p-8"
                        style={{ border: "1px solid #D4E6F7", boxShadow: "0 4px 24px rgba(0,48,135,0.06)" }}>

                        <h1 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>Buat Tiket Baru</h1>
                        <p className="text-sm text-gray-500 mb-8">Silakan isi formulir di bawah ini untuk membuat tiket baru.</p>

                        {/* Produk */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Produk <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown((v) => !v)}
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left"
                                    style={{
                                        border: "1px solid #D4E6F7",
                                        borderRadius: "8px",
                                        color: product ? "#1a1a2e" : "#9CA3AF",
                                        backgroundColor: "white",
                                    }}
                                >
                                    {product || "Produk"}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                                {openDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(false)} />
                                        <div className="absolute top-full mt-1 w-full bg-white z-20 overflow-hidden"
                                            style={{ border: "1px solid #D4E6F7", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                                            {productOptions.map((opt) => (
                                                <button key={opt}
                                                    onClick={() => { setProduct(opt); setOpenDropdown(false); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors"
                                                    style={{ color: product === opt ? "#003087" : "#374151", fontWeight: product === opt ? "600" : "400" }}>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Deskripsi Pertanyaan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Masukkan deskripsi kegiatan Anda..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none resize-none"
                                style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                        {/* Submit */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !product || !description.trim()}
                                className="px-16 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                                style={{ backgroundColor: "#0070C0", borderRadius: "8px" }}
                            >
                                {loading ? "Mengirim..." : "Kirim"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}

export default function NewTicketPage() {
    return (
        <Suspense>
            <NewTicketForm />
        </Suspense>
    );
}