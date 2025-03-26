import Link from "next/link";
import { BookOpen, User } from "lucide-react";

interface RoomCardProps {
  roomNumber: string;
  subject: string;
  lecturer: string;
  status: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ roomNumber, subject, lecturer, status }) => {
  // Warna status berdasarkan kondisi
  const statusColor =
    status === "Aktif" ? "bg-black text-white" :
    status === "Kosong" ? "bg-gray-200 text-gray-700" :
    "bg-gray-500 text-white";

    return (
        <div className="border rounded-lg p-4">
          {/* Room Number & Status */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-black font-semibold">{roomNumber}</h2>
            <span className={`px-3 py-1 text-sm rounded-full ${statusColor}`}>
              {status}
            </span>
          </div>
    
          {/* Subject with Icon */}
          <div className="flex items-center gap-2 mt-2">
            <BookOpen className="h-5 w-5 text-gray-600" />
            <p className="text-black">{subject}</p>
          </div>
    
          {/* Lecturer with Icon */}
          <div className="flex items-center gap-2 mt-1">
            <User className="h-5 w-5 text-gray-600" />
            <p className="text-black">{lecturer}</p>
          </div>
        </div>
      );
};

export default RoomCard;
