"use client";

import { Calendar, Clock } from "lucide-react";

type Reservation = {
  id: string;
  room: string;
  user: string;
  purpose: string;
  date: string;
  time: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  timestamp: string;
  rejectionReason?: string;
};

interface AllTableProps {
  data?: Reservation[];
}

export default function AllTable({ data = [] }: AllTableProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-gray-200 text-black";
      case "Disetujui":
        return "bg-white text-black border border-gray-200";
      case "Ditolak":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Reservasi</h1>
        <p className="text-gray-600 mt-1">
          Kelola dan lihat status reservasi ruangan.
        </p>
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
                Status
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Diajukan
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.map((reservation, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 border-b border-gray-100"
              >
                <td className="p-4 font-medium">{reservation.room}</td>
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
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{reservation.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {data.map((reservation, index) => (
          <div
            key={index}
            className="p-4 border border-gray-100 rounded-lg shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{reservation.room}</h3>
                  <p className="text-gray-600">{reservation.user}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </span>
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
