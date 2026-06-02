"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FaqSidebar from "@/components/layout/FaqSidebar";
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
        q: "Mengapa tinta tidak keluar padahal kartrid masih penuh?",
        a: `Beberapa penyebab tinta tidak keluar meski kartrid penuh:
1. Head printer tersumbat — jalankan Head Cleaning dari menu printer atau software Epson.
2. Nozzle kering — lakukan Nozzle Check untuk melihat pola cetakan.
3. Kartrid baru belum terpasang dengan benar — lepas dan pasang kembali kartrid.
4. Driver printer bermasalah — hapus dan install ulang driver dari epson.com.
Jika masalah berlanjut setelah 3x cleaning, bawa ke service center Epson terdekat.`,
      },
      {
        q: "Bagaimana cara membersihkan head printer Epson?",
        a: `Langkah membersihkan head printer Epson:
1. Buka Epson Printer Utility di komputer.
2. Pilih menu Maintenance → Head Cleaning.
3. Klik Start dan tunggu proses selesai (±2 menit).
4. Setelah selesai, lakukan Nozzle Check untuk memastikan hasilnya.
5. Ulangi maksimal 3 kali jika masih bermasalah.
Catatan: Proses cleaning menggunakan sedikit tinta, jangan terlalu sering.`,
      },
      {
        q: "Bagaimana cara menggunakan Epson iPrint?",
        a: `Cara mencetak menggunakan Epson iPrint:
1. Unduh aplikasi Epson iPrint dari App Store atau Google Play.
2. Pastikan smartphone dan printer terhubung ke jaringan Wi-Fi yang sama.
3. Buka aplikasi → pilih printer Epson yang ingin digunakan.
4. Pilih dokumen atau foto yang ingin dicetak.
5. Atur ukuran kertas dan kualitas cetak sesuai kebutuhan.
6. Tekan Print untuk mulai mencetak.`,
      },
      {
        q: "Kenapa hasil cetakan bergaris atau tidak rata?",
        a: `Hasil cetakan bergaris biasanya disebabkan oleh:
1. Head printer kotor atau tersumbat → lakukan Head Cleaning.
2. Tinta hampir habis → periksa level tinta dan isi jika perlu.
3. Kertas lembab atau tidak sesuai spesifikasi → ganti kertas yang direkomendasikan.
4. Setting kualitas cetak terlalu rendah → ubah ke mode High Quality di pengaturan cetak.`,
      },
      {
        q: "Bagaimana cara reset printer Epson?",
        a: `Cara melakukan reset printer Epson:
1. Matikan printer dengan menekan tombol Power.
2. Tahan tombol Reset (atau tombol khusus sesuai model) saat menyalakan kembali.
3. Lepaskan tombol setelah lampu berkedip.
4. Printer akan kembali ke pengaturan pabrik.
Untuk reset ink pad counter, gunakan Epson Adjustment Program yang tersedia di website resmi Epson.`,
      },
    ],
  },
  scanner: {
    title: "FAQ Dukungan Pemindai",
    items: [
      {
        q: "Bagaimana cara menggunakan pemindai Epson untuk pertama kali?",
        a: `Langkah menggunakan pemindai Epson:
1. Hubungkan pemindai ke komputer via USB atau Wi-Fi.
2. Install driver dan software Epson Scan 2 dari epson.com.
3. Letakkan dokumen menghadap ke bawah di atas kaca pemindai.
4. Buka Epson Scan 2, pilih mode (Full Auto/Office/Professional).
5. Klik Preview untuk melihat pratinjau, lalu Scan untuk memindai.
6. Simpan file dalam format yang diinginkan (PDF, JPEG, dll).`,
      },
      {
        q: "Pemindai tidak terdeteksi di komputer, bagaimana solusinya?",
        a: `Jika pemindai Epson tidak terdeteksi:
1. Periksa kabel USB — coba ganti port USB atau gunakan kabel lain.
2. Restart komputer dan pemindai.
3. Pastikan driver Epson Scan sudah terinstall dengan benar.
4. Uninstall dan install ulang driver dari epson.com.
5. Untuk koneksi Wi-Fi, pastikan pemindai dan komputer di jaringan yang sama.
6. Nonaktifkan sementara firewall/antivirus dan coba scan ulang.`,
      },
      {
        q: "Hasil scan buram atau kualitasnya rendah?",
        a: `Cara meningkatkan kualitas hasil scan:
1. Naikkan resolusi scan ke minimal 300 DPI (untuk dokumen) atau 600 DPI (untuk foto).
2. Bersihkan kaca pemindai dengan kain microfiber yang lembut.
3. Pastikan dokumen tidak terlipat dan menempel rata di kaca.
4. Pilih mode warna yang sesuai (Color untuk foto, Grayscale untuk dokumen).
5. Aktifkan fitur Image Adjustment di Epson Scan 2 untuk hasil optimal.`,
      },
      {
        q: "Bagaimana cara scan ke PDF menggunakan Epson?",
        a: `Cara scan ke format PDF:
1. Buka Epson Scan 2 atau aplikasi Document Capture Pro.
2. Letakkan dokumen di atas kaca atau di ADF (Auto Document Feeder).
3. Di menu File Save Settings, pilih format PDF.
4. Untuk scan multi-halaman, centang opsi Multi-Page PDF.
5. Klik Scan dan tentukan lokasi penyimpanan file.`,
      },
    ],
  },
  projector: {
    title: "FAQ Proyektor",
    items: [
      {
        q: "Bagaimana cara menghubungkan proyektor Epson ke laptop?",
        a: `Cara menghubungkan proyektor ke laptop:
1. Via HDMI (direkomendasikan):
   • Sambungkan kabel HDMI dari laptop ke port HDMI proyektor.
   • Nyalakan proyektor dan pilih source HDMI.
   • Di laptop tekan Win + P → pilih Duplicate atau Extend.
2. Via VGA:
   • Sambungkan kabel VGA dan pastikan kencang.
   • Beberapa laptop memerlukan adapter VGA.
3. Via Wi-Fi (Wireless):
   • Install Epson iProjection di laptop.
   • Hubungkan ke jaringan yang sama dengan proyektor.
   • Buka aplikasi dan pilih proyektor yang tersedia.`,
      },
      {
        q: "Gambar proyektor buram, bagaimana mengatasinya?",
        a: `Cara mengatasi gambar proyektor yang buram:
1. Putar cincin fokus (focus ring) pada lensa proyektor hingga gambar tajam.
2. Periksa jarak proyektor ke layar — sesuaikan dengan throw ratio proyektor.
3. Bersihkan lensa dengan kain microfiber yang bersih dan kering.
4. Aktifkan fitur Auto Keystone Correction untuk meluruskan gambar.
5. Pastikan resolusi output laptop sesuai dengan resolusi native proyektor.`,
      },
      {
        q: "Proyektor tidak menampilkan gambar meski sudah terhubung?",
        a: `Langkah troubleshooting proyektor tidak tampil gambar:
1. Pastikan proyektor sudah menyala dan source input sudah benar (HDMI/VGA).
2. Di laptop, tekan Win + P dan pilih Duplicate.
3. Coba restart proyektor dan laptop.
4. Ganti kabel HDMI/VGA dengan yang lain untuk memastikan kabel tidak rusak.
5. Periksa apakah lampu proyektor menyala normal (tidak berkedip merah).`,
      },
      {
        q: "Bagaimana cara mengatur keystone proyektor?",
        a: `Cara mengatur keystone proyektor Epson:
1. Otomatis: Aktifkan Auto Keystone dari menu Settings proyektor.
2. Manual Horizontal/Vertical:
   • Tekan tombol Keystone pada remote atau panel proyektor.
   • Gunakan tombol panah untuk menyesuaikan hingga gambar berbentuk persegi.
3. Quick Corner:
   • Masuk menu Settings → Keystone → Quick Corner.
   • Atur setiap sudut secara independen untuk koreksi lebih presisi.`,
      },
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
  const [userName, setUserName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("eppy_name");
    const email = localStorage.getItem("eppy_email");
    if (name) setUserName(name);
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eppy_token");
    localStorage.removeItem("eppy_role");
    localStorage.removeItem("eppy_name");
    localStorage.removeItem("eppy_email");
    router.push("/login");
  };

  const data = faqData[category] || faqData["printer"];

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--epson-bg)' }}>
        <div className="flex flex-1 overflow-hidden p-4 gap-3" style={{ backgroundColor: "#F0F7FF" }}>

          {/* Sidebar kiri — tanpa profile di bawah */}
          <FaqSidebar />

          {/* Kolom tengah */}
          <div className="flex-1 flex flex-col overflow-hidden gap-3">

            {/* Header: nama user + icon profile */}
            <div
              className="bg-white shrink-0 px-6 py-3 flex items-center justify-end"
              style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
            >
              <div className="relative">
                <button
                  onClick={() => setShowProfile((v) => !v)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm font-semibold" style={{ color: "#003087" }}>
                    {userName || "Pengguna"}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#003087" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown profile */}
                {showProfile && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                    <div
                      className="absolute right-0 mt-3 w-64 z-20 p-4 flex flex-col gap-3"
                      style={{
                        backgroundColor: "#DDEAF6",
                        borderRadius: "12px",
                        border: "1px solid #003087",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <p className="text-sm font-bold" style={{ color: "#003087" }}>
                          {userName || "Pengguna"}
                        </p>
                        <p className="text-xs text-gray-500">{userEmail || ""}</p>
                      </div>
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => { setShowProfile(false); router.push("/forgot-password"); }}
                          className="flex-1 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap"
                          style={{ backgroundColor: "#0070C0", borderRadius: "8px" }}
                        >
                          Ubah Kata Sandi
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex-1 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: "#0070C0", borderRadius: "8px" }}
                        >
                          Keluar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Konten FAQ */}
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
                      <div key={i}>
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors"
                          style={{
                            border: "1.5px solid #D4E6F7",
                            borderRadius: isOpen ? "20px 20px 0 0" : "9999px",
                            backgroundColor: isOpen ? "#DDEAF6" : "white",
                          }}
                        >
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#003087" }}
                          >
                            {item.q}
                          </span>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={isOpen ? "#003087" : "#6b7280"}
                            strokeWidth="2"
                            style={{
                              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.2s",
                              flexShrink: 0,
                              marginLeft: "12px",
                            }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        {isOpen && (
                          <div
                            className="px-5 py-4 text-sm text-gray-700 whitespace-pre-line"
                            style={{
                              border: "1.5px solid #D4E6F7",
                              borderTop: "none",
                              borderRadius: "0 0 20px 20px",
                              backgroundColor: "white",
                            }}
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
          </div>

          {/* Panel kategori FAQ kanan */}
          <aside
            className="w-52 bg-white shrink-0 p-4"
            style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: "#003087" }}>FAQ</h3>
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
                      borderRadius: "8px",
                      backgroundColor: isActive ? "#DDEAF6" : "white",
                    }}
                  >
                    <img src={cat.img} alt={cat.label} className="w-10 h-10 object-contain" />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#003087" }}
                    >
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