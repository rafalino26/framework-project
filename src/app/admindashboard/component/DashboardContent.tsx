"use client";

import { useState, useEffect } from "react";
import api from "@/app/services/api";
import { FaBuilding, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaClock, FaStar } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList} from "recharts";

interface TopUsedRoom {
  roomCode: string;
  roomName: string | null;
  totalDurationSeconds: number;
}
interface OverviewData {
  totalRooms: number; newRoomsThisMonth: number; activeRooms: number; emptyRooms: number;
  positiveCommentCount: number;
  commentDistribution: { positiveComments: number; negativeComments: number; totalComments: number; };
  topUsedRooms: TopUsedRoom[];
}

interface HourlyAvailability { hour: number; averageEmptyRooms: number; }
interface RatingSatisfaction { rating: number; count: number; }
interface AnalyticsData {
  hourlyRoomAvailability: HourlyAvailability[];
  roomRatingSatisfaction: RatingSatisfaction[];
}

interface CommentData {
  commentId: string;
  roomCode: string;
  commentText: string;
  rating: number;
  likeCount: number;
  dislikeCount: number;
  commentedAt: string;
  commentedAtRelative: string;
  userFullName: string;
  username: string;
}


export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("Ikhtisar");

  const [overviewData, setOverviewData] = useState<OverviewData>({
    totalRooms: 0, newRoomsThisMonth: 0, activeRooms: 0, emptyRooms: 0,
    positiveCommentCount: 0,
    commentDistribution: { positiveComments: 0, negativeComments: 0, totalComments: 1 },
    topUsedRooms: [],
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    hourlyRoomAvailability: [],
    roomRatingSatisfaction: [],
  });

  const [commentsData, setCommentsData] = useState<CommentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "Ikhtisar") {
          const response = await api.get("/dashboard");
          setOverviewData(response.data);
        } else if (activeTab === "Analitik") {
          const response = await api.get("/dashboard/analytics");
          setAnalyticsData(response.data);
        } else if (activeTab === "Komentar") {
          const response = await api.get("/dashboard/comments");
          setCommentsData(response.data);
        }
      } catch (error) {
        console.error(`Failed to fetch data for tab ${activeTab}:`, error);
      } finally {
      }
    };

    fetchData();
  }, [activeTab]);

  const roomUsageData = overviewData.topUsedRooms.map(room => ({
    name: room.roomName || room.roomCode,
    usage: parseFloat((room.totalDurationSeconds / 3600).toFixed(2)),
  }));
  const sentimentData = [
    { name: "Positif", value: overviewData.commentDistribution.positiveComments, color: "#22c55e" },
    { name: "Negatif", value: overviewData.commentDistribution.negativeComments, color: "#ef4444" },
  ];
  const positiveCommentPercentage = overviewData.commentDistribution.totalComments > 0
    ? ((overviewData.commentDistribution.positiveComments / overviewData.commentDistribution.totalComments) * 100).toFixed(0) : 0;
  const activeRoomsPercentage = overviewData.totalRooms > 0
    ? ((overviewData.activeRooms / overviewData.totalRooms) * 100).toFixed(0) : 0;
    
  const roomEmptyTime = analyticsData.hourlyRoomAvailability
    .filter(data => data.hour >= 7 && data.hour <= 22)
    .map(data => ({
      time: `${String(data.hour).padStart(2, '0')}:00`,
      count: data.averageEmptyRooms,
    }));
  
  const getRatingColor = (rating: number) => {
    const colors: { [key: number]: string } = {
        5: "#6366F1", 4: "#10B981", 3: "#FACC15", 2: "#EF4444", 1: "#A855F7",
    };
    return colors[rating] || "#d1d5db";
  };

  const satisfactionData = analyticsData.roomRatingSatisfaction.map(data => ({
      name: `${data.rating} Bintang`,
      value: data.count,
      color: getRatingColor(data.rating),
  }));
  
  const roomUsagePieData = [
    { name: "Laboratorium 1", value: 40, color: "#6366F1" }, { name: "Laboratorium 2", value: 25, color: "#EF4444" },
    { name: "Ruang Kuliah", value: 20, color: "#FACC15" }, { name: "Ruang Seminar", value: 15, color: "#10B981" },
  ];

  function RatingStars({ rating }: { rating: number }) {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"} />
        ))}
      </div>
    );
  }

  interface CardProps {
    title: string;
    value: string;
    subtext: string;
    icon: React.ReactNode;
  }
  
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Ruangan" value={overviewData.totalRooms.toString()} subtext={`+${overviewData.newRoomsThisMonth} ruangan baru bulan ini`} icon={<FaBuilding />} />
            <Card title="Ruangan Aktif" value={overviewData.activeRooms.toString()} subtext={`${activeRoomsPercentage}% dari total ruangan`} icon={<FaCalendarAlt />} />
            <Card title="Komentar Positif" value={`${positiveCommentPercentage}%`} subtext={`${overviewData.commentDistribution.positiveComments} dari ${overviewData.commentDistribution.totalComments} ulasan`} icon={<FaThumbsUp />} />
            <Card title="Ruangan Kosong" value={overviewData.emptyRooms.toString()} subtext="Ruangan yang sedang tidak digunakan" icon={<FaClock />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold">Ruangan Paling Sering Digunakan</h2>
              <p className="text-gray-500 text-sm">Total durasi penggunaan dalam jam</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roomUsageData}>
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Jam', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} jam`, "Durasi"]}/>
                  <Bar dataKey="usage" fill="#6366F1">
                    <LabelList dataKey="usage" position="top" fill="#000" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold">Sentimen Komentar</h2>
              <p className="text-gray-500 text-sm">Distribusi komentar positif dan negatif</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                      data={sentimentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
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
            <p className="text-gray-500 text-sm">Rata-rata jumlah ruangan kosong per jam</p>
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
                    {roomUsagePieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold">Tingkat Kepuasan Pengguna</h2>
              <p className="text-gray-500 text-sm">Berdasarkan rating yang diberikan</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={satisfactionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Jumlah"]} />
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

          <div className="mt-4 space-y-6">
            {commentsData.length > 0 ? (
              commentsData.map((comment) => (
                <div key={comment.commentId} className="flex justify-between items-start pb-4 border-b border-gray-200 last:border-b-0">
                  <div>
                    <h3 className="font-semibold">{comment.userFullName} <span className="text-gray-500 font-normal">(@{comment.username})</span></h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2 my-1">
                      <span className="border border-gray-200 px-2 py-1 rounded-md text-xs font-medium bg-gray-50">{comment.roomCode}</span>
                      <span>{comment.commentedAtRelative}</span>
                    </div>
                    <p className="mt-2 text-gray-800">{comment.commentText}</p>
                    <div className="flex items-center gap-4 mt-2 text-gray-500">
                      <div className="flex text-sm items-center gap-1">
                        <FaThumbsUp className="cursor-pointer hover:text-blue-500" />
                        <span>{comment.likeCount}</span>
                      </div>
                      <div className="flex text-sm items-center gap-1">
                        <FaThumbsDown className="cursor-pointer hover:text-red-500" />
                        <span>{comment.dislikeCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <RatingStars rating={comment.rating} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada komentar.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

