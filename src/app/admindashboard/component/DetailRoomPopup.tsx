"use client";

import { useState } from "react";
import {
  X,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Trash2,
} from "lucide-react";
import CommentPopup from "./CommentPopup";

// Update the Comment type to be compatible with the one in RoomContent.tsx
type Comment = {
  id: string | number;
  user: string | { fullName?: string; username?: string };
  text?: string;
  comment?: string;
  rating: number;
  likes: number;
  dislikes: number;
  date?: string;
  timestamp?: string;
};

type RoomDetails = {
  id: string;
  roomCode?: string;
  roomName?: string;
  course: string;
  lecturer: string;
  time: string;
  status: "Aktif" | "Kosong" | "Pemeliharaan";
  rating: number;
  capacity: number;
  facilities: string[];
};

type DetailRoomPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  room: RoomDetails;
  onAddComment?: (
    roomId: string,
    comment: { text: string; rating: number }
  ) => void;
  comments?: Comment[];
};

export default function DetailRoomPopup({
  isOpen,
  onClose,
  room,
  onAddComment,
  comments = [],
}: DetailRoomPopupProps) {
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);

  // Add this logging to see what facilities are being received
  console.log("DetailRoomPopup - Room facilities:", room.facilities);
  console.log("DetailRoomPopup - Full room data:", room);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 md:h-4 md:w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleAddComment = (commentData: { text: string; rating: number }) => {
    // Call the parent handler if provided
    if (onAddComment) {
      onAddComment(room.id, commentData);
    }

    // Close the popup
    setIsCommentPopupOpen(false);
  };

  // Update the handleLikeComment function to immediately update the UI
  const handleLikeComment = async (commentId: string | number) => {
    try {
      // Find the comment and update it optimistically
      const updatedComments = comments.map((comment) => {
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
      const updatedComments = comments.map((comment) => {
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

  // Add a delete comment function
  const handleDeleteComment = async (commentId: string | number) => {
    try {
      // Confirm deletion
      if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
        return;
      }

      // Try to call API first
      try {
        // Import apiService at the top of the file if needed
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
        console.log("API delete failed, updating locally");
      }

      // Update local state regardless of API success
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );

      // Update localStorage
      const savedComments = localStorage.getItem("roomComments");
      if (savedComments) {
        const allComments = JSON.parse(savedComments);
        allComments[room.id] = updatedComments;
        localStorage.setItem("roomComments", JSON.stringify(allComments));
      }

      // Force re-render by updating parent component
      if (onAddComment) {
        // This is a hack to trigger a re-render in the parent component
        onAddComment(room.id, { text: "", rating: 0 });
      }

      // Show notification
      console.log("Comment deleted locally");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-4xl mx-4 border border-gray-200 shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Detail Ruangan {room.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 overflow-auto flex-1">
          {/* Left Grid - Room Info */}
          <div className="min-w-[300px] space-y-4">
            <h3 className="text-lg font-semibold">Informasi Ruangan</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-600">Kode Ruangan</p>
                <p className="text-black">{room.roomCode || room.id}</p>
              </div>

              {room.roomName && room.roomName !== room.id && (
                <div>
                  <p className="font-semibold text-gray-600">Nama Ruangan</p>
                  <p className="text-black">{room.roomName}</p>
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-600">Event/Kegiatan</p>
                <p className="text-black">{room.course}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-600">Penanggung Jawab</p>
                <p className="text-black">{room.lecturer}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-600">Waktu</p>
                <p className="text-black">{room.time}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-600">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
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

              <div>
                <p className="font-semibold text-gray-600">Kapasitas</p>
                <p className="text-black">{room.capacity} orang</p>
              </div>

              <div>
                <p className="font-semibold text-gray-600">Fasilitas</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {room.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-600">Rating</p>
                {renderStars(room.rating)}
              </div>
            </div>
          </div>

          {/* Right Grid - Comments */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Komentar</h3>
              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-black hover:bg-gray-50 whitespace-nowrap"
                onClick={() => setIsCommentPopupOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Tambah Komentar
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-2 max-h-[40vh] md:max-h-none">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada komentar untuk ruangan ini
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {typeof comment.user === "string"
                              ? comment.user.substring(0, 2).toUpperCase()
                              : (
                                  comment.user?.fullName ||
                                  comment.user?.username ||
                                  "U"
                                )
                                  .substring(0, 2)
                                  .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-black">
                            {typeof comment.user === "string"
                              ? comment.user
                              : comment.user?.fullName ||
                                comment.user?.username ||
                                "User"}
                          </h4>
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
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button
                          className="flex items-center gap-1 hover:text-green-600 transition-colors"
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button
                          className="flex items-center gap-1 hover:text-red-600 transition-colors"
                          onClick={() => handleDislikeComment(comment.id)}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>{comment.dislikes}</span>
                        </button>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Popup */}
      {isCommentPopupOpen && (
        <CommentPopup
          roomId={room.id}
          onClose={() => setIsCommentPopupOpen(false)}
          onSubmit={handleAddComment}
        />
      )}
    </div>
  );
}
