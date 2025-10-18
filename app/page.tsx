"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import Image from "next/image";
import Drawer from "./components/Drawer"; 
import { Moon, Settings, LogOut, User, Edit, Upload } from "lucide-react";

// ================= Profile Dropdown =================
const ProfileDropdown = forwardRef<HTMLDivElement, { onClose: () => void }>(
  ({ onClose }, ref) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleItemClick = (action: string) => {
      console.log(action);
      onClose();
    };

    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
      console.log("Dark Mode:", !isDarkMode);
    };

    const menuItemClass =
      "group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg cursor-pointer transition duration-150 justify-between";

    return (
      <div
        ref={ref}
        className="absolute mt-2 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50 right-0 max-w-[90vw] min-w-[13rem]"
        style={{ overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Group 1 */}
        <div className="p-1.5 space-y-0.5">
          <div className={menuItemClass} onClick={() => handleItemClick("ดูโปรไฟล์")}>
            <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
            ดูโปรไฟล์
          </div>
          <div className={menuItemClass} onClick={() => handleItemClick("แก้ไขโปรไฟล์")}>
            <Edit className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
            แก้ไขโปรไฟล์
          </div>
          <div className={menuItemClass} onClick={() => handleItemClick("ประวัติการอัพโหลด")}>
            <Upload className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
            ประวัติการอัพโหลด
          </div>
        </div>

        {/* Group 2 */}
        <div className="p-1.5 space-y-0.5">
          <div className={menuItemClass} onClick={toggleDarkMode}>
            โหมดมืด
            <Moon className={`w-4 h-4 ml-2 ${isDarkMode ? "text-blue-600 fill-blue-600" : "text-gray-400"}`} />
          </div>
          <div className={menuItemClass} onClick={() => handleItemClick("ตั้งค่า")}>
            ตั้งค่า
            <Settings className="w-4 h-4 ml-2 text-gray-400 group-hover:text-blue-600" />
          </div>
        </div>

        {/* Group 3 */}
        <div className="p-1.5">
          <div
            className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition duration-150"
            onClick={() => handleItemClick("ออกจากระบบ")}
          >
            <LogOut className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-600" />
            ออกจากระบบ
          </div>
        </div>
      </div>
    );
  }
);
ProfileDropdown.displayName = "ProfileDropdown";
// =====================================================

// ================= Navbar =================
const Navbar = () => {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const avatarSrc = userAvatar || "/placeholder-avatar.png";

  // ป้องกัน dropdown ทะลุหน้าจอ
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current && avatarRef.current) {
      const dropdown = dropdownRef.current;
      const rect = dropdown.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom > viewportHeight) {
        const overflow = rect.bottom - viewportHeight + 10;
        dropdown.style.top = `-${overflow}px`;
      } else {
        dropdown.style.top = "100%";
      }
    }
  }, [isDropdownOpen]);

  return (
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

        <div className="flex items-center space-x-3 relative">
          <div
            className="w-8 h-8 relative cursor-pointer"
            onClick={handleAvatarClick}
            ref={avatarRef}
          >
            <Image
              src={avatarSrc}
              alt="Profile"
              fill
              sizes="32px"
              className="rounded-full object-cover"
            />
          </div>

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

          {isDropdownOpen && <ProfileDropdown onClose={closeDropdown} ref={dropdownRef} />}
        </div>
      </div>

      {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={closeDropdown} />}
    </header>
  );
};
// ============================================

// ================= Hero Section =================
const HeroSection = () => (
  <section className="relative pt-32 pb-32 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Image
        src="/background.png"
        alt="Background"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
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
          href="/search"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-500 hover:bg-indigo-600 shadow-xl transition duration-300 transform hover:scale-105"
        >
          เริ่มใช้งาน
        </a>
      </div>

      <div className="md:w-1/2 flex justify-center p-8">
        <div className="w-[350px] h-[350px] relative rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <Image
            src="/research.png"
            alt="Research"
            fill
            sizes="350px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);
// ============================================

// ================= Description Section =================
const DescriptionSection = () => (
  <section className="py-16 bg-white relative z-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        แพลตฟอร์มของเราออกแบบมาเพื่อจัดเก็บและบริหารจัดการงานวิจัยอย่างมีประสิทธิภาพ
        ด้วยระบบที่ใช้งานง่าย คุณสามารถจัดการและเข้าถึงงานวิจัยได้สะดวก
        พร้อมรองรับการแสดงผลที่ตอบสนองต่อทุกอุปกรณ์
      </p>
      <a
        href="/search"
        className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition duration-300 transform hover:scale-105"
      >
        เริ่มต้นใช้งาน
      </a>
    </div>
  </section>
);
// ============================================

// ================= Home Page =================
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter']">
      <Navbar />
      <Drawer />
      <HeroSection />
      <DescriptionSection />
    </div>
  );
};

export default HomePage;
