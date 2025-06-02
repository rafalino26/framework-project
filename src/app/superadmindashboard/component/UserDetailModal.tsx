import React from "react";
import { X } from "lucide-react";
import { User } from "../types/user";

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) {
        return "Belum pernah login";
    }
    return new Date(dateString).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const displayRole = (role: User["role"]): string => {
    const roleMap: { [key in User["role"]]: string } = {
        admin: "Admin",
        superadmin: "Super Admin",
        regular: "User",
    };
    return roleMap[role];
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;
    const initials = user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const status = user.lastSignInAt ? "Aktif" : "Tidak Aktif";

    return (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-4 mb-6">
                     <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-600">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
                        <p className="text-sm text-gray-500">{user.username}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">NIM/NIDN</p>
                        <p className="font-medium text-gray-800">{user.nim_nidn || "-"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Role</p>
                        <span
                            className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                user.role === "admin" ? "bg-black text-white" :
                                user.role === "superadmin" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {displayRole(user.role)}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500">Status</p>
                        <span
                            className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                status === "Aktif" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {status}
                        </span>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-gray-500">Login Terakhir</p>
                        <p className="font-medium text-gray-800">{formatDate(user.lastSignInAt)}</p>
                    </div>
                </div>

                 <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-semibold"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;