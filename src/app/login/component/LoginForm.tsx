"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
    if (sessionStorage.getItem("token")) {
      router.push("");
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) throw new Error("Invalid credentials");
        if (response.status === 401) throw new Error("Unauthorized access");
        if (response.status === 500)
          throw new Error("Server error, try again later");
        throw new Error(data.message || "Login failed");
      }

      sessionStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#EDF0F2] items-center justify-center p-4 font-sans">
      <div className="bg-white w-11/12 md:w-5/6 lg:w-3/4 h-auto md:h-4/5 flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden">
        {/* Login Form */}
        <div className="w-full md:w-2/5 p-10 flex flex-col justify-center">
          <div className="flex flex-col items-start">
            <div className="w-10 h-10 bg-[#94FCF6] mb-2"></div>
            <h2 className="text-2xl font-semibold text-black font-sans">
              Login
            </h2>
          </div>

          <p className="text-black text-sm mb-6 font-sans">
            See your growth and get support!
          </p>

          {error && <p className="text-red-500 text-sm font-sans">{error}</p>}

          <form onSubmit={handleLogin}>
            <label className="text-sm font-medium text-black font-sans">
              Email*
            </label>
            <input
              type="email"
              placeholder="sarah@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
            />

            <label className="text-sm font-medium text-black font-sans">
              Password*
            </label>
            <input
              type="password"
              placeholder="gal&sarah"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 mb-4 border rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
            />

            <div className="flex justify-between items-center text-sm mb-4 text-black font-sans">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="text-black hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#101540] text-white p-2 rounded-2xl hover:bg-[#131313] disabled:bg-gray-500 font-sans"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-black font-sans">
            Not registered yet?{" "}
            <a
              href="/register"
              className="text-black font-semibold hover:underline"
            >
              Create a new account
            </a>
          </p>
        </div>

        {/* Image Container */}
        <div className="w-full md:w-3/5 bg-white flex items-center justify-center p-4">
          <Image
            src="/image 3.png"
            alt="Login Illustration"
            width={600}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
