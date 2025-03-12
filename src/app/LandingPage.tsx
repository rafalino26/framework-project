"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Header */}
      <header className="absolute top-6 left-8 right-12 flex justify-between items-center z-10">
        <h1 className="text-3xl text-black font-bold">TrackIt</h1>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="border border-black text-black px-5 py-1 rounded-md hover:border-blue-700 hover:text-blue-700"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-[#252432] text-white px-5 py-1 rounded-md transition duration-300 hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </header>

      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/landing-pagebg.png"
          alt="Background"
          className="h-screen w-auto max-w-full object-cover"
        />
      </div>

      <div className="relative z-10 text-center">
        <h2 className="text-7xl text-black font-bold leading-snug">
          Track <br /> your <br /> stock
        </h2>
        <Link
          href="/contact"
          className="mt-6 inline-block bg-[#252432] text-white px-14 py-4 rounded-md"
        >
          Get In Touch
        </Link>
      </div>
    </div>
  );
}
