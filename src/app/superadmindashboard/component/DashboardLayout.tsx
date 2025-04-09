"use client";

import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import Footer from "@/app/components/Footer";

const pageTitles: Record<string, string> = {
  "/superadmindashboard": "Dashboard (Super Admin)",
  "/superadmindashboard/room": "Ruangan (Super Admin)",
  "/superadmindashboard/schedule": "Jadwal (Super Admin)",
  "/superadmindashboard/reservasi": "Reservasi (Super Admin)",
  "/superadmindashboard/editor-profile": "Edit Profil (Super Admin)",
  "/superadmindashboard/pengguna": "Manajemen Pengguna (Super Admin)"
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Dashboard";


  return (
    <div className="flex flex-col min-h-screen bg-white px-6 md:px-8">
      {/* Navbar */}
      <Navbar />

      {/* Page Title */}
      <div className="mt-20 px-6 py-4 text-3xl text-black font-bold">
        {pageTitle}
      </div>

      {/* Main Content */}
      <main className="flex-1 -mt-6 p-4 md:p-6">{children}</main>

            {/* Footer */}
            <Footer /> 
            
    </div>
  );
}
