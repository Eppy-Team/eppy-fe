"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { resetPassword } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        const t = searchParams.get("token");
        if (!t) {
            router.push("/login");
        } else {
            setToken(t);
        }
    }, [searchParams]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showToast("Kata sandi tidak cocok", "error");
            return;
        }

        if (newPassword.length < 8) {
            showToast("Kata sandi minimal 8 karakter", "error");
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, newPassword);
            showToast("Kata sandi berhasil diubah! Mengalihkan ke login...", "success");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: any) {
            showToast(err.message || "Gagal reset password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#DDEAF6" }}>
            <Navbar />

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <div className="flex-1 flex items-center justify-center px-4">
                <div
                    className="bg-white w-full max-w-xl px-16 py-12"
                    style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                >
                    <h1 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                        Eppy
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Masukkan Untuk Mengubah Kata Sandi
                    </p>

                    <form onSubmit={handleReset} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kata Sandi Baru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none"
                                style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {loading ? "Memuat..." : "Ubah Kata Sandi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    );
}