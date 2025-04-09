import React from "react";
import { X } from "lucide-react";
import { User } from "../types/user";

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
  }

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">

      <div className="bg-white w-full max-w-md md:max-w-xl rounded-lg shadow-lg p-6 relative">
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Detail Pengguna</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium text-gray-700">
            {initials}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <p className="text-gray-500">Nama Lengkap</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500">NIM</p>
            <p className="font-medium">{user.nim}</p>
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                user.role === "Admin"
                  ? "bg-black text-white"
                  : user.role === "Super Admin"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {user.role}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                user.status === "Aktif"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {user.status}
            </span>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">Login Terakhir</p>
            <p className="font-medium">{user.lastLogin}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
