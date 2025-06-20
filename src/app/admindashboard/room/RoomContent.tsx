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
  eventName: string | null; // Changed from courseName
  personInCharge: string | null; // Changed from lecturerName
  eventStartTime: string | null; // Changed from scheduleStartTime (now string)
  eventEndTime: string | null; // Changed from scheduleEndTime (now string)
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

// Replace the Comment type definition:
type Comment = {
  id: string;
  user: string | { fullName?: string; username?: string; id?: string };
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
      console.log(
        "Making API call to:",
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/current-status`
      );
      const response = await api.get("/rooms/current-status");

      console.log("Raw API response:", response);
      console.log("Response data:", response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log("First room structure:", response.data[0]);
        console.log("Available fields:", Object.keys(response.data[0]));
        return response.data;
      } else {
        console.warn(
          "API response is empty or not an array, trying alternative endpoint..."
        );
        return await this.getRoomsAlternative();
      }
    } catch (error) {
      console.error("Primary API Error:", error);
      console.log("Trying alternative endpoint...");
      return await this.getRoomsAlternative();
    }
  },

  // Alternative method to get rooms if current-status doesn't work
  async getRoomsAlternative(): Promise<Room[]> {
    try {
      console.log("Trying alternative API endpoint...");
      const response = await api.get("/rooms");
      console.log("Alternative API response:", response.data);

      if (Array.isArray(response.data)) {
        // Transform the data if needed
        return response.data.map((room: any) => ({
          roomId: room.roomId || room.id,
          roomCode: room.roomCode,
          roomName: room.roomName,
          status: room.status || "kosong",
          capacity: room.capacity || 0,
          rating: room.rating || 0,
          eventName: room.eventName || room.courseName || null,
          personInCharge: room.personInCharge || room.lecturerName || null,
          eventStartTime: room.eventStartTime || room.scheduleStartTime || null,
          eventEndTime: room.eventEndTime || room.scheduleEndTime || null,
          facilities: room.facilities || [],
        }));
      }
      return [];
    } catch (error) {
      console.error("Alternative API Error:", error);
      return [];
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
    const debugMode = false; // Set to true only when debugging

    if (debugMode) {
      console.log("=== COMMENT API DEBUG ===");
      console.log("Room Code:", roomCode);
      console.log("Comment Data:", commentData);
      console.log(
        "API URL:",
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomCode}/comments`
      );
    }

    // Use the correct field name expected by the backend: commentText
    const payload = {
      commentText: commentData.text,
      rating: commentData.rating,
    };

    try {
      if (debugMode) console.log("Sending payload:", payload);

      const response = await api.post(`/rooms/${roomCode}/comments`, payload);

      if (debugMode) console.log("Response data:", response.data);
      return this.transformCommentResponse(response.data);
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw new Error("Comment API not available");
    }
  },

  // Update the transformCommentResponse method:
  transformCommentResponse(data: any): Comment {
    return {
      id: data.id || String(Math.random()),
      user: data.user || data.user?.fullName || data.user?.username || "User",
      text: data.commentText || "", // Backend returns commentText
      rating: data.rating || 0,
      likes: data.likeCount || 0,
      dislikes: data.dislikeCount || 0,
      date: data.createdAtRelative || new Date().toLocaleString("id-ID"),
    };
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

  // Delete a room
  async deleteRoom(roomCode: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/rooms/${roomCode}`);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(error.response?.data?.message || "Failed to delete room");
    }
  },

  // Delete a comment
  async deleteComment(
    roomCode: string,
    commentId: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.delete(
        `/rooms/${roomCode}/comments/${commentId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  },
};

// Helper functions
const formatTime = (
  startTime: string | null,
  endTime: string | null
): string => {
  if (!startTime || !endTime) return "-";

  try {
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
  } catch (error) {
    console.error("Error formatting time:", error);
    return "-";
  }
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
      console.log("Loading rooms...");
      const roomsData = await apiService.getRooms();
      console.log("Rooms data from API:", roomsData);
      console.log("Number of rooms:", roomsData.length);

      // Log each room's event data
      roomsData.forEach((room, index) => {
        console.log(`Room ${index + 1} (${room.roomCode}):`, {
          eventName: room.eventName,
          personInCharge: room.personInCharge,
          eventStartTime: room.eventStartTime,
          eventEndTime: room.eventEndTime,
          status: room.status,
        });
      });

      setRooms(roomsData);
    } catch (error: any) {
      console.error("Error loading rooms:", error);
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
      (room.eventName &&
        room.eventName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (room.personInCharge &&
        room.personInCharge.toLowerCase().includes(searchQuery.toLowerCase()));

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

      // Process facilities properly - don't override with defaults
      let facilities: string[] = [];
      if (updatedRoomData.facilities) {
        if (Array.isArray(updatedRoomData.facilities)) {
          facilities = updatedRoomData.facilities;
        } else if (typeof updatedRoomData.facilities === "string") {
          facilities = updatedRoomData.facilities
            .split(",")
            .map((f: string) => f.trim())
            .filter(Boolean);
        }
      }

      // Create a clean update object with only the fields the API expects
      const updateData: UpdateRoomData = {
        roomName: updatedRoomData.roomName || undefined,
        capacity: Number(updatedRoomData.capacity) || undefined,
        status: backendStatus,
        facilities: facilities.length > 0 ? facilities : undefined,
      };

      // Log the formatted data being sent to the API
      console.log("Formatted update data for API:", updateData);
      console.log(
        "Room code being updated:",
        updatedRoomData.roomCode || updatedRoomData.id
      );

      const updatedRoom = await apiService.updateRoom(
        updatedRoomData.roomCode || updatedRoomData.id,
        updateData
      );
      console.log("Response from API after update:", updatedRoom);

      await loadRooms(); // Reload rooms to get updated data
      console.log("Rooms after reload:", rooms);

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

  const handleDeleteRoom = async (roomCode: string) => {
    try {
      await apiService.deleteRoom(roomCode);
      // Remove the room from local state
      setRooms((prevRooms) =>
        prevRooms.filter((room) => room.roomCode !== roomCode)
      );
      showNotification(`Ruangan ${roomCode} berhasil dihapus`, "success");
      setShowDeleteConfirm(false);
      setRoomToDelete(null);
    } catch (error: any) {
      console.error("Error deleting room:", error);
      showNotification(error.message || "Gagal menghapus ruangan", "error");
      setShowDeleteConfirm(false);
      setRoomToDelete(null);
    }
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsEditPopupOpen(true);
    setIsListDetailPopupOpen(false);
    setIsDetailPopupOpen(false);
    setSelectedRoomId(null);
  };

  // Update the handleAddComment function to handle the "refresh" hack for like/dislike/delete
  const handleAddComment = async (
    roomCode: string,
    comment: { text: string; rating: number }
  ) => {
    try {
      // If this is an empty comment with rating 0, it's a signal to refresh comments
      if (comment.text === "" && comment.rating === 0) {
        // Just reload the comments
        loadCommentsFromStorage();
        return;
      }

      // Create a comment with real timestamp
      const now = new Date();
      const timestamp = now.toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Create local comment first for immediate UI update
      const localComment: Comment = {
        id: Math.random().toString(36).substring(2, 9),
        user: "Anda", // In a real app, this would come from authentication
        text: comment.text,
        rating: comment.rating,
        likes: 0,
        dislikes: 0,
        date: timestamp,
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

      // Show immediate feedback
      showNotification(
        "Komentar ditambahkan (mencoba sinkronisasi dengan database...)",
        "info"
      );

      // Try to save to API in the background
      try {
        const apiComment = await apiService.addComment(roomCode, comment);

        // If API succeeds, replace the local comment with the API response
        const apiUpdatedComments = [
          apiComment,
          ...(comments[roomCode] || []).filter((c) => c.id !== localComment.id),
        ];
        setComments((prev) => ({
          ...prev,
          [roomCode]: apiUpdatedComments,
        }));

        // Update localStorage with API response
        const apiAllComments = { ...comments, [roomCode]: apiUpdatedComments };
        localStorage.setItem("roomComments", JSON.stringify(apiAllComments));

        showNotification("Komentar berhasil disimpan ke database!", "success");
      } catch (apiError: any) {
        // Silently handle API errors - the comment is already saved locally
        let errorMessage =
          "Komentar disimpan secara lokal (database tidak tersedia)";
        if (apiError.message?.includes("not available")) {
          errorMessage = "Komentar disimpan lokal - API tidak tersedia";
        }
        showNotification(errorMessage, "info");
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
            placeholder="Cari ruangan, event, atau penanggung jawab..."
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
                  Event/Kegiatan
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Penanggung Jawab
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
                    {room.eventName || "-"}
                  </td>
                  <td className="py-4 px-4 text-black text-sm">
                    {room.personInCharge || "-"}
                  </td>
                  <td className="py-4 px-4 text-black text-sm">
                    {formatTime(room.eventStartTime, room.eventEndTime)}
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
                  <span className="text-black">{room.eventName || "-"}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">
                    {room.personInCharge || "-"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">
                    {formatTime(room.eventStartTime, room.eventEndTime)}
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

      {selectedRoom &&
        (() => {
          console.log("Selected room facilities:", selectedRoom.facilities);
          console.log("Selected room full data:", selectedRoom);
          return null;
        })()}

      {selectedRoom && (
        <>
          <DetailRoomPopup
            isOpen={isDetailPopupOpen}
            onClose={() => setIsDetailPopupOpen(false)}
            room={{
              id: selectedRoom.roomCode,
              course: selectedRoom.eventName || "-", // Map eventName to course
              lecturer: selectedRoom.personInCharge || "-", // Map personInCharge to lecturer
              time: formatTime(
                selectedRoom.eventStartTime,
                selectedRoom.eventEndTime
              ),
              status: mapStatusToDisplay(selectedRoom.status),
              rating: selectedRoom.rating,
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [],
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
              course: selectedRoom.eventName || "-", // Map eventName to course
              lecturer: selectedRoom.personInCharge || "-", // Map personInCharge to lecturer
              time: formatTime(
                selectedRoom.eventStartTime,
                selectedRoom.eventEndTime
              ),
              status: mapStatusToDisplay(selectedRoom.status),
              rating: selectedRoom.rating,
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [],
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
              course: selectedRoom.eventName || "-", // Map eventName to course
              lecturer: selectedRoom.personInCharge || "-", // Map personInCharge to lecturer
              time: formatTime(
                selectedRoom.eventStartTime,
                selectedRoom.eventEndTime
              ),
              status: mapStatusToDisplay(selectedRoom.status),
              rating: selectedRoom.rating,
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [],
            }}
            onClose={() => setIsEditPopupOpen(false)}
            onSave={handleUpdateRoom}
          />

          <PrintPopup
            isOpen={isPrintPopupOpen}
            onClose={() => setIsPrintPopupOpen(false)}
            room={{
              id: selectedRoom.roomCode,
              course: selectedRoom.eventName || "-", // Map eventName to course
              lecturer: selectedRoom.personInCharge || "-", // Map personInCharge to lecturer
              time: formatTime(
                selectedRoom.eventStartTime,
                selectedRoom.eventEndTime
              ),
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [],
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
