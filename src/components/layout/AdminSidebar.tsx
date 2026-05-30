"use client";

import { useRouter } from "next/navigation";

interface Props {
    active: string;
}

export default function AdminSidebar({
    active,
}: Props) {
    const router = useRouter();

    const menus = [
        {
            title: "Dashboard Chatbot",
            path: "/dashboard",
        },
        {
            title: "Dashboard Tiket",
            path: "/admin-tickets",
        },
        {
            title: "Knowledge Based",
            path: "/knowledge-base",
        },
    ];

    return (
        <aside className="w-[240px] bg-white border-r border-[#D4E6F7] flex flex-col justify-between">
            <div className="p-4 space-y-2">
                {menus.map((menu) => (
                    <button
                        key={menu.path}
                        onClick={() => router.push(menu.path)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition
            ${active === menu.path
                                ? "bg-[#DDEAF6] text-[#003087]"
                                : "text-gray-700"
                            }`}
                    >
                        {menu.title}
                    </button>
                ))}
            </div>

            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#003087]" />

                    <span className="font-semibold text-[#003087]">
                        Pricilia Gladys
                    </span>
                </div>
            </div>
        </aside>
    );
}