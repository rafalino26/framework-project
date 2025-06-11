"use client";

import { useState, useEffect } from "react";
import {
  X,
  Book,
  User,
  Clock,
  Star,
  Edit,
  Clock3,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Calendar,
  Eye,
  Check,
  MessageSquare,
} from "lucide-react";
import NewReservationPopup from "./NewReservationPopup";
import EditRoomPopup from "./EditRoomPopup";
import UpdateStatusPopup from "./UpdateStatusPopup";
import CommentPopup from "./CommentPopup";
import api from "@/app/services/api";

type Room = {
  id: string;
  roomCode?: string;
  roomName?: string;
  course: string;
  lecturer: string;
  time: string;
  status: "Aktif" | "Kosong" | "Pemeliharaan";
  rating: number;
  capacity: number;
  facilities?: string[];
};

type Comment = {
  id: string | number;
  user:
    | string
    | {
        fullName?: string;
        username?: string;
      };
  text?: string;
  comment?: string;
  rating: number;
  likes: number;
  dislikes: number;
  date?: string;
  timestamp?: string;
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
  rejectionReason?: string | null;
  notes?: string | null;
};

// Add reservation types to match the reservation system
type ReservationUser = {
  id: string;
  fullName: string | null;
  username?: string | null;
};

type ApiReservation = {
  id: string;
  roomCode: string;
  roomName: string | null;
  requestingUser: ReservationUser;
  purpose: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: "menunggu" | "disetujui" | "ditolak";
  requestedAt: Date;
  requestedAtRelative?: string;
  processedByAdmin?: ReservationUser | null;
  processedAt?: Date | null;
  processedAtRelative?: string;
  adminNotes?: string | null;
};

