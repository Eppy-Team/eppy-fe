"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AuthGuard from "@/components/AuthGuard";

const faqCategories = [
  { label: "Printer", key: "printer", img: "/images/printer.png" },
  { label: "Dukungan Pemindai", key: "scanner", img: "/images/scanner.png" },
  { label: "Proyektor", key: "projector", img: "/images/proyektor.png" },
];

const dummyTicket = {
  id: "#00234",
  email: "capstone@gmail.com",
  phone: "08124357586",
  pertanyaan: "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?",
  jawaban: `Untuk menghubungkan printer Epson ke jaringan Wi-Fi, ikuti langkah-langkah berikut:
1. Nyalakan printer Epson.
   Pastikan printer dalam keadaan hidup dan tidak sedang mencetak.
2. Tekan tombol Wi-Fi pada printer.
   Tahan hingga lampu indikator Wi-Fi mulai berkedip.
3. Gunakan WPS (jika router mendukung):
   • Tekan tombol WPS pada router dalam waktu 2 menit.
   • Tunggu hingga lampu Wi-Fi pada printer berhenti berkedip dan menyala stabil.
4. Jika tanpa WPS (manual setup):
   • Hubungkan laptop/PC ke jaringan Wi-Fi yang sama.
   • Jalankan Epson Printer Setup Utility di komputer.
   • Pilih Wireless Connection → Set up printer for the first time.
5. Konfirmasi koneksi.
   Setelah berhasil, coba cetak Network Status Sheet dari menu printer.`,
};

export default function TicketsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", noTiket: "" });
  const [result, setResult] = useState<typeof dummyTicket | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi pencarian — nanti disambungkan ke API
    setResult(dummyTicket);
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen" style={{ backgroundColor: "#DDEAF6" }}>
        <Navbar />

        <div className="flex flex-1 overflow-hidden p-4 gap-3">
          {/* Sidebar Kiri */}
          <ChatSidebar />

          {/* Konten Tengah */}
          <main
            className="flex-1 flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <div className="flex-1 overflow-y-auto p-8">
              {!result ? (
                /* Form Cari Tiket */
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                    Cari Tiket
                  </h2>
                  <p className="text-sm text-gray-500 mb-8">
                    Silakan isi formulir di bawah ini untuk melihat tiket anda
                  </p>

                  <form onSubmit={handleSearch} className="flex flex-col gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Alamat email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                        className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none"
                        style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        No. Tiket <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.noTiket}
                        onChange={(e) => setForm({ ...form, noTiket: e.target.value })}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                        className="w-full px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none"
                        style={{ border: "1px solid #B8D0E8", borderRadius: "4px" }}
                      />
                    </div>
                    <div className="flex justify-center mt-2">
                      <button
                        type="submit"
                        className="px-12 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: "#7EB3E0", borderRadius: "4px" }}
                      >
                        Lihat Tiket
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Detail Tiket */
                <div className="w-full">
                  <h2 className="text-3xl font-bold mb-1" style={{ color: "#003087" }}>
                    {result.id}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Email: {result.email}, Phone: {result.phone}
                  </p>

                  <div className="flex flex-col gap-4">
                    {/* Pertanyaan user */}
                    <div className="flex justify-end">
                      <div
                        className="px-4 py-2.5 text-sm text-gray-700 max-w-sm"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 2px 12px", backgroundColor: "white" }}
                      >
                        {result.pertanyaan}
                      </div>
                    </div>

                    {/* Jawaban bot */}
                    <div className="flex justify-start">
                      <div
                        className="px-4 py-3 text-sm text-gray-700 max-w-xl whitespace-pre-line"
                        style={{ border: "1px solid #D4E6F7", borderRadius: "12px 12px 12px 2px", backgroundColor: "white" }}
                      >
                        {result.jawaban}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setResult(null)}
                    className="mt-6 text-sm hover:underline"
                    style={{ color: "#003087" }}
                  >
                    ← Cari tiket lain
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Panel FAQ Kanan */}
          <aside
            className="w-56 bg-white shrink-0 p-4"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <h3 className="font-bold text-gray-800 text-lg mb-4">FAQ</h3>
            <div className="flex flex-col gap-3">
              {faqCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => router.push(`/faq/${cat.key}`)}
                  className="flex items-center gap-3 p-3 hover:bg-epson-light transition-all text-left w-full"
                  style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
                >
                  <img src={cat.img} alt={cat.label} className="w-10 h-10 object-contain" />
                  <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}