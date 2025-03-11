"use client";

import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
    "/dashboard/home": "Home",
    "/dashboard/inventory": "Inventory",
    "/dashboard/stock-entry": "Stock Entry",
    "/dashboard/stock-update": "Stock Update",
    "/dashboard/market-price": "Market Price",
    "/dashboard/hpp": "HPP",
    "/dashboard/report": "Report",
    "/dashboard/about-us": "About Us"
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
        const pathname = usePathname();

        const pageTitle = pageTitles[pathname] || "Dashboard";

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
            <header className="bg-white shadow p-4 flex justify-between items-center">
    <div className="text-xl  text-black font-bold">{pageTitle}</div>
    <div className="flex items-center mr-6 space-x-4">
        {/* Notification Icon */}
        <div className="relative cursor-pointer">
            <img src="/notification.png" alt="Notifications" className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
            <img src="/profile.png" alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />
            {/* Tambah dropdown kalau mau */}
        </div>
    </div>
</header>
                <main className="flex-1 p-6 bg-[#C7DFEA]">{children}</main>
             
            </div>
        </div>
    );
}
