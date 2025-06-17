"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginUser } from "@/app/services/auth";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

type FieldName = 'email' | 'password';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (name: FieldName, value: string): string => {
    let error = "";
    if (name === "email") {
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        error = "Format email tidak valid.";
      }
    } else if (name === "password") {
      if (value && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)) {
        error = "Password minimal 8 karakter, harus mengandung huruf dan angka.";
      }
    }
    return error;
  };

  useEffect(() => {
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);
    setFormErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError && email && password) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, password]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
        setServerError("Form belum valid. Harap periksa kembali input Anda.");
        return;
    }

    setServerError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      const role = data.user.role;

      if (role === "admin") {
        router.push("/admindashboard");
      } else if (role === "superadmin") {
        router.push("/superadmindashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message || "Email atau password salah.");
      } else {
        setServerError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

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
          
          {serverError && (
            <p className="text-red-500 text-sm mb-4 bg-red-100 p-2 rounded">{serverError}</p>
          )}

          <form onSubmit={handleLogin} noValidate>
            <label className="text-sm font-medium text-black">Email*</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 mt-1 mb-1 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 ${formErrors.email ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
            />
            {formErrors.email && <p className="text-red-500 text-xs mb-3">{formErrors.email}</p>}


            <label className="text-sm font-medium text-black mt-4">Password*</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 pr-10 mt-1 mb-1 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 ${formErrors.password ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {formErrors.password && <p className="text-red-500 text-xs mb-3">{formErrors.password}</p>}


            <div className="flex justify-between items-center text-sm my-4 text-black">
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
              className="w-full bg-[#101540] text-white p-2 rounded-2xl hover:bg-[#131313] flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : null}
              {loading ? "Loading..." : "Login"}
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
        <div className="w-full md:w-3/5 bg-white hidden md:flex items-center justify-center p-4">
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