"use client";

import { useState } from "react";
import { FaBuilding, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaClock, FaStar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList} from "recharts";

export default function DashboardContent() {
  // State untuk tab aktif
  const [activeTab, setActiveTab] = useState("Ikhtisar");

  // Data untuk bar chart
  const roomUsageData = [
    { name: "JTE-01", usage: 85 },
    { name: "JTE-02", usage: 65 },
    { name: "JTE-03", usage: 45 },
    { name: "JTE-04", usage: 30 },
    { name: "JTE-05", usage: 25 },
  ];

  // Data untuk pie chart
  const sentimentData = [
    { name: "Positif", value: 65, color: "#22c55e" },
    { name: "Negatif", value: 35, color: "#ef4444" },
  ];

    // Data untuk tab Analitik
  const roomEmptyTime = [
    { time: "08:00", count: 12 },
    { time: "10:00", count: 8 },
    { time: "12:00", count: 15 },
    { time: "14:00", count: 5 },
    { time: "16:00", count: 10 },
  ];

  const roomUsagePieData = [
    { name: "Laboratorium 1", value: 40, color: "#6366F1" },
    { name: "Laboratorium 2", value: 25, color: "#EF4444" },
    { name: "Ruang Kuliah", value: 20, color: "#FACC15" },
    { name: "Ruang Seminar", value: 15, color: "#10B981" },
  ];

  const satisfactionData = [
    { name: "5 Bintang", value: 35, color: "#6366F1" },
    { name: "4 Bintang", value: 30, color: "#EF4444" },
    { name: "3 Bintang", value: 20, color: "#10B981" },
    { name: "2 Bintang", value: 10, color: "#FACC15" },
    { name: "1 Bintang", value: 5, color: "#A855F7" },
  ];

  // Data untuk komentar
  const comments = [
    {
      id: 1,
      name: "Budi Santoso",
      room: "JTE-01",
      time: "2 jam lalu",
      text: "Ruangan sangat nyaman dan bersih. AC berfungsi dengan baik.",
      likes: 12,
      dislikes: 2,
      rating: 5,
    },
    {
      id: 2,
      name: "Siti Rahayu",
      room: "JTE-02",
      time: "5 jam lalu",
      text: "Proyektor tidak berfungsi dengan baik, perlu perbaikan.",
      likes: 8,
      dislikes: 1,
      rating: 3,
    },
    {
      id: 3,
      name: "Ahmad Wijaya",
      room: "JTE-03",
      time: "1 hari lalu",
      text: "Kursi kurang nyaman untuk perkuliahan jangka panjang.",
      likes: 5,
      dislikes: 3,
      rating: 3,
    },
  ];
  
 // Komponen Rating Bintang
  function RatingStars({ rating }: { rating: number }) {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"} />
        ))}
      </div>
    );
  }

  // Definisi tipe untuk props Card
  interface CardProps {
    title: string;
    value: string;
    subtext: string;
    icon: React.ReactNode;
  }
  
  // Komponen Card
  function Card({ title, value, subtext, icon }: CardProps) {
    return (
      <div className="bg-white text-black p-6 rounded-lg border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-500">{subtext}</p>
        </div>
        <div className="text-medium text-gray-400">{icon}</div>
      </div>
    );
  }

  return (
    <div className="text-black space-y-6">
      <p className="text-gray-600">Lihat statistik dan informasi terkini tentang penggunaan ruangan kelas.</p>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-md w-fit mx-auto sm:mx-0">
        {["Ikhtisar", "Analitik", "Komentar"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === tab ? "bg-white text-black" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Konten Berdasarkan Tab */}
      {activeTab === "Ikhtisar" && (
        <>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Ruangan" value="25" subtext="+2 ruangan baru bulan ini" icon={<FaBuilding />} />
        <Card title="Ruangan Aktif" value="18" subtext="72% dari total ruangan" icon={<FaCalendarAlt />} />
        <Card title="Komentar Positif" value="65%" subtext="+5% dari bulan lalu" icon={<FaThumbsUp />} />
        <Card title="Waktu Kosong" value="28%" subtext="-3% dari bulan lalu" icon={<FaClock />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold">Ruangan Paling Sering Digunakan</h2>
          <p className="text-gray-500 text-sm">Persentase penggunaan ruangan dalam seminggu terakhir</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomUsageData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#6366F1">
      <LabelList dataKey="usage" position="top" fill="#000" fontSize={12} />
    </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold">Sentimen Komentar</h2>
        <p className="text-gray-500 text-sm">Distribusi komentar positif dan negatif</p>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            {/* Pie Chart dengan label */}
            <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={0}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
                {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            
            {/* Tooltip saat hover */}
            <Tooltip formatter={(value, name) => [`${value}%`, name]} />

            {/* Legend di bawah chart */}
            <Legend verticalAlign="bottom" align="center" />
            </PieChart>
        </ResponsiveContainer>
        </div>

      </div>
      </>
      )}
      {activeTab === "Analitik" && (
        <>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold">Waktu Ruangan Paling Sering Kosong</h2>
            <p className="text-gray-500 text-sm">Jumlah ruangan kosong berdasarkan waktu dalam seminggu terakhir</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roomEmptyTime}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22C55E">
                  <LabelList dataKey="count" position="top" fill="#000" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold">Distribusi Penggunaan Ruangan</h2>
              <p className="text-gray-500 text-sm">Berdasarkan ruangan yang paling sering digunakan</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={roomUsagePieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                    {roomUsagePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold">Tingkat Kepuasan Pengguna</h2>
              <p className="text-gray-500 text-sm">Berdasarkan rating ruangan</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={satisfactionData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
      {activeTab === "Komentar" && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold">Komentar Terbaru</h2>
          <p className="text-gray-600">Komentar dan ulasan pengguna tentang ruangan kelas</p>

          {/* List Komentar */}
          <div className="mt-4 space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex justify-between items-start pb-4">
                {/* Kiri: Isi Komentar */}
                <div>
                  <h3 className="font-semibold">{comment.name}</h3>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="border border-gray-200 px-2 py-1 rounded-md text-xs">{comment.room}</span>
                    <span>{comment.time}</span>
                  </div>
                  <p className="mt-2">{comment.text}</p>
                  {/* Tombol Like & Dislike */}
                  <div className="flex items-center gap-4 mt-2 text-gray-500">
                    <div className="flex text-sm items-center gap-1">
                      <FaThumbsUp className="cursor-pointer" />
                      <span>{comment.likes}</span>
                    </div>
                    <div className="flex text-sm items-center gap-1">
                      <FaThumbsDown className="cursor-pointer" />
                      <span>{comment.dislikes}</span>
                    </div>
                  </div>
                </div>

                {/* Kanan: Bintang Rating */}
                <RatingStars rating={comment.rating} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

