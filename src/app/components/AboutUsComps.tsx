import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Footer from "./Footer";

export default function AboutUs() {
  // Data Tim Pengembang
  const developers = [
    {
      name: "Made Narayindra",
      role: "Frontend Developer",
      avatar: "/mas.jpg",
    },
    {
      name: "Rafael Lalujan",
      role: "Frontend Developer",
      avatar: "/rafa.jpg",
    },
    {
      name: "Galnoel Rindengan",
      role: "Backend Developer",
      avatar: "/kevin.jpg",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-background" id="about">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl text-black font-bold md:text-4xl">Tentang Kami</h2>
          <br />
          <p className="max-w-[700px] text-gray-600 md:text-lg">
            Sistem ini dikembangkan oleh Tim Pengembangan IT untuk meningkatkan efisiensi penggunaan ruangan di Universitas Sam Ratulangi.
          </p>
        </div>

        {/* Tujuan Sistem */}
        <div className="grid grid-cols-1 md:grid-cols-2 ml-8 gap-10 items-center mb-16">
          <div className="text-black space-y-4">
            <h3 className="text-2xl font-bold">Tujuan Sistem</h3>
            <ul className="space-y-3">
  {[
    "Meminimalisir konflik jadwal ruangan.",
    "Memberikan transparansi ketersediaan fasilitas kampus.",
    "Meningkatkan efisiensi penggunaan ruangan kelas.",
    "Memudahkan mahasiswa dan dosen dalam mencari informasi ruangan.",
  ].map((item, index) => (
    <li key={index} className="flex items-center gap-2">
      <CheckCircle size={20} className="text-primary flex-shrink-0 h-auto w-auto" />
      <span className="text-sm md:text-base">{item}</span>
    </li>
  ))}
</ul>

          </div>

          {/* Gambar (Logo Universitas) */}
          <div className="flex justify-center">
            <div className="w-48 h-48 relative">
              <Image
                src="/unsrat.jpg"
                width={200}
                height={200}
                alt="Logo Universitas"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Tim Pengembang */}
        <div className="space-y-6 mb-20">
          <h3 className="text-2xl text-black font-bold text-center">Tim Pengembang</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {developers.map((developer, index) => (
              <div key={index} className="border rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={developer.avatar}
                    width={100}
                    height={100}
                    alt={developer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-black font-semibold text-lg">{developer.name}</h4>
                  <p className="text-sm text-gray-600">{developer.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
            {/* Footer */}
            <Footer /> 
      </div>
    </section>
  );
}
