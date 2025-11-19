"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  // --- State ---
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("thai");

  const handleThemeChange = (event) => {
    const selected = event.target.value;
    setTheme(selected);

    if (selected === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", selected);
  };
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSave = () => {
    console.log("--- บันทึกการตั้งค่าแล้ว (Mock Save) ---");
    console.log("การแสดงผล:", { theme, language });
  };

  const handleDelete = () => {
    console.log("--- ดำเนินการลบบัญชี (Mock Delete) ---");
    console.log("บัญชีถูกลบแล้ว (ต้องมี confirmation modal จริง)");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto settings-container">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-4">
        การตั้งค่า
      </h1>

      {/* การแสดงผล */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">การแสดงผล</h2>

        {/* ธีม */}
        <div className="mb-6">
          <p className="font-semibold text-gray-800 mb-3">ธีม (Theme)</p>
          <div className="flex flex-wrap gap-3" id="theme_radio_group">
            <label
              className={`flex items-center px-4 py-2 border-2 rounded-lg cursor-pointer transition-all flex-shrink-0 ${theme === "light"
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name="theme"
                value="light"
                className="text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                checked={theme === "light"}
                onChange={handleThemeChange}
              />
              <span className="text-sm font-medium whitespace-nowrap">☀️ สว่าง (Light)</span>
            </label>

            <label
              className={`flex items-center px-4 py-2 border-2 rounded-lg cursor-pointer transition-all flex-shrink-0 ${theme === "dark"
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name="theme"
                value="dark"
                className="text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                checked={theme === "dark"}
                onChange={handleThemeChange}
              />
              <span className="text-sm font-medium whitespace-nowrap">🌙 มืด (Dark)</span>
            </label>

            <label
              className={`flex items-center px-4 py-2 border-2 rounded-lg cursor-pointer transition-all flex-shrink-0 ${theme === "system"
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name="theme"
                value="system"
                className="text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                checked={theme === "system"}
                onChange={handleThemeChange}
              />
              <span className="text-sm font-medium whitespace-nowrap">💻 ตามระบบ</span>
            </label>
          </div>
        </div>

        {/* ภาษา */}
        <div>
          <p className="font-semibold text-gray-800 mb-3">ภาษา (Language)</p>
          <div className="relative w-full sm:w-64">
            <select
              id="language_select"
              value={language}
              onChange={handleLanguageChange}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="thai">ภาษาไทย (Thai)</option>
              <option value="english">ภาษาอังกฤษ (English)</option>
              <option value="chinese">ภาษาจีน (Chinese)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* การจัดการบัญชี */}
      <div className="bg-red-50 p-6 rounded-xl shadow-md border border-red-300 mb-24">
        <h2 className="text-xl font-bold mb-4 text-red-700">การจัดการบัญชี</h2>
        <div>
          <p className="font-semibold text-red-800 mb-2">ลบบัญชีผู้ใช้งาน</p>
          <p className="text-sm text-red-500 max-w-lg mb-4">
            การดำเนินการนี้ไม่สามารถย้อนกลับได้ ข้อมูลผู้ใช้งานและงานวิจัยทั้งหมดของคุณจะถูกลบอย่างถาวร
          </p>

          <button
            id="delete_account_btn"
            className="flex items-center px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl delete-btn hover:bg-red-700 transition-colors"
            onClick={handleDelete}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            ฉันต้องการลบบัญชี
          </button>
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-10">
        <div className="max-w-4xl mx-auto flex justify-end">
          <button
            id="save_changes_btn"
            className="px-8 py-2.5 bg-blue-600 text-white font-semibold text-base rounded-xl hover:bg-blue-700 transition-colors shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={handleSave}
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </div>
  );
}
