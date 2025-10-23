"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Search, Upload, Users } from "lucide-react";
import Link from "next/link"; // ✅ เพิ่ม Link

type Feature = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  subtitle: string;
};

type ResearchItem = {
  color: string;
  title: string;
  author: string;
  date: string;
  views: string;
  comments: string;
};

// --- Feature Card ---
const FeatureCard: React.FC<Feature> = ({ icon: Icon, title, subtitle }) => (
  <div className="bg-white text-center p-8 rounded-xl shadow-lg border border-gray-100 transition duration-300 transform hover:shadow-xl">
    <div className="mx-auto w-14 h-14 flex items-center justify-center mb-4 text-blue-600 rounded-full bg-blue-50">
      <Icon size={28} strokeWidth={2} />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

// --- Research Card ---
const ResearchCard: React.FC<ResearchItem> = ({ color, title, author, date, views, comments }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition duration-300 hover:shadow-lg">
    <div className={`${color} h-28 p-4 flex items-center justify-center text-center`}>
      <span className="text-white text-lg font-bold">Research Cover</span>
    </div>
    <div className="p-4 space-y-2">
      <h4 className="text-gray-800 text-sm font-semibold line-clamp-2 min-h-[40px] leading-tight">{title}</h4>
      <div className="text-xs text-gray-500 pt-1">
        <p>{author}</p>
      </div>
      <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xs text-gray-500 mt-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>{views}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>{comments}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
    </div>
  </div>
);

// --- Navbar / Profile UI อัปเดต ---
const Navbar: React.FC = () => {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  const handleToggleProfile = () => setIsProfilePopupOpen(!isProfilePopupOpen);
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* โลโก้ */}
        <div className="text-xl font-bold text-blue-600">Siam Archive</div>

        {/* ลิงก์เมนู */}
        <div className="hidden md:flex items-center space-x-4 text-gray-600 text-sm relative">
          <Link href="#" className="hover:text-blue-600 transition duration-150">หน้าหลัก</Link>
          <Link href="/search" className="hover:text-blue-600 transition duration-150">ค้นหางานวิจัย</Link>
          <Link href="#" className="hover:text-blue-600 transition duration-150">เกี่ยวกับเรา</Link>
          <Link href="#" className="hover:text-blue-600 transition duration-150">ติดต่อเรา</Link>

          {/* ปุ่ม Login / Register */}
          <Link href="/login" className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition duration-150 text-sm">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-150 text-sm">
            สมัครสมาชิก
          </Link>

          {/* --- User Profile Icon --- */}
          <div className="ml-4 relative">
            <img
              src="/placeholder-avatar.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
              onClick={handleToggleProfile}
            />

            {/* --- Profile Popup --- */}
            {isProfilePopupOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  ดูโปรไฟล์
                </Link>
                <Link href="/edit-profile" className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  แก้ไขโปรไฟล์
                </Link>
                <Link href="/history" className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  ประวัติการอัพโหลด
                </Link>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">โหมดมืด</div>
                <Link href="/setting" className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  ตั้งค่า
                </Link>
                <div
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                >
                  ออกจากระบบ
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function Page() {
  const features: Feature[] = [
    { icon: Search, title: "ค้นหาง่าย", subtitle: "ค้นหาและเข้าถึงงานวิจัยได้ง่ายขึ้น" },
    { icon: Upload, title: "อัปโหลดเอกสาร", subtitle: "แชร์ผลงานของคุณพร้อมอัปเดตข้อมูลได้ตลอด" },
    { icon: Users, title: "สร้างชุมชน", subtitle: "เชื่อมต่อและร่วมมือกับผู้เชี่ยวชาญ และเพื่อนร่วมงาน" },
  ];

  const researchItems: ResearchItem[] = [
    { color: "bg-blue-600", title: "การพัฒนาเวชระเบียนแบบนำทางสำหรับการประเมิน...", author: "รศ.ดร.ชินวัตร", date: "17 ก.ค. 2566", views: "1,200", comments: "15" },
    { color: "bg-green-500", title: "ผลกระทบของ Climate Change ต่อการเกษตรและ...", author: "อ.ดร.ปิติ", date: "20 พ.ค. 2566", views: "980", comments: "8" },
    { color: "bg-purple-600", title: "แนวคิด Blockchain กับระบบ Supply Chain...", author: "วิทยา ดอนหาด", date: "1 ก.ค. 2566", views: "786", comments: "22" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',_sans-serif]">
      <Navbar />

      <main className="pt-[72px]">
        {/* Hero Section */}
        <section className="relative h-[550px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] opacity-95"></div>
          <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-start text-white z-[1]">
            <div className="w-full md:w-3/5 space-y-6 pt-10 md:pt-0">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                ยินดีต้อนรับสู่ <span className="block">Siam Archive</span>
              </h1>
              <p className="text-lg md:text-xl font-light max-w-md">
                สถานที่ที่เปิดโอกาสในการเข้าถึงแหล่งข้อมูล ศึกษา และสร้างคุณค่าทางปัญญาของคุณ
              </p>
              <Link href="/search" className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.05]">
                เริ่มต้นใช้งาน
              </Link>
            </div>
            <div className="w-full md:w-2/5 flex justify-center md:justify-start pt-12 md:pt-0 md:pl-16">
              <div className="bg-white text-gray-800 p-10 w-full max-w-sm h-[320px] flex items-center justify-center rounded-2xl shadow-2xl transform transition duration-500 hover:shadow-blue-500/50">
                <h2 className="text-2xl font-bold text-center text-blue-600">
                  Academic Research
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">แพลตฟอร์มที่ออกแบบมาเพื่อคุณ</h2>
            <p className="text-center text-gray-500 mb-16 max-w-3xl mx-auto">เราออกแบบมาเพื่อเป็นเครื่องมือและบริการจัดการงานวิจัยให้คุณเข้าถึงง่ายและมีประสิทธิภาพ ด้วยระบบที่ใช้งานง่าย</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => <FeatureCard key={index} {...feature} />)}
            </div>
          </div>
        </section>

        {/* Latest Research Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">งานวิจัยล่าสุด</h2>
              <Link href="/search" className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition duration-150 flex items-center space-x-1">
                <span className='text-gray-500 text-sm font-normal'>ดูทั้งหมด</span> 
                <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchItems.map((item, index) => <ResearchCard key={index} {...item} />)}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-5xl mx-auto px-6 text-center text-white space-y-4">
            <h2 className="text-3xl font-bold">เริ่มต้นแบ่งปันผลงานของคุณ</h2>
            <p className="text-lg font-light max-w-xl mx-auto">สำหรับทุกงานวิจัยที่คุณจะทำ และค้นคว้าแหล่งงานวิจัยของทุกคน</p>
            <Link href="/register" className="bg-white text-blue-600 font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-gray-100 transition duration-300 mt-4 transform hover:scale-[1.05]">
              สมัครสมาชิกเลย
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-4">
        <div className="text-center text-gray-400 text-xs">© 2025 Siam Archive. สงวนลิขสิทธิ์.</div>
      </footer>
    </div>
  );
}
