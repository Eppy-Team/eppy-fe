"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { login, setToken } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(email, password);
      setToken(data.data.accessToken);
      localStorage.setItem("eppy_role", data.data.user.role);
      localStorage.setItem("eppy_name", data.data.user.name);

      showToast("Login berhasil! Mengalihkan...", "success");

      setTimeout(() => {
        const role = data.data.user.role;
        if (role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/chat");
        }
      }, 1000);

    } catch (err: any) {
      showToast(err.message || "Email atau password salah", "error");
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
            Masuk untuk mengakses sistem
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Masukkan Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Memuat..." : "Masuk"}
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <p className="text-sm text-gray-500">
                Belum punya akun?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="font-medium hover:opacity-80 transition-opacity"
                  style={{ color: "#0070C0" }}
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}