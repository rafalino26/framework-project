"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { registerUser } from "@/app/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    nimNidn: "",
    phoneNumber: "",
  });


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSignUp = async () => {
  setIsLoading(true);
  try {
    const response = await registerUser(form);

    // Tampilkan pesan ke user
    alert("Silahkan cek email anda untuk verifikasi");

    // Setelah user klik OK di alert, redirect ke login
    router.push("/login");
  } catch (err: any) {
    alert(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-[#EDF0F2] items-center justify-center p-4 font-sans">
      <div className="bg-white w-11/12 md:w-5/6 lg:w-3/4 h-auto md:h-4/5 flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden">
        {/* Image Container */}
        <div className="w-full md:w-2/5 bg-white flex items-center justify-center p-4">
          <Image
            src="/image 3.png"
            alt="Register Illustration"
            width={500}
            height={500}
            priority
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Register Form */}
        <div className="w-full md:w-3/5 p-10 flex flex-col justify-center">
          <div className="flex flex-col items-start">
            <div className="w-10 h-10 bg-[#94FCF6] mb-2"></div>
            <h2 className="text-2xl font-medium text-black">Sign Up</h2>
          </div>

          <p className="text-black text-lg font-medium mt-2">
            Manage all your inventory efficiently
          </p>

          <p className="text-black text-sm mb-6">
            Let's get you all set up so you can verify your personal account.
          </p>

          <form>
            {/* Full Name */}
            <div>
              <label className="text-sm text-black">Full Name</label>
              <input
                name="fullname"
                type="text"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
              />
            </div>

            {/* Username & NIM/NIDN */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="text-sm text-black">Username</label>
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Create a username"
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black">NIM/NIDN</label>
                <input
                  name="nimNidn"
                  type="text"
                  value={form.nimNidn}
                  onChange={handleChange}
                  placeholder="Enter your NIM/NIDN"
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="text-sm text-black">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black">Phone No.</label>
                <input
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
                />
              </div>
            </div>

            {/* Password with eye icon */}
            <div className="relative">
              <label className="text-sm text-black">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 pr-10"
              />
              <div
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={handleTogglePassword}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </div>
            </div>

            {/* Checkbox Agreement */}
            <div className="flex items-center mb-4">
              <input type="checkbox" id="agree" className="mr-2" />
              <label htmlFor="agree" className="text-sm text-black">
                I agree to all terms, privacy policies, and fees
              </label>
            </div>

            {/* Sign Up Button with loading */}
            <button
              type="button"
              onClick={handleSignUp}
              className={`w-40 bg-[#101540] text-white p-2 rounded-2xl hover:bg-[#131313] flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
          </form>

          {/* Already have an account? */}
          <p className="text-sm mt-4 text-black">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
