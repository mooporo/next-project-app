"use client";

//เจมส์ : เพิ่ม uuidv4 เพื่อเจนรหัส session ใหม่ทุกครั้งที่มีการกด "แชทใหม่"
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
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
    className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors ${isActive
      ? "bg-blue-100 text-blue-700 font-semibold"
      : "text-gray-600 hover:bg-gray-100"
      }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span className="text-sm">{label}</span>
  </div>
);

const HistoryItem = ({ title, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center py-2 px-3 pl-6 cursor-pointer rounded-lg transition-colors ${isActive
      ? "bg-blue-100 text-blue-700 font-semibold"
      : "text-gray-600 hover:bg-gray-100"
      } text-sm truncate`}
    title={title}
  >
    <span className="mr-2">•</span>
    {title}
  </div>
);

//เจมส์ : เพิ่ม useEffect สำหรับเรียกค่า isOpen จาก Wrapper.js
/**
 * @param {{ onToggle?: (open: boolean) => void }} props
 */

const Drawer = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState("home");
  const [chatHistory, setChatHistory] = useState([]); //setActiveHistoryId
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = "Anonymous01";
  const user_id = 129;

  //เจมส์ : เพิ่มตัวแปรเก็บ router
  const router = useRouter();

  //เจมส์ : เพิ่ม useEffect สำหรับเรียกค่า isOpen จาก Wrapper.js
  useEffect(() => {
    // ตรวจสอบว่า onToggle ถูกส่งมาและเป็นฟังก์ชันหรือไม่
    if (typeof onToggle === 'function') {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);

  //เจมส์ : ดึงประวัติแชทจากฐานข้อมูล
  useEffect(() => {
    const getAllChatSessionByUserId = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_session_tb')
          .select('*')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching chat session:', error);
        } else {
          console.log(data);
          setChatHistory(data);
        }

      } catch (error) {
        console.error('Error fetching chat session:', error);
      }
    }

    getAllChatSessionByUserId();
  }, [user_id])

  // เจมส์ : เพิ่มดึง session แบบ realtime เมื่อมีการเพิ่มแชท
  useEffect(() => {
    //สร้าง channel รับ boardcast
    const channel = supabase
      .channel('chat_session_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_session_tb', filter: `user_id=eq.${user_id}` },
        (payload) => {
          // โหลดข้อมูลที่ insert มาเก็บ
          const newSession = payload.new;
          setChatHistory(prevHistory => [newSession, ...prevHistory]);
        }
      )
      .subscribe();

    // ลบ channel
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user_id]);

  //เจมส์ : สร้าง function ไปยัง chat/session_id
  const handleClickNewChat = () => {
    const new_session_id = uuidv4();
    router.push(`/chat/${new_session_id}`);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger */} {/*เจมส์ : แก้ไข UI ปุ่มให้ hover ได้*/}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 text-2xl text-black rounded-lg fixed top-4 left-4 z-50 cursor-pointer hover:bg-gray-200 transition-colors"
      >
        ☰
      </button>

      {/*เจมส์ : ตัด Overlay ออกไปแล้ว*/}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl overflow-hidden z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex-grow p-4 space-y-6 overflow-y-auto">

          {/*เจมส์ : เอาปุ่มมาใส่ใน Drawer*/}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-2xl text-black rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          >
            ☰
          </button>

          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">
              เมนู
            </h2>
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
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">
              ฟังก์ชัน
            </h2>
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

          {/* ✅ แก้เฉพาะปุ่ม “แชทใหม่” ให้ลิงก์ไป /chat */} {/*เจมส์ : เพิ่ม Link ไป /chat/$session_id*/}
          <button
            onClick={handleClickNewChat}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
            <Plus className="w-5 h-5 mr-2" /> แชทใหม่
          </button>

          {/*เจมส์ : เพิ่ม mt-5 เนื่องจากเห็นการเยื่องไม่ถูกต้อง*/}
          <section className="mt-5">
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">
              ประวัติการแชท
            </h2>
            <div className="space-y-1">
              {chatHistory.map((item) => (
                <HistoryItem
                  key={item.session_id}
                  title={item.session_name}
                  isActive={chatHistory === item.session_id}
                  onClick={() => router.push(`/chat/${item.session_id}`)}
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
                  <div onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">ออกจากระบบ</div>
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
                  <div onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">ออกจากระบบ</div>
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
