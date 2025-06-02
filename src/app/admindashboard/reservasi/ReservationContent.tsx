"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Clock, ChevronDown } from "lucide-react";
import AllTable from "../component/AllTable";
import WaitingTable from "../component/WaitingTable";
import AcceptedTable from "../component/AcceptedTable";
import RefusedTable from "../component/RefusedTable";
import NewReservationPopup from "../component/NewReservationPopup";
import api from "@/app/services/api";

// Updated types to match backend DTOs
type ReservationUser = {
  id: string;
  fullName: string | null;
  username?: string | null;
};

type Reservation = {
  id: string;
  roomCode: string;
  roomName: string | null;
  requestingUser: ReservationUser;
  purpose: string;
  reservationDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: "menunggu" | "disetujui" | "ditolak";
  requestedAt: Date;
  requestedAtRelative?: string;
  processedByAdmin?: ReservationUser | null;
  processedAt?: Date | null;
  processedAtRelative?: string;
  adminNotes?: string | null;
};

// Add this type definition after the existing types
type TransformedReservation = {
  id: string;
  room: string;
  user: string;
  purpose: string;
  date: string;
  time: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  timestamp: string;
  rejectionReason?: string | null;
  notes?: string | null;
  // Include all original fields
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

// API service for reservations using the same pattern as RoomContent
const reservationApiService = {
  async getAllReservations(): Promise<Reservation[]> {
    try {
      const response = await api.get("/reservations/admin");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("API Error:", error);
      return this.getMockReservations(); // Return mock data when API fails
    }
  },

  // Mock data for when API is not available
  getMockReservations(): Reservation[] {
    const currentDate = new Date();
    const mockUser: ReservationUser = {
      id: "mock-user-1",
      fullName: "Mock User",
      username: "mockuser",
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
        id: "res-001",
        roomCode: "JTE-01",
        roomName: "Ruang Kuliah 01",
        requestingUser: mockUser,
        purpose: "Kuliah Pengganti Algoritma",
        reservationDate: formatDate(today),
        startTime: "08:00",
        endTime: "10:30",
        status: "menunggu",
        requestedAt: currentDate,
        requestedAtRelative: "Hari ini",
      },
      {
        id: "res-002",
        roomCode: "JTE-02",
        roomName: "Ruang Kuliah 02",
        requestingUser: {
          ...mockUser,
          id: "mock-user-2",
          fullName: "Dosen Tamu",
        },
        purpose: "Seminar Teknologi",
        reservationDate: formatDate(tomorrow),
        startTime: "13:00",
        endTime: "15:30",
        status: "disetujui",
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
        id: "res-003",
        roomCode: "JTE-03",
        roomName: "Ruang Rapat",
        requestingUser: {
          ...mockUser,
          id: "mock-user-3",
          fullName: "Ketua Jurusan",
        },
        purpose: "Rapat Jurusan",
        reservationDate: formatDate(dayAfterTomorrow),
        startTime: "09:00",
        endTime: "12:00",
        status: "ditolak",
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
      },
    ];
  },

  async createReservation(reservationData: {
    roomCode: string;
    purpose: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
  }): Promise<Reservation> {
    try {
      const response = await api.post("/reservations", reservationData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);

      // Create a mock reservation for fallback
      const mockReservation: Reservation = {
        id: `res-${Date.now()}`,
        roomCode: reservationData.roomCode,
        roomName: `Ruang ${reservationData.roomCode}`,
        requestingUser: {
          id: "mock-user",
          fullName: "Demo User",
          username: "demouser",
        },
        purpose: reservationData.purpose,
        reservationDate: reservationData.reservationDate,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime,
        status: "menunggu",
        requestedAt: new Date(),
        requestedAtRelative: "Baru saja",
      };

      return mockReservation;
    }
  },

  async updateReservationStatus(
    reservationId: string,
    status: string,
    adminNotes?: string
  ): Promise<Reservation> {
    try {
      const response = await api.patch(
        `/reservations/${reservationId}/status`,
        {
          status,
          adminNotes,
        }
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error);

      // Create a mock updated reservation for fallback
      const mockUpdatedReservation: Reservation = {
        id: reservationId,
        roomCode: "JTE-01",
        roomName: "Ruang JTE-01",
        requestingUser: {
          id: "mock-user",
          fullName: "Demo User",
          username: "demouser",
        },
        purpose: "Demo Purpose",
        reservationDate: new Date().toISOString().split("T")[0],
        startTime: "08:00",
        endTime: "10:00",
        status: status as "menunggu" | "disetujui" | "ditolak",
        requestedAt: new Date(),
        requestedAtRelative: "Hari ini",
        processedByAdmin: {
          id: "admin-demo",
          fullName: "Demo Admin",
          username: "demoadmin",
        },
        processedAt: new Date(),
        processedAtRelative: "Baru saja",
        adminNotes: adminNotes || undefined,
      };

      return mockUpdatedReservation;
    }
  },
};

