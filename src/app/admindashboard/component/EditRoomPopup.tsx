"use client";

import type React from "react";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

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

interface EditRoomPopupProps {
  room: Room;
  onClose: () => void;
  onSave: (updatedRoom: Room) => void;
}

export default function EditRoomPopup({
  room,
  onClose,
  onSave,
}: EditRoomPopupProps) {
  const [formData, setFormData] = useState({
    id: room.id,
    course: room.course,
    lecturer: room.lecturer,
    time: room.time,
    status: room.status,
    capacity: room.capacity,
    facilities: room.facilities?.join(", ") || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id) newErrors.id = "Kode ruangan harus diisi";
    if (!formData.capacity || formData.capacity <= 0)
      newErrors.capacity = "Kapasitas harus lebih dari 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number.parseInt(value) || "" : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const facilitiesArray = formData.facilities
        ? formData.facilities.split(",").map((f) => f.trim())
        : [];

      onSave({
        ...room,
        ...formData,
        facilities: facilitiesArray,
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
              Edit Ruangan {room.id}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Edit informasi ruangan kelas.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            {/* Kode Ruangan */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Kode Ruangan
              </label>
              <input
                type="text"
                name="id"
                className={`w-full p-2 text-xs sm:text-sm border rounded-md ${
                  errors.id ? "border-red-500" : ""
                }`}
                value={formData.id}
                onChange={handleChange}
                disabled
              />
              {errors.id && (
                <p className="text-red-500 text-xs mt-1">{errors.id}</p>
              )}
            </div>

            {/* Mata Kuliah */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Mata Kuliah
              </label>
              <input
                type="text"
                name="course"
                className="w-full p-2 text-xs sm:text-sm border rounded-md"
                value={formData.course}
                onChange={handleChange}
              />
            </div>

            {/* Dosen */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Dosen
              </label>
              <input
                type="text"
                name="lecturer"
                className="w-full p-2 text-xs sm:text-sm border rounded-md"
                value={formData.lecturer}
                onChange={handleChange}
              />
            </div>

            {/* Waktu */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Waktu
              </label>
              <input
                type="text"
                name="time"
                className="w-full p-2 text-xs sm:text-sm border rounded-md"
                value={formData.time}
                onChange={handleChange}
                placeholder="Contoh: Senin, 08:00 - 10:30"
              />
            </div>

            {/* Status */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Status
              </label>
              <select
                name="status"
                className="w-full p-2 text-xs sm:text-sm border rounded-md"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Aktif">Aktif</option>
                <option value="Kosong">Kosong</option>
                <option value="Pemeliharaan">Pemeliharaan</option>
              </select>
            </div>

            {/* Kapasitas */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Kapasitas
              </label>
              <input
                type="number"
                name="capacity"
                className={`w-full p-2 text-xs sm:text-sm border rounded-md ${
                  errors.capacity ? "border-red-500" : ""
                }`}
                value={formData.capacity}
                onChange={handleChange}
                min="1"
              />
              {errors.capacity && (
                <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
              )}
            </div>

            {/* Fasilitas */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium">
                Fasilitas
              </label>
              <textarea
                name="facilities"
                className="w-full p-2 text-xs sm:text-sm border rounded-md"
                value={formData.facilities}
                onChange={handleChange}
                placeholder="Pisahkan dengan koma (contoh: Proyektor, AC, Whiteboard)"
                rows={2}
              />
            </div>
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
