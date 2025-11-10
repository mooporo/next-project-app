"use client";

import React, { useState } from "react";
import DrawerAdmin from "../components/DrawerAdmin"; // ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ
import Image from "next/image";
import Link from "next/link";

export default function AdminHomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = (isOpen) => {
    setDrawerOpen(isOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',_sans-serif] flex">
      {/* Drawer */}
      <DrawerAdmin onToggle={handleDrawerToggle} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300`}
        style={{ marginLeft: drawerOpen ? "18rem" : "0" }}
      >
        <main>
          {/* Hero Section เต็มหน้าจอ */}
          <section
            className="relative h-screen w-full overflow-hidden bg-cover bg-center bg-fixed fade-in"
            style={{ backgroundImage: "url('/backgroud2.png')" }}
          >
            {/* Layer สีพื้นหลัง */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#2563EB]/80 to-[#60A5FA]/70 opacity-60"></div>

            {/* เนื้อหา */}
            <div className="relative z-[1] w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between max-w-7xl mx-auto px-6 text-white">
              {/* ข้อความฝั่งซ้าย */}
              <div className="w-full md:w-3/5 space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                  ยินดีต้อนรับสู่{" "}
                  <span className="block text-blue-100">Siam Archive (Admin)</span>
                </h1>
                <p className="text-lg md:text-xl font-light max-w-md mx-auto md:mx-0 text-blue-100">
                  จัดการ ดูแล และตรวจสอบระบบงานวิจัยและผู้ใช้ทั้งหมดได้จากที่นี่
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                  <Link
                    href="/verify-user" // ✅ แก้แค่บรรทัดนี้เท่านั้น
                    className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.05]"
                  >
                    ตรวจสอบ user
                  </Link>

                  <Link
                    href="/verify-research" // ✅ แก้ตรงนี้เท่านั้น
                    className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-xl hover:bg-blue-700 transition duration-300 transform hover:scale-[1.05]"
                  >
                    ตรวจสอบงานวิจัย
                  </Link>
                </div>
              </div>

              {/* รูปภาพฝั่งขวา */}
              <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-10 md:mt-0">
                <div className="bg-white p-2 rounded-2xl shadow-2xl w-[320px] h-[320px] flex items-center justify-center hover:shadow-blue-400/40 transition duration-500 overflow-hidden fade-in">
                  <div className="relative w-full h-full">
                    <Image
                      src="/siam_archive.png"
                      alt="Siam Archive Admin"
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
        </main>
      </div>
    </div>
  );
}
