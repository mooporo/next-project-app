"use client";

import React, { useState } from "react";
import DrawerAdmin from "../components/DrawerAdmin"; // path ให้ตรงกับไฟล์ของคุณ
import Image from "next/image";
import Link from "next/link";
import { Search, Upload, Users } from "lucide-react";

export default function AdminHomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ฟังก์ชันส่งไปให้ DrawerAdmin เพื่อแจ้งสถานะ
  const handleDrawerToggle = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  const features = [
    { icon: Search, title: "ค้นหาง่าย", subtitle: "ค้นหาและเข้าถึงงานวิจัยได้ง่ายขึ้น" },
    { icon: Upload, title: "อัปโหลดเอกสาร", subtitle: "แชร์ผลงานของคุณพร้อมอัปเดตข้อมูลได้ตลอด" },
    { icon: Users, title: "สร้างชุมชน", subtitle: "เชื่อมต่อและร่วมมือกับผู้เชี่ยวชาญ และเพื่อนร่วมงาน" },
  ];

  const researchItems = [
    { id: "1", color: "bg-blue-600", title: "การพัฒนาเวชระเบียนแบบนำทางสำหรับการประเมิน...", author: "รศ.ดร.ชินวัตร", date: "17 ก.ค. 2566", views: "1,200", comments: "15" },
    { id: "2", color: "bg-green-500", title: "ผลกระทบของ Climate Change ต่อการเกษตรและ...", author: "อ.ดร.ปิติ", date: "20 พ.ค. 2566", views: "980", comments: "8" },
    { id: "3", color: "bg-purple-600", title: "แนวคิด Blockchain กับระบบ Supply Chain...", author: "วิทยา ดอนหาด", date: "1 ก.ค. 2566", views: "786", comments: "22" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',_sans-serif] flex">
      {/* Drawer */}
      <DrawerAdmin onToggle={handleDrawerToggle} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300`}
        style={{ marginLeft: drawerOpen ? "18rem" : "0" }} // ดัน Main content ตาม Drawer (w-72 = 18rem)
      >
        <main>
          {/* Hero Section */}
          <section
            className="relative h-[550px] overflow-hidden bg-cover bg-center bg-fixed fade-in"
            style={{ backgroundImage: "url('/backgroud2.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#2563EB]/80 to-[#60A5FA]/70 opacity-40"></div>
            <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-white z-[1]">
              <div className="w-full md:w-3/5 space-y-6 pt-10 md:pt-0">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                  ยินดีต้อนรับสู่ <span className="block">Siam Archive</span>
                </h1>
                <p className="text-lg md:text-xl font-light max-w-md text-blue-100">
                  สถานที่ที่เปิดโอกาสในการเข้าถึงแหล่งข้อมูล ศึกษา และสร้างคุณค่าทางปัญญาของคุณ
                </p>
                <Link
                  href="/search"
                  className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.05]"
                >
                  เริ่มต้นใช้งาน
                </Link>
              </div>

              <div className="w-full md:w-2/5 flex justify-center md:justify-end pt-12 md:pt-0">
                <div className="bg-white p-2 rounded-2xl shadow-2xl w-[320px] h-[320px] flex items-center justify-center hover:shadow-blue-400/40 transition duration-500 overflow-hidden fade-in">
                  <div className="relative w-full h-full">
                    <Image
                      src="/siam_archive.png"
                      alt="Siam Archive"
                      fill
                      unoptimized
                      priority
                      className="object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white fade-in">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
                แพลตฟอร์มที่ออกแบบมาเพื่อคุณ
              </h2>
              <p className="text-center text-gray-500 mb-16 max-w-3xl mx-auto">
                เราออกแบบมาเพื่อเป็นเครื่องมือและบริการจัดการงานวิจัยให้คุณเข้าถึงง่ายและมีประสิทธิภาพ ด้วยระบบที่ใช้งานง่าย
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Link key={index} href={feature.title === "ค้นหาง่าย" ? "/search" : feature.title === "อัปโหลดเอกสาร" ? "/upload" : "#"}>
                    <FeatureCard {...feature} />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Latest Research Section */}
          <section className="py-20 bg-gray-50 fade-in">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">งานวิจัยล่าสุด</h2>
                <Link href="/search" className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition duration-150 flex items-center space-x-1">
                  <span className="text-gray-500 text-sm font-normal">ดูทั้งหมด</span>
                  <span>→</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {researchItems.map((item, index) => (
                  <ResearchCard key={index} {...item} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// FeatureCard & ResearchCard เหมือนเดิม
const FeatureCard = ({ icon: Icon, title, subtitle }) => (
  <div className="bg-white text-center p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 transition duration-300 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-blue-100/80 fade-in">
    <div className="mx-auto w-16 h-16 flex items-center justify-center mb-5 text-blue-600 rounded-full bg-blue-50 shadow-inner hover:rotate-6 transition-transform duration-300">
      <Icon size={30} strokeWidth={2} />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

const ResearchCard = ({ id, color, title, author, date, views, comments }) => (
  <Link href={`/งานวิจัย/${id}`} className="group">
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 fade-in">
      <div className={`${color} h-28 p-4 flex items-center justify-center text-center`}>
        <span className="text-white text-lg font-bold tracking-wide">Research Cover</span>
      </div>
      <div className="p-5 space-y-2">
        <h4 className="text-gray-800 text-sm font-semibold line-clamp-2 min-h-[40px] leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
        <div className="text-xs text-gray-500">
          <p>{author}</p>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xs text-gray-500 mt-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{views}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{comments}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
      </div>
    </div>
  </Link>
);
