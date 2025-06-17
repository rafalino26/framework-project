"use client"

import { useState, useEffect } from "react"
import { FiChevronDown } from "react-icons/fi"
import { FaBook, FaUser, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaSpinner, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import PrintButton from "../component/PrintButton";
import api from "@/app/services/api";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

// Definisikan tipe data untuk UI
interface Course {
  id: string;
  name: string;
  lecturer: string;
  time: string;
  room: string;
  semester: string;
  day: string;
}

export default function SchedulePage() {
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [semester, setSemester] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data statis
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
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  // Data turunan
  const filteredCourses = semester === "all" ? courses : courses.filter((course) => course.semester === semester);
  const selectedCourseDetails = courses.filter((course) => selectedCourses.includes(course.id));

  // Handlers
  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]));
  };

  const fetchSchedule = async () => {
    setIsLoading(true);
    setError(null); // Reset error setiap kali fetch
    try {
      const response = await api.get("/schedule"); // Tipe data dari API sudah ditangani di service `api`
      const data = response.data;

      const formattedCourses: Course[] = data.map((item: any) => {
        const start = dayjs(item.schedule_start_time);
        const end = dayjs(item.schedule_end_time);
        return {
          id: item.id.toString(),
          name: item.course_name,
          lecturer: item.lecturer_name ?? "Belum ada dosen",
          time: `${start.format("HH:mm")} - ${end.format("HH:mm")}`,
          room: item.room_code ?? item.room_name ?? "-",
          semester: String(item.semester),
          day: start.format("dddd"),
        };
      });

      setCourses(formattedCourses);
    } catch (error) {
      console.error("Gagal memuat data jadwal:", error);
      setError("Gagal memuat data. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // --- FUNGSI UNTUK MERENDER KONTEN UTAMA SECARA KONDISIONAL ---
  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FaSpinner className="animate-spin text-3xl mb-4" />
          <p>Memuat jadwal...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <FaExclamationTriangle className="text-3xl mb-4" />
          <p>{error}</p>
        </div>
      );
    }
    
    // Empty State Utama: Jika tidak ada data sama sekali dari server
    if (courses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FaInfoCircle className="text-3xl mb-4" />
          <p>Belum ada data jadwal saat ini</p>
        </div>
      );
    }

    // Tampilan jika data ada
    return (
      <>
        {activeTab === "courses" ? (
          <>
            <h3 className="text-2xl font-semibold mb-4 text-center sm:text-left">Pilih Mata Kuliah</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b border-gray-300 pb-3">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-2 font-medium whitespace-nowrap">Pilih</th>
                    <th className="p-2 font-medium whitespace-nowrap">Mata Kuliah</th>
                    <th className="p-2 font-medium whitespace-nowrap">Dosen</th>
                    <th className="p-2 font-medium whitespace-nowrap">Waktu</th>
                    <th className="p-2 font-medium whitespace-nowrap">Ruangan</th>
                    <th className="p-2 font-medium whitespace-nowrap">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="border-b text-sm border-gray-200 hover:bg-gray-50">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(course.id)}
                            onChange={() => handleCourseToggle(course.id)}
                            className="w-5 h-5 accent-black"
                          />
                        </td>
                        <td className="p-2 font-medium">{course.name}</td>
                        <td className="p-2 text-gray-600">{course.lecturer}</td>
                        <td className="p-2 text-gray-600">{`${course.day}, ${course.time}`}</td>
                        <td className="p-2 text-gray-600">{course.room}</td>
                        <td className="p-2 text-gray-600">{course.semester}</td>
                      </tr>
                    ))
                  ) : (
                    // Filtered Empty State: Jika filter tidak menemukan data
                    <tr>
                      <td colSpan={6} className="text-center p-8">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FaInfoCircle className="text-3xl mb-3" />
                          <p>
                            Tidak ada data mata kuliah untuk{" "}
                            <span className="font-semibold">
                              {semesters.find((s) => s.value === semester)?.label || 'semester ini'}
                            </span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div id="printable-content">
              <h3 className="text-2xl font-semibold text-center sm:text-left">Jadwal Mata Kuliah</h3>
              <p className="text-gray-500 text-center sm:text-left">Jadwal mata kuliah yang Anda pilih.</p>
              
              {selectedCourseDetails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <FaInfoCircle className="text-3xl mb-4" />
                    <p>Pilih mata kuliah terlebih dahulu untuk melihat jadwal.</p>
                </div>
              ) : (
                <div className="space-y-6 mt-4">
                  {days.map((day) => {
                    const dayCourses = selectedCourseDetails.filter((course) => course.day === day);
                    if (dayCourses.length === 0) return null;
                    return (
                      <div key={day}>
                        <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-1 mb-2">{day}</h4>
                        {dayCourses.map((course) => (
                          <div key={course.id} className="p-4 bg-white border border-gray-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 hover:shadow-md transition-shadow">
                            <div className="flex-1">
                              <p className="font-semibold text-black flex items-center gap-2"><FaBook /> {course.name}</p>
                              <p className="text-gray-600 flex items-center gap-2 text-sm mt-1"><FaUser /> {course.lecturer}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-start text-sm">
                              <p className="text-gray-700 flex items-center gap-2"><FaClock /> {course.time}</p>
                              <p className="text-gray-700 flex items-center gap-2 mt-1"><FaMapMarkerAlt /> {course.room}</p>
                            </div>
                            <div className="text-right sm:text-left text-sm">
                              <p className="text-gray-700 flex items-center justify-end sm:justify-start gap-2"><FaCalendarAlt className="text-gray-500" /> Semester {course.semester}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  };
    
  return (
    <div className="text-black space-y-6 p-4 md:p-6">
      <p className="text-gray-600 sm:text-left">
        Pilih mata kuliah yang Anda kontrak untuk melihat jadwal.
      </p>
 
      {/* Filter dan Badge + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* ... (kode dropdown dan badge sama) ... */}
         <div className="relative w-full sm:w-48">
           <button
             onClick={() => setDropdownOpen(!dropdownOpen)}
             className="w-full flex justify-between text-sm items-center border border-gray-300 px-4 py-2 rounded-md bg-white hover:bg-gray-50"
           >
             {semesters.find((s) => s.value === semester)?.label}
             <FiChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
           </button>
  
           {dropdownOpen && (
             <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
         <div className="flex items-center gap-4">
           <span className="px-3 py-1 text-xs border border-gray-400 font-semibold text-gray-700 rounded-full bg-gray-100">
             {selectedCourses.length} Mata Kuliah Dipilih
           </span>
           <button
             className="px-3 py-2 border text-sm border-gray-400 text-gray-700 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
             onClick={() => setSelectedCourses([])}
             disabled={selectedCourses.length === 0}
           >
             Reset
           </button>
         </div>
      </div>

      {/* Tabs dan Tombol Cetak */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
           <button
             className={`px-4 py-2 text-sm rounded-md transition-colors ${
               activeTab === "courses" ? "bg-white font-semibold shadow-sm" : "text-gray-500 hover:bg-gray-200"
             }`}
             onClick={() => setActiveTab("courses")}
           >
             Pilihan Mata Kuliah
           </button>
           <button
             className={`px-4 py-2 text-sm rounded-md transition-colors ${
               activeTab === "schedule" ? "bg-white font-semibold shadow-sm" : "text-gray-500 hover:bg-gray-200"
             } disabled:cursor-not-allowed disabled:text-gray-400`}
             onClick={() => selectedCourses.length > 0 && setActiveTab("schedule")}
             disabled={selectedCourses.length === 0}
           >
             Jadwal
           </button>
        </div>
        
        {activeTab === "schedule" && selectedCourses.length > 0 && (
          <PrintButton contentId="printable-content" />
        )}
      </div>
 
      {/* Card Container */}
      <div className="border border-gray-200 rounded-lg p-4 md:p-6 bg-white min-h-[20rem] transition-all">
        {renderMainContent()}
      </div>
    </div>
  );
}