"use client";

import { useState } from "react";
import { X, Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import CommentPopup from "./CommentPopup";

type Comment = {
  id: number;
  user: string;
  rating: number;
  comment: string;
  likes: number;
  dislikes: number;
  timestamp: string;
};

type RoomDetails = {
  id: string;
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
};

export default function DetailRoomPopup({
  isOpen,
  onClose,
  room,
  onAddComment,
}: DetailRoomPopupProps) {
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "John Doe",
      rating: 4,
      comment: "Ruangan nyaman dengan AC yang berfungsi baik",
      likes: 12,
      dislikes: 2,
      timestamp: "3 jam lalu",
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 3,
      comment: "Proyektor kadang mati sendiri",
      likes: 5,
      dislikes: 1,
      timestamp: "1 hari lalu",
    },
  ]);

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
    // Add to local state
    const newComment: Comment = {
      id: comments.length + 1,
      user: "Anda",
      rating: commentData.rating,
      comment: commentData.text,
      likes: 0,
      dislikes: 0,
      timestamp: "Baru saja",
    };

    setComments([newComment, ...comments]);

    // Call the parent handler if provided
    if (onAddComment) {
      onAddComment(room.id, commentData);
    }

    // Close the popup
    setIsCommentPopupOpen(false);
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
                <p className="font-semibold text-gray-600">Mata Kuliah</p>
                <p className="text-black">{room.course}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-600">Dosen</p>
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
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-black">{comment.user}</h4>
                      {renderStars(comment.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {comment.timestamp}
                    </span>
                  </div>

                  <p className="text-black mb-3">{comment.comment}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button className="flex items-center gap-1 hover:text-black">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-black">
                        <ThumbsDown className="h-4 w-4" />
                        <span>{comment.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
