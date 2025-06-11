"use client";

import { Calendar, Clock, Eye, X } from "lucide-react";
import { useState } from "react";

type Reservation = {
  id: string;
  room: string;
  user: string;
  purpose: string;
  date: string;
  time: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  timestamp: string;
  rejectionReason?: string | null;
  notes?: string | null;
};

interface AllTableProps {
  data?: Reservation[];
}

const DetailModal = ({
  reservation,
  onClose,
}: {
  reservation: Reservation | null;
  onClose: () => void;
}) => {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
            <h3 className="font-semibold text-lg">{reservation.room}</h3>
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
                <p className="text-gray-600 font-medium">Tanggal & Waktu</p>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {reservation.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {reservation.time}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    reservation.status === "Menunggu"
                      ? "bg-gray-200 text-black"
                      : reservation.status === "Disetujui"
                      ? "bg-white text-black border border-gray-200"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {reservation.status}
                </span>
              </div>
              {reservation.status === "Ditolak" &&
                reservation.rejectionReason && (
                  <div className="col-span-2">
                    <p className="text-gray-600 font-medium">
                      Alasan Penolakan
                    </p>
                    <p className="text-red-600">
                      {reservation.rejectionReason}
                    </p>
                  </div>
                )}
              {reservation.notes && reservation.status !== "Ditolak" && (
                <div className="col-span-2">
                  <p className="text-gray-600 font-medium">Catatan</p>
                  <p>{reservation.notes}</p>
                </div>
              )}
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

export default function UserAllTable({ data = [] }: AllTableProps) {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

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
          Lihat semua reservasi ruangan Anda.
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
                Tujuan
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Tanggal & Waktu
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Diajukan Pada
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-700">
                Aksi
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
                <td className="p-4">{reservation.purpose}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {reservation.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {reservation.time}
                    </div>
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
                <td className="p-4">
                  <button
                    onClick={() => setSelectedReservation(reservation)}
                    className="text-gray-400 hover:text-gray-800"
                    title="Lihat Detail"
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
        {data.map((reservation, index) => (
          <div
            key={index}
            className="p-4 border border-gray-100 rounded-lg shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{reservation.room}</h3>
                  <p className="text-gray-600">{reservation.purpose}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{reservation.date}</span>
                  </div>
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

              <div className="flex justify-end pt-2 border-t">
                <button
                  onClick={() => setSelectedReservation(reservation)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  title="Lihat Detail"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <DetailModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
}
