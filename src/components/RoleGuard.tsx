"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";

type Props = {
    children: React.ReactNode;
    allowedRoles: string[];
};

/**
 * RoleGuard - Proteksi halaman berdasarkan role pengguna.
 *
 * Aturan:
 * - User (role: "USER") hanya bisa akses halaman user
 * - Admin (role: "ADMIN") bisa akses halaman admin DAN halaman user (fitur "Buka User")
 *
 * Penggunaan:
 * - Halaman admin: <RoleGuard allowedRoles={["ADMIN"]}>
 * - Halaman user:  <RoleGuard allowedRoles={["USER", "ADMIN"]}>
 */
export default function RoleGuard({ children, allowedRoles }: Props) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("eppy_token");
        const role = localStorage.getItem("eppy_role");

        if (!token) {
            router.replace("/login");
            return;
        }

        if (!role || !allowedRoles.includes(role)) {
            // User mencoba akses admin → redirect ke /chat
            // Admin tidak akan kena ini karena allowedRoles user selalu include ADMIN
            if (role === "ADMIN") {
                router.replace("/dashboard");
            } else {
                router.replace("/chat");
            }
            return;
        }

        setChecking(false);
    }, [router]);

    if (checking) return <PageLoader />;

    return <>{children}</>;
}