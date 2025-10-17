"use client";

import React, { useState } from 'react';
import { Home, Notebook, Settings, Shuffle, LayoutList, Plus, User } from 'lucide-react';

// ข้อมูลเมนูนำทาง
const mainMenuItems = [
  { name: 'หน้าหลัก', icon: Home, key: 'home' },
  { name: 'ห้องสมุด', icon: Notebook, key: 'library' },
];

// ข้อมูลเมนูฟังก์ชัน
const functionMenuItems = [
  { name: 'เปรียบเทียบเนื้อหา', icon: Shuffle, key: 'compare' },
  { name: 'ตั้งข้อมูล', icon: Settings, key: 'config' },
  { name: 'สร้างแผนภาพ', icon: LayoutList, key: 'diagram' },
];

// ข้อมูลประวัติการสนทนา (จำลอง)
const dummyHistory = [
  { id: '1', title: 'ถามเกี่ยวกับคนขี้สงสัย', active: true },
  { id: '2', title: 'ถามเกี่ยวกับคนขี้สงสัย', active: false },
  { id: '3', title: 'หัวข้อการวิจัยใหม่', active: false },
];

// คอมโพเนนต์สำหรับแต่ละรายการเมนู
const DrawerItem = ({ icon: Icon, label, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`
      flex items-center p-3 cursor-pointer rounded-lg transition-colors
      ${isActive
        ? 'bg-blue-100 text-blue-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-100'
      }
    `}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span className="text-sm">{label}</span>
  </div>
);

// คอมโพเนนต์สำหรับรายการประวัติการสนทนา
const HistoryItem = ({ title, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`
      flex items-center py-2 px-3 pl-6 cursor-pointer rounded-lg transition-colors
      ${isActive
        ? 'bg-blue-100 text-blue-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-100'
      }
      text-sm truncate
    `}
    title={title}
  >
    <span className="mr-2">•</span>
    {title}
  </div>
);

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState('home');
  const [activeHistoryId, setActiveHistoryId] = useState(dummyHistory[0].id);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white bg-gray-800 rounded-md fixed top-4 left-4 z-40 shadow-lg"
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl overflow-hidden z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Navigation */}
        <div className="flex-grow p-4 space-y-6 overflow-y-auto">

          {/* Main Menu */}
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">เมนู</h2>
            <div className="space-y-1">
              {mainMenuItems.map(item => (
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

          {/* Function Menu */}
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">ฟังก์ชัน</h2>
            <div className="space-y-1">
              {functionMenuItems.map(item => (
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

          {/* New Chat Button */}
          <button className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            <span>แชทใหม่</span>
          </button>

          {/* History */}
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">ประวัติการแชท</h2>
            <div className="space-y-1">
              {dummyHistory.map(item => (
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="p-2 bg-gray-300 rounded-full">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <span className="ml-3 font-medium text-gray-800 truncate" title="Anonymous01">Anonymous01</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
