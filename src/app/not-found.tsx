"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center"
            style={{ backgroundColor: "#DDEAF6" }}
        >
            {/* Logo */}
            <div className="mb-8">
                <span className="font-bold text-3xl tracking-tight" style={{ color: "#003087" }}>
                    EPSON
                </span>
            </div>

            {/* Konten */}
            <div
                className="bg-white px-16 py-14 flex flex-col items-center text-center"
                style={{ border: "1px solid #B8D0E8", borderRadius: "4px", maxWidth: "480px", width: "100%" }}
            >
                <p className="text-8xl font-bold mb-4" style={{ color: "#003087" }}>404</p>
                <h1 className="text-2xl font-bold mb-2" style={{ color: "#003087" }}>
                    Halaman Tidak Ditemukan
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    Halaman yang Anda cari tidak ada atau telah dipindahkan.
                </p>

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => router.back()}
                        className="w-full py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: "#003087", borderRadius: "4px" }}
                    >
                        ← Kembali
                    </button>
                    <button
                        onClick={() => router.push("/chat")}
                        className="w-full py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                        style={{ border: "1px solid #003087", color: "#003087", borderRadius: "4px", backgroundColor: "white" }}
                    >
                        Ke Halaman Utama
                    </button>
                </div>
            </div>
        </div>
    );
}