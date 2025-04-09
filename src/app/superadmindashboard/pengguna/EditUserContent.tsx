"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { Search } from "lucide-react"; 
import { Filter, ChevronDown, UserCircle } from "lucide-react";
import UserDetailModal from "../component/UserDetailModal";
import ChangeRoleModal from "../component/ChangeRoleModal";
import { User } from "../types/user";

const roles = ["Semua Role", "Super Admin", "Admin", "User"];
const statuses = ["Semua Status", "Aktif", "Tidak Aktif"];

export default function UserManagementPage() {
  const [selectedRole, setSelectedRole] = useState("Semua Role");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);


// Handler
const handleRoleChange = (role: string) => {
  setSelectedRole(role);
  setIsRoleDropdownOpen(false);
};

const handleStatusChange = (status: string) => {
  setSelectedStatus(status);
  setIsStatusDropdownOpen(false);
};

const handleOpenDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleOpenChangeRole = (user: User) => {
    setSelectedUser(user);
    setIsChangeRoleOpen(true);
  };
  
  const handleChangeRole = (userId: string, newRole: string) => {
    console.log("User ID:", userId);
    console.log("Role baru:", newRole);
    // Di sini kamu bisa update data, panggil API, dll
  };
  

const users = [
    {
      id: "1",
      name: "Budi Santoso",
      username: "budisantoso",
      email: "budi.santoso@example.com",
      nim: "2020010001",
      role: "Admin",
      status: "Aktif",
      lastLogin: "2023-06-15 08:30:45",
    },
    {
        id: "2",
      name: "Siti Rahayu",
      username: "sitirahayu",
      email: "siti.rahayu@example.com",
      nim: "2020010002",
      role: "User",
      status: "Aktif",
      lastLogin: "2023-06-14 14:22:10",
    },
    {
        id: "3",
      name: "Rizki Ramadhan",
      username: "rizkiramadhan",
      email: "rizki.ramadhan@example.com",
      nim: "2020010003",
      role: "Admin",
      status: "Nonaktif",
      lastLogin: "2023-06-13 11:00:00",
    },
    {
        id: "4",
      name: "Anisa Putri",
      username: "anisaputri",
      email: "anisa.putri@example.com",
      nim: "2020010004",
      role: "User",
      status: "Nonaktif",
      lastLogin: "2023-06-12 09:45:30",
    },
    {
        id: "5",
      name: "Ahmad Fauzi",
      username: "ahmadfauzi",
      email: "ahmad.fauzi@example.com",
      nim: "2020010005",
      role: "Admin",
      status: "Aktif",
      lastLogin: "2023-06-11 17:20:10",
    },
    {
        id: "6",
      name: "Dewi Lestari",
      username: "dewilestari",
      email: "dewi.lestari@example.com",
      nim: "2020010006",
      role: "User",
      status: "Nonaktif",
      lastLogin: "2023-06-10 12:05:55",
    },
  ];

  // Refs buat dropdown
const roleRef = useRef<HTMLDivElement>(null);
const statusRef = useRef<HTMLDivElement>(null);
const actionRef = useRef<HTMLDivElement>(null);

