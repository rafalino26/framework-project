import DashboardLayout from "../component/DashboardLayout";
import EditProfileContent from "./EditProfileContent";

export default function EditProfilePage() {
  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <EditProfileContent />
      </div>
    </DashboardLayout>
  );
}