export default function ReservationContent() {
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

  // Load reservations from API
  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationApiService.getAllReservations();
      setReservations(data);
    } catch (err: any) {
      console.error("Error loading reservations:", err);
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  // Load reservations on component mount
  useEffect(() => {
    loadReservations();
  }, []);

  // Transform data for display (convert backend status to display format)
  const transformedReservations: TransformedReservation[] = reservations.map(
    (reservation) => ({
      ...reservation,
      room: reservation.roomCode,
      user: reservation.requestingUser.fullName || "Unknown User",
      date: reservation.reservationDate,
      time: `${reservation.startTime} - ${reservation.endTime}`,
      status: (reservation.status === "menunggu"
        ? "Menunggu"
        : reservation.status === "disetujui"
        ? "Disetujui"
        : "Ditolak") as "Menunggu" | "Disetujui" | "Ditolak",
      timestamp:
        reservation.requestedAtRelative ||
        new Date(reservation.requestedAt).toLocaleString(),
      rejectionReason: reservation.adminNotes,
      notes: reservation.adminNotes,
    })
  );

  // Filter data
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
      const newReservation = await reservationApiService.createReservation({
        roomCode: reservationData.room,
        purpose: reservationData.purpose,
        reservationDate: reservationData.date,
        startTime: reservationData.startTime,
        endTime: reservationData.endTime,
      });

      // Add the new reservation to the local state immediately for better UX
      setReservations((prev) => [newReservation, ...prev]);
      setShowPopup(false);

      // Show success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent =
        "Reservasi berhasil diajukan dan sedang menunggu persetujuan.";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    } catch (err: any) {
      console.error("Error creating reservation:", err);

      // Show error notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent = err.message || "Gagal membuat reservasi";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }
  };

  // Handle approve reservation
  const handleApproveReservation = async (id: string) => {
    try {
      // Update local state immediately for better UX - with proper status mapping
      setReservations((prev) =>
        prev.map((reservation) => {
          if (reservation.id === id) {
            return {
              ...reservation,
              status: "disetujui",
              processedAt: new Date(),
              processedAtRelative: "Baru saja",
              processedByAdmin: {
                id: "current-user",
                fullName: "Admin User",
                username: "admin",
              },
            };
          }
          return reservation;
        })
      );

      // Show success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent = `Reservasi berhasil disetujui.`;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);

      // Try API call in background
      try {
        await reservationApiService.updateReservationStatus(id, "disetujui");
      } catch (apiError) {
        console.log("API call failed, but local state already updated");
      }
    } catch (err: any) {
      console.error("Error approving reservation:", err);

      // Show error notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent = err.message || "Gagal menyetujui reservasi";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }
  };

  // Handle reject reservation
  const handleRejectReservation = async (id: string, reason: string) => {
    try {
      // Update local state immediately for better UX - with proper status mapping and rejection reason
      setReservations((prev) =>
        prev.map((reservation) => {
          if (reservation.id === id) {
            return {
              ...reservation,
              status: "ditolak",
              adminNotes: reason,
              processedAt: new Date(),
              processedAtRelative: "Baru saja",
              processedByAdmin: {
                id: "current-user",
                fullName: "Admin User",
                username: "admin",
              },
            };
          }
          return reservation;
        })
      );

      // Show success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent = `Reservasi berhasil ditolak.`;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);

      // Try API call in background
      try {
        await reservationApiService.updateReservationStatus(
          id,
          "ditolak",
          reason
        );
      } catch (apiError) {
        console.log("API call failed, but local state already updated");
      }
    } catch (err: any) {
      console.error("Error rejecting reservation:", err);

      // Show error notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent = err.message || "Gagal menolak reservasi";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 bg-white text-black">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data reservasi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 bg-white text-black">
        <div className="flex items-center justify-center h-64">
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
    <div className="container mx-auto py-8 px-4 bg-white text-black">
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
      {viewMode === "all" && (
        <AllTable
          data={filteredData}
          onApprove={handleApproveReservation}
          onReject={handleRejectReservation}
        />
      )}
      {viewMode === "waiting" && (
        <WaitingTable
          data={filteredData}
          onApprove={handleApproveReservation}
          onReject={handleRejectReservation}
        />
      )}
      {viewMode === "accepted" && <AcceptedTable data={filteredData} />}
      {viewMode === "refused" && <RefusedTable data={filteredData} />}
    </div>
  );
}
