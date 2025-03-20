"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import CommentPopup from "../component/CommentPopup";
import DetailsPopup from "../component/DetailsPopup";
import BookRoomPopup from "../component/BookRoomPopup";

type Room = {
  id: string;
  status: "Free" | "Used" | "Locked";
  course: string;
  lecturer: string;
  time: string;
};

const floors: Record<number, Room[]> = {
  2: [
    { id: "JTE 04", status: "Free", course: "", lecturer: "", time: "" },
    { id: "JTE 05", status: "Locked", course: "", lecturer: "", time: "" },
    {
      id: "JTE 06",
      status: "Used",
      course: "Mathematics",
      lecturer: "Dr. Albert",
      time: "08:00 - 10:00",
    },
    { id: "JTE 07", status: "Free", course: "", lecturer: "", time: "" },
    { id: "JTE 08", status: "Locked", course: "", lecturer: "", time: "" },
    {
      id: "JTE 13",
      status: "Used",
      course: "Physics",
      lecturer: "Prof. Newton",
      time: "13:00 - 15:00",
    },
  ],
  3: [
    {
      id: "JTE 09",
      status: "Used",
      course: "Chemistry",
      lecturer: "Dr. Marie",
      time: "10:00 - 12:00",
    },
    { id: "JTE 10", status: "Free", course: "", lecturer: "", time: "" },
    { id: "JTE 11", status: "Locked", course: "", lecturer: "", time: "" },
    { id: "JTE 12", status: "Free", course: "", lecturer: "", time: "" },
  ],
};

export default function RoomContent() {
  const [floor, setFloor] = useState<number>(2);
  const [dateTime, setDateTime] = useState<string>("");

  const [popup, setPopup] = useState<{
    show: boolean;
    type: "details" | "comment" | "book" | "";
    room: string;
    status?: string;
    course?: string;
    lecturer?: string;
    time?: string;
  }>({
    show: false,
    type: "",
    room: "",
  });

  const toggleFloor = useCallback(() => {
    setFloor((prev) => (prev === 2 ? 3 : 2));
  }, []);

  const floorData: Room[] = useMemo(() => floors[floor] || [], [floor]);

  const getStatusClass = (status: Room["status"]) => {
    switch (status) {
      case "Free":
        return "bg-[#E8FFEB] text-[#049C6B] font-poppins font-semibold";
      case "Used":
        return "bg-[#FFFCE5] text-[#F99F01] font-poppins font-semibold";
      case "Locked":
        return "bg-[#FFECEF] text-[#DF1525] font-poppins font-semibold";
      default:
        return "";
    }
  };

  const handlePopup = (type: "details" | "comment", room: Room) => {
    setPopup({
      show: true,
      type,
      room: room.id,
      ...(type === "details" && {
        status: room.status,
        course: room.course,
        lecturer: room.lecturer,
        time: room.time,
      }),
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setDateTime(now.toLocaleDateString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4 sm:p-10 font-poppins text-black">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-4">
          <p className="text-lg font-medium text-gray-700">{dateTime}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
            {`Floor ${floor} (${
              floor === 1
                ? "1st"
                : floor === 2
                ? "2nd"
                : floor === 3
                ? "3rd"
                : `${floor}th`
            } Floor)`}
          </h1>
          <button
            onClick={toggleFloor}
            className="p-2 bg-none cursor-pointer transition flex items-center gap-2"
          >
            <span>{floor === 2 ? "3rd Floor" : "2nd Floor"}</span>
            <FaChevronRight className="text-xl" />
          </button>
        </div>

        {/* 🔹 Grid Responsif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6">
          {floorData.map((room) => (
            <div
              key={room.id}
              className="p-4 bg-white rounded-lg shadow-md flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{room.id}</h2>
                <span
                  className={`px-2 py-1 text-sm rounded ${getStatusClass(
                    room.status
                  )}`}
                >
                  {room.status}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-1 w-fit rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
                  onClick={() => handlePopup("details", room)}
                >
                  <MdInfoOutline className="text-base" />
                  <span className="font-medium">Details</span>
                </button>

                <button
                  className="flex items-center gap-1 px-3 py-1 w-fit rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
                  onClick={() => handlePopup("comment", room)}
                >
                  <BiMessageDetail className="text-base" />
                  <span className="font-medium">Comment</span>
                </button>
              </div>

              {/* Tombol Book Room (Pastikan ini ada di sini!) */}
              <button
                className={`w-full px-4 py-2 rounded font-semibold transition text-center ${
                  room.status === "Free"
                    ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                }`}
                disabled={room.status !== "Free"}
                onClick={() =>
                  setPopup({ show: true, type: "book", room: room.id })
                }
              >
                Book Room
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Popup hanya satu yang muncul */}
      {popup.show && (
        <>
          {popup.type === "details" && (
            <DetailsPopup
              show={popup.show}
              room={popup.room}
              status={popup.status as "Free" | "Used" | "Locked"}
              course={popup.course ?? ""}
              lecturer={popup.lecturer ?? ""}
              time={popup.time ?? ""}
              onClose={() => setPopup({ show: false, type: "", room: "" })}
            />
          )}

          {popup.type === "comment" && (
            <CommentPopup
              room={popup.room}
              onClose={() => setPopup({ show: false, type: "", room: "" })}
            />
          )}

          {popup.type === "book" && (
            <BookRoomPopup
              room={popup.room}
              onClose={() => setPopup({ show: false, type: "", room: "" })}
            />
          )}
        </>
      )}
    </div>
  );
}
