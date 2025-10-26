"use client";

import React, { useState, useEffect } from "react";
import { Search, Upload, ChevronRight, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// ✅ Component: Navbar สีฟ้าเต็มความกว้าง
const Navbar = () => (
  <div className="bg-blue-600 w-full h-16 shadow-lg fixed top-0 left-0 z-10"></div>
);

// ✅ Component สำหรับ Dropdown Filter
const FilterDropdown = ({ title, options }) => (
  <select
    className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-sm md:text-base"
  >
    <option value="" disabled>
      {title}
    </option>
    {options.map((opt, idx) => (
      <option key={idx} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// ✅ Component สำหรับ Card รายการอัปโหลด
const UploadCard = ({ title, id, date, version, status }) => {
  let statusClass = "";
  let buttonAction = { icon: Edit, text: "แก้ไข", color: "text-gray-600 hover:text-blue-600" };

  switch (status) {
    case "ตรวจรอบ":
      statusClass = "bg-yellow-100 text-yellow-800 border border-yellow-300";
      break;
    case "อนุมัติ":
      statusClass = "bg-green-100 text-green-800 border border-green-300";
      break;
    case "ต้องการแก้ไข":
      statusClass = "bg-red-100 text-red-800 border border-red-300";
      break;
    default:
      statusClass = "bg-gray-100 text-gray-800 border border-gray-300";
  }

  return (
    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-md flex flex-col justify-between h-full hover:shadow-xl transition duration-300">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 mr-4 leading-snug line-clamp-2 min-h-[50px]">{title}</h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass} whitespace-nowrap flex-shrink-0`}
          >
            {status}
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            ID: <span className="font-mono text-gray-700">{id}</span>
          </p>
          <p>
            อัปโหลดเมื่อ: <span className="font-medium">{date}</span>
          </p>
          <p>
            เวอร์ชัน: <span className="font-medium">{version}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-6">
        <button
          className={`text-sm font-medium flex items-center space-x-1 ${buttonAction.color} transition duration-150`}
          onClick={() => console.log(`Action: ${buttonAction.text} ${id}`)}
        >
          <buttonAction.icon className="w-4 h-4" />
          <span>แก้ไข</span>
        </button>

        <button
          className="text-sm font-medium text-gray-500 hover:text-red-600 transition duration-150 flex items-center space-x-1"
          onClick={() => console.log(`Action: Delete ${id}`)}
        >
          <Trash2 className="w-4 h-4" />
          <span>ลบ</span>
        </button>
      </div>
    </div>
  );
};

// ✅ Component หลักสำหรับ Page
export default function HistoryPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ ดึงข้อมูลจาก Supabase เฉพาะของ user ที่ล็อกอินอยู่
  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);

      // ✅ ดึง user ปัจจุบัน
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn("No user logged in");
        setPapers([]);
        setLoading(false);
        return;
      }

      // ✅ ดึงเฉพาะข้อมูลของ user นี้
      const { data, error } = await supabase
        .from("paper_tb")
        .select(`
          paper_id,
          paper_title,
          created_at,
          paper_status,
          paper_type_id,
          paper_category_id
        `)
        .eq("user_id", user.id) // ✅ เฉพาะของตัวเอง
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching papers:", error);
      } else {
        setPapers(
          data.map((item) => ({
            id: item.paper_id,
            title: item.paper_title,
            date: new Date(item.created_at).toLocaleString("th-TH", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
            version: "1.0",
            status:
              item.paper_status === 1
                ? "ตรวจรอบ"
                : item.paper_status === 2
                ? "อนุมัติ"
                : item.paper_status === 3
                ? "ต้องการแก้ไข"
                : "ไม่ทราบสถานะ",
          }))
        );
      }

      setLoading(false);
    };

    fetchPapers();
  }, []);

  const totalItems = papers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = papers.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Navbar />

      <div className="p-4 sm:p-8 mt-24 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">ประวัติการอัปโหลด</h1>
          <button className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition duration-150 flex items-center space-x-2 w-full sm:w-auto text-base">
            <Upload className="w-5 h-5" />
            <span>อัปโหลดไฟล์งานวิจัย</span>
          </button>
        </header>

        {/* ✅ ส่วนค้นหา + ตัวกรอง */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center border border-gray-300 rounded-xl p-3 flex-grow max-w-full md:max-w-xl bg-gray-50 shadow-inner">
            <Search className="w-5 h-5 text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="ค้นหางานวิจัย..."
              className="flex-grow text-gray-700 focus:outline-none placeholder-gray-400 bg-gray-50"
            />
          </div>
          <div className="flex flex-wrap gap-3 md:ml-auto">
            <FilterDropdown
              title="เรียงตามชื่อ"
              options={[{ label: "เรียงตามชื่อ", value: "name" }]}
            />
            <FilterDropdown
              title="เรียงตามวันที่อัปโหลด"
              options={[{ label: "เรียงตามวันที่อัปโหลด", value: "date" }]}
            />
            <FilterDropdown
              title="ประเภทงานทั้งหมด"
              options={[{ label: "ประเภทงานทั้งหมด", value: "type" }]}
            />
          </div>
        </div>

        {/* ✅ Grid แสดงรายการ */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">กำลังโหลดข้อมูล...</p>
        ) : currentData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">ยังไม่มีข้อมูลอัปโหลด</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentData.map((data, index) => (
              <UploadCard key={index} {...data} />
            ))}
          </div>
        )}

        {/* ✅ Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0">
            แสดง {startIdx + 1}-{Math.min(startIdx + itemsPerPage, totalItems)} จากทั้งหมด{" "}
            <span className="font-bold text-gray-800">{totalItems}</span> รายการ
          </p>

          <div className="flex items-center space-x-1">
            <button
              className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-50 transition duration-150"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 3)
              .map((page) => (
                <button
                  key={page}
                  className={`min-w-[40px] px-2 py-2 font-semibold rounded-lg transition duration-150 ${
                    page === currentPage ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

            <button
              className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-50 transition duration-150"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
