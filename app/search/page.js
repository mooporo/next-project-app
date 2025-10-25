"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ต้อง import useRouter
import { supabase } from "../lib/supabaseClient"; // ✅ KLA : import Supabase client

// --- mock data สำหรับใช้ทดสอบ ResearchCard Component ---
// / --- mock data สำหรับใช้ทดสอบ ResearchCard Component ---
// const researchData = [
//   { id: 1, coverColor: "bg-indigo-600", title: "การพัฒนาระบบแนะนำร้านอาหาร...", author: "สมศักดิ์ รักษ์ใจ", views: 1204, comments: 15, date: "17 ต.ค. 2568" },
//   { id: 2, coverColor: "bg-green-600", title: "ผลกระทบของ Climate Change ...", author: "อลิสา ใจดี", views: 980, comments: 8, date: "28 ก.ย. 2568" },
//   { id: 3, coverColor: "bg-purple-600", title: "ศึกษาแนวคิด Blockchain กับระบบ...", author: "วิทยา พัฒนาดี", views: 765, comments: 22, date: "1 ต.ค. 2568" },
//   { id: 4, coverColor: "bg-red-500", title: "เทคนิคการทำครัวซองต์ยุคใหม่", author: "มานี มีสุข", views: 550, comments: 10, date: "5 ต.ค. 2568" },
//   { id: 5, coverColor: "bg-yellow-600", title: "การจัดการข้อมูล Big Data ในองค์กร", author: "ชูใจ ใจดี", views: 1500, comments: 30, date: "10 พ.ย. 2568" },
//   { id: 6, coverColor: "bg-sky-600", title: "ปัญญาประดิษฐ์กับการแพทย์แผนไทย", author: "สมชาย ชอบเรียน", views: 800, comments: 5, date: "18 ธ.ค. 2568" },
//   { id: 7, coverColor: "bg-pink-600", title: "พฤติกรรมผู้บริโภคออนไลน์ Gen Z", author: "กอล์ฟ ซ่าส์", views: 2000, comments: 50, date: "1 ม.ค. 2569" },
//   { id: 8, coverColor: "bg-orange-600", title: "การออกแบบเว็บไซต์ที่เข้าถึงง่าย (A11Y)", author: "โอ๊ต ตันติ", views: 900, comments: 12, date: "15 ก.พ. 2569" },
//   { id: 9, coverColor: "bg-teal-600", title: "อนาคตของพลังงานหมุนเวียนในเอเชีย", author: "ปลา วาฬ", views: 1100, comments: 18, date: "22 มี.ค. 2569" },
// ];

// KLA : keywords for dropdown
const keywords = ["AI", "Big Data", "Blockchain", "Web Design", "Climate Change", "พลังงานหมุนเวียน"];

// --- Research Card Component  ---
const ResearchCard = ({ item, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer"
    onClick={() => onClick(item)} // ✅ เมื่อคลิก card จะเรียก handleView
  >
    <div className="h-40 flex items-center justify-center bg-gray-200">
      <img
        src={item.paper_image || "/no-image.png"}
        alt={item.paper_title}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="p-4 space-y-2">
      <h3 className="text-gray-900 font-bold text-lg leading-snug truncate">
        {item.paper_title}
      </h3>
      <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>{item.paper_views?.toLocaleString() || 0}</span>
          </div>
        </div>
        <span className="text-xs">
          {item.created_at ? new Date(item.created_at).toLocaleDateString("th-TH") : "-"}
        </span>
      </div>
    </div>
  </div>
);

// KLA : Pagination Component ใช้สำหรับแบ่งหน้า 1 2 3 ...
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
        ◀
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
        ▶
      </button>
    </div>
  );
};

