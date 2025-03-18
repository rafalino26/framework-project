"use client";

import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bell, Settings, ChevronDown } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard/home": "Home",
  "/dashboard/inventory": "Inventory",
  "/dashboard/stock-entry": "Stock Entry",
  "/dashboard/stock-update": "Stock Update",
  "/dashboard/market-price": "Market Price",
  "/dashboard/hpp": "HPP",
  "/dashboard/report": "Report",
  "/dashboard/about-us": "About Us",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Dashboard";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen font-poppins">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-50 shadow p-4 flex justify-between items-center border-none border-gray-300">
          <div className="text-xl text-black font-bold font-poppins">
            {pageTitle}
          </div>

          {/* Notification, Settings, and Profile */}
          <div className="flex items-center space-x-6 font-poppins">
            {/* Notification Icon */}
            <div className="relative cursor-pointer p-2 rounded-full bg-blue-100 hover:bg-gray-200 transition">
              <Bell className="w-6 h-6 text-black" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                3
              </span>
            </div>

            {/* Settings Icon */}
            <button className="p-2 rounded-full bg-blue-100 hover:bg-gray-200 transition">
              <Settings className="w-6 h-6 text-black" />
            </button>

            {/* Profile Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 p-2 bg-blue-100 rounded-full hover:bg-gray-200 transition"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <img
                  src="/profile.png"
                  alt="User profile picture"
                  className="w-8 h-8 rounded-full border border-gray-400"
                />
                <span className="font-medium text-black font-poppins">
                  John Doe
                </span>
                <ChevronDown className="w-5 h-5 text-black" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-black font-poppins">
                    Edit Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 font-poppins">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-blue-50 font-poppins">{children}</main>
      </div>
    </div>
  );
}
