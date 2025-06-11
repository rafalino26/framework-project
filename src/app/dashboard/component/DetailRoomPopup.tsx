"use client";

import { useState } from "react";
import { X, Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import CommentPopup from "./CommentPopup";

type Comment = {
  id: string;
  user: string | { fullName?: string; username?: string; id?: string };
  text: string;
  rating: number;
  likes: number;
  dislikes: number;
  date: string;
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

type UserDetailRoomPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  room: RoomDetails;
  onAddComment?: (
    roomId: string,
    comment: { text: string; rating: number }
  ) => void;
  onVoteComment?: (
    roomId: string,
    commentId: string,
    voteType: "like" | "dislike"
  ) => void;
  comments?: Comment[];
};

export default function UserDetailRoomPopup({
  isOpen,
  onClose,
  room,
  onAddComment,
  onVoteComment,
  comments = [],
}: UserDetailRoomPopupProps) {
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);

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

  const handleLikeComment = (commentId: string) => {
    if (onVoteComment) {
      onVoteComment(room.id, commentId, "like");
    }
  };

  const handleDislikeComment = (commentId: string) => {
    if (onVoteComment) {
      onVoteComment(room.id, commentId, "dislike");
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
                        {comment.date}
                      </span>
                    </div>

                    <p className="text-black mb-3">{comment.text}</p>

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
