"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Ruangan", path: "/dashboard/room" },
  { label: "Jadwal", path: "/dashboard/schedule" },
  { label: "Reservasi", path: "/dashboard/reservasi" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-6 py-3 flex items-center justify-between border-gray-200">
      {/* Sidebar Button (Pindah ke kiri atas) */}
      <button
        className="p-2 rounded-md hover:bg-gray-200 text-black md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Nama Aplikasi (Desktop) */}
      <h2 className="hidden md:block text-lg md:text-xl font-semibold text-black px-6 md:px-8">
        SARA
      </h2>

      {/* Navbar Desktop */}
      <div className="hidden md:flex flex-1 px-2 md:px-3">
        <ul className="flex text-sm font-medium">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-4 py-2 rounded-lg transition ${
                    isActive ? "font-bold text-black" : "font-normal text-[#757575]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Profile di Navbar (Desktop) */}
      <img
        src="/profilepict1.png"
        alt="User profile"
        className="hidden md:block w-10 h-10 rounded-full border border-gray-400 cursor-pointer mr-4"
      />

      {/* Overlay Transparan + Sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-0 z-50" // Warna transparan
          onClick={() => setOpen(false)} // Klik luar sidebar = close
        >
          <div
            className="w-64 bg-white h-full p-6 shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()} // Supaya sidebar gak ke-close kalau diklik dalam
          >
            {/* Header Sidebar */}
            <div className="flex items-center justify-between mb-4">
              {/* Profile & Nama Aplikasi (Hanya di Sidebar) */}
              <div className="flex items-center">
                <img
                  src="/profilepict1.png"
                  alt="User profile"
                  className="w-10 h-10 rounded-full border border-gray-400"
                />
                <h2 className="text-lg font-semibold text-black ml-2">SARA</h2>
              </div>

              {/* Tombol Close */}
              <button
                className="p-2 rounded-md hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                <X className="h-6 w-6 text-black" />
              </button>
            </div>

            {/* Menu Items (Sekarang warnanya hitam) */}
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`p-3 rounded-md text-lg font-medium text-black`} // Ditambah text-black
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
