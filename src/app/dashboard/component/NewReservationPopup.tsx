"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/app/services/api";

interface NewReservationPopupProps {
  onClose: () => void;
  onSubmit: (reservationData: {
    room: string;
    purpose: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => void;
}

// Room type for API integration
type Room = {
  roomId: string;
  roomCode: string;
  roomName: string;
  status: "aktif" | "kosong" | "pemeliharaan";
};

export default function UserNewReservationPopup({
  onClose,
  onSubmit,
}: NewReservationPopupProps) {
  const [room, setRoom] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Load available rooms from API
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);
        const response = await api.get("/rooms/current-status");

        if (Array.isArray(response.data)) {
          // Filter to only show available rooms (kosong status)
          const availableRooms = response.data.filter(
            (room: Room) => room.status === "kosong"
          );
          setAvailableRooms(availableRooms);
        } else {
          // Fallback to mock rooms if API fails
          setAvailableRooms(getMockRooms());
        }
      } catch (error) {
        console.error("Error loading rooms:", error);
        // Use mock data when API is not available
        setAvailableRooms(getMockRooms());
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, []);

  // Mock rooms for when API is not available
  const getMockRooms = (): Room[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      roomId: `room-${i + 1}`,
      roomCode: `JTE-${(i + 4).toString().padStart(2, "0")}`,
      roomName: `Ruang Kuliah ${(i + 4).toString().padStart(2, "0")}`,
      status: "kosong" as const,
    }));
  };

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!room) newErrors.room = "Ruangan harus dipilih";
    if (!purpose.trim()) newErrors.purpose = "Tujuan penggunaan harus diisi";
    if (!date) newErrors.date = "Tanggal harus dipilih";
    if (!startTime) newErrors.startTime = "Waktu mulai harus diisi";
    if (!endTime) newErrors.endTime = "Waktu selesai harus diisi";

    // Validate date is not in the past
    if (date && date < today) {
      newErrors.date = "Tanggal tidak boleh di masa lalu";
    }

    // Validate time
    if (startTime && endTime) {
      if (startTime >= endTime) {
        newErrors.time = "Waktu selesai harus lebih besar dari waktu mulai";
      }

      // Validate minimum duration (at least 30 minutes)
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

      if (diffMinutes < 30) {
        newErrors.time = "Durasi minimal 30 menit";
      }

      // Validate maximum duration (8 hours)
      if (diffMinutes > 480) {
        newErrors.time = "Durasi maksimal 8 jam";
      }
    }

    // Validate purpose length
    if (purpose.trim() && purpose.trim().length < 5) {
      newErrors.purpose = "Tujuan penggunaan minimal 5 karakter";
    }

    if (purpose.trim() && purpose.trim().length > 200) {
      newErrors.purpose = "Tujuan penggunaan maksimal 200 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        room,
        purpose: purpose.trim(),
        date,
        startTime,
        endTime,
        notes: notes.trim() || undefined,
      });
    } catch (error) {
      console.error("Error submitting reservation:", error);
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-2 min-w-[300px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              Reservasi Ruangan
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Isi formulir untuk mengajukan reservasi ruangan.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {/* Ruangan */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Ruangan <span className="text-red-500">*</span>
              </label>
              {loadingRooms ? (
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">
                    Memuat ruangan...
                  </span>
                </div>
              ) : (
                <select
                  className={`w-full p-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    errors.room ? "border-red-500" : "border-gray-300"
                  }`}
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Pilih ruangan</option>
                  {availableRooms.map((roomOption) => (
                    <option
                      key={roomOption.roomCode}
                      value={roomOption.roomCode}
                    >
                      {roomOption.roomCode} - {roomOption.roomName}
                    </option>
                  ))}
                </select>
              )}
              {errors.room && (
                <p className="text-red-500 text-xs mt-1">{errors.room}</p>
              )}
            </div>

            {/* Tujuan Penggunaan */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Tujuan Penggunaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Seminar Tugas Akhir, Rapat Proyek, Kuliah Pengganti"
                className={`w-full p-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.purpose ? "border-red-500" : "border-gray-300"
                }`}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                disabled={isSubmitting}
                maxLength={200}
              />
              <div className="flex justify-between items-center">
                {errors.purpose && (
                  <p className="text-red-500 text-xs">{errors.purpose}</p>
                )}
                <p className="text-xs text-gray-400 ml-auto">
                  {purpose.length}/200
                </p>
              </div>
            </div>

            {/* Tanggal */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={today}
                className={`w-full p-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            {/* Waktu */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Waktu <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1 sm:gap-2 items-center">
                <input
                  type="time"
                  className={`w-full p-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    errors.startTime || errors.time
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isSubmitting}
                />
                <span className="text-sm mx-1 text-gray-500">sampai</span>
                <input
                  type="time"
                  className={`w-full p-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    errors.endTime || errors.time
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {(errors.startTime || errors.endTime || errors.time) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.time || errors.startTime || errors.endTime}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Durasi minimal 30 menit, maksimal 8 jam
              </p>
            </div>

            {/* Catatan Tambahan */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Catatan Tambahan (opsional)
              </label>
              <textarea
                rows={3}
                className="w-full p-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[80px] resize-none"
                placeholder="Informasi tambahan tentang kebutuhan ruangan, jumlah peserta, atau peralatan khusus yang diperlukan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
                maxLength={500}
              />
              <p className="text-xs text-gray-400">{notes.length}/500</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100 pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-black text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-3 w-3 animate-spin" />}
              {isSubmitting ? "Mengajukan..." : "Ajukan Reservasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
