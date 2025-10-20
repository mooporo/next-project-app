"use client";

import React, { useState } from "react";
import Image from "next/image";
import BookImg from "../images/book.png";
import { supabase } from "../lib/supabaseClient";
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user_email,
        password: user_password,
      });

      setLoading(false);

      if (error) {
        alert("❌ ล็อกอินไม่สำเร็จ: " + error.message);
        console.error(error);
        return;
      }

      if (data?.user) {
        alert("✅ เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ " + user_email);
        router.push("/"); // ไปหน้า app/page.tsx (home)
      } else {
        alert("❌ ไม่พบผู้ใช้");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("❌ เกิดข้อผิดพลาด: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex font-['Inter'] bg-white text-gray-900">
      {/* ฟอร์มล็อกอิน */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ยินดีต้อนรับสู่ Siam Archive</h1>
          <p className="text-gray-600 mb-8">ใช้อีเมลและรหัสผ่านของคุณเพื่อเข้าสู่ระบบ</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="user_email"
                type="email"
                required
                value={user_email}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรอกอีเมลของคุณ"
              />
            </div>

            <div>
              <label htmlFor="user_password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <div className="relative">
                <input
                  id="user_password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={user_password}
                  onChange={(e) => setUserPassword(e.target.value)}
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
        </div>
      </div>

      {/* ภาพประกอบ */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <Image src={BookImg} alt="Digital Archive Illustration" fill className="object-cover" priority />
      </div>
    </div>
  );
}
