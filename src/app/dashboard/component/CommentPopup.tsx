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
  room: string; // ✅ 1. Nama ruangan yang sedang dikomentari
  onClose: () => void; // ✅ 2. Fungsi untuk menutup popup
}

export default function CommentPopup({ room, onClose }: CommentPopupProps) {
  // ✅ 3. State untuk menyimpan komentar yang sedang diketik oleh pengguna
  const [comment, setComment] = useState("");

  // ✅ 4. Data dummy untuk menampilkan komentar dari pengguna lain
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

  // ✅ 5. State untuk melacak komentar yang sedang ditampilkan
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  // ✅ 6. Fungsi untuk menambahkan format teks (Bold, Italic, Link) ke dalam komentar
  const applyFormat = useCallback(
    (format: "bold" | "italic" | "link") => {
      const textarea = document.getElementById(
        "comment-box"
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      // ✅ 7. Mengambil teks yang dipilih oleh pengguna
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = comment.slice(start, end);

      if (!selectedText) return; // Jika tidak ada teks yang dipilih, hentikan fungsi

      let formattedText = selectedText;
      if (format === "bold") formattedText = `**${selectedText}**`;
      if (format === "italic") formattedText = `*${selectedText}*`;
      if (format === "link") {
        const url = prompt("Enter URL:"); // ✅ 8. Meminta pengguna untuk memasukkan URL
        if (url) formattedText = `[${selectedText}](${url})`;
      }

      // ✅ 9. Mengganti teks yang dipilih dengan format yang dipilih
      setComment(comment.slice(0, start) + formattedText + comment.slice(end));
      textarea.focus(); // ✅ 10. Mengembalikan fokus ke textarea setelah format diterapkan
    },
    [comment]
  );

  return (
    // ✅ 11. Container utama popup dengan efek blur di latar belakang
    <div className="fixed inset-0 bg-blend-saturation bg-opacity-20 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        {/* ✅ 12. Judul Popup */}
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {/* ✅ 13. Input Komentar - Untuk pengguna mengetik komentar baru */}
        <div className="border p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            {/* ✅ 14. Avatar pengguna */}
            <img
              src="/avatar1.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-semibold">Your Name</span>
          </div>
          {/* ✅ 15. Textarea untuk mengetik komentar */}
          <textarea
            id="comment-box"
            className="w-full border rounded p-2 text-gray-700"
            rows={3}
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {/* ✅ 16. Tombol Editor Teks (Bold, Italic, Link) */}
          <div className="flex gap-2 mt-2 text-gray-600">
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
        </div>

        {/* ✅ 17. Tampilan Komentar Orang Lain */}
        <div className="border p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            {/* ✅ 18. Avatar dan nama pengguna yang berkomentar */}
            <img
              src={comments[currentCommentIndex].avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-semibold">
              {comments[currentCommentIndex].name}
            </span>
          </div>
          {/* ✅ 19. Isi komentar */}
          <p className="text-gray-700">{comments[currentCommentIndex].text}</p>
        </div>

        {/* ✅ 20. Navigasi untuk berpindah komentar (ke atas dan ke bawah) */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            className="p-2 border rounded hover:bg-gray-100"
            onClick={() =>
              setCurrentCommentIndex((prev) => Math.max(prev - 1, 0))
            }
          >
            <FiArrowUp />
          </button>
          <button
            className="p-2 border rounded hover:bg-gray-100"
            onClick={() =>
              setCurrentCommentIndex((prev) =>
                Math.min(prev + 1, comments.length - 1)
              )
            }
          >
            <FiArrowDown />
          </button>
        </div>

        {/* ✅ 21. Tombol untuk menutup popup */}
        <button
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
