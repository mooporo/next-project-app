"use client";

import React, { useState } from "react";
import Image from "next/image";
import Drawer from "./components/Drawer";

const HomePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex">
      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />

      {/* เนื้อหาหลัก */}
      <div className={`flex-1 transition-transform duration-300 ${isDrawerOpen ? 'translate-x-72' : 'translate-x-0'}`}>
        <div className="min-h-screen flex flex-col bg-white font-['Inter']">
          {/* Hero Section */}
          <section className="relative pt-15 pb-15 overflow-hidden">
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
              <div className="md:w-1/2 text-left py-20 z-10">
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

              <div className="md:w-1/2 flex justify-start p-8">
                <div className="w-[450px] h-[450px] relative rounded-2xl shadow-2xl overflow-hidden ">
                  <Image
                    src="/siam_archive.png"
                    alt="Research"
                    fill
                    sizes="600px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="py-20 bg-white relative z-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-2xl md:text-3xl text-black leading-relaxed mb-12 font-semibold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                แพลตฟอร์มของเราออกแบบมาเพื่อจัดเก็บและบริหารจัดการงานวิจัยอย่างมีประสิทธิภาพ
                ด้วยระบบที่ใช้งานง่าย คุณสามารถจัดการและเข้าถึงงานวิจัยได้สะดวก
                พร้อมรองรับการแสดงผลที่ตอบสนองต่อทุกอุปกรณ์
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
