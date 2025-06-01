"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  Book,
  User,
  Clock,
  Star,
  MoreVertical,
  Trash2,
  X,
  Loader2,
  Printer,
} from "lucide-react";
import AddRoomPopup from "../component/AddRoomPopup";
import DetailRoomPopup from "../component/DetailRoomPopup";
import ListDetailPopup from "../component/ListDetailPopup";
import EditRoomPopup from "../component/EditRoomPopup";
import PrintPopup from "../component/PrintPopup";
import api from "@/app/services/api";

// Updated types to match backend DTOs
type Room = {
  roomId: string;
  roomCode: string;
  roomName: string;
  status: "aktif" | "kosong" | "pemeliharaan";
  capacity: number;
  rating: number;
  courseName: string | null;
  lecturerName: string | null;
  scheduleStartTime: Date | null;
  scheduleEndTime: Date | null;
  facilities?: string[];
};

type CreateRoomData = {
  roomCode: string;
  roomName?: string;
  capacity: number;
  status?: "aktif" | "kosong" | "pemeliharaan";
  facilities?: string[];
};

type UpdateRoomData = {
  roomName?: string;
  capacity?: number;
  status?: "aktif" | "kosong" | "pemeliharaan";
  facilities?: string[];
};

type RoomSchedule = {
  scheduleId: string;
  semester: number;
  lecturerName: string | null;
  scheduleStartTime: Date;
  scheduleEndTime: Date;
  course: {
    courseCode: string | null;
    courseName: string | null;
  };
};

type Comment = {
  id: string;
  user: string;
  text: string;
  rating: number;
  likes: number;
  dislikes: number;
  date: string;
};

type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

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

// API service functions

