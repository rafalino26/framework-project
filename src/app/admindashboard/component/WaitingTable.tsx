"use client";

import type React from "react";

import { Calendar, Clock, Eye, Check, X } from "lucide-react";
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

interface WaitingTableProps {
  data?: Reservation[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
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
              {reservation.notes && (
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

const RejectModal = ({
  reservation,
  onClose,
  onReject,
}: {
  reservation: Reservation | null;
  onClose: () => void;
  onReject: (id: string, reason: string) => void;
}) => {
  const [reason, setReason] = useState("");

  if (!reservation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onReject(reservation.id, reason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md border border-gray-100 shadow-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Tolak Reservasi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="mb-2">
              Anda akan menolak reservasi untuk ruangan{" "}
              <span className="font-semibold">{reservation.room}</span> oleh{" "}
              <span className="font-semibold">{reservation.user}</span>.
            </p>
            <label className="block text-sm font-medium mb-2">
              Alasan Penolakan
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Berikan alasan penolakan reservasi ini..."
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Tolak Reservasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function WaitingTable({
  data = [],
  onApprove,
  onReject,
}: WaitingTableProps) {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [rejectReservation, setRejectReservation] =
    useState<Reservation | null>(null);

  // Filter to only show waiting reservations
  const waitingReservations = data.filter(
    (reservation) => reservation.status === "Menunggu"
  );

  const handleApprove = (id: string) => {
    if (onApprove) {
      onApprove(id);
    }
  };

  const handleReject = (id: string, reason: string) => {
    if (onReject) {
      onReject(id, reason);
    }
  };

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
                Tanggal & Waktu
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
            {waitingReservations.map((reservation, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 border-b border-gray-100"
              >
                <td className="p-4 font-medium">{reservation.room}</td>
                <td className="p-4">{reservation.user}</td>
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
                <td className="p-4 text-gray-500">{reservation.timestamp}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedReservation(reservation)}
                      className="text-gray-400 hover:text-gray-800"
                      title="Lihat Detail"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleApprove(reservation.id)}
                      className="text-green-500 hover:text-green-700"
                      title="Setujui"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setRejectReservation(reservation)}
                      className="text-red-500 hover:text-red-700"
                      title="Tolak"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {waitingReservations.map((reservation, index) => (
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
              </div>

              <div className="border-t pt-3">
                <p className="font-medium">Tujuan</p>
                <p className="text-gray-600">{reservation.purpose}</p>
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

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  onClick={() => setSelectedReservation(reservation)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  title="Lihat Detail"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleApprove(reservation.id)}
                  className="p-2 text-green-500 hover:bg-green-50 rounded-full"
                  title="Setujui"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRejectReservation(reservation)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  title="Tolak"
                >
                  <X className="w-5 h-5" />
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

      {/* Reject Modal */}
      <RejectModal
        reservation={rejectReservation}
        onClose={() => setRejectReservation(null)}
        onReject={handleReject}
      />
    </div>
  );
}
