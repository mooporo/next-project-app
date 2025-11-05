"use client";

import React, { useState } from "react";
import Image from "next/image";
import BookImg from "../images/book.png";
import { useRouter } from "next/navigation";

// --- ICONS ---
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13 13 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.37-1.62" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    const adminEmail = "art";
    const adminPassword = "666666";

    setTimeout(() => {
      if (email === adminEmail && password === adminPassword) {
        alert("✅ เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ Admin");
        router.push("/admin-home"); // <-- เปลี่ยนตรงนี้
      } else {
        alert("❌ คุณไม่มีสิทธิ์เข้าถึงหน้า Admin หรือรหัสไม่ถูกต้อง");
      }
      setLoading(false);
    }, 500); // จำลอง loading
  };

  return (
    <div className="min-h-screen flex font-['Inter'] bg-white text-gray-900">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Login - Siam Archive</h1>
          <p className="text-gray-600 mb-8">เฉพาะ Admin เท่านั้นสามารถเข้าสู่ระบบ</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรอก Email ของ Admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="กรอกรหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"} transition duration-150`}
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "ลงชื่อเข้าใช้"}
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-col items-center space-y-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm text-blue-600 hover:underline"
            >
              ← ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <Image src={BookImg} alt="Digital Archive Illustration" fill className="object-cover" priority />
      </div>
    </div>
  );
}
