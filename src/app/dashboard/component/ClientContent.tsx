"use client";

import { usePathname } from "next/navigation";
import DashboardContent from "@/app/dashboard/component/pages/DashboardContent";
import RoomContent from "@/app/dashboard/component/pages/RoomContent";
import ScheduleContent from "@/app/dashboard/component/pages/ScheduleContent";

export default function ClientContent() {
    const pathname = usePathname(); // 🔥 Gunakan pathname untuk mengecek URL

    const renderContent = () => {
        if (pathname === "/dashboard/room") return <RoomContent />;
        if (pathname === "/dashboard/schedule") return <ScheduleContent />;
        return <DashboardContent />;
    };

    return <>{renderContent()}</>;
}

