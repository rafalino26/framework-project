import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-8 px-6 border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-left">
        {/* Sistem Manajemen Ruangan */}
        <div className="md:pr-6 pb-6 md:pb-0">
          <h3 className="text-xl font-semibold text-black mb-2">
            Sistem Manajemen Ruangan
          </h3>
          <p className="text-gray-600">
            Solusi terpadu untuk manajemen ruangan kelas dan jadwal perkuliahan.
          </p>
        </div>

        {/* Tautan Cepat */}
        <div className="md:pr-6 pb-6 md:pb-0">
          <h3 className="text-xl font-semibold text-black mb-2">
            Tautan Cepat
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-black">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="text-gray-600 hover:text-black">
                Ruangan
              </Link>
            </li>
            <li>
              <Link href="/schedule" className="text-gray-600 hover:text-black">
                Jadwal
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-600 hover:text-black">
                Tentang Kami
              </Link>
            </li>
          </ul>
        </div>

        {/* Hubungi Kami */}
        <div>
          <h3 className="text-xl font-semibold text-black mb-2">
            Hubungi Kami
          </h3>
          <p className="text-gray-600">support@namasistem.ac.id</p>
          <p className="text-gray-600">+62 812-XXXX-XXXX</p>
          <p className="text-gray-600">
            Jl. Pendidikan No. 123, Kota Universitas, Indonesia
          </p>
        </div>
      </div>

      {/* Copyright dengan garis pemisah */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 Sistem Manajemen Ruangan Kelas. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
