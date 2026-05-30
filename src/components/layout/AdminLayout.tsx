"use client";

import { ReactNode } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
    children: ReactNode;
    activeMenu: string;
}

export default function AdminLayout({
    children,
    activeMenu,
}: AdminLayoutProps) {
    return (
        <div className="flex flex-col h-screen">
            <AdminNavbar />

            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar active={activeMenu} />

                <main className="flex-1 overflow-y-auto bg-[#F0F7FF] p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}