export default function SearchPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [inputTerm, setInputTerm] = useState(""); //KLA :คำค้นหาจาก input
  const [searchTerm, setSearchTerm] = useState(""); // KLA : คำค้นหาที่ใช้กรองข้อมูล
  const [selectedKeyword, setSelectedKeyword] = useState(""); //  KLA :คีย์เวิร์ดที่เลือกจาก dropdown
  const itemsPerPage = 6;

  // 🟢 KLA : ดึงข้อมูลจาก Supabase จริง
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);


  // KLA : ฟังก์ชันดึงข้อมูลงานวิจัยจาก Supabase
  const fetchResearchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("paper_tb")
      .select("paper_id, user_id, paper_title, paper_image, paper_views, created_at") // เลือกเฉพาะฟิลด์ที่ต้องการมาเพื่อแสดงผล
      .order("created_at", { ascending: false }); // เรียงลำดับจากใหม่ไปเก่า

    if (error) {
      console.error("❌ Error fetching data:", error);  
    } else {
      setResearchData(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResearchData();
  }, []);

  // KLA : เมื่อคลิกการ์ด → เพิ่ม paper_views +1
  const handleView = async (item) => {
    const newViews = (item.paper_views || 0) + 1;

    const { error } = await supabase
      .from("paper_tb")
      .update({ paper_views: newViews })
      .eq("paper_id", item.paper_id);

    if (error) {
      console.error("❌ Error updating views:", error);
      return;
    }

    // อัปเดตใน state เพื่อให้เห็นผลทันที
    setResearchData((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, paper_views: newViews } : r
      )
    );

    // ไปหน้าแสดงรายละเอียด (ภายหลังจะสร้างจริง)
    router.push(`/research/${item.id}`);
  };

  // KLA : กรองข้อมูลตามคำค้นหาและคีย์เวิร์ดที่เลือก
  const filteredData = researchData.filter(
    (item) =>
      item.paper_title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedKeyword ? item.paper_title?.toLowerCase().includes(selectedKeyword.toLowerCase()) : true)
  );

  const startIndex = (currentPage - 1) * itemsPerPage; // KLA : คำนวณดัชนีเริ่มต้นของหน้าปัจจุบัน
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage); // KLA : ดึงข้อมูลของหน้าปัจจุบัน

  // KLA : ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(filteredData.length / itemsPerPage)) return;
    setCurrentPage(page);
  };

  // KLA : ฟังก์ชันใช้สำหรับการค้นหางานวิจัย
  const handleSearch = () => {
    setSearchTerm(inputTerm);
    setCurrentPage(1);
  };

  // KLA : ฟังก์ชันจับการกดปุ่ม Enter ในช่องค้นหา
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // KLA : ฟังก์ชันล้างการค้นหา
  const handleClear = () => {
    setInputTerm("");
    setSelectedKeyword("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    // KLA : หน้า Search Page
    <div className="min-h-screen bg-gray-50 font-[Inter] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-gray-800">คลังงานวิจัย</h1>
          <button
            onClick={() => router.push("/upload")} // KLA : เปลี่ยนเส้นทางไปยังหน้าอัพโหลด
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition duration-150 flex items-center space-x-2"
          >
            <span>อัพโหลดงานวิจัย</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-stretch">
          <div className="flex items-center border border-gray-300 rounded-lg flex-grow px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อเรื่อง..."
              className="w-full focus:outline-none text-gray-700"
              value={inputTerm}
              onChange={(e) => setInputTerm(e.target.value)} // KLA : อัพเดตคำค้นหา
              onKeyDown={handleKeyDown} // KLA : จับการกดปุ่ม Enter
            />
          </div>

          {/* KLA : Dropdown สำหรับเลือกคีย์เวิร์ด */}
          <select
            value={selectedKeyword}
            onChange={(e) => {
              setSelectedKeyword(e.target.value); // KLA : อัพเดตคีย์เวิร์ดที่เลือก
              setCurrentPage(1); // KLA : กลับไปหน้าแรกเมื่อเปลี่ยนคีย์เวิร์ด
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
          >
            <option value="">-- เลือกคีย์เวิร์ด --</option>
            {keywords.map((kw) => (
              <option key={kw} value={kw}>
                {kw}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch} // KLA : เรียกใช้ฟังก์ชันค้นหา
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition duration-150 min-w-[100px]"
          >
            ค้นหา
          </button>
          
          <button
            onClick={handleClear} // KLA : เรียกใช้ฟังก์ชันล้างการค้นหา
            className="bg-red-600 text-white text-gray-700 px-6 py-2 rounded-lg font-medium shadow-md hover:bg-red-700 transition duration-150 min-w-[100px]"
          >
            ล้างการค้นหา
          </button>
        </div>

        {/* Research Grid */}
        {loading ? (
          <p className="text-center text-gray-500 py-12">กำลังโหลดข้อมูล...</p>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentItems.map((item) => (
              <ResearchCard key={item.id} item={item} onClick={handleView} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">ไม่พบงานวิจัยที่ตรงกับคำค้น</p>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-gray-600 pb-8">
          <span className="font-medium text-gray-700">
            แสดง{" "}
            <span className="text-blue-600">
              {filteredData.length === 0
                ? 0
                : `${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredData.length)}`}
            </span>{" "}
            จาก {filteredData.length} รายการ
          </span>

          <Pagination
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
