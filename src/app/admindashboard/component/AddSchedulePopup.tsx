"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/app/services/api";

type AddSchedulePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSchedule: (newSchedule: any) => void;
};

// ... (Type ScheduleItem dan Room bisa disesuaikan atau dihapus jika tidak digunakan di luar)

export default function AddSchedulePopup({
  isOpen,
  onClose,
  onAddSchedule,
}: AddSchedulePopupProps) {
  // 1. Update state agar lebih sesuai dengan nama field API baru
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    lecturerName: "", // Diubah dari lecturer
    day: "",
    timeRange: "",
    roomCode: "",
    semesterOrdinal: "", // Diubah dari semester
  });

  const [rooms, setRooms] = useState<string[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errorRooms, setErrorRooms] = useState<string | null>(null);

  useEffect(() => {
    // ... (Logika untuk fetch rooms tidak berubah)
    if (isOpen) {
      setLoadingRooms(true);
      type Room = { roomCode: string; /* ... properti lain */ };
      api
        .get<Room[]>("/rooms/current-status")
        .then((res) => {
          const roomCodes = res.data.map((room) => room.roomCode);
          setRooms(Array.from(new Set(roomCodes)));
          setLoadingRooms(false);
        })
        .catch(() => {
          setErrorRooms("Gagal mengambil data ruangan");
          setLoadingRooms(false);
        });
    }
  }, [isOpen]);

  // 2. Logika diubah total untuk membuat payload baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.day || !formData.timeRange.includes(" - ")) {
      alert("Mohon isi hari dan waktu dengan format benar (contoh: 09:00 - 11:00)");
      return;
    }

    // Ambil startTime dan endTime dari timeRange
    const [startTime, endTime] = formData.timeRange.split(" - ").map(time => time.trim());

    // Mapping hari ke angka (dayOfWeek)
    const daysMap: { [key: string]: number } = {
      Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6, Minggu: 7, // Sesuaikan angka dengan API Anda
    };
    const dayOfWeek = daysMap[formData.day];

    // Buat payload sesuai struktur baru
    const payload = {
      courseName: formData.courseName,
      courseCode: formData.courseCode,
      roomCode: formData.roomCode,
      lecturerName: formData.lecturerName,
      semesterOrdinal: Number(formData.semesterOrdinal),
      dayOfWeek: dayOfWeek,
      startTime: startTime,
      endTime: endTime,
    };

    try {
      // 3. Panggil endpoint baru
      const res = await api.post("/academic-schedule", payload);
      onAddSchedule(res.data);
      onClose(); // Tutup popup setelah sukses
      alert("Jadwal berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan jadwal:", error);
      alert("Terjadi kesalahan saat menambahkan jadwal. Periksa kembali data Anda.");
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

        {/* 4. Sesuaikan value dan onChange pada form Dosen & Semester */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Kode MK (tidak berubah) */}
          <div>
            <label className="block text-sm font-medium mb-1">Kode MK</label>
            <input type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
              placeholder="BD"
            />
          </div>

          {/* Input Nama MK (tidak berubah) */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama MK</label>
            <input type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              placeholder="Big Data"
            />
          </div>

          {/* Input Dosen (diperbarui) */}
          <div>
            <label className="block text-sm font-medium mb-1">Dosen</label>
            <input type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.lecturerName}
              onChange={(e) => setFormData({ ...formData, lecturerName: e.target.value })}
              placeholder="Rizal"
            />
          </div>

          {/* Input Hari (tidak berubah) */}
          <div>
            <label className="block text-sm font-medium mb-1">Hari</label>
            <select required className="w-full px-3 py-2 border border-gray-200 rounded-md"
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

          {/* Input Waktu (tidak berubah) */}
          <div>
            <label className="block text-sm font-medium mb-1">Waktu (HH:mm - HH:mm)</label>
            <input type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.timeRange}
              onChange={(e) => setFormData({ ...formData, timeRange: e.target.value })}
              placeholder="07:00 - 08:40"
            />
          </div>

          {/* Input Ruangan (tidak berubah) */}
          <div>
            <label className="block text-sm font-medium mb-1">Ruangan</label>
            {loadingRooms ? <p>Memuat ruangan...</p> : errorRooms ? <p className="text-red-500">{errorRooms}</p> : (
              <select required className="w-full px-3 py-2 border border-gray-200 rounded-md"
                value={formData.roomCode}
                onChange={(e) => setFormData({ ...formData, roomCode: e.target.value })}
              >
                <option value="">Pilih Ruangan</option>
                {rooms.map((room) => ( <option key={room} value={room}>{room}</option> ))}
              </select>
            )}
          </div>

          {/* Input Semester (diperbarui) */}
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <input type="number" required className="w-full px-3 py-2 border border-gray-200 rounded-md"
              value={formData.semesterOrdinal}
              onChange={(e) => setFormData({ ...formData, semesterOrdinal: e.target.value })}
              placeholder="6"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}