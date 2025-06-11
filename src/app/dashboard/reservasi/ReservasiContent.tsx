"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Clock, ChevronDown, Loader2, X } from "lucide-react";
import UserAllTable from "../component/AllTable";
import UserWaitingTable from "../component/WaitingTable";
import UserAcceptedTable from "../component/AcceptedTable";
import UserRefusedTable from "../component/RefusedTable";
import NewReservationPopup from "@/app/admindashboard/component/NewReservationPopup";
import api from "@/app/services/api";

// Updated types to match backend DTOs
type ReservationUser = {
  id: string;
  fullName: string | null;
  username?: string | null;
};

// Updated type for display components - make it consistent with backend response
type Reservation = {
  id: string;
  room: string;
  user: string;
  purpose: string;
  date: string;
  time: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  timestamp: string;
  rejectionReason?: string | null; // Allow null values from backend
  notes?: string | null; // Allow null values from backend
  // Include all original fields for reference
  roomCode: string;
  roomName: string | null;
  requestingUser: ReservationUser;
  reservationDate: string;
  startTime: string;
  endTime: string;
  requestedAt: Date;
  requestedAtRelative?: string;
  processedByAdmin?: ReservationUser | null;
  processedAt?: Date | null;
  processedAtRelative?: string;
  adminNotes?: string | null;
};

type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

