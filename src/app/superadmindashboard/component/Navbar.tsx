"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { FiUser, FiLogOut } from "react-icons/fi";

const menuItems = [
  { label: "Dashboard", path: "/superadmindashboard" },
  { label: "Ruangan", path: "/superadmindashboard/room" },
  { label: "Jadwal", path: "/superadmindashboard/schedule" },
  { label: "Reservasi", path: "/superadmindashboard/reservasi" },
  { label: "Pengguna", path: "/superadmindashboard/pengguna" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLElement)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-6 py-3 flex items-center justify-between border-gray-200">
        {/* Sidebar Button (Mobile) */}
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

        {/* Profile + Dropdown (Desktop) */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <img
            src="/profilepict1.png"
            alt="User profile"
            className="w-10 h-10 rounded-full border border-gray-400 cursor-pointer mr-4"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {/* Dropdown Menu (Desktop) */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <p className="text-sm font-semibold text-black">Nama Pengguna</p>
                <p className="text-xs text-gray-500">email@example.com</p>
              </div>
              <hr className="border-gray-300" />
              <div className="flex flex-col">
                <Link
                  href="/admindashboard/editor-profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  <FiUser className="w-5 h-5" />
                  Profil
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FiLogOut className="w-5 h-5" />
                  Keluar
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay Transparan */}
      {open && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-none transition-opacity z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between p-4 border-b">
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

        {/* Menu Items */}
        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="p-3 rounded-md text-sm font-medium text-black"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

{/* Profile Dropdown di Sidebar (Mobile) */}
<div className="absolute bottom-4 left-4 w-[85%] text-xs">
  {/* Garis pemisah */}
  <hr className="border-gray-300 mb-2" />

  <p className="font-semibold text-black px-3 py-1">Nama Pengguna</p>
  <p className="text-gray-500 px-3 pb-2">email@example.com</p>

  <div className="flex flex-col">
    <Link
      href="/dashboard/editor-profile"
      className="flex items-center gap-2 px-3 py-2 text-black hover:bg-gray-100"
      onClick={() => setOpen(false)}
    >
      <FiUser className="w-4 h-4" />
      Profil
    </Link>
    <Link
      href="/"
      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-gray-100"
      onClick={() => setOpen(false)}
    >
      <FiLogOut className="w-4 h-4" />
      Keluar
    </Link>
  </div>
</div>

      </div>
    </>
  );
}
