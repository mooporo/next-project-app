"use client";

import React, { useState } from "react";
import { Home, Notebook, Settings, Shuffle, LayoutList, Plus, User, LogIn, UserPlus } from "lucide-react";

// ================= Drawer Data =================
const mainMenuItems = [
  { name: "หน้าหลัก", icon: Home, key: "home" },
  { name: "ห้องสมุด", icon: Notebook, key: "library" },
];

const functionMenuItems = [
  { name: "เปรียบเทียบเนื้อหา", icon: Shuffle, key: "compare" },
  { name: "ตั้งข้อมูล", icon: Settings, key: "config" },
  { name: "สร้างแผนภาพ", icon: LayoutList, key: "diagram" },
];

const dummyHistory = [
  { id: "1", title: "ถามเกี่ยวกับคนขี้สงสัย" },
  { id: "2", title: "ถามเกี่ยวกับคนขี้สงสัย" },
  { id: "3", title: "หัวข้อการวิจัยใหม่" },
];

// ================= Drawer Items =================
const DrawerItem = ({ icon: Icon, label, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
      }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span className="text-sm">{label}</span>
  </div>
);

const HistoryItem = ({ title, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center py-2 px-3 pl-6 cursor-pointer rounded-lg transition-colors ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
      } text-sm truncate`}
    title={title}
  >
    <span className="mr-2">•</span>
    {title}
  </div>
);


const Drawer = ({ isOpen, setIsOpen }) => {
  const [activeMenuKey, setActiveMenuKey] = useState("home");
  const [activeHistoryId, setActiveHistoryId] = useState(dummyHistory[0].id);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = "Anonymous01";

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 text-3xl text-white bg-gray-800 rounded-md fixed top-4 left-4 z-50 shadow-lg"
      >
        ☰ Siam Archive
      </button>
      

      {/* Overlay */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-40"></div>}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl overflow-hidden z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex-grow p-4 space-y-6 overflow-y-auto">
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">เมนู</h2>
            <div className="space-y-1">
              {mainMenuItems.map((item) => (
                <DrawerItem
                  key={item.key}
                  icon={item.icon}
                  label={item.name}
                  isActive={activeMenuKey === item.key}
                  onClick={() => setActiveMenuKey(item.key)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">ฟังก์ชัน</h2>
            <div className="space-y-1">
              {functionMenuItems.map((item) => (
                <DrawerItem
                  key={item.key}
                  icon={item.icon}
                  label={item.name}
                  isActive={activeMenuKey === item.key}
                  onClick={() => setActiveMenuKey(item.key)}
                />
              ))}
            </div>
          </section>

          <hr className="border-gray-200" />

          <button className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
            <Plus className="w-5 h-5 mr-2" /> แชทใหม่
          </button>

          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">ประวัติการแชท</h2>
            <div className="space-y-1">
              {dummyHistory.map((item) => (
                <HistoryItem
                  key={item.id}
                  title={item.title}
                  isActive={activeHistoryId === item.id}
                  onClick={() => setActiveHistoryId(item.id)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 relative">
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div className="p-2 bg-gray-300 rounded-full">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <span className="ml-3 font-medium text-gray-800 truncate" title={username}>
              {isLoggedIn ? username : "Guest"}
            </span>
          </div>

          {isProfileMenuOpen && (
            <div className="absolute bottom-16 left-4 w-60 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">ดูโปรไฟล์</div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">ประวัติการอัพโหลด</div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">ตั้งค่า</div>
                  <div onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                    ออกจากระบบ
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <LogIn className="w-4 h-4 mr-2" /> เข้าสู่ระบบ
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" /> ลงทะเบียน
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">ตั้งค่า</div>
                  <div onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                    ออกจากระบบ
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Drawer;
