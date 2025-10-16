"use client"; // เพิ่ม directive นี้เพื่อระบุว่าเป็น Client Component

import React, { useState } from 'react';
import Image from "next/image";
import BookImg from "../images/book.png"; // import รูปจาก app/images

// ไอคอน SVG สำหรับการซ่อน/แสดงรหัสผ่าน
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.37-1.62" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const GoogleIcon = (props) => (
  <svg {...props} viewBox="0 0 48 48" width="20" height="20">
    <clipPath id="g"><path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.3 0-13.3-6-13.3-13.3s6-13.3 13.3-13.3c3.9 0 7.2 1.5 9.8 3.2L41.3 9c-4.4-2.6-9.8-4-15.3-4C13.5 5 5 13.5 5 24s8.5 19 19 19c11.1 0 17.7-8.1 17.7-17.9 0-1.3-.1-2.6-.4-3.9z" /></clipPath>
    <path clipPath="url(#g)" fill="#FBBC04" d="M0 37V11l17 13z" />
    <path clipPath="url(#g)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V5z" />
    <path clipPath="url(#g)" fill="#34A853" d="M0 37l30-23 7.9 1L48 37z" />
    <path clipPath="url(#g)" fill="#4285F4" d="M48 14l-4.1 2.5H24v8.5h20.5z" />
  </svg>
);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // จำลองการล็อกอิน (ไม่มีการเชื่อมต่อจริง)
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Attempting login with:', { email, password });
    // ในแอปพลิเคชันจริงจะมีการเรียก API ที่นี่
  };

  return (
    <div className="min-h-screen flex font-['Inter']">
      
      {/* ส่วนซ้าย: แบบฟอร์มล็อกอิน */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับสู่ Siam Archive</h1>
          <p className="text-gray-600 mb-8">
            ใช้ชื่อผู้ใช้และรหัสผ่านของคุณเพื่อเข้าสู่ระบบ
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* 1. Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรอกอีเมลของคุณ"
              />
            </div>

            {/* 2. Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* 3. Remember Me & Login Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  จำฉันไว้
                </label>
              </div>
            </div>

            {/* 4. Login Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                ลงชื่อเข้าใช้
              </button>
            </div>
          </form>

          {/* 5. Social Login / Guest */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  หรือ
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                className="w-1/2 inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
              >
                <GoogleIcon className="mr-2" />
                Sign in with Google
              </button>
              <button
                type="button"
                className="w-1/2 inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
              >
                Sign in with Guest
              </button>
            </div>
          </div>
          
          {/* 6. Register Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            ยังไม่มีบัญชีใช่ไหม?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              ลงทะเบียนเป็นสมาชิก
            </a>
          </p>
        </div>
      </div>

      {/* ส่วนขวา: รูปภาพ */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <Image
          src={BookImg}
          alt="Digital Archive Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>
      
    </div>
  );
};

export default LoginPage;
