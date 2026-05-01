"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("eppy_name");
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eppy_token");
    localStorage.removeItem("eppy_role");
    localStorage.removeItem("eppy_name");
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white border-b px-8 py-3 flex items-center justify-between sticky top-0 z-50"
      style={{ borderColor: "#D4E6F7" }}>
      {/* Logo */}
      <button onClick={() => router.push("/chat")} className="flex items-center">
        <span className="font-bold text-2xl tracking-tight" style={{ color: "#003087" }}>
          EPSON
        </span>
      </button>

      {/* Nav Links */}
      <div className="flex items-center gap-8">
        {["Produk", "Solusi", "Tempat Pembelian", "Dukungan", "Keberlanjutan"].map((item) => (
          <button key={item} className="text-sm text-gray-700 font-medium transition-colors hover:text-epson-navy">
            {item}
          </button>
        ))}
      </div>

      {/* User Info + Logout */}
      <div className="flex items-center gap-3">
        {userName && (
          <span className="text-sm font-medium text-gray-700">
            Halo, {userName}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "#003087" }}
          title="Logout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
    </nav>
  );
}