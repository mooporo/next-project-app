"use client";

import React, { useState, useEffect } from "react";
import { Search, Upload, ChevronRight, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth";
import { useRouter } from "next/navigation"; // เพิ่ม useRouter

// KLA : เพิ่ม Sort Dropdown Component
const SortDropdown = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-sm md:text-base w-full"
  >
    <option value="date">เรียงจากวันที่อัปโหลด</option>
    <option value="name">เรียงตามชื่อ</option>
  </select>
);

// KLA :Upload Card
const UploadCard = ({ title, id, date, version, status, onDelete }) => {
  const router = useRouter(); //  เพิ่ม router
  let statusClass = "";
  const buttonAction = { icon: Edit, text: "แก้ไข", color: "text-gray-600 hover:text-blue-600" };

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

  const Icon = buttonAction.icon;

  return (
    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-md flex flex-col justify-between h-full hover:shadow-xl transition duration-300">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 mr-4 leading-snug line-clamp-2 min-h-[50px]">{title}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass} whitespace-nowrap flex-shrink-0`}>
            {status}
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>ID: <span className="font-mono text-gray-700">{id}</span></p>
          <p>อัปโหลดเมื่อ: <span className="font-medium">{date}</span></p>
          <p>เวอร์ชัน: <span className="font-medium">{version}</span></p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-6">
        {/* KLA :ปุ่มแก้ไข → ไปหน้า /research/[id]/edit */}
        <button
          className={`text-sm font-medium flex items-center space-x-1 ${buttonAction.color} transition duration-150`}
          onClick={() => router.push(`/research/${id}/edit`)}
        >
          <Icon className="w-4 h-4" />
          <span>แก้ไข</span>
        </button>

        {/* KLA  : ปุ่มลบ*/}
        <button
          className="text-sm font-medium text-gray-500 hover:text-red-600 transition duration-150 flex items-center space-x-1"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="w-4 h-4" />
          <span>ลบ</span>
        </button>
      </div>
    </div>
  );
};

// ✅ History Page
export default function HistoryPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // KLA : จำกัดจำนวนรายการต่อหน้าไว้ที่ 6

  const [inputValue, setInputValue] = useState(""); // สำหรับเก็บค่าที่พิมพ์
  const [search, setSearch] = useState(""); // สำหรับค้นหาจริง
  const [sortField, setSortField] = useState("date"); // name / date / type
  const { user } = useAuth();
  const router = useRouter(); // ✅ เพิ่ม router สำหรับปุ่มอัปโหลด

  // Fetch papers
  useEffect(() => {
    if (!user?.user_id) return;
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("paper_tb")
          .select(`paper_id, paper_title, created_at, paper_status, paper_type_id`)
          .eq("user_id", user.user_id)
          .order("created_at", { ascending: false });

        if (error) console.error("Error fetching papers:", error);
        else {
          setPapers(
            data.map((item) => ({
              id: item.paper_id,
              title: item.paper_title,
              date: new Date(item.created_at).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }),
              version: "1.0",
              status:
                item.paper_status === 1 
                  ? "ตรวจรอบ"
                  : item.paper_status === 2 || item.paper_status === 4
                    ? "อนุมัติ"
                    : item.paper_status === 3
                      ? "ต้องการแก้ไข"
                      : "ไม่ทราบสถานะ",
              type: item.paper_type_id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
      setLoading(false);
    };
    fetchPapers();
  }, [user?.user_id]);

  // KLA: เพิ่มฟังก์ชันลบข้อมูลงานวิจัย ทั้งไฟล์และ metadata ใน database
  const handleDelete = async (paperId, filePath) => {
    if (!confirm("คุณแน่ใจว่าจะลบงานวิจัยนี้?")) return;

    try {
      //  ลบไฟล์จาก Supabase Storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('papers')   // ชื่อ bucket
          .remove([filePath]);

        if (storageError) {
          console.error("Error deleting file:", storageError);
          alert("เกิดข้อผิดพลาดในการลบไฟล์");
          return;
        }
      }

      //  ลบ metadata ใน database
      const { error } = await supabase.from("paper_tb").delete().eq("paper_id", paperId);
      if (error) {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล: " + error.message);
        return;
      }

      setPapers((prev) => prev.filter((p) => p.id !== paperId));
      alert("ลบงานวิจัยเรียบร้อยแล้ว");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  // KLA : เพิ่ม Search + Sort + Pagination
  const filteredData = papers
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortField === "name") return a.title.localeCompare(b.title);
      if (sortField === "date") return new Date(b.date) - new Date(a.date);
      if (sortField === "type") return a.type.localeCompare(b.type);
      return 0;
    });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  const handleSearch = () => setCurrentPage(1);


  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">ประวัติการอัปโหลด</h1>
          <button
            onClick={() => router.push('/upload')} // ✅ ลิงก์ไปหน้า upload
            className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition duration-150 flex items-center space-x-2 w-full sm:w-auto text-base"
          >
            <Upload className="w-5 h-5" />
            <span>อัปโหลดไฟล์งานวิจัย</span>
          </button>
        </header>

        {/* SearchBar, Sort, Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center bg-white p-5 rounded-xl shadow-md border border-gray-200">

          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 flex-grow md:flex-[2.5] bg-gray-50 shadow-inner">
            <Search className="w-5 h-5 text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="ค้นหางานวิจัย..."
              className="flex-grow text-gray-700 focus:outline-none placeholder-gray-400 bg-gray-50"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(inputValue);
                  handleSearch();
                }
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex md:flex-[1.2]">
            <SortDropdown
              value={sortField}
              onChange={(val) => { setSortField(val); handleSearch(); }}
            />
          </div>

          {/* Search  */}
          <div className="flex md:flex-[1]">
            <button
              onClick={() => { setSearch(inputValue); handleSearch(); }}
              className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition duration-150 text-base"
            >
              ค้นหา
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">กำลังโหลดข้อมูล...</p>
        ) : currentData.length === 0 ? (
          <p className="text-center text-gray-500 py-10">ยังไม่มีข้อมูลอัปโหลด</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentData.map((data) => (
              <UploadCard key={data.id} {...data} onDelete={handleDelete} /> // ✅ ส่ง onDelete
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0">
            แสดง {startIdx + 1}-{Math.min(startIdx + itemsPerPage, totalItems)} จากทั้งหมด <span className="font-bold text-gray-800">{totalItems}</span> รายการ
          </p>

          <div className="flex items-center space-x-1 flex-wrap">
            <button
              className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-50 transition duration-150"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`min-w-[40px] px-2 py-2 font-semibold rounded-lg transition duration-150 ${page === currentPage ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
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
