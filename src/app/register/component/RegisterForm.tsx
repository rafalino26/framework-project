"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = {
      firstName: "",
      lastName: "",
      username: "",
      emailOrPhone: "",
      password: "",
      confirmPassword: "",
    };

    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!username) newErrors.username = "Username or company name is required.";
    if (!emailOrPhone) newErrors.emailOrPhone = "Email or phone number is required.";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Password confirmation does not match.";
    

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    // Handle registrasi di sini (API call atau logika lainnya)
    console.log({ firstName, lastName, username, emailOrPhone, password });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Kiri - Form Section */}
      <div className="w-1/2 flex items-center justify-center p-8 pl-24">
        <div className="w-full max-w-md">
        <h2 className="text-5xl font-bold bg-black bg-clip-text text-transparent mb-6 leading-tight">
  Register
</h2>


<form onSubmit={handleSubmit} className="space-y-4">

{/* First Name & Last Name (Side by Side) */}
<div className="flex space-x-5">
    {/* First Name */}
    <div className="w-44">
        <label className="block text-sm text-gray-600 mb-1">First Name</label>
        <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full p-1 border rounded-md focus:ring-2 placeholder:text-sm text-black focus:outline-none ${errors.firstName ? "ring-red-500" : "ring-blue-300"}`}
            placeholder="Enter First Name"
        />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
    </div>

    {/* Last Name */}
    <div className="w-44">
        <label className="block text-sm text-gray-600 mb-1">Last Name</label>
        <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full p-1 border rounded-md focus:ring-2 placeholder:text-sm text-black focus:outline-none ${errors.lastName ? "ring-red-500" : "ring-blue-300"}`}
            placeholder="Enter Last Name"
        />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
    </div>
</div>


{/* Username/Company Name */}
<div className="w-10/12">
    <label className="block text-sm text-gray-600 mb-1">Username/Company Name</label>
    <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={`w-full p-1 border rounded-md focus:ring-2 placeholder:text-sm text-black focus:outline-none ${errors.username ? "ring-red-500" : "ring-blue-300"}`}
        placeholder="Enter Username or Company Name"
    />
    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
</div>

{/* Email/Phone */}
<div className="w-10/12">
    <label className="block text-sm text-gray-600 mb-1">Email/Phone Number</label>
    <input
        type="text"
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
        className={`w-full p-1 border rounded-md focus:ring-2 placeholder:text-sm text-black focus:outline-none ${errors.emailOrPhone ? "ring-red-500" : "ring-blue-300"}`}
        placeholder="Enter Email or Phone Number"
    />
    {errors.emailOrPhone && <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone}</p>}
</div>

{/* Password */}
<div className="w-10/12">
    <label className="block text-sm text-gray-600 mb-1">Password</label>
    <div className="relative">
        <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-1 pr-10 border rounded-md focus:ring-2 placeholder:text-sm text-black focus:outline-none ${errors.password ? "ring-red-500" : "ring-blue-300"}`}
            placeholder="Enter Password"
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500"
        >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
    </div>
    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
</div>

{/* Confirm Password */}
<div className="w-10/12">
    <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
    <div className="relative">
        <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full p-1 pr-10 border rounded-md focus:ring-2 placeholder:text-sm text-black focus:outline-none ${errors.confirmPassword ? "ring-red-500" : "ring-blue-300"}`}
            placeholder="Confirm Password"
        />
        <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500"
        >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
    </div>
    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
</div>

{/* Register Button */}
<button
    type="submit"
    className="w-52 ml-21 bg-black text-white py-2 mt-4 rounded-full hover:bg-gray-700"
>
    Register
</button>

{/* Already Have Account */}
<p className="-mt-1 mr-18 text-center text-sm text-gray-700">
    Already have an account?{" "}
    <Link href="/" className="text-black hover:underline">Login</Link>
</p>
</form>
        </div>
      </div>

      {/* Kanan - Profile & Title Section */}
<div className="w-1/2 relative flex items-center justify-center">
    <img 
        src="bekbek.jpg" 
        alt="Background Image" 
        className="w-full h-[100vh] object-cover"
    />
    
    {/* Overlay untuk bulat hitam + teks */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-28 h-28 bg-black rounded-full mb-4"></div>
        <h1 className="text-4xl font-light text-white">S T A S H I F Y</h1>
    </div>
</div>
</div>
  );
}
