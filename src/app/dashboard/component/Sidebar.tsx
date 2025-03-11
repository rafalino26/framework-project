"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const menuItems = [
    { label: "Home", path: "/dashboard/home", icon: "/home.png", iconActive: "/home-black.png", tooltip: "Go to Home Page" },
    { label: "Inventory", path: "/dashboard/inventory", icon: "/inventory.png", iconActive: "/inventory-black.png", tooltip: "Manage your inventory here" },
    { label: "Stock Entry", path: "/dashboard/stock-entry", icon: "/stockentry.png", iconActive: "/stockentry-black.png", tooltip: "Add new stock to your inventory" },
    { label: "Stock Update", path: "/dashboard/stock-update", icon: "/stockupdate.png", iconActive: "/stockupdate-black.png", tooltip: "Update your stock data" },
    { label: "Market Price", path: "/dashboard/market-price", icon: "/marketprice.png", iconActive: "/marketprice-black.png", tooltip: "See latest market prices" },
    { label: "HPP", path: "/dashboard/hpp", icon: "/hpp.png", iconActive: "/hpp-black.png", tooltip: "Calculate product cost (HPP)" },
    { label: "Report", path: "/dashboard/report", icon: "/report.png", iconActive: "/report-black.png", tooltip: "View business reports" },
    { label: "About Us", path: "/dashboard/about-us", icon: "/aboutus.png", iconActive: "/aboutus-black.png", tooltip: "Learn more about us" }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (hoveredItem) {
            timer = setTimeout(() => {
                setTooltipVisible(hoveredItem);
            }, 500); // Delay 1 detik
        } else {
            setTooltipVisible(null);
        }

        return () => clearTimeout(timer);
    }, [hoveredItem]);

    return (
        <div className="w-64 min-h-screen bg-[#255367] text-white p-5 flex flex-col">
            {/* Wrapper flex untuk logo dan teks */}
            <div className="flex items-center space-x-3 mb-8">
                <img src="/logostashify.png" alt="Logo" className="w-8 h-8" />
                <h2 className={`text-2xl font-semibold ${poppins.className}`}>STASHIFY</h2>
            </div>

            <ul className="space-y-2 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <li
                            key={item.path}
                            className="relative"
                            onMouseEnter={() => setHoveredItem(item.path)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Link
                                href={item.path}
                                className={`flex items-center space-x-3 py-2 px-4 rounded-lg ${
                                    isActive
                                        ? "bg-[#C7DFEA] text-black"
                                        : "hover:bg-[#C7DFEA] hover:text-black"
                                }`}
                            >
                                {/* Image icon - cek aktif atau tidak */}
                                <img
                                    src={isActive || hoveredItem === item.path ? item.iconActive : item.icon}
                                    alt={`${item.label} icon`}
                                    className="w-5 h-5"
                                />

                                <span>{item.label}</span>
                            </Link>

                            {/* Tooltip dengan delay 1 detik */}
                            {tooltipVisible === item.path && (
                                <div className="absolute left-0 top-[-2rem] bg-black text-white text-xs py-1 px-2 rounded opacity-100 visible transition-opacity duration-300 z-10 max-w-[200px] whitespace-normal">
                                    {item.tooltip}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
