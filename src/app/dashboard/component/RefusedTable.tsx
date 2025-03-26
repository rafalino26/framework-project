"use client";

import { Calendar, Clock, Eye, X } from "lucide-react";
import { useState } from "react";

type Reservation = {
  roomCode: string;
  user: string;
  purpose: string;
  date: string;
  time: string;
  timestamp: string;
  rejectionReason: string;
};

const reservations: Reservation[] = [
  {
    roomCode: "R-103",
    user: "Maya Putri",
    purpose: "Diskusi Kelompok",
    date: "2023-06-22",
    time: "14:00 - 16:00",
    timestamp: "2023-06-13 09:15:33",
    rejectionReason: "Ruangan sudah dipesan untuk kegiatan lain",
  },
  {
    roomCode: "R-112",
    user: "Agus Supriyadi",
    purpose: "Rapat Alumni",
    date: "2023-07-01",
    time: "09:00 - 11:00",
    timestamp: "2023-06-14 13:10:50",
    rejectionReason: "Jadwal bertabrakan dengan acara fakultas",
  },
  {
    roomCode: "R-113",
    user: "Lina Marlina",
    purpose: "Pelatihan Desain",
    date: "2023-07-02",
    time: "13:00 - 15:00",
    timestamp: "2023-06-15 08:45:15",
    rejectionReason: "Dokumen persyaratan tidak lengkap",
  },
  {
    roomCode: "R-114",
    user: "Hendra Gunawan",
    purpose: "Seminar IoT",
    date: "2023-07-03",
    time: "10:30 - 12:30",
    timestamp: "2023-06-12 14:30:20",
    rejectionReason: "Melebihi kapasitas ruangan",
  },
  {
    roomCode: "R-115",
    user: "Sari Indah",
    purpose: "Workshop Kreativitas",
    date: "2023-07-04",
    time: "14:00 - 16:00",
    timestamp: "2023-06-11 16:15:10",
    rejectionReason: "Sudah ada reservasi sebelumnya",
  },
];

const DetailModal = ({
  reservation,
  onClose,
}: {
  reservation: Reservation | null;
  onClose: () => void;
}) => {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl border border-gray-100 shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Detail Reservasi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <h3 className="font-semibold text-lg">{reservation.roomCode}</h3>
          </div>

          <div className="col-span-2 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">Pengguna</p>
                <p>{reservation.user}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Tujuan</p>
                <p>{reservation.purpose}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Tanggal</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {reservation.date}
                </div>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Waktu</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {reservation.time}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 font-medium">Alasan Penolakan</p>
                <p className="text-red-600">{reservation.rejectionReason}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 font-medium">Diajukan Pada</p>
                <p>{reservation.timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RefusedTable() {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reservasi Ditolak</h1>
        <p className="text-gray-600 mt-1">Reservasi yang telah ditolak.</p>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Ruangan
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Pengguna
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Tujuan
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Tanggal
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Waktu
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Alasan Penolakan
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {reservations.map((reservation, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 border-b border-gray-100"
              >
                <td className="p-4 font-medium">{reservation.roomCode}</td>
                <td className="p-4">{reservation.user}</td>
                <td className="p-4">{reservation.purpose}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {reservation.date}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {reservation.time}
                  </div>
                </td>
                <td className="p-4 text-red-600">
                  {reservation.rejectionReason}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedReservation(reservation)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {reservations.map((reservation, index) => (
          <div
            key={index}
            className="p-4 border border-gray-100 rounded-lg shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{reservation.roomCode}</h3>
                  <p className="text-gray-600">{reservation.user}</p>
                </div>
                <button
                  onClick={() => setSelectedReservation(reservation)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="font-medium">Tujuan</p>
                <p className="text-gray-600">{reservation.purpose}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{reservation.date}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Waktu</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{reservation.time}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-gray-600 font-medium">Alasan Penolakan</p>
                <p className="text-red-600">{reservation.rejectionReason}</p>
              </div>

              <div className="text-sm text-gray-500">
                <p>Diajukan Pada</p>
                <p>{reservation.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DetailModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
}
