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
  Calendar,
  Eye,
  Check,
  MessageSquare,
} from "lucide-react";
import NewReservationPopup from "./NewReservationPopup";
import EditRoomPopup from "./EditRoomPopup";
import UpdateStatusPopup from "./UpdateStatusPopup";
import CommentPopup from "./CommentPopup";

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
  room: string;
  user: string;
  purpose: string;
  date: string;
  time: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  timestamp: string;
  rejectionReason?: string;
  notes?: string;
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
  comments?: Comment[];
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

  if (!isOpen) return null;

  // Default schedule if not provided
  const schedule = room.schedule || [
    { day: "Senin", time: "08:00 - 10:30" },
    { day: "Rabu", time: "13:00 - 15:30" },
    { day: "Jumat", time: "10:00 - 12:30" },
  ];

  // Use external comments if provided, otherwise use default
  const comments =
    externalComments.length > 0
      ? externalComments
      : room.comments || [
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

  // Filter reservations for this room
  const roomReservations = reservations.filter(
    (reservation) => reservation.room === room.id
  );

  // Handle new reservation submission
  const handleNewReservation = (reservationData: {
    room: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    if (onAddReservation) {
      onAddReservation(reservationData);
    }
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

  // Handle approve reservation
  const handleApproveReservation = (id: string) => {
    if (onApproveReservation) {
      onApproveReservation(id);
    }
  };

  // Handle reject reservation
  const handleRejectReservation = () => {
    if (rejectReservation && onRejectReservation && rejectReason.trim()) {
      onRejectReservation(rejectReservation.id, rejectReason);
      setRejectReservation(null);
      setRejectReason("");
    }
  };

  // Handle add comment
  const handleAddComment = (comment: { text: string; rating: number }) => {
    if (onAddComment) {
      onAddComment(room.id, comment);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
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
        <div className="flex bg-gray-100 p-1 text-sm rounded-lg mb-6">
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
              <button
                className="px-4 py-2 border border-gray-200 rounded-md text-black hover:bg-gray-50 flex items-center gap-2"
                onClick={() => setIsCommentPopupOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
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
