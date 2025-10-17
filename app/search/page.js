import React, { useState, useEffect } from 'react';
import { Search, Upload, Home, Eye, MessageSquare, Menu } from 'lucide-react';

// โครงสร้างหลักของหน้าค้นหา
const SearchPage = () => {
  // จำลองข้อมูลผลการค้นหา
  const researchResults = [
    { title: 'ชื่องานวิจัยตัวอย่าง 1', views: 154, comments: 23, id: 1 },
    { title: 'ชื่องานวิจัยตัวอย่าง 2', views: 120, comments: 5, id: 2 },
    { title: 'ชื่องานวิจัยตัวอย่าง 3', views: 88, comments: 10, id: 3 },
    { title: 'ชื่องานวิจัยตัวอย่าง 4', views: 210, comments: 40, id: 4 },
    { title: 'ชื่องานวิจัยตัวอย่าง 5', views: 95, comments: 15, id: 5 },
    { title: 'ชื่องานวิจัยตัวอย่าง 6', views: 130, comments: 8, id: 6 },
  ];

  const keywordTags = [
    'AI', 'Big Data', 'Robotics', 'IoT', 'Machine Learning', 'Cyber Security', 'Blockchain', 'Cloud Computing'
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* 1. Navbar / Header (แถบเมนูสีน้ำเงินเข้ม) */}
      <header className="bg-blue-800 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold text-white tracking-wider">
            Siam Archive
          </div>
          <nav className="hidden md:flex space-x-6 text-lg">
            <a href="#" className="hover:text-blue-200 transition duration-150">Home</a>
            <a href="#" className="hover:text-blue-200 transition duration-150">Search</a>
            <a href="#" className="hover:text-blue-200 transition duration-150">Upload</a>
            <a href="#" className="hover:text-blue-200 transition duration-150">Profile</a>
          </nav>
          <div className="md:hidden">
            <Menu className="w-6 h-6 text-white cursor-pointer" />
          </div>
        </div>
      </header>

      {/* 2. Main Content Area (Layout 2 คอลัมน์) */}
      <main className="container mx-auto px-4 py-8">
        <div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 
                     bg-blue-950 p-6 rounded-xl shadow-2xl 
                     bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-color-blue-900)_0%,_var(--tw-color-gray-900)_100%)]"
        >
          {/* 2.1. Left Sidebar (ค้นหาและคีย์เวิร์ด) - คอลัมน์ 1 */}
          {/* ใช้ bg-gray-900/80 เพื่อจำลองความเข้มของ Sidebar */}
          <div className="lg:col-span-1 space-y-0 rounded-xl bg-gray-900 bg-opacity-80 overflow-hidden">
            
            {/* อัพโหลดงานวิจัย - ใช้สีน้ำเงินสดใสตามภาพ */}
            <div className="p-4 bg-blue-700 shadow-xl hover:bg-blue-600 transition duration-200 cursor-pointer text-center mb-6">
              <Upload className="w-6 h-6 inline mr-2" />
              <span className="text-xl font-semibold">อัพโหลดงานวิจัย</span>
            </div>

            {/* ส่วนค้นหา/ฟิลเตอร์ - เพิ่ม padding รอบด้าน */}
            <div className="space-y-4 px-4 pb-6">
              {/* ปรับ Label เป็นสีขาวสนิทตามภาพ */}
              <h3 className="text-lg font-bold text-white">ค้นหาด้วยชื่อ:</h3>
              <input
                type="text"
                placeholder="กรอกชื่องานวิจัย..."
                // พื้นหลังขาว
                className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              
              {/* ปรับ Label เป็นสีขาวสนิทตามภาพ */}
              <h3 className="text-lg font-bold text-white pt-2">คีย์เวิร์ด (ประเภท):</h3>
              <select
                // พื้นหลังขาว
                className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 appearance-none pr-10"
              >
                <option value="">เลือกคีย์เวิร์ดหลัก...</option>
                <option value="tech">เทคโนโลยี</option>
                <option value="health">สุขภาพ</option>
                <option value="social">สังคมศาสตร์</option>
              </select>
              
              <button 
                // ปุ่มสีน้ำเงินเข้ม/ดำ ตามภาพ
                className="w-full flex items-center justify-center p-3 mt-6 bg-blue-900 rounded-lg text-xl font-bold 
                           shadow-md hover:bg-blue-700 transition duration-200 active:scale-95"
              >
                <Search className="w-5 h-5 mr-2" />
                ค้นหา
              </button>
            </div>

            {/* คีย์เวิร์ดแนะนำ - แถบสีน้ำเงินเต็มความกว้าง */}
            <div> 
              {/* Blue Header Bar for Keywords - ใช้สีน้ำเงินสดใสตามภาพ */}
              <div className="bg-blue-700 p-3 shadow-xl">
                <h2 className="text-xl font-bold text-white text-center">คีย์เวิร์ด</h2>
              </div>
              
              {/* Grid of Keyword Buttons */}
              <div className="grid grid-cols-2 gap-3 p-4"> 
                {keywordTags.map((tag, index) => (
                  <button
                    key={index}
                    // ปุ่มสีน้ำเงินสดใสตามภาพ
                    className="p-3 text-sm bg-blue-700 rounded-lg shadow-lg hover:bg-blue-600 transition duration-150 active:scale-95 text-white" 
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2.2. Main Results Grid (ผลการค้นหางานวิจัย) - คอลัมน์ 2, 3, 4 */}
          {/* ปรับ Grid เป็น 3 คอลัมน์ในหน้าจอใหญ่ตามภาพ */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {researchResults.map((item) => (
              <ResearchCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Component สำหรับแสดงผลการวิจัยแต่ละรายการ
const ResearchCard = ({ item }) => {
  return (
    // ปรับ Card ให้เป็นสีเทาอ่อน/ขาว ตามภาพ
    <div className="bg-gray-200 p-5 rounded-xl shadow-xl transition duration-300 flex flex-col space-y-4">
      {/* ชื่องานวิจัย - Text สีดำ ตามภาพ */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
      
      {/* รูปภาพ Placeholder - Background เทาอ่อน, icon ดำ */}
      <div className="w-full h-40 bg-gray-400 rounded-lg flex items-center justify-center overflow-hidden">
        {/* ไอคอน Placeholder Image */}
        <svg className="w-16 h-16 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>

      {/* Views และ Comments */}
      <div className="flex justify-start space-x-6 text-base text-gray-700 mt-2">
        <span className="flex items-center">
          <Eye className="w-5 h-5 mr-1 text-gray-700" />
          Views: <span className="text-gray-900 ml-1">{item.views}</span>
        </span>
        <span className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-1 text-gray-700" />
          Comments: <span className="text-gray-900 ml-1">{item.comments}</span>
        </span>
      </div>
    </div>
  );
}

export default SearchPage;
