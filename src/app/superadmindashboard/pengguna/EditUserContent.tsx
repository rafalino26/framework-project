"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical, Search, Filter, ChevronDown, UserCircle } from "lucide-react";
import UserDetailModal from "../component/UserDetailModal";
import ChangeRoleModal from "../component/ChangeRoleModal";
import { User } from "../types/user";
import api from "@/app/services/api";

// Mapping untuk tampilan dan data API
const roleDisplayMap: { [key: string]: string } = {
  "Semua Role": "Semua Role",
  "Super Admin": "superadmin",
  Admin: "admin",
  User: "regular",
};

const roleApiMap: { [key: string]: string } = {
  superadmin: "Super Admin",
  admin: "Admin",
  regular: "User",
};

const rolesForFilter = ["Semua Role", "Super Admin", "Admin", "User"];
const statuses = ["Semua Status", "Aktif", "Tidak Aktif"];

export default function UserManagementPage() {
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState<User[]>([]); // State untuk menampung data dari API
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const [selectedRole, setSelectedRole] = useState("Semua Role");
  const [selectedStatus, setSelectedStatus] = useState("Semua Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  
  // --- DATA FETCHING ---
  // 3. useEffect untuk mengambil data pengguna saat komponen dimuat
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<User[]>("/user");
        setUsers(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        // Anda bisa menambahkan state untuk menampilkan pesan error di UI
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // --- HANDLERS ---
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
    setOpenDropdownIndex(null); // Tutup dropdown aksi
  };
  const handleOpenChangeRole = (user: User) => {
    setSelectedUser(user);
    setIsChangeRoleOpen(true);
    setOpenDropdownIndex(null); // Tutup dropdown aksi
  };

  // 4. Implementasi fungsi untuk mengubah role (memanggil API PATCH)
  const handleChangeRole = async (userId: string, newDisplayRole: string) => {
    const newApiRole = roleDisplayMap[newDisplayRole] as User["role"];
    if (!newApiRole) {
      console.error("Role tidak valid:", newDisplayRole);
      return;
    }
    
    try {
      await api.patch(`/user/${userId}/role`, { role: newApiRole });
      
      // Update state lokal agar UI langsung berubah
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userId ? { ...user, role: newApiRole } : user
        )
      );
      
      console.log(`Role untuk user ID: ${userId} berhasil diubah menjadi ${newApiRole}`);
      setIsChangeRoleOpen(false); // Tutup modal setelah berhasil
      
    } catch (error) {
      console.error("Gagal mengubah role pengguna:", error);
      alert("Gagal mengubah role. Silakan coba lagi.");
    }
  };

  // --- FILTERING & DISPLAY LOGIC ---
  // 5. Sesuaikan logika filter dengan data dari API
  const filteredUsers = users.filter((user) => {
    const userStatus = user.lastSignInAt ? "Aktif" : "Tidak Aktif";
    const apiRole = roleDisplayMap[selectedRole];

    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.nim_nidn && user.nim_nidn.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesRole = selectedRole === "Semua Role" || user.role === apiRole;
    const matchesStatus = selectedStatus === "Semua Status" || userStatus === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Helper untuk format tanggal
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Belum pernah login";
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Refs dan useEffect untuk menutup dropdown (tidak berubah)
  const roleRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (roleRef.current && !roleRef.current.contains(target)) setIsRoleDropdownOpen(false);
      if (statusRef.current && !statusRef.current.contains(target)) setIsStatusDropdownOpen(false);
      // Modifikasi kecil: pastikan ref ada sebelum cek contains
      if (openDropdownIndex !== null && actionRef.current && !actionRef.current.contains(target)) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownIndex]);

  return (
    <div className="text-black">
      <p className="text-gray-500 mb-4">Kelola pengguna dan atur peran akses mereka.</p>

{/* Search & Filter */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
  {/* Search Input */}
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

  {/* Filter and Button Group */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
    {/* Role Filter Dropdown */}
    <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0" ref={roleRef}>
      <button
        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-black bg-white w-full sm:w-auto justify-between hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          <span>{selectedRole}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transform transition-transform ${isRoleDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isRoleDropdownOpen && (
        <div className="absolute right-0 mt-1 w-full min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {rolesForFilter.map((role) => (
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
    <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0" ref={statusRef}>
      <button
        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-black bg-white w-full sm:w-auto justify-between hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>{selectedStatus}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transform transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
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
    <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full sm:w-auto">
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
            {isLoading ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-500">Memuat data pengguna...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-500">Tidak ada pengguna yang cocok.</td></tr>
            ) : (
              // 6. Sesuaikan tampilan data di tabel
              filteredUsers.map((user, idx) => {
                const userStatus = user.lastSignInAt ? "Aktif" : "Tidak Aktif";
                const displayRole = roleApiMap[user.role] || user.role;
                
                return (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4 text-black text-sm font-medium">{user.fullName}</td>
                    <td className="py-4 px-4 text-black text-sm">{user.username}</td>
                    <td className="py-4 px-4 text-black text-sm">{user.email}</td>
                    <td className="py-4 px-4 text-black text-sm">{user.nim_nidn || "-"}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "superadmin" ? "bg-red-500 text-white" :
                        user.role === "admin" ? "bg-black text-white" : "bg-gray-200 text-gray-700"
                      }`}>
                        {displayRole}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userStatus === "Aktif" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-500"
                      }`}>
                        {userStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-black text-sm">{formatDate(user.lastSignInAt)}</td>
                    <td className="py-4 px-4 relative">
                      <button onClick={() => setOpenDropdownIndex(openDropdownIndex === idx ? null : idx)} className="p-1 rounded-md hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      {openDropdownIndex === idx && (
                        <div ref={actionRef} className="absolute right-4 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button onClick={() => handleOpenDetail(user)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Detail</button>
                          <button onClick={() => handleOpenChangeRole(user)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ubah Role</button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Nonaktifkan</button>
                        </div>
                      )}  
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <UserDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} user={selectedUser} />
      <ChangeRoleModal isOpen={isChangeRoleOpen} onClose={() => setIsChangeRoleOpen(false)} user={selectedUser} onSubmit={handleChangeRole} />
    </div>
  );
}
