"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

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

export default function NewReservationPopup({
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!room) newErrors.room = "Ruangan harus dipilih";
    if (!purpose) newErrors.purpose = "Tujuan penggunaan harus diisi";
    if (!date) newErrors.date = "Tanggal harus dipilih";
    if (!startTime) newErrors.startTime = "Waktu mulai harus diisi";
    if (!endTime) newErrors.endTime = "Waktu selesai harus diisi";

    if (startTime && endTime) {
      if (startTime >= endTime) {
        newErrors.time = "Waktu selesai harus lebih besar dari waktu mulai";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        room,
        purpose,
        date,
        startTime,
        endTime,
        notes: notes || undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-2 min-w-[300px]">
        {/* Header */}
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              Reservasi Ruangan
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
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
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            {/* Ruangan */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Ruangan
              </label>
              <select
                className={`w-full p-2 text-xs sm:text-sm border rounded-md ${
                  errors.room ? "border-red-500" : ""
                }`}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              >
                <option value="">Pilih ruangan</option>
                {Array.from(
                  { length: 10 },
                  (_, i) => `JTE-${(i + 4).toString().padStart(2, "0")}`
                ).map((roomOption) => (
                  <option key={roomOption} value={roomOption}>
                    {roomOption}
                  </option>
                ))}
              </select>
              {errors.room && (
                <p className="text-red-500 text-xs mt-1">{errors.room}</p>
              )}
            </div>

            {/* Tujuan Penggunaan */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Tujuan Penggunaan
              </label>
              <input
                type="text"
                placeholder="Contoh: Seminar, Rapat, Kuliah Pengganti"
                className={`w-full p-2 text-xs sm:text-sm border rounded-md ${
                  errors.purpose ? "border-red-500" : ""
                }`}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
              {errors.purpose && (
                <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
              )}
            </div>

            {/* Tanggal & Durasi */}
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-medium">
                  Tanggal
                </label>
                <input
                  type="date"
                  className={`w-full p-2 text-xs sm:text-sm border rounded-md ${
                    errors.date ? "border-red-500" : ""
                  }`}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-medium">
                  Durasi
                </label>
                <div className="flex gap-1 sm:gap-2 items-center">
                  <input
                    type="time"
                    className={`w-full p-2 text-xs sm:text-sm border rounded-md ${
                      errors.startTime || errors.time ? "border-red-500" : ""
                    }`}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <span className="text-sm mx-1">-</span>
                  <input
                    type="time"
                    className={`w-full p-2 text-xs sm:text-sm border rounded-md ${
                      errors.endTime || errors.time ? "border-red-500" : ""
                    }`}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                {(errors.startTime || errors.endTime || errors.time) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.time || errors.startTime || errors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Catatan Tambahan */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Catatan Tambahan (opsional)
              </label>
              <textarea
                rows={3}
                className="w-full p-2 text-xs sm:text-sm border rounded-md min-h-[80px]"
                placeholder="Informasi tambahan tentang kebutuhan ruangan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex justify-end">
            <button
              type="submit"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Ajukan Reservasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
