"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { registerUser } from "@/app/services/auth";

// --- AWAL DARI KOMPONEN ---
export default function RegisterPage() {
  
  // --- DEFINISI HOOK & STATE ---
  const router = useRouter();

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    nimNidn: "",
    phoneNumber: "",
  });

  // <-- FIX: Membuat tipe data dari kunci 'form' untuk keamanan tipe
  type FormKeys = keyof typeof form;

  // State untuk fungsionalitas UI
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState({ ...form }); // Inisialisasi dengan struktur yang sama
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // <-- FIX: Mendefinisikan state 'isFormValid'
  const [isFormValid, setIsFormValid] = useState(false);


  // --- FUNGSI-FUNGSI LOGIKA ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // <-- FIX: Memberi tahu TypeScript bahwa `name` adalah kunci yang valid
    const name = e.target.name as FormKeys;
    const value = e.target.value;

    setForm(prevForm => ({ ...prevForm, [name]: value }));

    if (hasAttemptedSubmit) {
      validateField(name, value);
    }
  };

  const validateField = (name: FormKeys, value: string) => {
    let error = "";
    if (!value) {
      error = "Wajib diisi.";
    } else {
      if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        error = "Format email tidak valid.";
      }
      if (name === 'password' && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)) {
        error = "Password min. 8 karakter, ada huruf & angka.";
      }
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };
  
  const validateForm = (): boolean => {
    const newErrors = { fullname: "", username: "", email: "", password: "", nimNidn: "", phoneNumber: "" };
    let formIsValid = true;

    // <-- FIX: Menggunakan `as FormKeys` untuk meyakinkan TypeScript
    (Object.keys(form) as FormKeys[]).forEach(key => {
        const value = form[key];
        let error = "";
        if (!value) {
            error = "Wajib diisi.";
            formIsValid = false;
        } else {
            if (key === 'email' && !/\S+@\S+\.\S+/.test(value)) {
                error = "Format email tidak valid.";
                formIsValid = false;
            }
            if (key === 'password' && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)) {
                error = "Password min. 8 karakter, harus ada huruf & angka.";
                formIsValid = false;
            }
        }
        newErrors[key] = error;
    });

    setErrors(newErrors);
    return formIsValid;
  };

  // <-- FIX: Menambahkan useEffect untuk mengatur isFormValid secara otomatis
  useEffect(() => {
    // Cek jika ada pesan error di state `errors`
    const hasErrors = Object.values(errors).some(errorMsg => errorMsg !== "");
    // Cek jika semua field sudah diisi
    const allFieldsFilled = Object.values(form).every(fieldValue => fieldValue !== "");
    
    // Form valid jika semua field terisi DAN tidak ada error
    setIsFormValid(!hasErrors && allFieldsFilled);
  }, [form, errors]);


  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setHasAttemptedSubmit(true);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(form);
      setSuccessMessage("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message || "Registrasi gagal. Coba lagi.");
      } else {
        setServerError("Terjadi kesalahan yang tidak diketahui.");
      }
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
          <p className="text-black text-sm mb-6">
            Let's get you all set up so you can verify your personal account.
          </p>

          {/* == TAMPILAN PESAN SUKSES & ERROR == */}
          {serverError && <p className="text-red-500 text-sm mb-4 bg-red-100 p-3 rounded">{serverError}</p>}
          {successMessage && <p className="text-green-600 text-sm mb-4 bg-green-100 p-3 rounded">{successMessage}</p>}


          <form onSubmit={handleSignUp} noValidate>
            {/* Full Name */}
            <div>
              <label className="text-sm text-black">Full Name</label>
              <input name="fullname" type="text" value={form.fullname} onChange={handleChange} placeholder="Enter your full name"
                className={`w-full p-2 mt-1 mb-1 border rounded-md text-black bg-gray-200 ${errors.fullname && 'border-red-500'}`} />
              {errors.fullname && <p className="text-red-500 text-xs">{errors.fullname}</p>}
            </div>

            {/* Username & NIM/NIDN */}
            <div className="flex space-x-4 mt-3">
              <div className="w-1/2">
                <label className="text-sm text-black">Username</label>
                <input name="username" type="text" value={form.username} onChange={handleChange} placeholder="Create a username"
                  className={`w-full p-2 mt-1 mb-1 border rounded-md text-black bg-gray-200 ${errors.username && 'border-red-500'}`} />
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black">NIM/NIDN</label>
                <input name="nimNidn" type="text" value={form.nimNidn} onChange={handleChange} placeholder="Enter your NIM/NIDN"
                  className={`w-full p-2 mt-1 mb-1 border rounded-md text-black bg-gray-200 ${errors.nimNidn && 'border-red-500'}`} />
                {errors.nimNidn && <p className="text-red-500 text-xs">{errors.nimNidn}</p>}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="flex space-x-4 mt-3">
              <div className="w-1/2">
                <label className="text-sm text-black">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email"
                  className={`w-full p-2 mt-1 mb-1 border rounded-md text-black bg-gray-200 ${errors.email && 'border-red-500'}`} />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="w-1/2">
                <label className="text-sm text-black">Phone No.</label>
                <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} placeholder="Your phone number"
                  className={`w-full p-2 mt-1 mb-1 border rounded-md text-black bg-gray-200 ${errors.phoneNumber && 'border-red-500'}`} />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="relative mt-3">
              <label className="text-sm text-black">Password</label>
              <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Enter your password"
                className={`w-full p-2 mt-1 mb-1 border rounded-md text-black bg-gray-200 pr-10 ${errors.password && 'border-red-500'}`} />
              <div className="absolute right-3 top-9 cursor-pointer text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </div>
            </div>
             {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            
            {/* Checkbox & Button */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                    <input type="checkbox" id="agree" className="mr-2" />
                    <label htmlFor="agree" className="text-sm text-black">I agree to terms</label>
                </div>
                
                 {/* == TOMBOL PENDAFTARAN YANG CERDAS == */}
                <button type="submit" disabled={isLoading || !isFormValid}
                    className="w-40 bg-[#101540] text-white p-2 rounded-2xl flex items-center justify-center hover:bg-[#131313] disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isLoading ? <FaSpinner className="animate-spin h-5 w-5" /> : "Sign Up"}
                </button>
            </div>
          </form>

          {/* Link ke Login */}
          <p className="text-sm mt-4 text-black">
            Already have an account?{" "}
            <Link href="/login" className="text-black font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
