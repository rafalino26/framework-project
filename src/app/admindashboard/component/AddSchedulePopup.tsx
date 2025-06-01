"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/app/services/api";

type AddSchedulePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSchedule: (newSchedule: any) => void;
};

type ScheduleItem = {
  room_code: string;
  // bisa tambah properti lain sesuai respons API
};

export default function AddSchedulePopup({
  isOpen,
  onClose,
  onAddSchedule,
}: AddSchedulePopupProps) {
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    lecturer: "",
    day: "",
    timeRange: "",
    roomCode: "",
    semester: "",
  });

  const [rooms, setRooms] = useState<string[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errorRooms, setErrorRooms] = useState<string | null>(null);

  // Fungsi bantu cari tanggal terdekat berdasarkan hari dalam seminggu
  function getUpcomingDateByDay(day: string) {
    const daysMap: { [key: string]: number } = {
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6,
      Minggu: 0,
    };
    const targetDay = daysMap[day];
    if (targetDay === undefined) return new Date().toISOString().slice(0, 10);

    const now = new Date();
    const diff = (targetDay + 7 - now.getDay()) % 7 || 7;
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + diff);
    return nextDay.toISOString().slice(0, 10);
  }

useEffect(() => {
  if (isOpen) {
    setLoadingRooms(true);
    type Room = {
      roomId: string;
      roomCode: string;
      roomName: string;
      status: string;
      capacity: number;
      rating: number;
      courseName: string | null;
      lecturerName: string | null;
      scheduleStartTime: string | null;
      scheduleEndTime: string | null;
    };
    api
      .get<Room[]>("/rooms/current-status")
      .then((res) => {
        const roomCodes = res.data.map((room) => room.roomCode);
        const uniqueRoomCodes = Array.from(new Set(roomCodes));
        setRooms(uniqueRoomCodes);
        setLoadingRooms(false);
      })
      .catch(() => {
        setErrorRooms("Gagal mengambil data ruangan");
        setLoadingRooms(false);
      });
  }
}, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.day || !formData.timeRange.includes(" - ")) {
      alert("Mohon isi hari dan waktu dengan format benar (contoh: 08:00 - 10:00)");
      return;
    }

    const [start, end] = formData.timeRange.split(" - ");
    const selectedDate = getUpcomingDateByDay(formData.day);
    const scheduleStartTime = new Date(`${selectedDate}T${start}:00`).toISOString();
    const scheduleEndTime = new Date(`${selectedDate}T${end}:00`).toISOString();

    const payload = {
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      lecturer: formData.lecturer,
      scheduleStartTime,
      scheduleEndTime,
      roomCode: formData.roomCode,
      semester: Number(formData.semester),
    };

    try {
      const res = await api.post("/schedule", payload);
      onAddSchedule(res.data);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menambahkan jadwal");
    }
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
          <div>
            <label className="block text-sm font-medium mb-1">Kode MK</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              placeholder="PWL-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nama MK</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              placeholder="Pemrograman Web Lanjut"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dosen</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.lecturer}
              onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
              placeholder="Dr. Ani Wijaya"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-1">Waktu (HH:mm - HH:mm)</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.timeRange}
              onChange={(e) => setFormData({ ...formData, timeRange: e.target.value })}
              placeholder="09:00 - 11:00"
            />
          </div>

          {/* Ruangan (dropdown) */}
          <div>
            <label className="block text-sm font-medium mb-1">Ruangan</label>
            {loadingRooms ? (
              <p>Loading rooms...</p>
            ) : errorRooms ? (
              <p className="text-red-500">{errorRooms}</p>
            ) : (
              <select
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
                value={formData.roomCode}
                onChange={(e) =>
                  setFormData({ ...formData, roomCode: e.target.value })
                }
              >
                <option value="">Pilih Ruangan</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              placeholder="4"
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
