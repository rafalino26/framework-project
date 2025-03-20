"use client";

import { useState, useCallback } from "react";
import {
  FiBold,
  FiItalic,
  FiLink,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

interface CommentPopupProps {
  room: string;
  onClose: () => void;
}

export default function CommentPopup({ room, onClose }: CommentPopupProps) {
  const [comment, setComment] = useState("");

  const comments = [
    {
      id: 1,
      name: "Jane Doe",
      avatar: "/avatar2.png",
      text: "This is a great room!",
    },
    {
      id: 2,
      name: "John Smith",
      avatar: "/avatar3.png",
      text: "Nice place to study.",
    },
  ];

  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  const applyFormat = useCallback(
    (format: "bold" | "italic" | "link") => {
      const textarea = document.getElementById(
        "comment-box"
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = comment.slice(start, end);

      if (!selectedText) return;

      let formattedText = selectedText;
      if (format === "bold") formattedText = `**${selectedText}**`;
      if (format === "italic") formattedText = `*${selectedText}*`;
      if (format === "link") {
        const url = prompt("Enter URL:");
        if (url) formattedText = `[${selectedText}](${url})`;
      }

      setComment(comment.slice(0, start) + formattedText + comment.slice(end));
      textarea.focus();
    },
    [comment]
  );

  return (
    <div className="fixed inset-0 bg-blend-saturation bg-opacity-20 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-[90%] md:w-1/3">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Comments</h2>

        {/* Input Komentar */}
        <div className="border p-3 md:p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <img
              src="/profilepict1.png"
              alt="User Avatar"
              className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2"
            />
            <span className="font-semibold text-sm md:text-base">Nezuko</span>
          </div>

          <textarea
            id="comment-box"
            className="w-full border rounded p-2 text-gray-700 text-sm md:text-base"
            rows={3}
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-1 md:gap-2 text-gray-600">
              <button
                className="hover:text-black"
                onClick={() => applyFormat("bold")}
              >
                <FiBold />
              </button>
              <button
                className="hover:text-black"
                onClick={() => applyFormat("italic")}
              >
                <FiItalic />
              </button>
              <button
                className="hover:text-black"
                onClick={() => applyFormat("link")}
              >
                <FiLink />
              </button>
            </div>

            <button
              className="py-1 px-3 bg-blue-500 text-white rounded text-xs md:text-sm hover:bg-blue-600 transition"
              onClick={() => {
                if (comment.trim()) {
                  alert(`Comment submitted: ${comment}`);
                  setComment("");
                }
              }}
            >
              Comment
            </button>
          </div>
        </div>

        {/* Komentar Orang Lain */}
        <div className="border p-3 md:p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <img
              src={comments[currentCommentIndex].avatar}
              alt="Avatar"
              className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2"
            />
            <span className="font-semibold text-sm md:text-base">
              {comments[currentCommentIndex].name}
            </span>
          </div>
          <p className="text-gray-700 text-sm md:text-base">
            {comments[currentCommentIndex].text}
          </p>
        </div>

        {/* Navigasi Komentar */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            className="p-1 md:p-2 border rounded hover:bg-gray-100"
            onClick={() =>
              setCurrentCommentIndex((prev) => Math.max(prev - 1, 0))
            }
          >
            <FiArrowUp />
          </button>
          <button
            className="p-1 md:p-2 border rounded hover:bg-gray-100"
            onClick={() =>
              setCurrentCommentIndex((prev) =>
                Math.min(prev + 1, comments.length - 1)
              )
            }
          >
            <FiArrowDown />
          </button>
        </div>

        {/* Tombol Close */}
        <button
          className="w-full py-2 bg-blue-500 text-white rounded text-sm md:text-base hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
