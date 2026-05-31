"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import AuthNavbar from "@/components/layout/AuthNavbar";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        const t = searchParams.get("token");
        setToken(t); // null kalau tidak ada, string kalau ada
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
        if (!token) return;

        setLoading(true);
        try {
            await resetPassword(token, newPassword);
            setSuccess(true);
            showToast("Kata sandi berhasil diubah!", "success");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            showToast(err.message || "Gagal reset password. Link mungkin sudah kadaluarsa.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#DDEAF6" }}>
            <AuthNavbar />

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            <div className="flex-1 flex items-center justify-center px-4">
                <div
                    className="bg-white w-full max-w-xl px-16 py-12"
                    style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                >
                    {token === null ? (
                        /* Token tidak ada di URL */
                        <div className="flex flex-col items-center text-center gap-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                                style={{ backgroundColor: "#FEE2E2" }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold" style={{ color: "#003087" }}>Link Tidak Valid</h2>
                            <p className="text-sm text-gray-500 max-w-xs">
                                Link reset password tidak ditemukan atau sudah kadaluarsa. Silakan minta link baru.
                            </p>
                            <button
                                onClick={() => router.push("/forgot-password")}
                                className="mt-4 px-10 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: "#0070C0", borderRadius: "4px" }}
                            >
                                Minta Link Baru
                            </button>
                        </div>
                    ) : success ? (
                        /* Sukses */
                        <div className="flex flex-col items-center text-center gap-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                                style={{ backgroundColor: "#DCFCE7" }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold" style={{ color: "#003087" }}>Berhasil!</h2>
                            <p className="text-sm text-gray-500">
                                Kata sandi kamu sudah berhasil diubah. Mengalihkan ke halaman login...
                            </p>
                        </div>
                    ) : (
                        /* Form */
                        <>
                            <h1 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                                Atur Ulang Password
                            </h1>
                            <p className="text-sm text-gray-500 mb-8">
                                Masukkan kata sandi baru untuk akun kamu.
                            </p>

                            <form onSubmit={handleReset} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kata Sandi Baru <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Minimal 8 karakter"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
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
                                        placeholder="Ulangi kata sandi baru"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none"
                                        style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                                    />
                                    {confirmPassword && (
                                        <p
                                            className="text-xs mt-1"
                                            style={{ color: newPassword === confirmPassword ? "#16A34A" : "#DC2626" }}
                                        >
                                            {newPassword === confirmPassword ? "✓ Kata sandi cocok" : "✗ Kata sandi tidak cocok"}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-center mt-2">
                                    <button
                                        type="submit"
                                        disabled={loading || newPassword !== confirmPassword}
                                        className="px-16 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                                        style={{ backgroundColor: "#0070C0", borderRadius: "4px" }}
                                    >
                                        {loading ? "Memproses..." : "Ubah Kata Sandi"}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
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