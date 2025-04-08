"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";

type CommentPopupProps = {
  roomId: string;
  onClose: () => void;
  onSubmit: (comment: { text: string; rating: number }) => void;
};

export default function CommentPopup({
  roomId,
  onClose,
  onSubmit,
}: CommentPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Silakan berikan rating terlebih dahulu");
      return;
    }

    if (!comment.trim()) {
      setError("Silakan berikan komentar terlebih dahulu");
      return;
    }

    onSubmit({
      text: comment,
      rating,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Tambah Komentar & Rating</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-500 mb-6">
            Berikan rating dan komentar untuk ruangan {roomId}.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-2">Rating</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Komentar</h3>
              <textarea
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Berikan komentar Anda tentang ruangan ini..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Kirim Komentar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
