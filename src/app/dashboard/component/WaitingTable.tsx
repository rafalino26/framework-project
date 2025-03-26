"use client";

import { Calendar, Clock } from "lucide-react";

type Reservation = {
  roomCode: string;
  user: string;
  purpose: string;
  date: string;
  time: string;
  timestamp: string;
};

const reservations: Reservation[] = [
  {
    roomCode: "R-101",
    user: "Siti Rahayu",
    purpose: "Seminar Tugas Akhir",
    date: "2023-06-20",
    time: "13:00 - 15:00",
    timestamp: "2023-06-15 10:30:45",
  },
  {
    roomCode: "R-104",
    user: "Darmawan",
    purpose: "Ujian Susulan",
    date: "2023-06-23",
    time: "10:00 - 12:00",
    timestamp: "2023-06-12 11:45:20",
  },
  {
    roomCode: "R-106",
    user: "Budi Santoso",
    purpose: "Presentasi Proposal",
    date: "2023-06-25",
    time: "15:00 - 17:00",
    timestamp: "2023-06-14 09:10:25",
  },
  {
    roomCode: "R-107",
    user: "Ani Lestari",
    purpose: "Pelatihan Software",
    date: "2023-06-26",
    time: "13:30 - 15:30",
    timestamp: "2023-06-13 14:55:10",
  },
  {
    roomCode: "R-108",
    user: "Fajar Nugroho",
    purpose: "Rapat Organisasi",
    date: "2023-06-27",
    time: "08:30 - 10:30",
    timestamp: "2023-06-12 16:20:45",
  },
];

export default function WaitingTable() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reservasi Menunggu</h1>
        <p className="text-gray-600 mt-1">Reservasi yang belum diproses.</p>
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
                Diajukan
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
                <td className="p-4 text-gray-500">{reservation.timestamp}</td>
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
              </div>

              <div className="border-t pt-3">
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

              <div className="text-sm text-gray-500">
                <p>Diajukan Pada</p>
                <p>{reservation.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
