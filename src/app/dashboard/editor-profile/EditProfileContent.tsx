"use client";

import { useState } from "react";

export default function EditProfileContent() {
  const [name, setName] = useState("Kevin Rindengan");
  const [email, setEmail] = useState("kevin@example.com");
  const [bio, setBio] = useState("SARA is the best.");
  const [avatar, setAvatar] = useState("/profilepict1.png");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Profile Updated: ${name}, ${email}, ${bio}`);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-4">
        <img
          src={avatar}
          alt="Avatar"
          className="w-20 h-20 rounded-full border border-gray-300 object-cover"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Change Avatar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md text-black"
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md text-black"
          />
        </div>

        {/* Bio Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 p-3 w-full border rounded-md h-24 text-black"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
