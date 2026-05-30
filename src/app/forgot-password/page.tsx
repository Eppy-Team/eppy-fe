"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err: any) {
            showToast(err.message || "Gagal mengirim email reset password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#DDEAF6" }}>
            <nav
                className="w-full bg-white border-b px-8 py-3 flex items-center sticky top-0 z-50"
                style={{ borderColor: "#D4E6F7" }}
            >
                <button onClick={() => router.push("/login")} className="flex items-center gap-3">
                    <img src="/images/eppy-logo.png" alt="Eppy" className="w-10 h-10 object-contain" />
                    <span className="font-bold text-2xl tracking-tight" style={{ color: "#003087" }}>Eppy</span>
                </button>
            </nav>

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <div className="flex-1 flex items-center justify-center px-4">
                <div
                    className="bg-white w-full max-w-xl px-16 py-12"
                    style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                >
                    {!sent ? (
                        <>
                            <h1 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                                Lupa Password
                            </h1>
                            <p className="text-sm text-gray-500 mb-8">
                                Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mengatur ulang kata sandi kamu.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Masukkan Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none"
                                        style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                                    />
                                </div>

                                <div className="flex justify-center mt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-16 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                                        style={{ backgroundColor: "#0070C0", borderRadius: "4px" }}
                                    >
                                        {loading ? "Mengirim..." : "Kirim Link Reset"}
                                    </button>
                                </div>

                                <div className="flex justify-center">
                                    <Link
                                        href="/login"
                                        className="text-sm hover:opacity-80 transition-opacity"
                                        style={{ color: "#0070C0" }}
                                    >
                                        ← Kembali ke halaman masuk
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-center gap-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                                style={{ backgroundColor: "#DDEAF6" }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0070C0" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold" style={{ color: "#003087" }}>Email Terkirim!</h2>
                            <p className="text-sm text-gray-500 max-w-xs">
                                Link reset password sudah dikirim ke <span className="font-medium text-gray-700">{email}</span>.
                                Silakan cek kotak masuk atau folder spam kamu.
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Tidak menerima email?{" "}
                                <button
                                    onClick={() => setSent(false)}
                                    className="hover:opacity-80 transition-opacity font-medium"
                                    style={{ color: "#0070C0" }}
                                >
                                    Kirim ulang
                                </button>
                            </p>
                            <button
                                onClick={() => router.push("/login")}
                                className="mt-4 px-10 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: "#0070C0", borderRadius: "4px" }}
                            >
                                Kembali ke Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}