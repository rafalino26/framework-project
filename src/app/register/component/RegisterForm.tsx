"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    agree: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("All fields are required");
      return;
    }

    if (!formData.agree) {
      setError("You must agree to the terms and policies");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://your-api.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#EDF0F2] items-center justify-center p-4 font-[Poppins]">
      <div className="bg-white w-11/12 md:w-5/6 lg:w-3/4 h-auto md:h-4/5 flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden">
        {/* Image Container (di kiri, lebih kecil) */}
        <div className="w-full md:w-2/5 bg-white flex items-center justify-center p-4">
          <Image
            src="/image 3.png"
            alt="Register Illustration"
            width={500}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Register Form (di kanan, lebih besar) */}
        <div className="w-full md:w-3/5 p-10 flex flex-col justify-center">
          <div className="flex flex-col items-start">
            <div className="w-10 h-10 bg-[#94FCF6] mb-2"></div>
            <h2 className="text-2xl font-medium text-black">Sign Up</h2>
          </div>

          <p className="text-black text-lg font-medium mt-2">
            Manage all your inventory efficiently
          </p>

          <p className="text-black text-sm mb-6">
            Let's get you all set up so you can verify your personal account and
            begin setting up your work profile.
          </p>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <form onSubmit={handleRegister}>
            {/* First Name & Last Name */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="text-sm text-black">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Minimum 8 characters"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Email & Phone Number */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="text-sm text-black">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black">Phone No.</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Minimum 8 characters"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-black">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Checkbox Agreement */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="agree"
                id="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="agree" className="text-sm text-black">
                I agree to all terms, privacy policies, and fees
              </label>
            </div>

            {/* Sign Up Button (di kiri, lebih pendek) */}
            <button
              type="submit"
              className="w-40 bg-[#101540] text-white p-2 rounded-2xl hover:bg-[#131313] disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Sudah punya akun? */}
          <p className="text-sm mt-4 text-black">
            Already have an account?{" "}
            <a href="/login" className="text-black font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
