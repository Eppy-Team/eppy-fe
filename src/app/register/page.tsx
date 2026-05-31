"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { register } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast("Kata sandi tidak cocok", "error");
            return;
        }

        if (password.length < 8) {
            showToast("Kata sandi minimal 8 karakter", "error");
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            showToast("Akun berhasil dibuat! Mengalihkan ke login...", "success");
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (err: any) {
            showToast(err.message || "Gagal membuat akun", "error");
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
                    <h1 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                        Eppy
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Buat akun untuk mengakses sistem
                    </p>

                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nama lengkap"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none"
                                style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Pratama@epson.company.id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none"
                                style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kata Sandi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none"
                                style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Verifikasi Kata Sandi <span className="text-red-500">*</span>
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
                                {loading ? "Memuat..." : "Buat Akun"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}