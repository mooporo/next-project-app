"use client"; // ต้องใช้ "use client" เนื่องจากมีการใช้ React Hooks (useState)

import React, { useState } from 'react';

// ไอคอน SVG สำหรับ Google
const GoogleIcon = (props) => (
  <svg {...props} viewBox="0 0 48 48" width="20" height="20">
    <clipPath id="g"><path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.3 0-13.3-6-13.3-13.3s6-13.3 13.3-13.3c3.9 0 7.2 1.5 9.8 3.2L41.3 9c-4.4-2.6-9.8-4-15.3-4C13.5 5 5 13.5 5 24s8.5 19 19 19c11.1 0 17.7-8.1 17.7-17.9 0-1.3-.1-2.6-.4-3.9z" /></clipPath>
    <path clipPath="url(#g)" fill="#FBBC04" d="M0 37V11l17 13z" />
    <path clipPath="url(#g)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V5z" />
    <path clipPath="url(#g)" fill="#34A853" d="M0 37l30-23 7.9 1L48 37z" />
    <path clipPath="url(#g)" fill="#4285F4" d="M48 14l-4.1 2.5H24v8.5h20.5z" />
  </svg>
);

// ไอคอน SVG สำหรับปฏิทิน (สำหรับช่องวันเดือนปีเกิด)
const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const RegisterPage = () => {
  // State สำหรับฟอร์มลงทะเบียน
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    idNumber: '',
    dob: '',
    userType: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  // จำลองการลงทะเบียน (ไม่มีการเชื่อมต่อจริง)
  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Attempting registration with:', formData);
    // ในแอปพลิเคชันจริงจะมีการตรวจสอบและเรียก API ที่นี่
  };

  // ตัวเลือกประเภทผู้ใช้
  const userTypeOptions = [
    { value: '', label: 'โปรดเลือกประเภทผู้ใช้' },
    { value: 'student', label: 'นักศึกษา' },
    { value: 'lecturer', label: 'อาจารย์/นักวิจัย' },
    { value: 'public', label: 'บุคคลทั่วไป' },
  ];

  return (
    <div className="min-h-screen flex font-['Inter']">
      
      {/* ส่วนซ้าย: แบบฟอร์มลงทะเบียน */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">ลงทะเบียนผู้ใช้</h1>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* 1. ชื่อผู้ใช้ (Username) */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 2. อีเมล (Email) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 3. หมายเลขประจำตัวประชาชน (ID Number) */}
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                หมายเลขประจำตัวประชาชน
              </label>
              <input
                id="idNumber"
                name="idNumber"
                type="text"
                required
                value={formData.idNumber}
                onChange={handleInputChange}
                maxLength={13}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 4. วันเดือนปีเกิด (Date of Birth) */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                วันเดือนปีเกิด
              </label>
              <div className="relative">
                <input
                  id="dob"
                  name="dob"
                  type="date" // ใช้ type="date" เพื่อให้แสดงปฏิทินบนอุปกรณ์ที่รองรับ
                  required
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none"
                />
                {/* ไอคอนปฏิทิน: ใช้งานใน browser ที่ไม่รองรับ date picker โดยตรง */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    <CalendarIcon />
                </div>
              </div>
            </div>
            
            {/* 5. ประเภทผู้ใช้ (User Type) */}
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                ประเภท
              </label>
              <select
                id="userType"
                name="userType"
                required
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {userTypeOptions.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.value === ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>


            {/* 6. รหัสผ่าน (Password) */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 7. ยืนยันรหัสผ่าน (Confirm Password) */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                ยืนยันรหัสผ่าน
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 8. ข้อตกลงและเงื่อนไข */}
            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                ฉันได้อ่านและยอมรับข้อตกลงและเงื่อนไข
              </label>
            </div>

            {/* 9. ลงทะเบียน Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                ลงทะเบียน
              </button>
            </div>
          </form>

          {/* 10. Social Login / Guest */}
          <div className="mt-4">
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

            <div className="mt-4 flex space-x-3">
              <button
                type="button"
                className="w-1/2 inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
              >
                <GoogleIcon className="mr-2" />
                ลงทะเบียนด้วย Google
              </button>
              <button
                type="button"
                className="w-1/2 inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
              >
                ลงทะเบียนในฐานะผู้มาเยือน
              </button>
            </div>
          </div>
          
          {/* 11. Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              กลับสู่หน้าเข้าสู่ระบบ
            </a>
          </p>
        </div>
      </div>

      {/* ส่วนขวา: รูปภาพ/โฆษณา (เหมือนหน้า Login) */}
      <div className="hidden md:block md:w-1/2 relative bg-gray-100 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://placehold.co/1200x800/2A4E7E/ffffff?text=Digital+Archive+Platform)` }}
        >
          {/* ใช้พื้นหลังสีน้ำเงินเข้มคล้ายภาพต้นฉบับ */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/90 to-blue-700/70"></div>
          <div className="absolute inset-0 flex items-center justify-center p-10 text-white text-center">
            <h2 className="text-3xl font-extrabold leading-snug">
              คลังความรู้ดิจิทัล <br/> ที่เข้าถึงได้ง่ายและรวดเร็ว
            </h2>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default RegisterPage;
