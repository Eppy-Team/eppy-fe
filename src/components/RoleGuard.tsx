"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";

type Props = {
    children: React.ReactNode;
    allowedRoles: string[];
};

export default function RoleGuard({ children, allowedRoles }: Props) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("eppy_token");
        const role = localStorage.getItem("eppy_role");

        console.log("[RoleGuard] token:", token ? "ada" : "kosong");
        console.log("[RoleGuard] role:", role);
        console.log("[RoleGuard] allowedRoles:", allowedRoles);

        if (!token) {
            console.log("[RoleGuard] → redirect /login (no token)");
            router.replace("/login");
            return;
        }

        if (!role) {
            // role kosong → kemungkinan login lama sebelum role disimpan, paksa re-login
            console.log("[RoleGuard] → redirect /login (no role)");
            localStorage.clear();
            router.replace("/login");
            return;
        }

        if (!allowedRoles.includes(role)) {
            console.log("[RoleGuard] → role tidak diizinkan, redirect");
            if (role === "ADMIN") {
                router.replace("/dashboard");
            } else {
                router.replace("/chat");
            }
            return;
        }

        console.log("[RoleGuard] → akses diizinkan");
        setAllowed(true);
    }, []);

    if (!allowed) return <PageLoader />;

    return <>{children}</>;
}