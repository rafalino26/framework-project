"use client";

import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bell, Settings, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/room": "Room",
  "/dashboard/schedule": "Schedule",
  "/dashboard/settings": "Settings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const formattedTitle =
    pageTitles[pathname] || pathname.split("/").pop()?.replace("-", " ") || "Dashboard";

  const pageTitle =
    formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Overlay untuk sidebar di layar kecil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-50 shadow p-4 flex justify-between items-center border-none border-gray-300">
          {/* Tombol Menu untuk layar kecil */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-black" />
          </button>

          {/* Page Title */}
          <div className="text-[20px] md:text-[24px] text-black font-semibold font-poppins">
            {pageTitle}
          </div>

          {/* Notification, Settings, and Profile */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Notification Icon */}
            <div className="relative cursor-pointer p-2 rounded-full bg-blue-100 hover:bg-gray-200 transition">
              <Bell className="w-6 h-6 text-black" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                3
              </span>
            </div>

            {/* Settings Button */}
            <Link href="/dashboard/settings">
              <button className="p-2 rounded-full bg-blue-100 hover:bg-gray-200 transition">
                <Settings className="w-6 h-6 text-black" />
              </button>
            </Link>

            {/* Profile Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 p-2 bg-blue-100 rounded-full hover:bg-gray-200 transition"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <img
                  src="/profilepict1.png"
                  alt="User profile picture"
                  className="w-8 h-8 rounded-full border border-gray-400"
                />
                <span className="hidden md:inline font-medium text-black font-poppins">
                  Nezuko
                </span>
                <ChevronDown className="hidden md:inline w-5 h-5 text-black" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                  <Link
                    href="/dashboard/editor-profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-black font-poppins"
                  >
                    Edit Profile
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 font-poppins">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 bg-blue-50 font-poppins">{children}</main>
      </div>
    </div>
  );
}
