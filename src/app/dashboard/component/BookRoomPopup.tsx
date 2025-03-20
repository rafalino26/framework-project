import React, { useState } from "react";
import { FaRegCalendarCheck, FaTimes } from "react-icons/fa"; // Import ikon

type BookRoomPopupProps = {
  room: string;
  onClose: () => void;
};

const BookRoomPopup: React.FC<BookRoomPopupProps> = ({ room, onClose }) => {
  const [course, setCourse] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    if (!course || !lecturer || !time) {
      setError("Please fill in all fields before confirming the booking.");
      return;
    }

    // Reset error jika sebelumnya ada
    setError("");
    setSuccess(true);

    // Simulasikan delay sebelum menutup popup
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-blend-saturation bg-opacity-20 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white w-full sm:w-96 max-w-[90%] p-6 rounded-lg shadow-lg relative">
        {/* Header dengan ikon */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaRegCalendarCheck className="text-blue-600 text-lg sm:text-xl" />
            <h2 className="text-lg sm:text-xl font-semibold">
              Book Room {room}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Input Fields */}
        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          Course Name
        </label>
        <input
          type="text"
          className="w-full border p-2 rounded mb-3 text-sm sm:text-base"
          placeholder="Enter course name"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          Lecturer Name
        </label>
        <input
          type="text"
          className="w-full border p-2 rounded mb-3 text-sm sm:text-base"
          placeholder="Enter lecturer name"
          value={lecturer}
          onChange={(e) => setLecturer(e.target.value)}
        />

        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          Time
        </label>
        <input
          type="text"
          className="w-full border p-2 rounded mb-4 text-sm sm:text-base"
          placeholder="Enter time (e.g., 10:00 - 12:00)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        {/* Pesan Error */}
        {error && (
          <p className="text-red-600 text-sm sm:text-base mb-3">{error}</p>
        )}

        {/* Pesan Sukses */}
        {success && (
          <p className="text-green-600 text-sm sm:text-base mb-3">
            Room successfully booked!
          </p>
        )}

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookRoomPopup;
