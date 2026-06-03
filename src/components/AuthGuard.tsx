"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";

type Props = {
    children: React.ReactNode;
    requiredRole?: "ADMIN" | "USER" | "ANY";
};

export default function AuthGuard({ children, requiredRole = "ANY" }: Props) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("eppy_token");
        const role = localStorage.getItem("eppy_role");

        if (!token) {
            router.replace("/login");
            return;
        }

        if (!role) {
            localStorage.clear();
            router.replace("/login");
            return;
        }

        if (requiredRole === "ADMIN" && role !== "ADMIN") {
            router.replace("/chat");
            return;
        }

        if (requiredRole === "USER" && role !== "USER" && role !== "ADMIN") {
            router.replace("/login");
            return;
        }

        setAllowed(true);
    }, []);

    if (!allowed) return <PageLoader />;

    return <>{children}</>;
}