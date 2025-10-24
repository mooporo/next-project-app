"use client";

import Drawer from "./Drawer";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DrawerWrapper({ children }) {
    // 1. ใช้ Hook เพื่อดึงเส้นทางปัจจุบัน
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // 2. ตรวจสอบเงื่อนไขการซ่อน
    // เช็คว่า pathname ตรงกับ /login หรือ /register หรือไม่
    const isAuthPage = pathname === '/login' || pathname === '/register';

    // 3. Conditional Rendering: ถ้าเป็นหน้า Auth ให้แสดงแค่ Children
    if (isAuthPage) {
        return (
            // แสดงแค่เนื้อหาหลัก (children) โดยไม่มี Drawer หรือ Layout
            <main className="w-full min-h-screen">
                {children}
            </main>
        );
    }
    
    // 4. ถ้าไม่ใช่หน้า Auth ให้แสดง Drawer และ Layout ปกติ
    return (
        <>
            <div className="relative w-full">
                {/* Drawer Component */}
                <Drawer onToggle={setIsOpen} /> 
                
                {/* Main Content พร้อม Class สำหรับเลื่อนหนี Drawer */}
                <main className={`flex-1 transition-all duration-250 bg-white min-h-screen ${
                        isOpen ? "ml-72" : "ml-0"
                    }`}
                >
                    {children}
                </main>
            </div>
        </>
    );
}