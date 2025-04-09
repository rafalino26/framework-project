import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { User } from "../types/user";

interface ChangeRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSubmit: (userId: string, newRole: string) => void;
  }

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({ isOpen, onClose, user, onSubmit }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "user");

  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    onSubmit(user.id, selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md md:max-w-xl rounded-lg shadow-lg p-6 relative">
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-xl font-semibold mb-2">Ubah Role Pengguna</h2>
        <p className="text-sm text-gray-500 mb-6">Ubah role untuk pengguna <strong>{user.name}</strong>.</p>

        {/* Dropdown Role */}
        <div className="mb-6">
          <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>

        <div className="flex justify-end">
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
