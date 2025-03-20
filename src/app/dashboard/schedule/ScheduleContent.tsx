"use client";

import { useState } from "react";
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";

export default function ScheduleContent() {
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    { name: "Mathematics", lecturer: "Dr. Smith", time: "08:00 - 10:00", class: "JTE-04", semester: 1 },
    { name: "Physics", lecturer: "Prof. Johnson", time: "10:00 - 12:00", class: "JTE-05", semester: 3 },
    { name: "Programming", lecturer: "Ms. Doe", time: "13:00 - 15:00", class: "JTE-06", semester: 5 },
    { name: "Chemistry", lecturer: "Mr. Brown", time: "15:00 - 17:00", class: "JTE-07", semester: 7 },
    { name: "Biology", lecturer: "Dr. Green", time: "08:00 - 10:00", class: "JTE-08", semester: 2 },
    { name: "Web Development", lecturer: "Ms. White", time: "10:00 - 12:00", class: "JTE-09", semester: 4 },
    { name: "Machine Learning", lecturer: "Mr. Black", time: "13:00 - 15:00", class: "JTE-10", semester: 6 },
    { name: "Networking", lecturer: "Dr. Yellow", time: "15:00 - 17:00", class: "JTE-11", semester: 8 },
    { name: "Mathematics II", lecturer: "Dr. Smith", time: "08:00 - 10:00", class: "JTE-12", semester: 1 },
    { name: "Physics II", lecturer: "Prof. Johnson", time: "10:00 - 12:00", class: "JTE-04", semester: 3 },
    { name: "Advanced Programming", lecturer: "Ms. Doe", time: "13:00 - 15:00", class: "JTE-05", semester: 5 },
    { name: "Organic Chemistry", lecturer: "Mr. Brown", time: "15:00 - 17:00", class: "JTE-06", semester: 7 },
    { name: "Genetics", lecturer: "Dr. Green", time: "08:00 - 10:00", class: "JTE-07", semester: 2 },
    { name: "Frontend Development", lecturer: "Ms. White", time: "10:00 - 12:00", class: "JTE-08", semester: 4 },
    { name: "Deep Learning", lecturer: "Mr. Black", time: "13:00 - 15:00", class: "JTE-09", semester: 6 },
    { name: "Cybersecurity", lecturer: "Dr. Yellow", time: "15:00 - 17:00", class: "JTE-10", semester: 8 }
    
  ];

  const availableSemesters = selectedSemester === "even" ? [2, 4, 6, 8] : [1, 3, 5, 7];

  const filteredCourses = courses.filter(
    (course) =>
      availableSemesters.includes(course.semester) &&
      (selectedFilter === "" || course.semester === parseInt(selectedFilter)) &&
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 min-h-screen text-black">
      {!selectedSemester ? (
        <div>
          <h2 className="text-2xl font-bold mb-8 -mt-10 text-center">Please select your semester</h2>

    {/* Pilihan Semester (Grid Responsive) */}
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
  {["odd", "even"].map((type, idx) => (
    <div
      key={idx}
      onClick={() => setSelectedSemester(type)}
      className="relative bg-white w-full max-w-[280px] h-56 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col justify-between p-4 sm:w-60"
    >
      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {type === "odd" ? "Odd Semester" : "Even Semester"}
        </h3>
      </div>
      <p className="text-gray-600 text-sm text-center mt-auto">
        {type === "odd" ? "1st, 3rd, 5th, and 7th semester courses" : "2nd, 4th, 6th, and 8th semester courses"}
      </p>
    </div>
  ))}
</div>


        </div>
      ) : (
        <div>
          {/* Header (Back, Search, Filter) */}
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 -mt-6 bg-white p-3 rounded-lg shadow-md gap-3">
            <button
              onClick={() => setSelectedSemester(null)}
              className="flex items-center gap-2 px-4 py-2"
            >
              <BsArrowLeftCircle size={28} className="text-gray-600 hover:text-gray-800 transition" />
              <span className="text-gray-700">Back</span>
            </button>

            <input
              type="text"
              placeholder="Search course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none shadow-sm"
            />

            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm w-full md:w-auto"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">All Semesters</option>
              {availableSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Tabel Mata Kuliah (Bisa Scroll di Mobile) */}
          <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            {filteredCourses.length > 0 ? (
              <table className="w-full min-w-[600px] border-collapse text-black">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Course</th>
                    <th className="p-2">Lecturer</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{course.name}</td>
                      <td className="p-2">{course.lecturer}</td>
                      <td className="p-2">{course.time}</td>
                      <td className="p-2">{course.class}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No courses found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}