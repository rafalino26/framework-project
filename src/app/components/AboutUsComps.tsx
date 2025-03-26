import Image from "next/image";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

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
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl text-black font-bold md:text-4xl">Tentang Kami</h2>
          <br />
          <p className="max-w-[700px] text-gray-600 md:text-lg">s
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
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gambar (Logo Universitas) */}
          <div className="flex justify-center">
            <div className="w-48 h-48 relative">
              <Image
                src="/gal.png"
                width={200}
                height={200}
                alt="Logo Universitas"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Tim Pengembang */}
        <div className="space-y-6">
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
        
   {/* Footer Section */}
   <div className="mt-12 bg-white py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Sistem Manajemen Ruangan */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-2">Sistem Manajemen Ruangan</h3>
            <p className="text-gray-600">Solusi terpadu untuk manajemen ruangan kelas dan jadwal perkuliahan.</p>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-2">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-black">Beranda</Link></li>
              <li><Link href="/rooms" className="text-gray-600 hover:text-black">Ruangan</Link></li>
              <li><Link href="/schedule" className="text-gray-600 hover:text-black">Jadwal</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-black">Tentang Kami</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-black">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-2">Hubungi Kami</h3>
            <p className="text-gray-600">support@namasistem.ac.id</p>
            <p className="text-gray-600">+62 812-XXXX-XXXX</p>
            <p className="text-gray-600">Jl. Pendidikan No. 123, Kota Universitas, Indonesia</p>
          </div>
        </div>
        <br />
        {/* Copyright */}
        <p className="text-gray-500 text-sm text-center mt-6">© 2025 Sistem Manajemen Ruangan Kelas. Hak Cipta Dilindungi.</p>
      </div>
      </div>
    </section>
  );
}
