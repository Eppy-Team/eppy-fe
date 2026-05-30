"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const name = localStorage.getItem("eppy_name");
    const email = localStorage.getItem("eppy_email");

    if (name) setUserName(name);
    if (email) setUserEmail(email);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eppy_token");
    localStorage.removeItem("eppy_role");
    localStorage.removeItem("eppy_name");
    localStorage.removeItem("eppy_email");

    router.push("/login");
  };

  return (
    <nav
      className="w-full h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-50"
      style={{ borderColor: "#D4E6F7" }}
    >
      {/* Logo */}
      <button
        onClick={() => router.push("/chat")}
        className="flex items-center gap-3"
      >
        <img
          src="/images/eppy-logo.png"
          alt="Eppy"
          className="w-12 h-12 object-contain"
        />

        <span
          className="font-bold text-4xl"
          style={{ color: "#003087" }}
        >
          Eppy
        </span>
      </button>

      {/* Profile */}
      {!isAuthPage && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#003087" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b">
                <p className="font-semibold text-gray-900">
                  {userName}
                </p>

                <p className="text-sm text-gray-500">
                  {userEmail}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowMenu(false);
                  router.push("/forgot-password");
                }}
                className="w-full text-left px-5 py-3 hover:bg-gray-50 transition"
              >
                Ubah Kata Sandi
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}