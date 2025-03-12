"use client";

import { useParams } from "next/navigation";
import HomeContent from "@/app/dashboard/component/pages/HomeContent";
import InventoryContent from "@/app/dashboard/component/pages/InventoryContent";
import StockEntryContent from "@/app/dashboard/component/pages/StockEntryContent";
import StockUpdateContent from "@/app/dashboard/component/pages/StockUpdateContent";
import ReportContent from "@/app/dashboard/component/pages/ReportContent";
import AboutUsContent from "@/app/dashboard/component/pages/AboutUsContent";

export default function ClientContent() {
    const { menu } = useParams();

    const renderContent = () => {
        switch (menu) {
            case "inventory":
                return <InventoryContent />;
            case "stock-entry":
                return <StockEntryContent />;
            case "stock-update":
                return <StockUpdateContent />;
            case "report":
                return <ReportContent />;
            case "about-us":
                return <AboutUsContent />;
            default:
                return <HomeContent />;
        }
    };

    return <>{renderContent()}</>;
}