// Close dropdown saat klik di luar
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;

    if (roleRef.current && !roleRef.current.contains(target)) {
      setIsRoleDropdownOpen(false);
    }
    if (statusRef.current && !statusRef.current.contains(target)) {
      setIsStatusDropdownOpen(false);
    }
    if (actionRef.current && !actionRef.current.contains(target)) {
      setOpenDropdownIndex(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  
  
  // Tambahkan ini sebelum return
const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nim.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesRole =
      selectedRole === "Semua Role" || user.role === selectedRole;
  
    const matchesStatus =
      selectedStatus === "Semua Status" || user.status === selectedStatus;
  
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  return (
    <div className="text-black">
      <p className="text-gray-500 mb-4">Kelola pengguna dan atur peran akses mereka.</p>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
      <div className="relative w-full md:w-96">
    <input
        type="text"
        placeholder="Cari nama, username, email, atau NIM..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
    </div>

        <div className="flex items-center gap-2">
          {/* Role Filter Dropdown */}
  <div className="relative flex-grow md:flex-grow-0" ref={roleRef}>
  <button
    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-black bg-white min-w-[160px] w-full md:w-auto justify-between hover:border-gray-300 transition-colors"
  >
    <div className="flex items-center gap-2">
      <UserCircle className="h-4 w-4" />
      <span>{selectedRole}</span>
    </div>
    <ChevronDown
      className={`h-4 w-4 transform transition-transform ${
        isRoleDropdownOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {isRoleDropdownOpen && (
    <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-10">
      {roles.map((role) => (
        <div
          key={role}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
          onClick={() => handleRoleChange(role)}
        >
          {role}
        </div>
      ))}
    </div>
  )}
</div>

{/* Status Filter Dropdown */}
<div className="relative flex-grow md:flex-grow-0" ref={statusRef}>
  <button
    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-black bg-white min-w-[160px] w-full md:w-auto justify-between hover:border-gray-300 transition-colors"
  >
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4" />
      <span>{selectedStatus}</span>
    </div>
    <ChevronDown
      className={`h-4 w-4 transform transition-transform ${
        isStatusDropdownOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {isStatusDropdownOpen && (
    <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-10">
      {statuses.map((status) => (
        <div
          key={status}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
          onClick={() => handleStatusChange(status)}
        >
          {status}
        </div>
      ))}
    </div>
  )}
</div>


          {/* Tombol Tambah */}
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            + Tambah
          </button>
        </div>
      </div>

      {/* Tabel */}
<div className="overflow-x-auto border border-gray-200 rounded-lg">
  {/* Header Judul & Deskripsi */}
  <div className="p-6">
    <h2 className="text-2xl font-semibold text-gray-900">Daftar Pengguna</h2>
    <p className="text-sm text-gray-500">Kelola pengguna dan atur peran akses mereka.</p>
  </div>
  <table className="w-full min-w-full border-collapse">
    <thead>
      <tr className="border-b text-sm border-gray-200">
        <th className="py-3 px-4 text-left font-medium text-gray-500">Nama</th>
        <th className="py-3 px-4 text-left font-medium text-gray-500">Username</th>
        <th className="py-3 px-4 text-left font-medium text-gray-500">Email</th>
        <th className="py-3 px-4 text-left font-medium text-gray-500">NIM/NIDN</th>
        <th className="py-3 px-4 text-left font-medium text-gray-500">Role</th>
        <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
        <th className="py-3 px-4 text-left font-medium text-gray-500">Login Terakhir</th>
        <th className="py-3 px-4 text-left font-medium text-gray-500">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.map((user, idx) => (
        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
          <td className="py-4 px-4 text-black text-sm font-medium">{user.name}</td>
          <td className="py-4 px-4 text-black text-sm">{user.username}</td>
          <td className="py-4 px-4 text-black text-sm">{user.email}</td>
          <td className="py-4 px-4 text-black text-sm">{user.nim}</td>
          <td className="py-4 px-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === "Admin"
                  ? "bg-black text-white"
                  : user.role === "Super Admin"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {user.role}
            </span>
          </td>
          <td className="py-4 px-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.status === "Aktif"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {user.status}
            </span>
          </td>
          <td className="py-4 px-4 text-black text-sm">{user.lastLogin}</td>
          <td className="py-4 px-4 relative">
  <button
    onClick={() => setOpenDropdownIndex(openDropdownIndex === idx ? null : idx)}
    className="p-1 rounded-md hover:bg-gray-100"
  >
    <MoreVertical className="w-5 h-5 text-gray-500" />
  </button>

  {/* Dropdown */}
  {openDropdownIndex === idx && (
    <div ref={actionRef} className="absolute right-4 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
        <button
        onClick={() => handleOpenDetail(user)}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
        Detail
        </button>
      <button 
      onClick={() => handleOpenChangeRole(user)}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        Ubah Role
      </button>
      <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
        Nonaktifkan
      </button>
    </div>
  )}
</td>

        </tr>
      ))}
    </tbody>
  </table>
  <UserDetailModal
  isOpen={isDetailOpen}
  onClose={() => setIsDetailOpen(false)}
  user={selectedUser}
/>
<ChangeRoleModal
  isOpen={isChangeRoleOpen}
  onClose={() => setIsChangeRoleOpen(false)}
  user={selectedUser}
  onSubmit={handleChangeRole} // ← ini harus kamu tambahkan
/>


</div>

    </div>
  );
}
