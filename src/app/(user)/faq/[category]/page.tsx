"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AuthGuard from "@/components/AuthGuard";

const faqData: Record<string, { title: string; items: { q: string; a: string }[] }> = {
  printer: {
    title: "FAQ Printer",
    items: [
      {
        q: "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?",
        a: `Untuk menghubungkan printer Epson ke jaringan Wi-Fi, ikuti langkah-langkah berikut:
1. Nyalakan printer Epson.
   Pastikan printer dalam keadaan hidup dan tidak sedang mencetak.
2. Tekan tombol Wi-Fi pada printer.
   Tahan hingga lampu indikator Wi-Fi mulai berkedip. Ini menandakan printer siap disambungkan.
3. Gunakan WPS (jika router mendukung):
   • Tekan tombol WPS pada router dalam waktu 2 menit setelah menekan tombol Wi-Fi di printer.
   • Tunggu hingga lampu Wi-Fi pada printer berhenti berkedip dan menyala stabil.
   • Artinya printer sudah berhasil terhubung ke jaringan Wi-Fi.
4. Jika tanpa WPS (manual setup):
   • Hubungkan laptop/PC ke jaringan Wi-Fi yang sama dengan printer.
   • Jalankan Epson Printer Setup Utility di komputer.
   • Pilih Wireless Connection → Set up printer for the first time.
   • Ikuti petunjuk di layar untuk memasukkan SSID (nama Wi-Fi) dan password.
5. Konfirmasi koneksi.
   Setelah berhasil, coba cetak Network Status Sheet dari menu printer untuk memastikan koneksi sudah aktif.`,
      },
      {
        q: "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?",
        a: "Jawaban untuk pertanyaan kedua tentang koneksi Wi-Fi printer Epson.",
      },
      {
        q: "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?",
        a: "Jawaban untuk pertanyaan ketiga tentang koneksi Wi-Fi printer Epson.",
      },
      {
        q: "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?",
        a: "Jawaban untuk pertanyaan keempat tentang koneksi Wi-Fi printer Epson.",
      },
      {
        q: "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?",
        a: "Jawaban untuk pertanyaan kelima tentang koneksi Wi-Fi printer Epson.",
      },
      {
        q: "Bagaimana cara menghubungkan printer Epson ke Wi-Fi?",
        a: "Jawaban untuk pertanyaan keenam tentang koneksi Wi-Fi printer Epson.",
      },
    ],
  },
  scanner: {
    title: "FAQ Dukungan Pemindai",
    items: [
      { q: "Bagaimana cara menggunakan pemindai Epson?", a: "Jawaban tentang penggunaan pemindai Epson." },
      { q: "Pemindai tidak terdeteksi di komputer?", a: "Jawaban tentang pemindai tidak terdeteksi." },
    ],
  },
  projector: {
    title: "FAQ Proyektor",
    items: [
      { q: "Bagaimana cara menghubungkan proyektor ke laptop?", a: "Jawaban tentang koneksi proyektor ke laptop." },
      { q: "Gambar proyektor buram, bagaimana mengatasinya?", a: "Jawaban tentang gambar proyektor buram." },
    ],
  },
};

const faqCategories = [
  { label: "Printer", key: "printer", img: "/images/printer.png" },
  { label: "Dukungan Pemindai", key: "scanner", img: "/images/scanner.png" },
  { label: "Proyektor", key: "projector", img: "/images/proyektor.png" },
];

export default function FAQCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const data = faqData[category] || faqData["printer"];

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen" style={{ backgroundColor: "#DDEAF6" }}>
        {/* Navbar dengan Search */}
        <nav className="w-full bg-white border-b px-8 py-3 flex items-center justify-between sticky top-0 z-50"
          style={{ borderColor: "#D4E6F7" }}>
          <button onClick={() => router.push("/chat")} className="flex items-center">
            <span className="font-bold text-2xl tracking-tight" style={{ color: "#003087" }}>EPSON</span>
          </button>
          <div className="flex items-center gap-8">
            {["Produk", "Solusi", "Tempat Pembelian", "Dukungan", "Keberlanjutan"].map((item) => (
              <button key={item} className="text-sm text-gray-700 font-medium hover:text-epson-navy transition-colors">
                {item}
              </button>
            ))}
          </div>
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ border: "1px solid #D4E6F7", backgroundColor: "white", minWidth: "160px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-gray-600 outline-none bg-transparent w-full placeholder:text-gray-400"
            />
          </div>
        </nav>

        <div className="flex flex-1 overflow-hidden p-4 gap-3">
          {/* Sidebar Kiri */}
          <ChatSidebar />

          {/* Konten Tengah */}
          <main
            className="flex-1 flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <div className="flex-1 overflow-y-auto p-8">
              <h2 className="text-3xl font-bold mb-6" style={{ color: "#003087" }}>
                {data.title}
              </h2>

              <div className="flex flex-col gap-3">
                {data.items.map((item, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={i} style={{ border: "1px solid #D4E6F7", borderRadius: "8px", overflow: "hidden" }}>
                      {/* Header Accordion */}
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                        style={{ backgroundColor: isOpen ? "#DDEAF6" : "white" }}
                      >
                        <span className="text-sm font-medium" style={{ color: isOpen ? "#003087" : "#374151" }}>
                          {item.q}
                        </span>
                        <svg
                          width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke={isOpen ? "#003087" : "#6b7280"} strokeWidth="2"
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {/* Konten Accordion */}
                      {isOpen && (
                        <div
                          className="px-5 py-4 text-sm text-gray-700 whitespace-pre-line"
                          style={{ borderTop: "1px solid #D4E6F7", backgroundColor: "white" }}
                        >
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>

          {/* Panel FAQ Kanan */}
          <aside
            className="w-56 bg-white shrink-0 p-4"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <h3 className="font-bold text-gray-800 text-lg mb-4">FAQ</h3>
            <div className="flex flex-col gap-3">
              {faqCategories.map((cat) => {
                const isActive = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => router.push(`/faq/${cat.key}`)}
                    className="flex items-center gap-3 p-3 transition-all text-left w-full"
                    style={{
                      border: "1px solid #D4E6F7",
                      borderRadius: "4px",
                      backgroundColor: isActive ? "#DDEAF6" : "white",
                    }}
                  >
                    <img src={cat.img} alt={cat.label} className="w-10 h-10 object-contain" />
                    <span className="text-sm font-medium" style={{ color: isActive ? "#003087" : "#374151" }}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}