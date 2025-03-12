"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-black text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stashify</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="#features" className="hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <Link
          href="/login"
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 bg-gray-100">
        <h2 className="text-5xl font-bold mb-4">Welcome to Stashify</h2>
        <p className="text-lg text-gray-700 mb-6">
          The best place to manage and secure your documents.
        </p>
        <Link
          href="/register"
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 bg-white text-center">
        <h2 className="text-4xl font-bold mb-6">Features</h2>
        <div className="flex justify-center space-x-8">
          <div className="w-1/3 p-4 border rounded-md">
            <h3 className="text-2xl font-semibold mb-2">Secure Storage</h3>
            <p className="text-gray-600">Keep your files safe with encryption.</p>
          </div>
          <div className="w-1/3 p-4 border rounded-md">
            <h3 className="text-2xl font-semibold mb-2">Easy Access</h3>
            <p className="text-gray-600">Access your documents anytime, anywhere.</p>
          </div>
          <div className="w-1/3 p-4 border rounded-md">
            <h3 className="text-2xl font-semibold mb-2">Collaboration</h3>
            <p className="text-gray-600">Share and collaborate with your team.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-8 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-6">About Us</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Stashify is a leading document management platform designed to help you
          store, manage, and collaborate securely.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-8 bg-white text-center">
        <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
        <p className="text-lg text-gray-700">
          Have questions? Feel free to reach out to us at{" "}
          <a href="mailto:support@stashify.com" className="text-black font-semibold">
            support@stashify.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black text-white text-center py-4">
        <p>&copy; 2025 Stashify. All rights reserved.</p>
      </footer>
    </div>
  );
}
