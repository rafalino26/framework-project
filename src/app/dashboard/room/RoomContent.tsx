"use client";

import { useState } from "react";
import { Search, Filter, Book, User, Clock, Star, Printer } from "lucide-react";
import DetailRoomPopup from "../component/DetailRoomPopup";
import PrintPopup from "../component/PrintPopup";

type Room = {
  id: string;
  course: string;
  lecturer: string;
  time: string;
  status: "Aktif" | "Kosong" | "Pemeliharaan";
  rating: number;
  capacity: number;
  facilities?: string[];
};

// Data ruangan contoh
const roomsData: Room[] = [
  {
    id: "JTE-01",
    course: "Algoritma dan Pemrograman",
    lecturer: "Dr. Budi Santoso",
    time: "Senin, 08:00 - 10:30",
    status: "Aktif",
    rating: 4.5,
    capacity: 40,
    facilities: ["Proyektor", "AC", "Whiteboard"],
  },
  {
    id: "JTE-02",
    course: "Basis Data",
    lecturer: "Prof. Siti Rahayu",
    time: "Selasa, 13:00 - 15:30",
    status: "Kosong",
    rating: 4.2,
    capacity: 30,
    facilities: ["Proyektor", "AC", "Whiteboard"],
  },
  {
    id: "JTE-03",
    course: "Jaringan Komputer",
    lecturer: "Dr. Ahmad Wijaya",
    time: "Rabu, 10:00 - 12:30",
    status: "Aktif",
    rating: 3.8,
    capacity: 35,
    facilities: ["Proyektor", "AC", "Whiteboard"],
  },
  {
    id: "JTE-04",
    course: "Kecerdasan Buatan",
    lecturer: "Dr. Maya Putri",
    time: "Kamis, 08:00 - 10:30",
    status: "Pemeliharaan",
    rating: 4.0,
    capacity: 25,
    facilities: ["Proyektor", "AC"],
  },
  {
    id: "JTE-05",
    course: "Sistem Operasi",
    lecturer: "Prof. Darmawan",
    time: "Jumat, 13:00 - 15:30",
    status: "Aktif",
    rating: 4.7,
    capacity: 30,
    facilities: ["Proyektor", "AC", "Whiteboard"],
  },
];

export default function RuanganPage() {
  const [rooms] = useState<Room[]>(roomsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [view, setView] = useState<"list" | "grid">("list");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isPrintPopupOpen, setIsPrintPopupOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Filter ruangan berdasarkan pencarian dan status
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.lecturer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "Semua Status" || room.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Render bintang rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Render badge status
  const renderStatusBadge = (status: Room["status"]) => {
    let bgColor = "bg-black";
    let textColor = "text-white";

    if (status === "Kosong") {
      bgColor = "bg-white";
      textColor = "text-black";
    } else if (status === "Pemeliharaan") {
      bgColor = "bg-red-500";
      textColor = "text-white";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor} ${
          status === "Kosong" ? "border border-gray-300" : ""
        }`}
      >
        {status}
      </span>
    );
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="container mx-auto bg-white text-black">
      <div className="mb-6">
        <p className="text-gray-600 font-normal">
          Kelola dan lihat informasi ruangan kelas yang tersedia.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Cari ruangan, mata kuliah, atau dosen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md text-black"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-black bg-white min-w-[160px] justify-between w-full md:w-auto hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{statusFilter}</span>
              </div>
              <svg
                className={`h-4 w-4 transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  onClick={() => {
                    setStatusFilter("Semua Status");
                    setIsDropdownOpen(false);
                  }}
                >
                  Semua Status
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  onClick={() => {
                    setStatusFilter("Aktif");
                    setIsDropdownOpen(false);
                  }}
                >
                  Aktif
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  onClick={() => {
                    setStatusFilter("Kosong");
                    setIsDropdownOpen(false);
                  }}
                >
                  Kosong
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  onClick={() => {
                    setStatusFilter("Pemeliharaan");
                    setIsDropdownOpen(false);
                  }}
                >
                  Pemeliharaan
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="inline-flex bg-gray-100 p-1 text-sm rounded-md">
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-md text-black font-medium ${
              view === "list" ? "bg-white shadow-sm" : ""
            }`}
          >
            Daftar
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-4 py-2 rounded-md text-black font-medium ${
              view === "grid" ? "bg-white shadow-sm" : ""
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg ">
          <table className="w-full min-w-full border-collapse">
            <thead>
              <tr className="border-b text-sm border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Kode
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Mata Kuliah
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Dosen
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Waktu
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Rating
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-black text-sm font-medium">
                    {room.id}
                  </td>
                  <td className="py-4 px-4 text-black text-sm">
                    {room.course}
                  </td>
                  <td className="py-4 px-4 text-black text-sm">
                    {room.lecturer}
                  </td>
                  <td className="py-4 px-4 text-black text-sm">{room.time}</td>
                  <td className="py-4 px-4">
                    {renderStatusBadge(room.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-black">
                        {room.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsDetailPopupOpen(true);
                        }}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsPrintPopupOpen(true);
                        }}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50 flex items-center gap-1"
                      >
                      Jadwal
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black">{room.id}</h3>
                {renderStatusBadge(room.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">{room.course}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">{room.lecturer}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">{room.time}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-black font-medium">
                    {room.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-black text-sm">
                  Kapasitas: {room.capacity} orang
                </span>
              </div>

              <div className="mt-4 pt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsDetailPopupOpen(true);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-black text-sm font-medium hover:border-gray-300 transition-colors"
                >
                  Detail
                </button>
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsPrintPopupOpen(true);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-black text-sm font-medium hover:border-gray-300 transition-colors flex items-center justify-center gap-1"
                >
                  Jadwal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRoom && (
        <>
          <DetailRoomPopup
            isOpen={isDetailPopupOpen}
            onClose={() => setIsDetailPopupOpen(false)}
            room={{
              ...selectedRoom,
              facilities: selectedRoom.facilities || [
                "Proyektor",
                "AC",
                "Whiteboard",
              ],
            }}
          />
          <PrintPopup
            isOpen={isPrintPopupOpen}
            onClose={() => setIsPrintPopupOpen(false)}
            room={{
              ...selectedRoom,
              facilities: selectedRoom.facilities || [
                "Proyektor",
                "AC",
                "Whiteboard",
              ],
            }}
          />
        </>
      )}
    </div>
  );
}
