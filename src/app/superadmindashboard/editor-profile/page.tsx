import DashboardLayout from "../component/DashboardLayout";
import EditProfileContent from "./EditProfileContent";

export default function EditProfilePage() {
  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h1>
        <EditProfileContent />
      </div>
    </DashboardLayout>
  );
}
