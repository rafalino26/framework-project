"use client"

import { useState, useEffect } from "react"
import { FiChevronDown } from "react-icons/fi"
import { FaBook, FaUser, FaClock, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import AddSchedulePopup from "../component/AddSchedulePopup";
import PrintButton from "../component/PrintButton";
import api from "@/app/services/api";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

export default function SchedulePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [semester, setSemester] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const semesters = [
    { value: "all", label: "Semua Semester" },
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
    { value: "3", label: "Semester 3" },
    { value: "4", label: "Semester 4" },
    { value: "5", label: "Semester 5" },
    { value: "6", label: "Semester 6" },
    { value: "7", label: "Semester 7" },
    { value: "8", label: "Semester 8" },
  ];

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  const filteredCourses = semester === "all" ? courses : courses.filter((course) => course.semester === semester);
  const selectedCourseDetails = courses.filter((course) => selectedCourses.includes(course.id));

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

    const fetchSchedule = async () => {
    try {
      const response = await api.get("/schedule");
      const data = response.data;

      const formattedCourses = data.map((item: any) => {
        const start = dayjs(item.schedule_start_time);
        const end = dayjs(item.schedule_end_time);
        return {
          id: item.id,
          name: item.course_name,
          lecturer: item.lecturer_name ?? "Belum ada dosen",
          time: `${start.format("dddd")}, ${start.format("HH:mm")} - ${end.format("HH:mm")}`,
          room: item.room_code ?? item.room_name ?? "-",
          semester: String(item.semester),
          day: start.format("dddd"),
        };
      });

      setCourses(formattedCourses);
    } catch (error) {
      console.error("Gagal memuat data jadwal:", error);
    }
  };

  // Panggil fetchSchedule saat komponen mount
  useEffect(() => {
    fetchSchedule();
  }, []);

  // Setelah tambah jadwal, fetch ulang data supaya update UI langsung
  const handleAddSchedule = async (newSchedule: any) => {
    await fetchSchedule();
  };

  return (
    <div className="text-black space-y-6">
      <p className="text-gray-600 sm:text-left">
        Pilih mata kuliah yang Anda kontrak untuk melihat jadwal.
      </p>
  
      {/* Filter dan Badge + Reset dalam satu row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Custom Dropdown Filter Semester */}
        <div className="relative w-full sm:w-48">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex justify-between text-sm items-center border border-gray-300 px-4 py-2 rounded-md bg-transparent"
          >
            {semesters.find((s) => s.value === semester)?.label}
            <FiChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
          </button>
  
          {dropdownOpen && (
            <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {semesters.map((s) => (
                <div
                  key={s.value}
                  onClick={() => {
                    setSemester(s.value);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                >
                  {s.label}
                </div>  
              ))}
            </div>
          )}
        </div>
        {/* Badge & Reset Button */}
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 text-xs border border-black font-semibold text-black rounded-full bg-transparent">
            {selectedCourses.length} Mata Kuliah Dipilih
          </span>
          <button
            className="px-3 py-2 border text-sm border-black text-black rounded-md bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setSelectedCourses([])}
            disabled={selectedCourses.length === 0}
          >
            Reset
          </button>
        </div>
      </div>

      {/*Tabs + Button */}
      <div className="flex items-center justify-between w-full">
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit mx-auto sm:mx-0">
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === "courses" ? "bg-white font-semibold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("courses")}
          >
            Pilihan Mata Kuliah
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              activeTab === "schedule" ? "bg-white font-semibold" : "text-gray-500"
            }`}
            onClick={() => selectedCourses.length > 0 && setActiveTab("schedule")}
            disabled={selectedCourses.length === 0}
          >
            Jadwal
          </button>
        </div>
{/* Tombol Cetak dan Tambah Jadwal */} 
<div className="flex gap-2 ml-auto">
  {activeTab === "schedule" && selectedCourses.length > 0 && (
    <PrintButton contentId="printable-content" />
  )}
  <button
    className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
    onClick={() => setIsPopupOpen(true)}
  >
    + Tambah
  </button>
</div>
        {/* Popup */}
        <AddSchedulePopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onAddSchedule={handleAddSchedule}
        />
      </div>
  
      {/* Card Container */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white">
        {activeTab === "courses" ? (
          <>
            <h3 className="text-2xl font-semibold mb-4 text-center sm:text-left">Pilih Mata Kuliah</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b border-gray-300 pb-3">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-2 font-medium">Pilih</th>
                    <th className="p-2 font-medium">Mata Kuliah</th>
                    <th className="p-2 font-medium">Dosen</th>
                    <th className="p-2 font-medium">Waktu</th>
                    <th className="p-2 font-medium">Ruangan</th>
                    <th className="p-2 font-medium">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b text-sm border-gray-300">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => handleCourseToggle(course.id)}
                          className="w-5 h-5"
                        />
                      </td>
                      <td className="p-2 t">{course.name}</td>
                      <td className="p-2">{course.lecturer}</td>
                      <td className="p-2">{course.time}</td>
                      <td className="p-2">{course.room}</td>
                      <td className="p-2">{course.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
          <div id="printable-content">
            <h3 className="text-2xl font-semibold text-center sm:text-left">Jadwal Mata Kuliah</h3>
            <p className="text-gray-500 text-center sm:text-left">Jadwal mata kuliah yang Anda pilih.</p>
  
            <div className="space-y-6 mt-4">
              {days.map((day) => {
                const dayCourses = selectedCourseDetails.filter((course) => course.day === day);
                return (
                  <div key={day}>
                    <h4 className="text-lg font-semibold">{day}</h4>
                    {dayCourses.length > 0 ? (
                      dayCourses.map((course) => (
                        <div key={course.id} className="p-4 border border-gray-300 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                          {/* Kiri: Nama dan Dosen */}
                          <div className="flex-1">
                            <p className="font-semibold text-black flex items-center gap-2">
                              <FaBook /> {course.name}
                            </p>
                            <p className="text-gray-600 flex items-center gap-2">
                              <FaUser /> {course.lecturer}
                            </p>
                          </div>
                          {/* Tengah: Waktu dan Ruangan (dalam 1 kolom) */}
                          <div className="flex-1 flex flex-col items-start ">
                            {/* Waktu */}
                            <p className="text-gray-700 flex items-center gap-2">
                              <FaClock /> {course.time}
                            </p>

                            {/* Ruangan (tepat di bawah waktu) */}
                            <p className="text-gray-700 flex items-center gap-2">
                              <FaMapMarkerAlt /> {course.room}
                            </p>
                          </div>

                          {/* Kanan: Semester */}
                          <div className="text-right sm:text-left">
                            <p className="text-gray-700 flex items-center justify-end sm:justify-start gap-2">
                              <FaCalendarAlt className="text-gray-500" /> Semester {course.semester}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">Tidak ada jadwal untuk hari {day}.</p>
                    )}
                  </div>
                );
              })}
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}  