const apiService = {
  // Get all rooms with current status
  async getRooms(): Promise<Room[]> {
    try {
      const response = await api.get("/rooms/current-status");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("API Error:", error);
      return []; // Return empty array when API fails
    }
  },

  // Create a new room
  async createRoom(roomData: CreateRoomData): Promise<Room> {
    try {
      const response = await api.post("/rooms", roomData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Update a room
  async updateRoom(
    roomCode: string,
    updateData: UpdateRoomData
  ): Promise<Room> {
    try {
      console.log("Sending PATCH request to:", `/rooms/${roomCode}`);
      console.log("With data:", JSON.stringify(updateData));

      // Make sure we're not sending undefined or null values
      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(
          ([_, v]) => v !== undefined && v !== null
        )
      );

      const response = await api.patch(`/rooms/${roomCode}`, cleanData);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error response data:", error.response?.data);

      // Provide a more helpful error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to update room ${roomCode} (Status: ${
          error.response?.status || "unknown"
        })`;

      throw new Error(errorMessage);
    }
  },

  // Get room schedules
  async getRoomSchedules(roomCode: string): Promise<RoomSchedule[]> {
    try {
      const response = await api.get(`/rooms/${roomCode}/schedules`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return []; // Return empty array when API fails
    }
  },

  // Get room comments
  async getRoomComments(roomCode: string): Promise<Comment[]> {
    try {
      const response = await api.get(`/rooms/${roomCode}/comments`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return []; // Return empty array when API fails
    }
  },

  // Add comment to room
  async addComment(
    roomCode: string,
    commentData: { text: string; rating: number }
  ): Promise<Comment> {
    try {
      // Log the data being sent to debug the 400 error
      console.log("Attempting to send comment data:", commentData);

      // For now, just return a local comment without making the API call
      // We'll fix the API integration later
      const localComment: Comment = {
        id: Math.random().toString(36).substring(2, 9),
        user: "Current User",
        text: commentData.text,
        rating: commentData.rating,
        likes: 0,
        dislikes: 0,
        date: "Baru saja",
      };

      return localComment;
    } catch (error: any) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Vote on comment
  async voteOnComment(
    roomCode: string,
    commentId: string,
    voteData: { voteType: "like" | "dislike" }
  ): Promise<{
    message: string;
    likeCount: number;
    dislikeCount: number;
    userVote: string | null;
  }> {
    try {
      const response = await api.post(
        `/rooms/${roomCode}/comments/${commentId}/vote`,
        voteData
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

// Helper functions
const formatTime = (startTime: Date | null, endTime: Date | null): string => {
  if (!startTime || !endTime) return "-";

  const start = new Date(startTime);
  const end = new Date(endTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const dayName = start.toLocaleDateString("id-ID", { weekday: "long" });
  return `${dayName}, ${formatTime(start)} - ${formatTime(end)}`;
};

const mapStatusToDisplay = (
  status: string
): "Aktif" | "Kosong" | "Pemeliharaan" => {
  switch (status) {
    case "aktif":
      return "Aktif";
    case "kosong":
      return "Kosong";
    case "pemeliharaan":
      return "Pemeliharaan";
    default:
      return "Kosong";
  }
};

const mapStatusToBackend = (
  status: "Aktif" | "Kosong" | "Pemeliharaan"
): "aktif" | "kosong" | "pemeliharaan" => {
  switch (status) {
    case "Aktif":
      return "aktif";
    case "Kosong":
      return "kosong";
    case "Pemeliharaan":
      return "pemeliharaan";
    default:
      return "kosong";
  }
};

export default function RuanganPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [view, setView] = useState<"list" | "grid">("list");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isListDetailPopupOpen, setIsListDetailPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isPrintPopupOpen, setIsPrintPopupOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [comments, setComments] = useState<{ [roomCode: string]: Comment[] }>(
    {}
  );
  const [schedules, setSchedules] = useState<{
    [roomCode: string]: RoomSchedule[];
  }>({});

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Move the loadCommentsFromStorage function above the useEffect that calls it
  // Add this function right after the state declarations, before any useEffect hooks

  const loadCommentsFromStorage = () => {
    const savedComments = localStorage.getItem("roomComments");
    if (savedComments) {
      try {
        const parsedComments = JSON.parse(savedComments);
        setComments(parsedComments);
      } catch (error) {
        console.error("Error loading comments from localStorage:", error);
      }
    }
  };

  // Load initial data
  useEffect(() => {
    loadRooms();
    loadReservations();
    loadCommentsFromStorage(); // Now this will work correctly
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedRoomId) {
        const dropdownRef = dropdownRefs.current[selectedRoomId];
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          setSelectedRoomId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedRoomId]);

  // Save reservations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await apiService.getRooms();
      setRooms(roomsData);
    } catch (error: any) {
      console.error("Error loading rooms:", error);
      // The axios interceptor will handle 401 errors automatically
      showNotification("Gagal memuat data ruangan", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = () => {
    const savedReservations = localStorage.getItem("reservations");
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  };

  const loadRoomComments = async (roomCode: string) => {
    try {
      const commentsData = await apiService.getRoomComments(roomCode);

      // Get existing local comments
      const existingComments = comments[roomCode] || [];

      // Merge API comments with local comments, avoiding duplicates
      const mergedComments = [...existingComments];
      commentsData.forEach((apiComment) => {
        if (!mergedComments.find((existing) => existing.id === apiComment.id)) {
          mergedComments.push(apiComment);
        }
      });

      setComments((prev) => ({ ...prev, [roomCode]: mergedComments }));
    } catch (error) {
      console.error("Error loading comments:", error);
      // Don't show error notification since we have local comments
    }
  };

  const loadRoomSchedules = async (roomCode: string) => {
    try {
      const schedulesData = await apiService.getRoomSchedules(roomCode);
      setSchedules((prev) => ({ ...prev, [roomCode]: schedulesData }));
    } catch (error) {
      console.error("Error loading schedules:", error);
      showNotification("Gagal memuat jadwal", "error");
    }
  };

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

  // Filter ruangan berdasarkan pencarian dan status
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.courseName &&
        room.courseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (room.lecturerName &&
        room.lecturerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const displayStatus = mapStatusToDisplay(room.status);
    const matchesStatus =
      statusFilter === "Semua Status" || displayStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddRoom = async (newRoomData: any) => {
    try {
      const createData: CreateRoomData = {
        roomCode: newRoomData.id,
        roomName: newRoomData.roomName || newRoomData.id,
        capacity: Number(newRoomData.capacity),
        status: mapStatusToBackend(newRoomData.status || "Kosong"),
        facilities: newRoomData.facilities || [],
      };

      await apiService.createRoom(createData);
      await loadRooms(); // Reload rooms to get updated data
      showNotification(`Ruangan ${newRoomData.id} berhasil ditambahkan`);
    } catch (error: any) {
      console.error("Error adding room:", error);
      showNotification(error.message || "Gagal menambahkan ruangan", "error");
    }
  };

  const handleUpdateRoom = async (updatedRoomData: any) => {
    try {
      // Log the incoming data from the form
      console.log("Original update data:", updatedRoomData);

      // Make sure status is properly formatted for the backend
      const backendStatus = mapStatusToBackend(updatedRoomData.status);

      // Create a clean update object with only the fields the API expects
      const updateData: UpdateRoomData = {
        roomName: updatedRoomData.roomName || undefined,
        capacity: Number(updatedRoomData.capacity) || undefined,
        status: backendStatus,
        facilities: Array.isArray(updatedRoomData.facilities)
          ? updatedRoomData.facilities
          : (updatedRoomData.facilities || "")
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean),
      };

      // Log the formatted data being sent to the API
      console.log("Formatted update data for API:", updateData);
      console.log(
        "Room code being updated:",
        updatedRoomData.roomCode || updatedRoomData.id
      );

      await apiService.updateRoom(
        updatedRoomData.roomCode || updatedRoomData.id,
        updateData
      );
      await loadRooms(); // Reload rooms to get updated data
      showNotification(
        `Ruangan ${
          updatedRoomData.roomCode || updatedRoomData.id
        } berhasil diperbarui`
      );
    } catch (error: any) {
      console.error("Error updating room:", error);
      showNotification(error.message || "Gagal memperbarui ruangan", "error");
    }
  };

  const handleDeleteRoom = (roomCode: string) => {
    // Note: Delete functionality would need to be implemented in the backend
    // For now, we'll just show a message
    showNotification("Fitur hapus ruangan belum tersedia", "info");
    setShowDeleteConfirm(false);
    setRoomToDelete(null);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsEditPopupOpen(true);
    setIsListDetailPopupOpen(false);
    setIsDetailPopupOpen(false);
    setSelectedRoomId(null);
  };

  const handleAddComment = async (
    roomCode: string,
    comment: { text: string; rating: number }
  ) => {
    try {
      // Create a local comment
      const localComment: Comment = {
        id: Math.random().toString(36).substring(2, 9),
        user: "Anda", // In a real app, this would come from authentication
        text: comment.text,
        rating: comment.rating,
        likes: 0,
        dislikes: 0,
        date: "Baru saja",
      };

      // Update local state immediately
      const updatedComments = [localComment, ...(comments[roomCode] || [])];
      setComments((prev) => ({
        ...prev,
        [roomCode]: updatedComments,
      }));

      // Save to localStorage for persistence
      const allComments = { ...comments, [roomCode]: updatedComments };
      localStorage.setItem("roomComments", JSON.stringify(allComments));

      showNotification("Komentar berhasil ditambahkan");

      // Optionally try to save to API (but don't fail if it doesn't work)
      try {
        await apiService.addComment(roomCode, comment);
        console.log("Comment saved to API successfully");
      } catch (error) {
        console.log("Could not save to API, using local storage only");
      }
    } catch (error: any) {
      console.error("Error adding comment:", error);
      showNotification("Gagal menambahkan komentar", "error");
    }
  };

  // Handle adding a new reservation (keeping localStorage for now)
  const handleAddReservation = (reservationData: {
    room: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    const generateId = () => {
      return `RES-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;
    };

    const getCurrentTimestamp = () => {
      const now = new Date();
      return now.toLocaleString("id-ID");
    };

    const newReservation: Reservation = {
      id: generateId(),
      room: reservationData.room,
      user: "Admin User", // In a real app, this would come from authentication
      purpose: reservationData.purpose,
      date: reservationData.date,
      time: `${reservationData.startTime} - ${reservationData.endTime}`,
      status: "Menunggu",
      timestamp: getCurrentTimestamp(),
      notes: reservationData.notes,
    };

    setReservations((prevReservations) => [
      newReservation,
      ...prevReservations,
    ]);
    showNotification(
      `Reservasi untuk ruangan ${reservationData.room} berhasil diajukan`,
      "success"
    );
  };

  // Handle approving a reservation
  const handleApproveReservation = (id: string) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === id
          ? {
              ...reservation,
              status: "Disetujui",
              timestamp: new Date().toLocaleString("id-ID"),
            }
          : reservation
      )
    );
    showNotification(`Reservasi berhasil disetujui`, "success");
  };

  // Handle rejecting a reservation
  const handleRejectReservation = (id: string, reason: string) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === id
          ? {
              ...reservation,
              status: "Ditolak",
              rejectionReason: reason,
              timestamp: new Date().toLocaleString("id-ID"),
            }
          : reservation
      )
    );
    showNotification(`Reservasi berhasil ditolak`, "info");
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
  const renderStatusBadge = (status: string) => {
    const displayStatus = mapStatusToDisplay(status);
    let bgColor = "bg-black";
    let textColor = "text-white";

    if (displayStatus === "Kosong") {
      bgColor = "bg-white";
      textColor = "text-black";
    } else if (displayStatus === "Pemeliharaan") {
      bgColor = "bg-red-500";
      textColor = "text-white";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor} ${
          displayStatus === "Kosong" ? "border border-gray-300" : ""
        }`}
      >
        {displayStatus}
      </span>
    );
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return (
      <div className="container mx-auto bg-white text-black flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat data ruangan...</span>
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
                {["Semua Status", "Aktif", "Kosong", "Pemeliharaan"].map(
                  (status) => (
                    <div
                      key={status}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => {
                        setStatusFilter(status);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {status}
                    </div>
                  )
                )}
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
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
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
                  key={room.roomId}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-black text-sm font-medium">
                    {room.roomCode}
                  </td>
                  <td className="py-4 px-4 text-black text-sm">
                    {room.courseName || "-"}
                  </td>
                  <td className="py-4 px-4 text-black text-sm">
                    {room.lecturerName || "-"}
                  </td>
                  <td className="py-4 px-4 text-black text-sm">
                    {formatTime(room.scheduleStartTime, room.scheduleEndTime)}
                  </td>
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
                  <td className="py-4 px-4 relative">
                    <div
                      className="relative"
                      ref={(el: HTMLDivElement | null) => {
                        if (el) dropdownRefs.current[room.roomCode] = el;
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoomId(
                            selectedRoomId === room.roomCode
                              ? null
                              : room.roomCode
                          );
                        }}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>

                      {selectedRoomId === room.roomCode && (
                        <div
                          className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20"
                          style={{ minWidth: "150px" }}
                        >
                          <div
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                            onClick={() => {
                              setSelectedRoom(room);
                              setIsListDetailPopupOpen(true);
                              setSelectedRoomId(null);
                              loadRoomComments(room.roomCode);
                              loadRoomSchedules(room.roomCode);
                            }}
                          >
                            Detail
                          </div>
                          <div
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black flex items-center"
                            onClick={() => {
                              setSelectedRoom(room);
                              setIsPrintPopupOpen(true);
                              setSelectedRoomId(null);
                            }}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Cetak
                          </div>
                          <div
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black flex items-center"
                            onClick={() => {
                              handleEditRoom(room);
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                            Edit
                          </div>
                          <div
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 flex items-center"
                            onClick={() => {
                              setShowDeleteConfirm(true);
                              setRoomToDelete(room);
                              setSelectedRoomId(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </div>
                        </div>
                      )}
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
              key={room.roomId}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black">
                  {room.roomCode}
                </h3>
                {renderStatusBadge(room.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">{room.courseName || "-"}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">{room.lecturerName || "-"}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">
                    {formatTime(room.scheduleStartTime, room.scheduleEndTime)}
                  </span>
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

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsDetailPopupOpen(true);
                    loadRoomComments(room.roomCode);
                  }}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-black text-sm font-medium hover:border-gray-300 transition-colors"
                >
                  Detail
                </button>
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsPrintPopupOpen(true);
                  }}
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-black text-sm font-medium hover:border-gray-300 transition-colors flex items-center gap-1"
                >
                  <Printer className="h-4 w-4" />
                  Cetak
                </button>
                <div className="flex gap-2">
                  <button
                    className="p-1.5 rounded-full hover:bg-gray-100"
                    onClick={() => {
                      handleEditRoom(room);
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    className="p-1.5 rounded-full hover:bg-gray-100"
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setRoomToDelete(room);
                    }}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddRoomPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAddRoom={handleAddRoom}
      />

      {selectedRoom && (
        <>
          <DetailRoomPopup
            isOpen={isDetailPopupOpen}
            onClose={() => setIsDetailPopupOpen(false)}
            room={{
              id: selectedRoom.roomCode,
              course: selectedRoom.courseName || "-",
              lecturer: selectedRoom.lecturerName || "-",
              time: formatTime(
                selectedRoom.scheduleStartTime,
                selectedRoom.scheduleEndTime
              ),
              status: mapStatusToDisplay(selectedRoom.status),
              rating: selectedRoom.rating,
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [
                "Proyektor",
                "AC",
                "Whiteboard",
              ],
            }}
            onAddComment={(
              roomCode: string,
              comment: { text: string; rating: number }
            ) => handleAddComment(roomCode, comment)}
            comments={comments[selectedRoom.roomCode] || []}
          />

          <ListDetailPopup
            isOpen={isListDetailPopupOpen}
            onClose={() => setIsListDetailPopupOpen(false)}
            room={{
              id: selectedRoom.roomCode,
              course: selectedRoom.courseName || "-",
              lecturer: selectedRoom.lecturerName || "-",
              time: formatTime(
                selectedRoom.scheduleStartTime,
                selectedRoom.scheduleEndTime
              ),
              status: mapStatusToDisplay(selectedRoom.status),
              rating: selectedRoom.rating,
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [
                "Proyektor",
                "AC",
                "Whiteboard",
              ],
            }}
            onUpdateRoom={handleUpdateRoom}
            onAddReservation={handleAddReservation}
            onApproveReservation={handleApproveReservation}
            onRejectReservation={handleRejectReservation}
            onAddComment={(
              roomCode: string,
              comment: { text: string; rating: number }
            ) => handleAddComment(roomCode, comment)}
            reservations={reservations}
            comments={comments[selectedRoom.roomCode] || []}
          />

          <EditRoomPopup
            isOpen={isEditPopupOpen}
            room={{
              id: selectedRoom.roomCode,
              course: selectedRoom.courseName || "-",
              lecturer: selectedRoom.lecturerName || "-",
              time: formatTime(
                selectedRoom.scheduleStartTime,
                selectedRoom.scheduleEndTime
              ),
              status: mapStatusToDisplay(selectedRoom.status),
              rating: selectedRoom.rating,
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [
                "Proyektor",
                "AC",
                "Whiteboard",
              ],
            }}
            onClose={() => setIsEditPopupOpen(false)}
            onSave={handleUpdateRoom}
          />

          <PrintPopup
            isOpen={isPrintPopupOpen}
            onClose={() => setIsPrintPopupOpen(false)}
            room={{
              id: selectedRoom.roomCode,
              course: selectedRoom.courseName || "-",
              lecturer: selectedRoom.lecturerName || "-",
              time: formatTime(
                selectedRoom.scheduleStartTime,
                selectedRoom.scheduleEndTime
              ),
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [
                "Proyektor",
                "AC",
                "Whiteboard",
              ],
            }}
          />
        </>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && roomToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 text-black">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus ruangan {roomToDelete.roomCode}?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteRoom(roomToDelete.roomCode)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
