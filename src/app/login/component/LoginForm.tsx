"use client";

import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#EDF0F2] items-center justify-center p-4 font-sans">
      <div className="bg-white w-11/12 md:w-5/6 lg:w-3/4 h-auto md:h-4/5 flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden">
        {/* Login Form */}
        <div className="w-full md:w-2/5 p-10 flex flex-col justify-center">
          <div className="flex flex-col items-start">
            <div className="w-10 h-10 bg-[#94FCF6] mb-2"></div>
            <h2 className="text-2xl font-semibold text-black">Login</h2>
          </div>

          <p className="text-black text-sm mb-6">See your growth and get support!</p>

          <form action="/dashboard">
            <label className="text-sm font-medium text-black">Email*</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="text-sm font-medium text-black">Password*</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-between items-center text-sm mb-4 text-black">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link href="#" className="text-black hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#101540] text-white p-2 rounded-2xl hover:bg-[#131313]"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-black">
            Not registered yet?{" "}
            <Link href="/register" className="text-black font-semibold hover:underline">
              Create a new account
            </Link>
          </p>
        </div>

        {/* Image Container */}
        <div className="w-full md:w-3/5 bg-white flex items-center justify-center p-4">
          <Image
            src="/image 3.png"
            alt="Login Illustration"
            width={500}
            height={500}
            priority
            className="w-2/3 h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
