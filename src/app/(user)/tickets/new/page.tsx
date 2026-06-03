"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthNavbar from "@/components/layout/AuthNavbar";
import AuthGuard from "@/components/AuthGuard";
import { createTicket } from "@/lib/api";

function NewTicketForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const conversationId = searchParams.get("conversationId") || "";
    const messageId = searchParams.get("messageId") || "";
    const prefillDesc = searchParams.get("desc") || "";

    const [description, setDescription] = useState(prefillDesc);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (prefillDesc) setDescription(prefillDesc);
    }, [prefillDesc]);

    const handleSubmit = async () => {
        if (!description.trim()) {
            setError("Deskripsi wajib diisi.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const title = description.slice(0, 60);
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
        <AuthGuard requiredRole="USER">
            <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#EEF3FA" }}>
                <AuthNavbar />

                <div className="flex flex-1 items-center justify-center px-4 py-12">
                    <div className="w-full max-w-xl bg-white rounded-2xl p-8"
                        style={{ border: "1px solid #D4E6F7", boxShadow: "0 4px 24px rgba(0,48,135,0.06)" }}>

                        <h1 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>Buat Tiket Baru</h1>
                        <p className="text-sm text-gray-500 mb-8">Silakan isi formulir di bawah ini untuk membuat tiket baru.</p>

                        {/* Deskripsi */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Deskripsi Pertanyaan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Masukkan deskripsi kegiatan Anda..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none resize-none"
                                style={{ border: "1px solid #D4E6F7", borderRadius: "8px" }}
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                        {/* Submit */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !description.trim()}
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