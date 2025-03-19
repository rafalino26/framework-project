import EditProfileContent from "./EditProfileContent";
import Sidebar from "@/app/dashboard/component/Sidebar";

export default function EditProfilePage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h1>

        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <EditProfileContent />
        </div>
      </div>
    </div>
  );
}