// API service for user reservations
const userReservationApiService = {
  // Get user's own reservations
  async getMyReservations(): Promise<Reservation[]> {
    try {
      console.log("Fetching user's reservations...");
      const response = await api.get("/reservations/my");
      console.log("User reservations response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("API Error:", error);
      return this.getMockReservations(); // Return mock data when API fails
    }
  },

  // Create new reservation
  async createReservation(reservationData: {
    roomCode: string;
    purpose: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
  }): Promise<Reservation> {
    try {
      console.log("Creating reservation:", reservationData);
      const response = await api.post("/reservations", reservationData);
      console.log("Create reservation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error("Gagal membuat reservasi. Silakan coba lagi.");
    }
  },

  // Mock data for when API is not available
  getMockReservations(): Reservation[] {
    const currentDate = new Date();
    const mockUser: ReservationUser = {
      id: "current-user",
      fullName: "Anda",
      username: "currentuser",
    };

    // Generate dates for the reservations
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    return [
      {
        id: "user-res-001",
        roomCode: "JTE-01",
        roomName: "Ruang Kuliah 01",
        requestingUser: mockUser,
        room: "JTE-01",
        user: "Anda",
        purpose: "Seminar Tugas Akhir",
        reservationDate: formatDate(today),
        date: formatDate(today),
        startTime: "13:00",
        endTime: "15:00",
        time: "13:00 - 15:00",
        status: "Menunggu",
        timestamp: "Hari ini",
        requestedAt: currentDate,
        requestedAtRelative: "Hari ini",
      },
      {
        id: "user-res-002",
        roomCode: "JTE-02",
        roomName: "Ruang Kuliah 02",
        requestingUser: mockUser,
        room: "JTE-02",
        user: "Anda",
        purpose: "Presentasi Proyek",
        reservationDate: formatDate(tomorrow),
        date: formatDate(tomorrow),
        startTime: "09:00",
        endTime: "11:00",
        time: "09:00 - 11:00",
        status: "Disetujui",
        timestamp: "Kemarin",
        requestedAt: new Date(currentDate.getTime() - 86400000), // yesterday
        requestedAtRelative: "Kemarin",
        processedByAdmin: {
          id: "admin-1",
          fullName: "Admin",
          username: "admin",
        },
        processedAt: currentDate,
        processedAtRelative: "Hari ini",
      },
      {
        id: "user-res-003",
        roomCode: "JTE-03",
        roomName: "Ruang Rapat",
        requestingUser: mockUser,
        room: "JTE-03",
        user: "Anda",
        purpose: "Diskusi Kelompok",
        reservationDate: formatDate(dayAfterTomorrow),
        date: formatDate(dayAfterTomorrow),
        startTime: "15:30",
        endTime: "17:30",
        time: "15:30 - 17:30",
        status: "Ditolak",
        timestamp: "2 hari yang lalu",
        requestedAt: new Date(currentDate.getTime() - 172800000), // 2 days ago
        requestedAtRelative: "2 hari yang lalu",
        processedByAdmin: {
          id: "admin-1",
          fullName: "Admin",
          username: "admin",
        },
        processedAt: currentDate,
        processedAtRelative: "Hari ini",
        adminNotes: "Ruangan sedang dalam pemeliharaan",
        notes: "Ruangan sedang dalam pemeliharaan",
        rejectionReason: "Ruangan sedang dalam pemeliharaan",
      },
    ];
  },
};

export default function UserReservationContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [viewMode, setViewMode] = useState<
    "all" | "waiting" | "accepted" | "refused"
  >("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load user's reservations from API
  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Loading user reservations...");
      const data = await userReservationApiService.getMyReservations();
      console.log("Loaded reservations:", data);
      setReservations(data);
    } catch (err: any) {
      console.error("Error loading reservations:", err);
      setError(err.message || "Failed to load reservations");
      showNotification("Gagal memuat data reservasi", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load reservations on component mount
  useEffect(() => {
    loadReservations();
  }, []);

  // Simple notification system
  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, 3000);
  };

  // Transform data for display (convert backend status to display format)
  const transformedReservations: Reservation[] = reservations.map(
    (reservation) => {
      // Convert backend status to display status
      let displayStatus: "Menunggu" | "Disetujui" | "Ditolak";
      switch (reservation.status) {
        case "Menunggu":
          displayStatus = "Menunggu";
          break;
        case "Disetujui":
          displayStatus = "Disetujui";
          break;
        case "Ditolak":
          displayStatus = "Ditolak";
          break;
        default:
          displayStatus = "Menunggu"; // fallback
      }

      return {
        ...reservation,
        room: reservation.roomCode,
        user: reservation.requestingUser.fullName || "User",
        date: reservation.reservationDate,
        time: `${reservation.startTime} - ${reservation.endTime}`,
        status: displayStatus,
        timestamp:
          reservation.requestedAtRelative ||
          new Date(reservation.requestedAt).toLocaleString("id-ID"),
        rejectionReason: reservation.adminNotes, // Keep as is (can be null)
        notes: reservation.adminNotes, // Keep as is (can be null)
      };
    }
  );

  // Filter data based on search and status
  const filteredData = transformedReservations.filter((reservation) => {
    const matchesSearch =
      reservation.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "Semua Status" || reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle view mode changes
  const handleViewModeChange = (
    mode: "all" | "waiting" | "accepted" | "refused"
  ) => {
    setViewMode(mode);
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

  // Handle status filter changes
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsDropdownOpen(false);

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

  // Handle new reservation submission
  const handleSubmitReservation = async (reservationData: {
    room: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    try {
      console.log("Submitting reservation:", reservationData);

      const newReservation = await userReservationApiService.createReservation({
        roomCode: reservationData.room,
        purpose: reservationData.purpose,
        reservationDate: reservationData.date,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime,
      });

      // Add the new reservation to the local state immediately for better UX
      setReservations((prev) => [newReservation, ...prev]);
      setShowPopup(false);

      showNotification(
        "Reservasi berhasil diajukan dan sedang menunggu persetujuan!",
        "success"
      );
    } catch (err: any) {
      console.error("Error creating reservation:", err);
      showNotification(err.message || "Gagal membuat reservasi", "error");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto bg-white text-black flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat data reservasi...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto bg-white text-black">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={loadReservations}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white text-black">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-md shadow-md flex justify-between items-center ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : notification.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
            style={{ minWidth: "300px" }}
          >
            <span>{notification.message}</span>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                )
              }
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 font-normal">
          Kelola dan lihat status reservasi ruangan Anda.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Cari ruangan atau tujuan..."
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
              className={`px-3 md:px-4 py-1 md:py-2 rounded-md font-medium whitespace-nowrap ${
                viewMode === mode ? "bg-white shadow-sm" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* New Reservation Popup */}
      {showPopup && (
        <NewReservationPopup
          onClose={() => setShowPopup(false)}
          onSubmit={handleSubmitReservation}
        />
      )}

      {/* Render Tables */}
      {viewMode === "all" && <UserAllTable data={filteredData} />}
      {viewMode === "waiting" && <UserWaitingTable data={filteredData} />}
      {viewMode === "accepted" && <UserAcceptedTable data={filteredData} />}
      {viewMode === "refused" && <UserRefusedTable data={filteredData} />}
    </div>
  );
}
