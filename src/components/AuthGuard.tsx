"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("eppy_token");
        if (!token) {
            router.replace("/login");
        } else {
            setChecking(false);
        }
    }, [router]);

    if (checking) return <PageLoader />;

    return <>{children}</>;
}