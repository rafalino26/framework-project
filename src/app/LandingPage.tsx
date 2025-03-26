import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import RoomCard from "./components/RoomCard";
import AboutUs from "./components/AboutUsComps";


export default function Home() {
  const classrooms = [
    { roomCode: "R-101", courseName: "Algoritma dan Pemrograman", lecturer: "Dr. Budi Santoso", status: "Aktif" },
    { roomCode: "R-102", courseName: "Basis Data", lecturer: "Prof. Siti Rahayu", status: "Kosong" },
    { roomCode: "R-103", courseName: "Jaringan Komputer", lecturer: "Dr. Ahmad Wijaya", status: "Aktif" },
    { roomCode: "R-104", courseName: "Kecerdasan Buatan", lecturer: "Dr. Maya Putri", status: "Akan Datang" },
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="bg-[#f6f6f6] w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col ml-12 justify-center space-y-4">
              <h1 className="text-3xl text-black font-bold tracking-tighter sm:text-5xl xl:text-6xl">
              SARA
              </h1>
              <p className="max-w-[600px] text-gray-600 text-muted-foreground md:text-xl">
              Smart Allocation & Room Access. <br />
              <span className="max-w-[600px] text-gray-600 text-muted-foreground md:text-xl">
                Kelola ruangan kelas dengan efisien, hindari konflik jadwal, dan dapatkan informasi ketersediaan ruangan secara real-time.
              </span>
              </p>
              
              <div className="flex gap-4">
              <Link
                href="/login"
                className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
              >
                Mulai Sekarang 
              </Link>
              
              <Link
                href="/about"
                className="inline-block border border-gray-300 text-black px-6 py-3 font-semibold rounded-md hover:bg-gray-100 transition"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>

            </div>
            <div className="mx-auto w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-lg">
              <Image src="/placeholder.svg?height=500&width=800" width={800} height={500} alt="Dashboard preview" />
            </div>
          </div>
        </div>
      </section>

      {/* Classroom Preview Section */}
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl text-black font-bold tracking-tighter md:text-4xl">Preview Ruangan Kelas</h2>
            <p className="max-w-[700px] text-gray-600 text-muted-foreground md:text-lg">
              Lihat status dan informasi ruangan kelas secara real-time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {classrooms.map((classroom) => (
    <RoomCard
      key={classroom.roomCode}
      roomNumber={classroom.roomCode}
      subject={classroom.courseName}
      lecturer={classroom.lecturer}
      status={classroom.status}
    />
  ))}
</div>


          <div className="mt-10 flex justify-center">
          <Link
          href="/rooms"
          className="mt-6 inline-block border border-gray-300 text-black px-6 py-3 rounded-md hover:bg-gray-100 transition"
        >
          Lihat Semua Ruangan
        </Link>

          </div>
        </div>
      </section>

      {/* Floor Plan Section */}
      <section className="bg-[#f6f6f6] w-full py-12 md:py-16 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl text-black font-bold tracking-tighter md:text-4xl">Denah Ruangan</h2>
            <p className="max-w-[700px] text-gray-600 text-muted-foreground md:text-lg">
              Lihat lokasi dan tata letak ruangan kelas di kampus
            </p>
          </div>

          <div className="flex justify-center gap-6">
  <div className="max-w-80 bg-white rounded-xl overflow-hidden shadow-lg">
    <div className="aspect-[16/9] relative">
      <Image 
        src="/denah1.png" 
        width={1000} 
        height={600} 
        alt="Denah ruangan kelas" 
      />
    </div>
  </div>

  <div className="max-w-80 bg-white rounded-xl overflow-hidden shadow-lg">
    <div className="aspect-[16/9] relative">
      <Image 
        src="/denah2.png" 
        width={1000} 
        height={600} 
        alt="Denah ruangan kelas" 
      />
    </div>
  </div>
</div>

        </div>
      </section>
       {/* About Us Section */}
       <AboutUs />
    </div>
  );
}
