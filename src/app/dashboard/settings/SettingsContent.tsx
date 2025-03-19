"use client";

import { useState } from "react";

export default function SettingsContent() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* Notifications Toggle */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <span className="text-gray-700">Enable Notifications</span>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
          className="cursor-pointer w-6 h-6"
        />
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <span className="text-gray-700">Dark Mode</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="cursor-pointer w-6 h-6"
        />
      </div>
    </div>
  );
}
