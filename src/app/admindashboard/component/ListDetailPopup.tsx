"use client";

import { useState } from "react";
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
} from "lucide-react";
import NewReservationPopup from "./NewReservationPopup";
import EditRoomPopup from "./EditRoomPopup";
import UpdateStatusPopup from "./UpdateStatusPopup";

type Room = {
  id: string;
  course: string;
  lecturer: string;
  time: string;
  status: "Aktif" | "Kosong" | "Pemeliharaan";
  rating: number;
  capacity: number;
  facilities?: string[];
};

type Comment = {
  id: string;
  user: string;
  text: string;
  rating: number;
  likes: number;
  dislikes: number;
  date: string;
};

type Reservation = {
  id: string;
  user: string;
  purpose: string;
  dateTime: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
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
};

export default function ListDetailPopup({
  isOpen,
  onClose,
  room,
  onUpdateRoom,
}: ListDetailPopupProps) {
  const [activeTab, setActiveTab] = useState<
    "informasi" | "komentar" | "reservasi"
  >("informasi");
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);

  if (!isOpen) return null;

  // Default schedule if not provided
  const schedule = room.schedule || [
    { day: "Senin", time: "08:00 - 10:30" },
    { day: "Rabu", time: "13:00 - 15:30" },
    { day: "Jumat", time: "10:00 - 12:30" },
  ];

  // Default comments if not provided
  const comments = room.comments || [
    {
      id: "1",
      user: "Budi Santoso",
      text: "Ruangan sangat nyaman dan bersih. AC berfungsi dengan baik.",
      rating: 5,
      likes: 12,
      dislikes: 2,
      date: "2 jam yang lalu",
    },
    {
      id: "2",
      user: "Darmawan",
      text: "AC terlalu dingin dan tidak bisa diatur.",
      rating: 4,
      likes: 7,
      dislikes: 2,
      date: "3 hari yang lalu",
    },
  ];

  // Default reservations if not provided
  const reservations = room.reservations || [
    {
      id: "1",
      user: "Siti Rahayu",
      purpose: "Seminar Tugas Akhir",
      dateTime: "2023-06-20, 13:00 - 15:00",
      status: "Menunggu",
    },
  ];

  // Handle new reservation submission
  const handleNewReservation = (reservationData: {
    room: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    console.log("New reservation:", reservationData);
    // Here you would typically send this data to your backend
    // For now, we'll just close the popup
    setIsNewReservationOpen(false);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">
            Detail Ruangan {room.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-md mb-6">
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
                        Mata Kuliah:
                      </p>
                      <p className="text-gray-600">{room.course}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-4 w-4 mr-3 mt-0.5 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-black font-medium mr-2">Dosen:</p>
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
              <button className="px-4 py-2 border border-gray-200 rounded-md text-black hover:bg-gray-50">
                Tambah Komentar
              </button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-black mr-2">
                        {comment.user.startsWith("Bu") ||
                        comment.user.startsWith("Da")
                          ? comment.user.substring(0, 2)
                          : comment.user.substring(0, 2)}
                      </span>
                      <span className="text-black">{comment.user}</span>
                    </div>
                    {renderStars(comment.rating)}
                  </div>

                  <p className="text-black mb-3">{comment.text}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        <span>{comment.dislikes}</span>
                      </button>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-2">
                        {comment.date}
                      </span>
                      <button className="text-red-500 hover:text-red-700">
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
                  {reservations.map((reservation) => (
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
                      <td className="py-3 px-4 text-black">
                        {reservation.dateTime}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            reservation.status === "Menunggu"
                              ? "bg-gray-100 text-gray-800"
                              : reservation.status === "Disetujui"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-gray-100 text-black rounded-md hover:bg-gray-200">
                            Setujui
                          </button>
                          <button className="px-3 py-1 text-red-500 rounded-md hover:bg-red-50">
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </div>
  );
}
