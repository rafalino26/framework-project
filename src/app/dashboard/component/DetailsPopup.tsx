import React from "react";
import { FaRegClock } from "react-icons/fa";
import { MdOutlinePerson } from "react-icons/md";
import { BiBook } from "react-icons/bi";

// ✅ 1. Definisikan tipe Props untuk komponen DetailsPopup
interface DetailsPopupProps {
  show: boolean; // Menentukan apakah popup ditampilkan atau tidak
  room: string; // Nama ruangan
  status: "Free" | "Used" | "Locked"; // Status ruangan
  course: string; // Nama mata kuliah (jika ada)
  lecturer: string; // Nama dosen pengampu (jika ada)
  time: string; // Jadwal waktu penggunaan ruangan (jika ada)
  onClose: () => void; // Fungsi untuk menutup popup
}

// ✅ 2. Fungsi untuk menentukan kelas warna berdasarkan status ruangan
const getStatusClass = (status: "Free" | "Used" | "Locked") => {
  switch (status) {
    case "Free":
      return "bg-[#E8FFEB] text-[#049C6B]"; // Hijau untuk ruangan kosong
    case "Used":
      return "bg-[#FFFCE5] text-[#F99F01]"; // Kuning untuk ruangan sedang dipakai
    case "Locked":
      return "bg-[#FFECEF] text-[#DF1525]"; // Merah untuk ruangan terkunci
    default:
      return "";
  }
};

// ✅ 3. Definisi komponen utama DetailsPopup
const DetailsPopup: React.FC<DetailsPopupProps> = ({
  show,
  room,
  status,
  course,
  lecturer,
  time,
  onClose,
}) => {
  if (!show) return null; // Jika show adalah false, tidak menampilkan popup

  // ✅ 4. Tentukan informasi yang ditampilkan berdasarkan status ruangan
  const displayCourse =
    status === "Used"
      ? course // Jika sedang digunakan, tampilkan mata kuliah
      : status === "Free"
      ? "No scheduled class" // Jika kosong, tampilkan pesan default
      : "Room unavailable"; // Jika terkunci, tampilkan pesan default

  const displayLecturer = status === "Used" ? lecturer : "-"; // Jika sedang digunakan, tampilkan dosen
  const displayTime = status === "Used" ? time : "-"; // Jika sedang digunakan, tampilkan jadwal waktu

  return (
    // ✅ 5. Background overlay untuk popup
    <div className="fixed inset-0 bg-blend-saturation bg-opacity-20 backdrop-blur-sm flex justify-center items-center">
      {/* ✅ 6. Container utama popup */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        {/* ✅ 7. Judul Popup (Nama Ruangan) */}
        <h2 className="text-2xl font-bold">{room}</h2>

        {/* ✅ 8. Badge status ruangan */}
        <span
          className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-2 ${getStatusClass(
            status
          )}`}
        >
          {status}
        </span>

        {/* ✅ 9. Informasi Mata Kuliah */}
        <div className="mt-4 flex items-center gap-2">
          <BiBook className="text-xl text-gray-600" />
          <h3 className="text-xl font-semibold">{displayCourse}</h3>
        </div>

        {/* ✅ 10. Informasi Dosen Pengampu */}
        <div className="mt-2 flex items-center gap-2">
          <MdOutlinePerson className="text-lg text-gray-600" />
          <p className="text-gray-700 font-medium">{displayLecturer}</p>
        </div>

        {/* ✅ 11. Informasi Waktu Penggunaan Ruangan */}
        <div className="mt-2 flex items-center gap-2">
          <FaRegClock className="text-lg text-gray-600" />
          <p className="text-gray-700">{displayTime}</p>
        </div>

        {/* ✅ 12. Tombol untuk menutup popup */}
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DetailsPopup;
