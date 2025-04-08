"use client";
import { useState, useEffect } from "react";
import { Search, Filter, Clock, ChevronDown } from "lucide-react";
import AllTable from "../component/AllTable";
import WaitingTable from "../component/WaitingTable";
import AcceptedTable from "../component/AcceptedTable";
import RefusedTable from "../component/RefusedTable";
import NewReservationPopup from "../component/NewReservationPopup";

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
  notes?: string;
};

// Generate a unique ID for new reservations
const generateId = () => {
  return `RES-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
};

// Format current timestamp
const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
  const [showPopup, setShowPopup] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>(mockData);

  // Current user info (in a real app, this would come from authentication)
  const currentUser = "Indra Kusuma"; // Replace with actual user name from auth

  // Data terfilter
  const filteredData = reservations.filter((reservation) => {
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

  const handleSubmitReservation = (reservationData: {
    room: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    // Create a new reservation object
    const newReservation: Reservation = {
      id: generateId(),
      room: reservationData.room,
      user: currentUser,
      purpose: reservationData.purpose,
      date: reservationData.date,
      time: `${reservationData.startTime} - ${reservationData.endTime}`,
      status: "Menunggu", // New reservations always start with "Menunggu" status
      timestamp: getCurrentTimestamp(),
      notes: reservationData.notes,
    };

    // Add the new reservation to the state
    setReservations((prevReservations) => [
      newReservation,
      ...prevReservations,
    ]);

    // Close the popup
    setShowPopup(false);

    // Optionally, show a success message
    alert("Reservasi berhasil diajukan dan sedang menunggu persetujuan.");
  };

  // Save reservations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  // Load reservations from localStorage on component mount
  useEffect(() => {
    const savedReservations = localStorage.getItem("reservations");
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  }, []);

  return (
    <div className="container mx-auto bg-white text-black">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 font-normal">
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
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
        </div>

        <div className="flex gap-2">
          <div className="relative flex-grow md:flex-grow-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-black bg-white min-w-[160px] w-full md:w-auto justify-between hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{statusFilter}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {["Semua Status", "Menunggu", "Disetujui", "Ditolak"].map(
                  (status) => (
                    <div
                      key={status}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => handleStatusFilterChange(status)}
                    >
                      {status}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPopup(true)}
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md flex items-center gap-2 whitespace-nowrap"
          >
            <Clock className="h-4 w-4" />
            Reservasi Baru
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="inline-flex bg-gray-100 p-1 rounded-md text-sm md:text-base min-w-[300px]">
          {[
            ["all", "Semua Reservasi"],
            ["waiting", "Menunggu"],
            ["accepted", "Disetujui"],
            ["refused", "Ditolak"],
          ].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode as typeof viewMode)}
              className={`px-3 md:px-4 py-1 md:py-2 rounded-md text-sm whitespace-nowrap ${
                viewMode === mode ? "bg-white shadow-sm" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {showPopup && (
        <NewReservationPopup
          onClose={() => setShowPopup(false)}
          onSubmit={handleSubmitReservation}
        />
      )}
      {/* Render Table */}
      {viewMode === "all" && <AllTable data={filteredData} />}
      {viewMode === "waiting" && <WaitingTable data={filteredData} />}
      {viewMode === "accepted" && <AcceptedTable data={filteredData} />}
      {viewMode === "refused" && <RefusedTable data={filteredData} />}
    </div>
  );
}
