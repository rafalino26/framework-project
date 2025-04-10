"use client";

import { useRef } from "react";
import { X, Printer, Download, Calendar } from "lucide-react";

type Schedule = {
  day: string;
  time: string;
  course: string;
  lecturer: string;
  semester: string;
};

type RoomSchedule = {
  id: string;
  schedules: Schedule[];
};

type PrintPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  room: {
    id: string;
    course: string;
    lecturer: string;
    time: string;
    capacity: number;
    facilities: string[];
  };
};

export default function PrintPopup({ isOpen, onClose, room }: PrintPopupProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Generate sample schedules for the room
  const roomSchedule: RoomSchedule = {
    id: room.id,
    schedules: [
      {
        day: "Senin",
        time: "08:00 - 10:30",
        course: "Algoritma dan Pemrograman",
        lecturer: "Dr. Budi Santoso",
        semester: "Semester 1",
      },
      {
        day: "Senin",
        time: "13:00 - 15:30",
        course: "Struktur Data",
        lecturer: "Dr. Rina Wijaya",
        semester: "Semester 2",
      },
      {
        day: "Selasa",
        time: "09:00 - 11:30",
        course: "Pemrograman Web",
        lecturer: "Prof. Ahmad Hidayat",
        semester: "Semester 3",
      },
      {
        day: "Rabu",
        time: "10:00 - 12:30",
        course: "Basis Data Lanjut",
        lecturer: "Dr. Maya Putri",
        semester: "Semester 4",
      },
      {
        day: "Kamis",
        time: "08:00 - 10:30",
        course: "Jaringan Komputer",
        lecturer: "Prof. Darmawan",
        semester: "Semester 5",
      },
      {
        day: "Jumat",
        time: "13:00 - 15:30",
        course: "Kecerdasan Buatan",
        lecturer: "Dr. Siti Rahayu",
        semester: "Semester 6",
      },
    ],
  };

  // Group schedules by day
  const schedulesByDay = roomSchedule.schedules.reduce((acc, schedule) => {
    if (!acc[schedule.day]) {
      acc[schedule.day] = [];
    }
    acc[schedule.day].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  // Order days of the week
  const daysOrder = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];
  const sortedDays = Object.keys(schedulesByDay).sort(
    (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  // Handle print functionality using browser's native print
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = contentRef.current?.innerHTML || "";

    printWindow.document.write(`
  <html>
    <head>
      <title>Jadwal Ruangan ${room.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; word-wrap: break-word; }
        th { background-color: #f2f2f2; }
        .print-header { margin-bottom: 20px; text-align: center; }
        .print-footer { margin-top: 20px; font-size: 12px; color: #666; }
        @media print {
          @page { size: landscape; }
        }
      </style>
    </head>
    <body>
      <div class="print-content">
        ${printContent}
      </div>
    </body>
  </html>
`);

    printWindow.document.close();
    printWindow.focus();

    // Print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Handle download as PDF (simulated by printing)
  const handleDownload = () => {
    handlePrint();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl mx-4 border border-gray-200 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Jadwal Ruangan {room.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-gray-600">
              Kapasitas:{" "}
              <span className="font-medium text-black">
                {room.capacity} orang
              </span>
            </p>
            <p className="text-gray-600">
              Fasilitas:{" "}
              <span className="font-medium text-black">
                {room.facilities.join(", ")}
              </span>
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex-1 sm:flex-initial"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition flex-1 sm:flex-initial"
            >
              <Download className="h-4 w-4" />
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>

        <div ref={contentRef}>
          <div className="print-header mb-6">
            <h1 className="text-2xl font-bold text-center">
              Jadwal Ruangan {room.id}
            </h1>
            <p className="text-center text-gray-600">
              Semester Ganjil 2023/2024
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-full table-fixed">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200 w-[15%]">
                    Hari
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200 w-[15%]">
                    Waktu
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200 w-[30%]">
                    Mata Kuliah
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200 w-[25%]">
                    Dosen
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700 border border-gray-200 w-[15%]">
                    Semester
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedDays.map((day) =>
                  schedulesByDay[day].map((schedule, index) => (
                    <tr
                      key={`${day}-${index}`}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {index === 0 && (
                        <td
                          className="py-3 px-4 text-black font-medium border border-gray-200"
                          rowSpan={schedulesByDay[day].length}
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {day}
                          </div>
                        </td>
                      )}
                      <td className="py-3 px-4 text-black border border-gray-200">
                        {schedule.time}
                      </td>
                      <td className="py-3 px-4 text-black border border-gray-200">
                        {schedule.course}
                      </td>
                      <td className="py-3 px-4 text-black border border-gray-200">
                        {schedule.lecturer}
                      </td>
                      <td className="py-3 px-4 text-black border border-gray-200">
                        {schedule.semester}
                      </td>
                    </tr>
                  ))
                )}
                {sortedDays.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-center text-gray-500 border border-gray-200"
                    >
                      Tidak ada jadwal untuk ruangan ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              * Jadwal dapat berubah sewaktu-waktu. Silakan periksa secara
              berkala.
            </p>
            <p>* Untuk informasi lebih lanjut, hubungi bagian akademik.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
