"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import { FaHome, FaCalendarAlt } from "react-icons/fa";
import { LuDoorClosed } from "react-icons/lu"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FaHome />, tooltip: "Dashboard Page" },
    { label: "Room", path: "/dashboard/room", icon: <LuDoorClosed/>, tooltip: "Book your room here" },
    { label: "Schedule", path: "/dashboard/schedule", icon: <FaCalendarAlt />, tooltip: "Check your schedule" }
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
            }, 500); // Delay 0.5 detik
        } else {
            setTooltipVisible(null);
        }

        return () => clearTimeout(timer);
    }, [hoveredItem]);

    return (
        <div className="w-60 min-h-screen bg-white p-5 flex flex-col border-r border-gray-200">
            {/* Header Sidebar */}
            <div className="flex items-center space-x-3 mb-4">
                <h2 className={`text-[28px] font-semibold text-black ${poppins.className}`}>TrackIt</h2>
            </div>
            <hr className="border-gray-200" />

            {/* Menu List */}
            <ul className="space-y-5 text-[17px] mt-6 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = item.path === "/dashboard"
                    ? pathname === "/dashboard" // Hanya aktif jika path persis "/dashboard"
                    : pathname.startsWith(item.path);  

                    return (
                        <li
                            key={item.path}
                            className="relative"
                            onMouseEnter={() => setHoveredItem(item.path)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Link
                                href={item.path}
                                className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition duration-300 ${
                                    isActive
                                        ? "bg-blue-100 text-[#1573FE] font-bold"
                                        : "text-[#757575] font-bold hover:bg-gray-200 hover:text-gray-600"
                                }`}
                            >
                                {/* Icon React */}
                                <span className="text-xl">{item.icon}</span>

                                <span>{item.label}</span>
                            </Link>

                            {/* Tooltip dengan delay */}
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
