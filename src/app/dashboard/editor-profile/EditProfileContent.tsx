"use client";

import { useEffect, useState } from "react";
import api from "@/app/services/api";

export default function ViewProfileContent() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        const data = res.data;

        setFullname(data.fullname || "");
        setEmail(data.email || "");
        setUsername(data.username || "");
        setAvatar("/default-avatar.png"); // Nanti bisa disesuaikan kalau ada avatar dari API
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-md mx-auto mt-10">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl text-gray-500 font-semibold">{fullname}</h2>
        <p className="text-sm text-gray-500">@{username}</p>
      </div>

      {/* Info Section */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-sm text-gray-500">Full Name</h3>
          <p className="text-base text-black">{fullname}</p>
        </div>

        <div>
          <h3 className="text-sm text-gray-500">Username</h3>
          <p className="text-base text-black">{username}</p>
        </div>

        <div>
          <h3 className="text-sm text-gray-500">Email</h3>
          <p className="text-base text-black">{email}</p>
        </div>
      </div>
    </div>
  );
}
