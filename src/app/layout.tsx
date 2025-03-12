import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google"; // ✅ Tambahkan Poppins
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins", // ✅ Tambahkan variable untuk Poppins
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // ✅ Sesuaikan dengan kebutuhan
});

export const metadata: Metadata = {
  title: "TrackIt",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} font-sans antialiased`} // ✅ Tambahkan font Poppins
      >
        {children}
      </body>
    </html>
  );
}
