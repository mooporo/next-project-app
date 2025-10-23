"use client";

import React, { useState } from "react";

// ข้อมูลจำลองสำหรับแสดงในหน้าค้นหา
const researchData = [
  { id: 1, coverColor: "bg-indigo-600", title: "การพัฒนาระบบแนะนำร้านอาหาร...", author: "สมศักดิ์ รักษ์ใจ", views: 1204, comments: 15, date: "17 ต.ค. 2568" },
  { id: 2, coverColor: "bg-green-600", title: "ผลกระทบของ Climate Change ...", author: "อลิสา ใจดี", views: 980, comments: 8, date: "28 ก.ย. 2568" },
  { id: 3, coverColor: "bg-purple-600", title: "ศึกษาแนวคิด Blockchain กับระบบ...", author: "วิทยา พัฒนาดี", views: 765, comments: 22, date: "1 ต.ค. 2568" },
  { id: 4, coverColor: "bg-red-500", title: "เทคนิคการทำครัวซองต์ยุคใหม่", author: "มานี มีสุข", views: 550, comments: 10, date: "5 ต.ค. 2568" },
  { id: 5, coverColor: "bg-yellow-600", title: "การจัดการข้อมูล Big Data ในองค์กร", author: "ชูใจ ใจดี", views: 1500, comments: 30, date: "10 พ.ย. 2568" },
  { id: 6, coverColor: "bg-sky-600", title: "ปัญญาประดิษฐ์กับการแพทย์แผนไทย", author: "สมชาย ชอบเรียน", views: 800, comments: 5, date: "18 ธ.ค. 2568" },
  { id: 7, coverColor: "bg-pink-600", title: "พฤติกรรมผู้บริโภคออนไลน์ Gen Z", author: "กอล์ฟ ซ่าส์", views: 2000, comments: 50, date: "1 ม.ค. 2569" },
  { id: 8, coverColor: "bg-orange-600", title: "การออกแบบเว็บไซต์ที่เข้าถึงง่าย (A11Y)", author: "โอ๊ต ตันติ", views: 900, comments: 12, date: "15 ก.พ. 2569" },
  { id: 9, coverColor: "bg-teal-600", title: "อนาคตของพลังงานหมุนเวียนในเอเชีย", author: "ปลา วาฬ", views: 1100, comments: 18, date: "22 มี.ค. 2569" },
];

// Component สำหรับแสดง Card งานวิจัย
const ResearchCard = ({ item }) => (
  <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300">
    <div className={`h-40 ${item.coverColor} flex items-center justify-center`}>
      <span className="text-white text-2xl font-semibold opacity-80">Research Cover</span>
    </div>
    <div className="p-4 space-y-2">
      <h3 className="text-gray-900 font-bold text-lg leading-snug truncate">{item.title}</h3>
      <p className="text-sm text-gray-500 truncate">โดย: {item.author}</p>
      <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>{item.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>{item.comments}</span>
          </div>
        </div>
        <span className="text-xs">{item.date}</span>
      </div>
    </div>
  </div>
);

// Component สำหรับ Pagination
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end items-center space-x-1 text-sm">
      <button
        className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`h-8 w-8 rounded-lg font-semibold ${
            page === currentPage ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
};

export default function SearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // คำนวณข้อมูลที่จะโชว์บนหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = researchData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(researchData.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-gray-800">คลังงานวิจัย</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition duration-150 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>อัพโหลดงานวิจัย</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-stretch">
          <div className="flex items-center border border-gray-300 rounded-lg flex-grow px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="ค้นหาด้วยชื่อเรื่อง..." className="w-full focus:outline-none text-gray-700"/>
          </div>

          <div className="relative border border-gray-300 rounded-lg flex items-center flex-grow-0 min-w-[200px]">
            <select defaultValue="" className="appearance-none w-full bg-white px-3 py-2 text-gray-700 rounded-lg focus:outline-none cursor-pointer">
              <option value="" disabled>เลือกคีย์เวิร์ด</option>
              <option value="tech">เทคโนโลยี</option>
              <option value="business">ธุรกิจ</option>
              <option value="health">สุขภาพ</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition duration-150 min-w-[100px]">ค้นหา</button>
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map((item) => (
            <ResearchCard key={item.id} item={item} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-gray-600 pb-8">
          <span className="font-medium text-gray-700">
            แสดง <span className="text-blue-600">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, researchData.length)}</span> จาก {researchData.length} รายการ
          </span>

          <Pagination
            totalItems={researchData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
