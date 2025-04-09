"use client";

import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
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

          {/* Form (hanya tampilan, tidak berfungsi) */}
          <form>
            {/* Full Name */}
            <div>
              <label className="text-sm text-black">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
              />
            </div>

            {/* Username & NIM/NIDN */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="text-sm text-black">Username</label>
                <input
                  type="text"
                  placeholder="Create a username"
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black">NIM/NIDN</label>
                <input
                  type="text"
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
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black">Phone No.</label>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-black">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200"
              />
            </div>

            {/* Checkbox Agreement */}
            <div className="flex items-center mb-4">
              <input type="checkbox" id="agree" className="mr-2" />
              <label htmlFor="agree" className="text-sm text-black">
                I agree to all terms, privacy policies, and fees
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="button"
              className="w-40 bg-[#101540] text-white p-2 rounded-2xl hover:bg-[#131313]"
            >
              Sign Up
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
