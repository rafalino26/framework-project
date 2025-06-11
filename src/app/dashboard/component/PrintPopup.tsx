"use client";

import { X, Printer, Calendar } from "lucide-react";

type RoomSchedule = {
  scheduleId: string;
  semester: number;
  lecturerName: string | null;
  scheduleStartTime: Date;
  scheduleEndTime: Date;
  course: {
    courseCode: string | null;
    courseName: string | null;
  };
};

type RoomDetails = {
  id: string;
  roomCode?: string;
  roomName?: string;
  course: string;
  lecturer: string;
  time: string;
  capacity: number;
  facilities: string[];
};

type UserPrintPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  room: RoomDetails;
  schedules?: RoomSchedule[];
};

export default function UserPrintPopup({
  isOpen,
  onClose,
  room,
  schedules = [],
}: UserPrintPopupProps) {
  const handlePrint = () => {
    window.print();
  };

  const formatScheduleTime = (startTime: Date, endTime: Date) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    const dayName = start.toLocaleDateString("id-ID", { weekday: "long" });
    return `${dayName}, ${formatTime(start)} - ${formatTime(end)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-xl font-bold">Jadwal Ruangan {room.id}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <Printer className="h-4 w-4" />
              Cetak
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Print Content */}
        <div className="space-y-6">
          {/* Room Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Informasi Ruangan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Kode Ruangan:</p>
                <p>{room.roomCode || room.id}</p>
              </div>
              {room.roomName && room.roomName !== room.id && (
                <div>
                  <p className="font-medium text-gray-600">Nama Ruangan:</p>
                  <p>{room.roomName}</p>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-600">Kapasitas:</p>
                <p>{room.capacity} orang</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Fasilitas:</p>
                <p>{room.facilities.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Jadwal Penggunaan</h3>
            {schedules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Semester
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Mata Kuliah
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Dosen
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.scheduleId}>
                        <td className="border border-gray-300 px-4 py-2">
                          {schedule.semester}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            <p className="font-medium">
                              {schedule.course.courseName || "-"}
                            </p>
                            {schedule.course.courseCode && (
                              <p className="text-sm text-gray-600">
                                {schedule.course.courseCode}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {schedule.lecturerName || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {formatScheduleTime(
                            schedule.scheduleStartTime,
                            schedule.scheduleEndTime
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Tidak ada jadwal tersedia untuk ruangan ini</p>
              </div>
            )}
          </div>

          {/* Print Footer */}
          <div className="text-center text-sm text-gray-500 mt-8 print:block hidden">
            <p>Dicetak pada: {new Date().toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
