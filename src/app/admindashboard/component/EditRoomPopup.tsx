"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";

type Room = {
  id: string;
  roomCode?: string;
  roomName?: string;
  course: string;
  lecturer: string;
  time: string;
  status: "Aktif" | "Kosong" | "Pemeliharaan";
  rating: number;
  capacity: number;
  facilities?: string[];
};

interface EditRoomPopupProps {
  isOpen: boolean;
  room: Room;
  onClose: () => void;
  onSave: (updatedRoom: Room) => void;
}

export default function EditRoomPopup({
  isOpen,
  room,
  onClose,
  onSave,
}: EditRoomPopupProps) {
  const [formData, setFormData] = useState({
    id: room.id,
    roomCode: room.roomCode || room.id,
    roomName: room.roomName || "",
    capacity: room.capacity.toString(),
    status: room.status,
    facilities:
      room.facilities && room.facilities.length > 0
        ? room.facilities.join(", ")
        : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format facilities as an array if it's a string
    const facilities =
      typeof formData.facilities === "string"
        ? formData.facilities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : formData.facilities;

    // Create a clean room object
    const updatedRoom: Room = {
      ...room,
      id: formData.id,
      roomCode: formData.roomCode,
      roomName: formData.roomName.trim() || undefined,
      capacity: Number(formData.capacity),
      status: formData.status as "Aktif" | "Kosong" | "Pemeliharaan",
      facilities: facilities,
    };

    console.log("Submitting updated room data:", updatedRoom);
    onSave(updatedRoom);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Edit Ruangan {room.roomCode || room.id}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Kode Ruangan
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
                value={formData.roomCode}
                onChange={(e) =>
                  setFormData({ ...formData, roomCode: e.target.value })
                }
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Ruangan
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
                value={formData.roomName}
                onChange={(e) =>
                  setFormData({ ...formData, roomName: e.target.value })
                }
                placeholder="Nama ruangan (opsional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Kapasitas
              </label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                placeholder="30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.status}
              onChange={(e) => {
                // Ensure we're setting a valid status type
                const newStatus = e.target.value as
                  | "Aktif"
                  | "Kosong"
                  | "Pemeliharaan";
                setFormData({ ...formData, status: newStatus });
              }}
            >
              <option value="Aktif">Aktif</option>
              <option value="Kosong">Kosong</option>
              <option value="Pemeliharaan">Pemeliharaan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fasilitas</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.facilities}
              onChange={(e) =>
                setFormData({ ...formData, facilities: e.target.value })
              }
              placeholder="Proyektor, AC, Whiteboard, dll"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
