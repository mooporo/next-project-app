"use client"; 
// บอก Next.js ว่าไฟล์นี้ทำงานแบบ Client Component (รันบนฝั่งผู้ใช้ ไม่ใช่บน Server)

import React, { useState } from "react";
// import React และ useState สำหรับใช้จัดการ state (ค่าตัวแปรที่เปลี่ยนแปลงได้)

import DrawerAdmin from "../components/DrawerAdmin"; 
// ดึงคอมโพเนนต์ DrawerAdmin มาใช้งาน (เมนูด้านข้างของ Admin)

import Image from "next/image";
// ใช้แสดงรูปภาพแบบ optimize ของ Next.js

import Link from "next/link";
// ใช้สร้างลิงก์เพื่อไปยังหน้าอื่น ๆ

export default function AdminHomePage() {
  // ประกาศฟังก์ชันคอมโพเนนต์หลักของหน้านี้ชื่อ AdminHomePage

  const [drawerOpen, setDrawerOpen] = useState(false);
  // สร้าง state ชื่อ drawerOpen เพื่อเช็คว่า Drawer เปิดหรือปิด
  // ค่าเริ่มต้น = false (ปิด)
  // ถ้าเป็น true = Drawer โผล่ออกมา

  const handleDrawerToggle = (isOpen) => {
    setDrawerOpen(isOpen);
  };
  // ฟังก์ชันรับค่าจาก DrawerAdmin เพื่ออัปเดตว่า Drawer เปิด/ปิด
  // ใช้สำหรับเลื่อนเนื้อหาหน้าเว็บให้ขยับตาม

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',_sans-serif] flex">
      {/* 
        container หลักของทั้งหน้าเว็บ
        - min-h-screen = สูงเต็มหน้าจอ
        - bg-gray-50 = สีเทาอ่อน
        - กำหนด font Inter ทั้งหน้า
        - flex = แบ่งเป็น 2 ส่วน คือ Drawer และ Main Content
      */}

      {/* Drawer (แถบเมนูด้านซ้าย) */}
      <DrawerAdmin onToggle={handleDrawerToggle} />
      {/* 
        แสดงเมนูด้านข้างที่เป็นของ Admin
        และส่งฟังก์ชัน handleDrawerToggle ไปให้ DrawerAdmin
        เพื่อให้ Drawer แจ้งกลับมาว่าตอนนี้เปิดหรือปิดอยู่
      */}

      {/* Main Content (เนื้อหาหลักด้านขวา) */}
      <div
        className={`flex-1 transition-all duration-300`}
        style={{ marginLeft: drawerOpen ? "18rem" : "0" }}
      >
        {/* 
          ส่วนของเนื้อหาเว็บไซต์ด้านขวา
          - flex-1 = กินพื้นที่ทั้งหมดที่เหลือจาก Drawer
          - มีเอฟเฟกต์ transition เพื่อให้เลื่อนสวย ๆ เวลาปิด/เปิด Drawer
          - ถ้า Drawer เปิด จะขยับเนื้อหาไปด้านขวา 18rem
        */}

        <main>
          {/* Hero Section: ส่วนต้อนรับใหญ่ เต็มหน้าจอ */}
          <section
            className="relative h-screen w-full overflow-hidden bg-cover bg-center bg-fixed fade-in"
            style={{ backgroundImage: "url('/backgroud2.png')" }}
          >
            {/* 
              Hero Section คือส่วนบนสุดของหน้าเว็บไซต์
              - มีพื้นหลังเป็นรูปภาพ
              - h-screen = สูงเท่าหนึ่งหน้าจอแบบเต็ม ๆ
              - bg-fixed = ทำให้ภาพพื้นหลังไม่เลื่อน (Parallax effect)
            */}

            {/* Layer สีทับพื้นหลังเพื่อทำให้ข้อความอ่านง่ายขึ้น */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#2563EB]/80 to-[#60A5FA]/70 opacity-60"></div>
            {/* 
              สร้าง Gradient ไล่สีแบบสีน้ำเงินทับบนภาพพื้นหลัง
              ช่วยเพิ่มความสวยงามและทำให้ข้อความด้านหน้าชัดขึ้น
            */}

            {/* เนื้อหาที่อยู่บนพื้นหลัง */}
            <div className="relative z-[1] w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between max-w-7xl mx-auto px-6 text-white">
              {/* 
                z-[1] = ให้อยู่เหนือเลเยอร์ Gradient
                layout แบบ flex:
                  - มือถือ: เรียงจากบนลงล่าง (column)
                  - จอใหญ่: ซ้าย–ขวา (row)
                text-white = ตัวหนังสือสีขาวทั้งหมด
              */}

              {/* ข้อความด้านซ้าย */}
              <div className="w-full md:w-3/5 space-y-6 text-center md:text-left">
                {/* 
                  ส่วนข้อความต้อนรับ
                  มีหัวข้อใหญ่ + คำอธิบาย
                  space-y-6 = ระยะห่างระหว่างบล็อกข้อความ
                */}

                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                  ยินดีต้อนรับสู่{" "}
                  <span className="block text-blue-100">Siam Archive (Admin)</span>
                </h1>
                {/* 
                  หัวข้อใหญ่สุดของหน้า
                  drop-shadow = เพิ่มเงาให้อ่านง่าย
                */}

                <p className="text-lg md:text-xl font-light max-w-md mx-auto md:mx-0 text-blue-100">
                  จัดการ ดูแล และตรวจสอบระบบงานวิจัยและผู้ใช้ทั้งหมดได้จากที่นี่
                </p>
                {/* ข้อความอธิบายเพิ่มเติม */}

                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                  {/* 
                    ส่วนของปุ่มกด 2 ปุ่ม (ตรวจสอบ user / ตรวจสอบงานวิจัย)
                    บนมือถือเรียงบน–ล่าง
                    จอใหญ่เรียงซ้าย–ขวา
                  */}

                  <Link
                    href="/verify-user"
                    className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.05]"
                  >
                    ตรวจสอบ user
                  </Link>
                  {/* 
                    ปุ่มไปหน้า "ตรวจสอบผู้ใช้"
                    - สีพื้นขาว
                    - ตัวอักษรน้ำเงิน
                    - hover แล้วขยายเล็กน้อย (scale 1.05)
                  */}

                  <Link
                    href="/verify-research"
                    className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-xl hover:bg-blue-700 transition duration-300 transform hover:scale-[1.05]"
                  >
                    ตรวจสอบงานวิจัย
                  </Link>
                  {/* ปุ่มไปหน้า "ตรวจสอบงานวิจัย" */}
                </div>
              </div>

              {/* รูปภาพฝั่งขวา */}
              <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-10 md:mt-0">
                {/* 
                  ส่วนรูปภาพโลโก้
                  มือถือ: อยู่ตรงกลาง
                  จอใหญ่: อยู่ฝั่งขวา
                */}

                <div className="bg-white p-2 rounded-2xl shadow-2xl w-[320px] h-[320px] flex items-center justify-center hover:shadow-blue-400/40 transition duration-500 overflow-hidden fade-in">
                  {/* 
                    กล่องใส่ภาพ
                    - พื้นขาว
                    - ขอบโค้งมน
                    - เงาเข้ม (shadow-2xl)
                    - hover แล้วเงามีน้ำเงิน
                  */}

                  <div className="relative w-full h-full">
                    <Image
                      src="/siam_archive.png"
                      alt="Siam Archive Admin"
                      fill
                      unoptimized
                      priority
                      className="object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                    />
                    {/* 
                      แสดงโลโก้ระบบ
                      - fill = เติมภาพให้เต็มกรอบ
                      - hover ขยายเล็กน้อย
                      - ปรับมุมโค้งมน
                    */}
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