// API service for reservations (same as ReservationContent)
const reservationApiService = {
  async getAllReservations(): Promise<ApiReservation[]> {
    try {
      const response = await api.get("/reservations/admin");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("API Error:", error);
      return this.getMockReservations();
    }
  },

  getMockReservations(): ApiReservation[] {
    const currentDate = new Date();
    const mockUser: ReservationUser = {
      id: "mock-user-1",
      fullName: "Mock User",
      username: "mockuser",
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

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
        requestedAt: new Date(currentDate.getTime() - 86400000),
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
        requestedAt: new Date(currentDate.getTime() - 172800000),
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
  }): Promise<ApiReservation> {
    try {
      const response = await api.post("/reservations", reservationData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      const mockReservation: ApiReservation = {
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
  ): Promise<ApiReservation> {
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
      const mockUpdatedReservation: ApiReservation = {
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

type ListDetailPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  room: Room & {
    facilities: string[];
    schedule?: { day: string; time: string }[];
    comments?: Comment[];
    reservations?: Reservation[];
  };
  onUpdateRoom?: (updatedRoom: Room) => void;
  onAddReservation?: (reservationData: {
    room: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => void;
  onApproveReservation?: (id: string) => void;
  onRejectReservation?: (id: string, reason: string) => void;
  onAddComment?: (
    roomId: string,
    comment: { text: string; rating: number }
  ) => void;
  reservations?: Reservation[];
  comments: Comment[];
};

export default function ListDetailPopup({
  isOpen,
  onClose,
  room,
  onUpdateRoom,
  onAddReservation,
  onApproveReservation,
  onRejectReservation,
  onAddComment,
  reservations = [],
  comments: externalComments = [],
}: ListDetailPopupProps) {
  // Add this logging to see what facilities are being received
  console.log("ListDetailPopup - Room facilities:", room.facilities);
  console.log("ListDetailPopup - Full room data:", room);

  const [activeTab, setActiveTab] = useState<
    "informasi" | "komentar" | "reservasi"
  >("informasi");
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [rejectReservation, setRejectReservation] =
    useState<Reservation | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Add state for API reservations and loading in the component:
  const [apiReservations, setApiReservations] = useState<ApiReservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  // Default schedule if not provided
  const schedule = room.schedule || [
    { day: "Senin", time: "08:00 - 10:30" },
    { day: "Rabu", time: "13:00 - 15:30" },
    { day: "Jumat", time: "10:00 - 12:30" },
  ];

  // Add state to track comments when using external comments
  const [activeComments, setActiveComments] = useState<Comment[]>([]);

  // Replace the complex displayComments logic with this simpler version:
  const displayComments = externalComments;

  // Load reservations when popup opens
  useEffect(() => {
    if (isOpen) {
      const loadReservations = async () => {
        try {
          setLoadingReservations(true);
          const data = await reservationApiService.getAllReservations();
          setApiReservations(data);
        } catch (error) {
          console.error("Error loading reservations:", error);
        } finally {
          setLoadingReservations(false);
        }
      };
      loadReservations();
    }
  }, [isOpen]);

  // Filter API reservations for this room and transform to match the expected format
  const roomReservations = apiReservations
    .filter((reservation) => reservation.roomCode === room.id)
    .map((reservation) => ({
      id: reservation.id,
      room: reservation.roomCode,
      user: reservation.requestingUser.fullName || "Unknown User",
      purpose: reservation.purpose,
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
      rejectionReason: reservation.adminNotes || undefined,
      notes: reservation.adminNotes || undefined,
      // Keep original data for API calls
      originalData: reservation,
    }));

  // Handle new reservation submission
  const handleNewReservation = async (reservationData: {
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

      // Add to local state immediately
      setApiReservations((prev) => [newReservation, ...prev]);

      // Also call the parent handler if provided
      if (onAddReservation) {
        onAddReservation(reservationData);
      }

      setIsNewReservationOpen(false);

      // Show success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent =
        "Reservasi berhasil diajukan dan sedang menunggu persetujuan.";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    } catch (error: any) {
      console.error("Error creating reservation:", error);

      // Show error notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent = error.message || "Gagal membuat reservasi";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }
  };

  // Handle room edit
  const handleRoomEdit = (updatedRoom: Room) => {
    if (onUpdateRoom) {
      onUpdateRoom(updatedRoom);
    }
    setIsEditRoomOpen(false);
  };

  // Handle status update
  const handleStatusUpdate = (
    newStatus: "Aktif" | "Kosong" | "Pemeliharaan",
    note?: string
  ) => {
    const updatedRoom = {
      ...room,
      status: newStatus,
    };
    if (onUpdateRoom) {
      onUpdateRoom(updatedRoom);
    }
    setIsUpdateStatusOpen(false);
  };

  // Handle approve reservation
  const handleApproveReservation = async (id: string) => {
    try {
      // Update local state immediately
      setApiReservations((prev) =>
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

      // Call parent handler if provided
      if (onApproveReservation) {
        onApproveReservation(id);
      }

      // Try API call in background
      try {
        await reservationApiService.updateReservationStatus(id, "disetujui");
      } catch (apiError) {
        console.log("API call failed, but local state already updated");
      }

      // Show success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent = "Reservasi berhasil disetujui.";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    } catch (error: any) {
      console.error("Error approving reservation:", error);

      // Show error notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
      notification.textContent = error.message || "Gagal menyetujui reservasi";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }
  };

  // Handle reject reservation
  const handleRejectReservation = async () => {
    if (rejectReservation && rejectReason.trim()) {
      try {
        // Update local state immediately
        setApiReservations((prev) =>
          prev.map((reservation) => {
            if (reservation.id === rejectReservation.id) {
              return {
                ...reservation,
                status: "ditolak",
                adminNotes: rejectReason,
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

        // Call parent handler if provided
        if (onRejectReservation) {
          onRejectReservation(rejectReservation.id, rejectReason);
        }

        // Try API call in background
        try {
          await reservationApiService.updateReservationStatus(
            rejectReservation.id,
            "ditolak",
            rejectReason
          );
        } catch (apiError) {
          console.log("API call failed, but local state already updated");
        }

        setRejectReservation(null);
        setRejectReason("");

        // Show success notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
        notification.textContent = "Reservasi berhasil ditolak.";
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
      } catch (error: any) {
        console.error("Error rejecting reservation:", error);

        // Show error notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50";
        notification.textContent = error.message || "Gagal menolak reservasi";
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
      }
    }
  };

  // Update the handleAddComment function to also update local state
  const handleAddComment = (comment: { text: string; rating: number }) => {
    // Create a new comment object
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      user: "Anda", // In a real app, this would come from authentication
      text: comment.text,
      rating: comment.rating,
      likes: 0,
      dislikes: 0,
      date: "Baru saja",
    };

    // Call the parent handler first
    if (onAddComment) {
      onAddComment(room.id, comment);
    }

    setIsCommentPopupOpen(false);
  };

  // Add these functions after the existing handleAddComment function:

  const handleLikeComment = async (commentId: string | number) => {
    try {
      // Find the comment and update it optimistically
      const updatedComments = displayComments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        return comment;
      });

      // Update localStorage immediately
      const savedComments = localStorage.getItem("roomComments");
      if (savedComments) {
        const allComments = JSON.parse(savedComments);
        allComments[room.id] = updatedComments;
        localStorage.setItem("roomComments", JSON.stringify(allComments));
      }

      // Trigger parent component to reload comments from localStorage
      if (onAddComment) {
        onAddComment(room.id, { text: "", rating: 0 });
      }

      // Try API call in background
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rooms/${room.id}/comments/${commentId}/vote`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voteType: "like" }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Like successful:", result);
        }
      } catch (apiError) {
        console.log("API vote failed, already updated locally");
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // Update the handleDislikeComment function to immediately update the UI
  const handleDislikeComment = async (commentId: string | number) => {
    try {
      // Find the comment and update it optimistically
      const updatedComments = displayComments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, dislikes: comment.dislikes + 1 };
        }
        return comment;
      });

      // Update localStorage immediately
      const savedComments = localStorage.getItem("roomComments");
      if (savedComments) {
        const allComments = JSON.parse(savedComments);
        allComments[room.id] = updatedComments;
        localStorage.setItem("roomComments", JSON.stringify(allComments));
      }

      // Trigger parent component to reload comments from localStorage
      if (onAddComment) {
        onAddComment(room.id, { text: "", rating: 0 });
      }

      // Try API call in background
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rooms/${room.id}/comments/${commentId}/vote`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voteType: "dislike" }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Dislike successful:", result);
        }
      } catch (apiError) {
        console.log("API vote failed, already updated locally");
      }
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  // Add a deleteComment function after the handleDislikeComment function
  const handleDeleteComment = async (commentId: string | number) => {
    try {
      // Confirm deletion
      if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
        return;
      }

      // Try API call first
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/rooms/${room.id}/comments/${commentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              // Include authorization header if needed
              // "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.ok) {
          console.log("Comment deleted successfully from API");
        } else {
          throw new Error("Failed to delete comment from API");
        }
      } catch (apiError) {
        console.log("API delete failed, already updated locally");
      }

      // Update localStorage immediately
      const updatedComments = displayComments.filter(
        (comment) => comment.id !== commentId
      );
      const savedComments = localStorage.getItem("roomComments");
      if (savedComments) {
        const allComments = JSON.parse(savedComments);
        allComments[room.id] = updatedComments;
        localStorage.setItem("roomComments", JSON.stringify(allComments));
      }

      // Trigger parent component to reload comments from localStorage
      if (onAddComment) {
        onAddComment(room.id, { text: "", rating: 0 });
      }

      console.log("Comment deleted locally");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Get status style
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-gray-200 text-black";
      case "Disetujui":
        return "bg-white text-black border border-gray-200";
      case "Ditolak":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">
            Detail Ruangan {room.id}
          </h2>
          <button
            onClick={() => {
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg mb-6">
          <button
            className={`flex-1 py-3 px-4 text-center rounded-lg ${
              activeTab === "informasi"
                ? "bg-white font-medium text-black"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("informasi")}
          >
            Informasi
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center rounded-lg ${
              activeTab === "komentar"
                ? "bg-white font-medium text-black"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("komentar")}
          >
            Komentar
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center rounded-lg ${
              activeTab === "reservasi"
                ? "bg-white font-medium text-black"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("reservasi")}
          >
            Reservasi
          </button>
        </div>

        {/* Informasi Tab */}
        {activeTab === "informasi" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">
                Informasi Ruangan
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start">
                  <Book className="h-4 w-4 mr-3 mt-0.5 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">
                        Event/Kegiatan:
                      </p>
                      <p className="text-gray-600">{room.course}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-4 w-4 mr-3 mt-0.5 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">
                        Penanggung Jawab:
                      </p>
                      <p className="text-gray-600">{room.lecturer}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-3 mt-0.5 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">Waktu:</p>
                      <p className="text-gray-600">{room.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-4 mr-3"></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">
                        Kode Ruangan:
                      </p>
                      <p className="text-gray-600">
                        {room.roomCode || room.id}
                      </p>
                    </div>
                  </div>
                </div>

                {room.roomName && room.roomName !== room.id && (
                  <div className="flex items-start">
                    <div className="w-4 mr-3"></div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="text-black font-medium mr-2">
                          Nama Ruangan:
                        </p>
                        <p className="text-gray-600">{room.roomName}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="w-4 mr-3"></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">Status:</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          room.status === "Aktif"
                            ? "bg-black text-white"
                            : room.status === "Kosong"
                            ? "bg-white text-black border border-gray-300"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-4 mr-3"></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">Kapasitas:</p>
                      <p className="text-gray-600">{room.capacity} orang</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-4 mr-3"></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">Fasilitas:</p>
                      <p className="text-gray-600">
                        {room.facilities.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-4 mr-3"></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">Rating:</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-gray-600">
                          {room.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-black">
                Jadwal Penggunaan
              </h3>

              <div className="space-y-2 text-sm">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between bg-gray-50 p-3 rounded-md"
                  >
                    <span className="text-black">{item.day}</span>
                    <span className="text-black font-medium">{item.time}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4 text-black">
                Admin Controls
              </h3>

              <div className="space-y-3 text-sm">
                <button
                  className="flex items-center justify-center w-full py-2.5 px-4 border border-gray-200 rounded-md text-black hover:bg-gray-50"
                  onClick={() => setIsEditRoomOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Informasi Ruangan
                </button>

                <button
                  className="flex items-center justify-center w-full py-2.5 px-4 border border-gray-200 rounded-md text-black hover:bg-gray-50"
                  onClick={() => setIsUpdateStatusOpen(true)}
                >
                  <Clock3 className="h-4 w-4 mr-2" />
                  Update Status Ruangan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Komentar Tab */}
        {activeTab === "komentar" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-black">
                Komentar & Rating
              </h3>
              <button
                className="px-4 py-2 border border-gray-200 rounded-md text-black hover:bg-gray-50 flex items-center gap-2"
                onClick={() => setIsCommentPopupOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Tambah Komentar
              </button>
            </div>

            <div className="space-y-4">
              {displayComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {typeof comment.user === "string"
                          ? comment.user.substring(0, 2).toUpperCase()
                          : (
                              comment.user?.fullName ||
                              comment.user?.username ||
                              "U"
                            )
                              .substring(0, 2)
                              .toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium text-black">
                          {typeof comment.user === "string"
                            ? comment.user
                            : comment.user?.fullName ||
                              comment.user?.username ||
                              "User"}
                        </span>
                        <div className="flex items-center gap-2">
                          {renderStars(comment.rating)}
                          <span className="text-sm text-gray-500">
                            ({comment.rating}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {comment.date || comment.timestamp}
                    </span>
                  </div>

                  <p className="text-black mb-3">
                    {comment.text || comment.comment}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <button
                        className="flex items-center text-gray-500 hover:text-green-600 transition-colors"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{comment.likes}</span>
                      </button>
                      <button
                        className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
                        onClick={() => handleDislikeComment(comment.id)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        <span>{comment.dislikes}</span>
                      </button>
                    </div>

                    <div className="flex items-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reservasi Tab */}
        {activeTab === "reservasi" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-black">
                Reservasi Ruangan
              </h3>
              <button
                className="px-4 py-2 border border-gray-200 rounded-md text-black hover:bg-gray-50"
                onClick={() => setIsNewReservationOpen(true)}
              >
                Ajukan Reservasi
              </button>
            </div>

            <h4 className="font-medium text-black mb-4">
              Permintaan Reservasi
            </h4>

            {loadingReservations ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-gray-600">Memuat reservasi...</span>
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full min-w-full border-collapse">
                  <thead>
                    <tr className="border-b text-sm border-gray-200 bg-gray-50">
                      <th className="py-3 px-4 text-left font-medium text-gray-500">
                        Pengguna
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">
                        Tujuan
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">
                        Tanggal & Waktu
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomReservations.length > 0 ? (
                      roomReservations.map((reservation) => (
                        <tr
                          key={reservation.id}
                          className="border-b border-gray-200"
                        >
                          <td className="py-3 px-4 text-black">
                            {reservation.user}
                          </td>
                          <td className="py-3 px-4 text-black">
                            {reservation.purpose}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {reservation.date}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {reservation.time}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                reservation.status
                              )}`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                className="text-gray-400 hover:text-gray-800"
                                onClick={() =>
                                  setSelectedReservation(reservation)
                                }
                                title="Lihat Detail"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              {reservation.status === "Menunggu" && (
                                <>
                                  <button
                                    className="text-green-500 hover:text-green-700"
                                    onClick={() =>
                                      handleApproveReservation(reservation.id)
                                    }
                                    title="Setujui"
                                  >
                                    <Check className="w-5 h-5" />
                                  </button>
                                  <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() =>
                                      setRejectReservation(reservation)
                                    }
                                    title="Tolak"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-4 px-4 text-center text-gray-500"
                        >
                          Belum ada reservasi untuk ruangan ini
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Reservation Popup */}
      {isNewReservationOpen && (
        <NewReservationPopup
          onClose={() => setIsNewReservationOpen(false)}
          onSubmit={handleNewReservation}
          roomId={room.id}
        />
      )}

      {/* Edit Room Popup */}
      {isEditRoomOpen && (
        <EditRoomPopup
          isOpen={isEditRoomOpen}
          room={room}
          onClose={() => setIsEditRoomOpen(false)}
          onSave={handleRoomEdit}
        />
      )}

      {/* Update Status Popup */}
      {isUpdateStatusOpen && (
        <UpdateStatusPopup
          roomId={room.id}
          currentStatus={room.status}
          onClose={() => setIsUpdateStatusOpen(false)}
          onUpdate={handleStatusUpdate}
        />
      )}

      {/* Comment Popup */}
      {isCommentPopupOpen && (
        <CommentPopup
          roomId={room.id}
          onClose={() => setIsCommentPopupOpen(false)}
          onSubmit={handleAddComment}
        />
      )}

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg w-full max-w-2xl border border-gray-100 shadow-lg">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Detail Reservasi</h2>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h3 className="font-semibold text-lg">
                  {selectedReservation.room}
                </h3>
              </div>

              <div className="col-span-2 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 font-medium">Pengguna</p>
                    <p>{selectedReservation.user}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Tujuan</p>
                    <p>{selectedReservation.purpose}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Tanggal & Waktu</p>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {selectedReservation.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {selectedReservation.time}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                        selectedReservation.status
                      )}`}
                    >
                      {selectedReservation.status}
                    </span>
                  </div>
                  {selectedReservation.status === "Ditolak" &&
                    selectedReservation.rejectionReason && (
                      <div className="col-span-2">
                        <p className="text-gray-600 font-medium">
                          Alasan Penolakan
                        </p>
                        <p className="text-red-600">
                          {selectedReservation.rejectionReason}
                        </p>
                      </div>
                    )}
                  {selectedReservation.notes && (
                    <div className="col-span-2">
                      <p className="text-gray-600 font-medium">Catatan</p>
                      <p>{selectedReservation.notes}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-gray-600 font-medium">Diajukan Pada</p>
                    <p>{selectedReservation.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reservation Modal */}
      {rejectReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg w-full max-w-md border border-gray-100 shadow-lg">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Tolak Reservasi</h2>
              <button
                onClick={() => setRejectReservation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="mb-4">
                Anda akan menolak reservasi untuk ruangan{" "}
                <span className="font-semibold">{rejectReservation.room}</span>{" "}
                oleh{" "}
                <span className="font-semibold">{rejectReservation.user}</span>.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Berikan alasan penolakan reservasi ini..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectReservation(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleRejectReservation}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                  disabled={!rejectReason.trim()}
                >
                  Tolak Reservasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
