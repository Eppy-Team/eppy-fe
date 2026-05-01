"use client";

import { useRouter, usePathname } from "next/navigation";

const riwayat = [
  "Bagaimana cara menghubungkan",
  "Bagaimana cara menghubungkan",
  "Bagaimana cara menghubungkan",
  "Bagaimana cara menghubungkan",
  "Bagaimana cara menghubungkan",
];

const menuItems = [
  {
    label: "Pesan Eppy Baru (AI)",
    path: "/chat",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Cari Pesan",
    path: "search",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: "Cari Tiket",
    path: "/tickets",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 12v10H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
];

export default function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className="w-64 bg-white flex flex-col h-full shrink-0"
      style={{ border: "1px solid #D4E6F7", borderRadius: "4px" }}
    >
      {/* Menu Utama */}
      <div className="p-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path && item.label === "Pesan Eppy Baru (AI)"
            ? true
            : pathname === item.path && item.label !== "Pesan Eppy Baru (AI)"
              ? false
              : pathname === item.path;

          const active =
            (item.label === "Pesan Eppy Baru (AI)" && pathname === "/chat") ||
            (item.label === "Cari Pesan" && pathname === "/search") ||
            (item.label === "Cari Tiket" && pathname === "/tickets");

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left"
              style={{
                backgroundColor: active ? "#003087" : "transparent",
                color: active ? "white" : "#1a1a2e",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t mx-4" style={{ borderColor: "#D4E6F7" }} />

      {/* Riwayat */}
      <div className="p-4 flex flex-col gap-1 overflow-y-auto flex-1">
        <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Pesan Anda
        </div>
        {riwayat.map((item, i) => (
          <button
            key={i}
            onClick={() => router.push("/chat")}
            className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-epson-light transition-colors w-full text-left truncate"
          >
            {item}
          </button>
        ))}
      </div>
    </aside>
  );
}