"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Book,
  User,
  Clock,
  Star,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import AddRoomPopup from "../component/AddRoomPopup";
import DetailRoomPopup from "../component/DetailRoomPopup";

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
    id: "R-101",
    course: "Algoritma dan Pemrograman",
    lecturer: "Dr. Budi Santoso",
    time: "Senin, 08:00 - 10:30",
    status: "Aktif",
    rating: 4.5,
    capacity: 40,
    facilities: ["Proyektor", "AC", "Whiteboard"],
  },
  {
    id: "R-102",
    course: "Basis Data",
    lecturer: "Prof. Siti Rahayu",
    time: "Selasa, 13:00 - 15:30",
    status: "Kosong",
    rating: 4.2,
    capacity: 30,
    facilities: ["Proyektor", "AC", "Whiteboard"],
  },
  {
    id: "R-103",
    course: "Jaringan Komputer",
    lecturer: "Dr. Ahmad Wijaya",
    time: "Rabu, 10:00 - 12:30",
    status: "Aktif",
    rating: 3.8,
    capacity: 35,
    facilities: ["Proyektor", "AC", "Whiteboard"],
  },
  {
    id: "R-104",
    course: "Kecerdasan Buatan",
    lecturer: "Dr. Maya Putri",
    time: "Kamis, 08:00 - 10:30",
    status: "Pemeliharaan",
    rating: 4.0,
    capacity: 25,
  },
  {
    id: "R-105",
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
  const [rooms, setRooms] = useState<Room[]>(roomsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [view, setView] = useState<"list" | "grid">("list");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
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

  const handleAddRoom = (newRoom: Room) => {
    setRooms((prevRooms) => [
      ...prevRooms,
      {
        ...newRoom,
        id: `R-${prevRooms.length + 1}`,
        capacity: Number(newRoom.capacity),
        rating: 0,
        course: "-",
        lecturer: "-",
        time: "-",
      },
    ]);
  };

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
    <div className="container mx-auto py-8 px-4 bg-white text-black">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Ruangan Kelas</h1>
        <p className="text-black font-normal">
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

          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="inline-flex bg-gray-100 p-1 rounded-md">
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
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-black">
                  Kode
                </th>
                <th className="py-3 px-4 text-left font-medium text-black">
                  Mata Kuliah
                </th>
                <th className="py-3 px-4 text-left font-medium text-black">
                  Dosen
                </th>
                <th className="py-3 px-4 text-left font-medium text-black">
                  Waktu
                </th>
                <th className="py-3 px-4 text-left font-medium text-black">
                  Status
                </th>
                <th className="py-3 px-4 text-left font-medium text-black">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-black font-medium">
                    {room.id}
                  </td>
                  <td className="py-4 px-4 text-black">{room.course}</td>
                  <td className="py-4 px-4 text-black">{room.lecturer}</td>
                  <td className="py-4 px-4 text-black">{room.time}</td>
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
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white p-6 hover:shadow-md transition-shadow"
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

              <div className="mt-4 pt-4">
                {" "}
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsDetailPopupOpen(true);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-md text-black font-medium w-full hover:border-gray-300 transition-colors"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Footer Section */}
      <div className="mt-12 bg-white py-8 px-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Sistem Manajemen Ruangan */}
          <div className="md:pr-6 pb-6 md:pb-0">
            <h3 className="text-xl font-semibold text-black mb-2">
              Sistem Manajemen Ruangan
            </h3>
            <p className="text-gray-600">
              Solusi terpadu untuk manajemen ruangan kelas dan jadwal
              perkuliahan.
            </p>
          </div>

          {/* Tautan Cepat */}
          <div className="md:pr-6 pb-6 md:pb-0">
            <h3 className="text-xl font-semibold text-black mb-2">
              Tautan Cepat
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-black">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-gray-600 hover:text-black">
                  Ruangan
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="text-gray-600 hover:text-black"
                >
                  Jadwal
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-black">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-2">
              Hubungi Kami
            </h3>
            <p className="text-gray-600">support@namasistem.ac.id</p>
            <p className="text-gray-600">+62 812-XXXX-XXXX</p>
            <p className="text-gray-600">
              Jl. Pendidikan No. 123, Kota Universitas, Indonesia
            </p>
          </div>
        </div>

        {/* Copyright dengan garis pemisah */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            © 2025 Sistem Manajemen Ruangan Kelas. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
      <AddRoomPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAddRoom={handleAddRoom}
      />
      {selectedRoom && (
        <DetailRoomPopup
          isOpen={isDetailPopupOpen}
          onClose={() => setIsDetailPopupOpen(false)}
          room={{
            ...selectedRoom,
            facilities: ["Proyektor", "AC", "Whiteboard"],
          }}
        />
      )}
    </div>
  );
}
