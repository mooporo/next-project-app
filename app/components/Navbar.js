"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* ซ้าย */}
      <div className="flex items-center space-x-8">
        <span className="font-bold text-2xl cursor-pointer" onClick={() => router.push("/")}>
          Siam Archive
        </span>
        <div className="hidden md:flex space-x-6">
          <span className="cursor-pointer hover:text-indigo-600 transition" onClick={() => router.push("/")}>
            Home
          </span>
          <span className="cursor-pointer hover:text-indigo-600 transition" onClick={() => router.push("/research")}>
            Research
          </span>
          <span className="cursor-pointer hover:text-indigo-600 transition" onClick={() => router.push("/about")}>
            About Me
          </span>
        </div>
      </div>

      {/* ขวา */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/register")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;