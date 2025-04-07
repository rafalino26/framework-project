"use client";

import type React from "react";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

type RoomStatus = "Aktif" | "Kosong" | "Pemeliharaan";

interface UpdateStatusPopupProps {
  roomId: string;
  currentStatus: RoomStatus;
  onClose: () => void;
  onUpdate: (newStatus: RoomStatus, note?: string) => void;
}

export default function UpdateStatusPopup({
  roomId,
  currentStatus,
  onClose,
  onUpdate,
}: UpdateStatusPopupProps) {
  const [status, setStatus] = useState<RoomStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [showNoteField, setShowNoteField] = useState(status === "Pemeliharaan");

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as RoomStatus;
    setStatus(newStatus);
    setShowNoteField(newStatus === "Pemeliharaan");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(status, showNoteField ? note : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-2 min-w-[300px]">
        {/* Header */}
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              Update Status Ruangan
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Update status ruangan {roomId}
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            {/* Status */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Status
              </label>
              <select
                className="w-full p-2 text-xs sm:text-sm border rounded-md"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="Aktif">Aktif</option>
                <option value="Kosong">Kosong</option>
                <option value="Pemeliharaan">Pemeliharaan</option>
              </select>
            </div>

            {/* Conditional Note Field */}
            {showNoteField && (
              <div className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-medium">
                  Catatan Pemeliharaan
                </label>
                <textarea
                  className="w-full p-2 text-xs sm:text-sm border rounded-md"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Jelaskan alasan pemeliharaan"
                  rows={3}
                />
              </div>
            )}

            {/* Warning for Pemeliharaan */}
            {status === "Pemeliharaan" && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  Mengubah status menjadi Pemeliharaan akan membatalkan semua
                  reservasi yang ada pada ruangan ini.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
