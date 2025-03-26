"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Clock, ChevronDown } from "lucide-react";
import AllTable from "../component/AllTable";
import WaitingTable from "../component/WaitingTable";
import AcceptedTable from "../component/AcceptedTable";
import RefusedTable from "../component/RefusedTable";

type Reservation = {
  id: string;
  room: string;
  user: string;
  purpose: string;
  date: string;
  time: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  timestamp: string;
  rejectionReason?: string;
};

const mockData: Reservation[] = [
  // Data dummy 15 item (5 untuk masing-masing status)
  {
    id: "RES-001",
    room: "R-101",
    user: "Siti Rahayu",
    purpose: "Seminar Tugas Akhir",
    date: "2023-06-20",
    time: "13:00 - 15:00",
    status: "Menunggu",
    timestamp: "2023-06-15 10:30:45",
  },
  {
    id: "RES-002",
    room: "R-102",
    user: "Ahmad Wijaya",
    purpose: "Rapat Proyek",
    date: "2023-06-21",
    time: "09:00 - 11:00",
    status: "Disetujui",
    timestamp: "2023-06-14 14:22:10",
  },
  {
    id: "RES-003",
    room: "R-103",
    user: "Maya Putri",
    purpose: "Kuliah Pengganti",
    date: "2023-06-22",
    time: "15:30 - 17:30",
    status: "Ditolak",
    timestamp: "2023-06-13 09:15:33",
    rejectionReason: "Ruangan tidak tersedia",
  },
  // Tambahkan 12 data dummy lainnya...
];

export default function ReservasiContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [viewMode, setViewMode] = useState<
    "all" | "waiting" | "accepted" | "refused"
  >("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Data terfilter
  const filteredData = mockData.filter((reservation) => {
    // Filter pencarian
    const matchesSearch =
      reservation.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter status
    const matchesStatus =
      statusFilter === "Semua Status" || reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle perubahan view mode
  const handleViewModeChange = (
    mode: "all" | "waiting" | "accepted" | "refused"
  ) => {
    setViewMode(mode);
    // Update status filter sesuai view mode
    switch (mode) {
      case "waiting":
        setStatusFilter("Menunggu");
        break;
      case "accepted":
        setStatusFilter("Disetujui");
        break;
      case "refused":
        setStatusFilter("Ditolak");
        break;
      default:
        setStatusFilter("Semua Status");
    }
  };

  // Handle perubahan status filter
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsDropdownOpen(false);

    // Update view mode sesuai status
    switch (status) {
      case "Menunggu":
        setViewMode("waiting");
        break;
      case "Disetujui":
        setViewMode("accepted");
        break;
      case "Ditolak":
        setViewMode("refused");
        break;
      default:
        setViewMode("all");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-white text-black">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reservasi Ruangan</h1>
        <p className="text-gray-600">
          Kelola dan lihat status reservasi ruangan.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Cari ruangan, pengguna, atau tujuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">{statusFilter}</span>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                {["Semua Status", "Menunggu", "Disetujui", "Ditolak"].map(
                  (status) => (
                    <div
                      key={status}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleStatusFilterChange(status)}
                    >
                      {status}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors">
            <Clock className="h-4 w-4" />
            Reservasi Baru
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="inline-flex bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => handleViewModeChange("all")}
            className={`px-4 py-2 rounded-md text-black font-medium ${
              viewMode === "all" ? "bg-white shadow-sm" : ""
            }`}
          >
            Semua Reservasi
          </button>
          <button
            onClick={() => handleViewModeChange("waiting")}
            className={`px-4 py-2 rounded-md text-black font-medium ${
              viewMode === "waiting" ? "bg-white shadow-sm" : ""
            }`}
          >
            Menunggu
          </button>
          <button
            onClick={() => handleViewModeChange("accepted")}
            className={`px-4 py-2 rounded-md text-black font-medium ${
              viewMode === "accepted" ? "bg-white shadow-sm" : ""
            }`}
          >
            Disetujui
          </button>
          <button
            onClick={() => handleViewModeChange("refused")}
            className={`px-4 py-2 rounded-md text-black font-medium ${
              viewMode === "refused" ? "bg-white shadow-sm" : ""
            }`}
          >
            Ditolak
          </button>
        </div>
      </div>

      {/* Render Table */}
      {viewMode === "all" && <AllTable data={filteredData} />}
      {viewMode === "waiting" && <WaitingTable data={filteredData} />}
      {viewMode === "accepted" && <AcceptedTable data={filteredData} />}
      {viewMode === "refused" && <RefusedTable data={filteredData} />}
    </div>
  );
}
