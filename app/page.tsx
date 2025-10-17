"use client";

import React from "react";
import Image from "next/image";

// Navbar
const Navbar = () => (
  <header className="fixed top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold text-blue-600">Siam Archive</h1>
        <nav className="hidden md:flex space-x-8 text-gray-700 text-sm font-medium">
          <a href="/" className="hover:text-blue-600 transition duration-150">Home</a>
          <a href="/search" className="hover:text-blue-600 transition duration-150">Search</a>
          <a href="/model" className="hover:text-blue-600 transition duration-150">Model</a>
        </nav>
      </div>
      <div className="space-x-3">
        <a
          href="/login"
          className="px-4 py-1.5 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition duration-150 shadow-sm"
        >
          Login
        </a>
        <a
          href="/register"
          className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
        >
          Register
        </a>
      </div>
    </div>
  </header>
);

// Hero Section
const HeroSection = () => (
  <section className="relative pt-32 pb-32 overflow-hidden">
    {/* Background image */}
    <div className="absolute inset-0 z-0">
      <Image
        src="/background.png" // วางไฟล์ background.png ใน public/
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
      {/* ซ้าย */}
      <div className="md:w-1/2 text-left py-24 z-10">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          ยินดีต้อนรับสู่ Siam Archive
        </h2>
        <p className="text-xl text-blue-200 mb-6">สถานที่สำหรับการค้นหางานวิจัย</p>
        <ul className="text-lg text-blue-100 space-y-2 mb-8 list-none">
          <li className="flex items-center">
            <span className="text-xl mr-2 text-white">‹</span>
            ค้นหา อัปโหลด ศึกษา และสร้างชุมชนงานวิจัย
          </li>
        </ul>
        <a
          href="/register"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-500 hover:bg-indigo-600 shadow-xl transition duration-300 transform hover:scale-105"
        >
          เริ่มใช้งาน
        </a>
      </div>

      {/* ขวา */}
      <div className="md:w-1/2 flex justify-center p-8">
        <div className="w-[350px] h-[350px] relative rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <Image
            src="/research.png" // วางไฟล์ research.png ใน public/
            alt="Research"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);

// Description Section
const DescriptionSection = () => (
  <section className="py-16 bg-white relative z-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        แพลตฟอร์มของเราออกแบบมาเพื่อจัดเก็บและบริหารจัดการงานวิจัยอย่างมีประสิทธิภาพ
        ด้วยระบบที่ใช้งานง่าย คุณสามารถจัดการและเข้าถึงงานวิจัยได้สะดวก
        พร้อมรองรับการแสดงผลที่ตอบสนองต่อทุกอุปกรณ์
      </p>
      <a
        href="/register"
        className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition duration-300 transform hover:scale-105"
      >
        เริ่มต้นใช้งาน
      </a>
    </div>
  </section>
);

// Home Page
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      <Navbar />
      <HeroSection />
      <DescriptionSection />
    </div>
  );
};

export default HomePage;
