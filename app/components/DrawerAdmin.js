"use client";

import React, { useState, useEffect } from "react";
import { Notebook, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth";

// ================= Drawer Item =================
const DrawerItem = ({ icon: Icon, label, isActive, onClick, disabled }) => {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center p-3 rounded-lg transition-colors 
        ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}
        ${disabled ? "cursor-not-allowed opacity-50 pointer-events-none" : "cursor-pointer"}
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-sm">{label}</span>
    </div>
  );
};

// ================= DrawerAdmin =================
const DrawerAdmin = ({ isOpen: parentIsOpen, onToggle }) => {
  const [isOpen, setIsOpen] = useState(parentIsOpen || false);
  const [activeMenuKey, setActiveMenuKey] = useState("checkUser");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const adminMenu = [
    { name: "ตรวจสอบ user", icon: User, key: "checkUser", path: "/admin/users" },
    { name: "ตรวจสอบงานวิจัย", icon: Notebook, key: "checkResearch", path: "/admin/research" },
  ];

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    router.replace("/login-admin");
  };

  // sync กับ parent
  useEffect(() => {
    setIsOpen(parentIsOpen);
  }, [parentIsOpen]);

  // แจ้ง Wrapper ทุกครั้งที่เปิด/ปิด drawer
  const toggleDrawer = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (typeof onToggle === "function") onToggle(newState);
  };

  return (
    <>
      {/* ปุ่มเปิด Drawer */}
      <button
        onClick={toggleDrawer}
        className="p-4 text-2xl text-black rounded-lg fixed top-4 left-4 z-50 cursor-pointer hover:bg-gray-200 transition-colors"
      >
        ☰
      </button>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl overflow-hidden z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-grow p-4 space-y-6 overflow-y-auto">
          {/* ปุ่มปิด Drawer */}
          <div className="flex flex-row items-center mb-4">
            <button
              onClick={toggleDrawer}
              className="p-2 text-2xl text-black rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
            >
              ☰
            </button>
          </div>

          {/* เมนู Admin */}
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400 mb-2">เมนู</h2>
            <div className="space-y-1">
              {adminMenu.map((item) => (
                <DrawerItem
                  key={item.key}
                  icon={item.icon}
                  label={item.name}
                  isActive={activeMenuKey === item.key}
                  onClick={() => {
                    setActiveMenuKey(item.key);
                    router.push(item.path);
                  }}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Footer / โปรไฟล์ */}
        <div className="p-4 border-t border-gray-200 relative">
          <div
            onClick={() => setIsProfileMenuOpen(prev => !prev)}
            className="flex items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div className="p-0 bg-gray-300 rounded-full w-10 h-10 overflow-hidden">
              {user?.user_image ? (
                <img
                  src={supabase.storage.from("user_bk").getPublicUrl(user.user_image).data.publicUrl}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full text-gray-600" />
              )}
            </div>
            <span className="ml-3 font-medium text-gray-800 truncate">{user ? user.username : "Admin"}</span>
          </div>

          {isProfileMenuOpen && (
            <div className="absolute bottom-16 left-4 w-60 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-50">
              <div
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
              >
                ออกจากระบบ
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DrawerAdmin;
