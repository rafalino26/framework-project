import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { User } from "../types/user"; 

interface ChangeRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSubmit: (userId: string, newRole: string) => void;
}
const roleApiToDisplay: { [key: string]: string } = {
    superadmin: "Super Admin",
    admin: "Admin",
    regular: "User",
};

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({ isOpen, onClose, user, onSubmit }) => {
    const [selectedRole, setSelectedRole] = useState("User");

    useEffect(() => {
        if (user?.role) {
            setSelectedRole(roleApiToDisplay[user.role] || "User");
        }
    }, [user]);
    if (!isOpen || !user) return null;
    const handleSubmit = () => {
        onSubmit(user.id, selectedRole);
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold mb-2">Ubah Role Pengguna</h2>
                <p className="text-sm text-gray-500 mb-6">Ubah role untuk pengguna <strong>{user.fullName}</strong>.</p>

                <div className="mb-6">
                    <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">Role</label>
                    <select
                        id="role"
                        value={selectedRole} 
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                     <button
                        type="button"
                        onClick={onClose}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeRoleModal;