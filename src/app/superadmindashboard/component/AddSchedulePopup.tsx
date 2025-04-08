"use client";

import { useState } from "react";
import { X } from "lucide-react";

type AddSchedulePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSchedule: (newSchedule: any) => void;
};

export default function AddSchedulePopup({
  isOpen,
  onClose,
  onAddSchedule,
}: AddSchedulePopupProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    lecturer: "",
    time: "",
    room: "",
    semester: "",
    day: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchedule(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tambah Jadwal Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kode Mata Kuliah */}
          <div>
            <label className="block text-sm font-medium mb-1">Kode MK</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="MK001"
            />
          </div>

          {/* Nama Mata Kuliah */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama MK</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Algoritma dan Pemrograman"
            />
          </div>

          {/* Dosen Pengajar */}
          <div>
            <label className="block text-sm font-medium mb-1">Dosen</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.lecturer}
              onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
              placeholder="Dr. Budi Santoso"
            />
          </div>

          {/* Waktu Kuliah */}
          <div>
            <label className="block text-sm font-medium mb-1">Waktu</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="Senin, 08:00 - 10:30"
            />
          </div>

          {/* Ruangan */}
          <div>
            <label className="block text-sm font-medium mb-1">Ruangan</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              placeholder="JTE-01"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              placeholder="1"
            />
          </div>

          {/* Hari */}
          <div>
            <label className="block text-sm font-medium mb-1">Hari</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            >
              <option value="">Pilih Hari</option>
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
            </select>
          </div>

          {/* Tombol Aksi */}
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
