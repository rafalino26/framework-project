"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Book,
  User,
  Clock,
  Star,
  Loader2,
  X,
} from "lucide-react";
import UserDetailRoomPopup from "../component/DetailRoomPopup";
import UserPrintPopup from "../component/PrintPopup";
import api from "@/app/services/api";

// Updated types to match backend DTOs
type Room = {
  roomId: string;
  roomCode: string;
  roomName: string;
  status: "aktif" | "kosong" | "pemeliharaan";
  capacity: number;
  rating: number;
  eventName: string | null;
  personInCharge: string | null;
  eventStartTime: string | null;
  eventEndTime: string | null;
  facilities?: string[];
};

type Comment = {
  id: string;
  user: string | { fullName?: string; username?: string; id?: string };
  text: string;
  rating: number;
  likes: number;
  dislikes: number;
  date: string;
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

type Notification = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

// API service functions (similar to admin but without admin-only operations)
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

  // Transform comment response
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

export default function UserRoomContent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Semua Status");
  const [view, setView] = useState<"list" | "grid">("list");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isPrintPopupOpen, setIsPrintPopupOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [comments, setComments] = useState<{ [roomCode: string]: Comment[] }>(
    {}
  );
  const [schedules, setSchedules] = useState<{
    [roomCode: string]: RoomSchedule[];
  }>({});

  // Load comments from localStorage
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
    loadCommentsFromStorage();
  }, []);

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

  // Filter rooms based on search and status
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

  const handleVoteComment = async (
    roomCode: string,
    commentId: string,
    voteType: "like" | "dislike"
  ) => {
    try {
      const result = await apiService.voteOnComment(roomCode, commentId, {
        voteType,
      });

      // Update local state with new vote counts
      setComments((prev) => ({
        ...prev,
        [roomCode]: (prev[roomCode] || []).map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: result.likeCount,
                dislikes: result.dislikeCount,
              }
            : comment
        ),
      }));

      // Also update localStorage
      const updatedComments = (comments[roomCode] || []).map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: result.likeCount,
              dislikes: result.dislikeCount,
            }
          : comment
      );
      const allComments = { ...comments, [roomCode]: updatedComments };
      localStorage.setItem("roomComments", JSON.stringify(allComments));

      showNotification(result.message, "success");
    } catch (error: any) {
      console.error("Error voting on comment:", error);
      showNotification("Gagal memberikan vote", "error");
    }
  };

  // Render stars for rating
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

  // Render status badge
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
          Lihat informasi ruangan kelas yang tersedia.
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
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsDetailPopupOpen(true);
                          loadRoomComments(room.roomCode);
                        }}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setIsPrintPopupOpen(true);
                          loadRoomSchedules(room.roomCode);
                        }}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
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

              <div className="mt-4 pt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsDetailPopupOpen(true);
                    loadRoomComments(room.roomCode);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-black text-sm font-medium hover:border-gray-300 transition-colors"
                >
                  Detail
                </button>
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsPrintPopupOpen(true);
                    loadRoomSchedules(room.roomCode);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-black text-sm font-medium hover:border-gray-300 transition-colors"
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
          <UserDetailRoomPopup
            isOpen={isDetailPopupOpen}
            onClose={() => setIsDetailPopupOpen(false)}
            room={{
              id: selectedRoom.roomCode,
              roomCode: selectedRoom.roomCode,
              roomName: selectedRoom.roomName,
              course: selectedRoom.eventName || "-",
              lecturer: selectedRoom.personInCharge || "-",
              time: formatTime(
                selectedRoom.eventStartTime,
                selectedRoom.eventEndTime
              ),
              status: mapStatusToDisplay(selectedRoom.status),
              rating: selectedRoom.rating,
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [],
            }}
            onAddComment={handleAddComment}
            onVoteComment={handleVoteComment}
            comments={comments[selectedRoom.roomCode] || []}
          />
          <UserPrintPopup
            isOpen={isPrintPopupOpen}
            onClose={() => setIsPrintPopupOpen(false)}
            room={{
              id: selectedRoom.roomCode,
              roomCode: selectedRoom.roomCode,
              roomName: selectedRoom.roomName,
              course: selectedRoom.eventName || "-",
              lecturer: selectedRoom.personInCharge || "-",
              time: formatTime(
                selectedRoom.eventStartTime,
                selectedRoom.eventEndTime
              ),
              capacity: selectedRoom.capacity,
              facilities: selectedRoom.facilities || [],
            }}
            schedules={schedules[selectedRoom.roomCode] || []}
          />
        </>
      )}
    </div>
  );
}
