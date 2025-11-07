"use client";

import React, { useState, useEffect } from "react";
import { Search, Upload, ChevronRight, ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth";
import { useRouter } from "next/navigation"; // เพิ่ม useRouter
import DrawerAdmin from "../components/DrawerAdmin"; // ✅ เพิ่ม DrawerAdmin

// KLA : เพิ่ม Sort Dropdown Component
const SortDropdown = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-sm md:text-base w-full"
  >
    <option value="date">เรียงจากวันที่สมัคร</option>
    <option value="name">เรียงตามชื่อผู้ใช้</option>
  </select>
);

// Upload Card
const UploadCard = ({ name, id, email, date, onReject }) => { 
  return (
    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-md flex flex-col justify-between h-full hover:shadow-xl transition duration-300">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 mr-4 leading-snug line-clamp-2 min-h-[50px]">{name}</h3>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>ID: <span className="font-mono text-gray-700">{id}</span></p>
          <p>อีเมล: <span className="font-medium">{email}</span></p>
          <p>วันที่สมัคร: <span className="font-medium">{date}</span></p>
        </div>
      </div>

      {/* ❌ ลบปุ่มอนุมัติออก ✅ เปลี่ยนปุ่มปฏิเสธเป็นลบบัญชี */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
        <button
          className="text-sm font-medium text-gray-500 hover:text-red-600 transition duration-150 flex items-center space-x-1"
          onClick={() => onReject(id)}
        >
          <XCircle className="w-4 h-4" />
          <span>ลบบัญชี</span>
        </button>
      </div>
    </div>
  );
};

// ✅ Verify User Page
export default function VerifyUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("date");
  const { user } = useAuth();
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false); // ✅ state สำหรับ Drawer
  const handleDrawerToggle = (isOpen) => setDrawerOpen(isOpen); // ✅ toggle Drawer

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_tb")
          .select("user_id, username, user_email, created_at, user_status")
          .order("created_at", { ascending: false });

        if (error) console.error("Error fetching users:", error);
        else {
          setUsers(
            data.map((item) => ({
              id: item.user_id,
              name: item.username,
              email: item.user_email,
              date: new Date(item.created_at).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // ✅ ฟังก์ชันลบบัญชี (แทนปฏิเสธ)
  const handleReject = async (id) => {
    if (!confirm("ยืนยันการลบบัญชีผู้ใช้นี้?")) return;
    await supabase.from("user_tb").delete().eq("user_id", id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // ค้นหา + เรียงลำดับ + แบ่งหน้า
  const filteredData = users
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortField === "name") return a.name.localeCompare(b.name);
      if (sortField === "date") return new Date(b.date) - new Date(a.date);
      return 0;
    });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  const handleSearch = () => setCurrentPage(1);
  const handleClear = () => {
    setInputValue("");
    setSearch("");
    setSortField("date");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex">
      {/* ✅ Drawer */}
      <DrawerAdmin onToggle={handleDrawerToggle} />

      {/* ✅ Main Content ดันตาม Drawer */}
      <div
        className={`flex-1 transition-all duration-300`}
        style={{ marginLeft: drawerOpen ? "18rem" : "0" }}
      >
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">ตรวจสอบผู้ใช้</h1>
          </header>

          {/* SearchBar, Sort, Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center border border-gray-300 rounded-xl p-3 flex-grow md:flex-[2] bg-gray-50 shadow-inner">
              <Search className="w-5 h-5 text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้..."
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

            <div className="flex md:flex-[1]">
              <SortDropdown value={sortField} onChange={(val) => { setSortField(val); handleSearch(); }} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-2 flex-[1.5]">
              <button
                onClick={() => { setSearch(inputValue); handleSearch(); }}
                className="bg-blue-600 text-white px-17.5 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition duration-150 w-full sm:w-auto text-lg"
              >
                ค้นหา
              </button>
              <button
                onClick={handleClear}
                className="bg-red-600 text-white px-17.5 py-3 rounded-lg font-medium shadow-md hover:bg-red-700 transition duration-150 w-full sm:w-auto text-lg"
              >
                ยกเลิก
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <p className="text-center text-gray-500 py-10">กำลังโหลดข้อมูล...</p>
          ) : currentData.length === 0 ? (
            <p className="text-center text-gray-500 py-10">ยังไม่มีผู้ใช้ในระบบ</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentData.map((data) => (
                <UploadCard key={data.id} {...data} onReject={handleReject} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            <p className="text-sm text-gray-600 mb-4 sm:mb-0">
              แสดง {startIdx + 1}-{Math.min(startIdx + itemsPerPage, totalItems)} จากทั้งหมด{" "}
              <span className="font-bold text-gray-800">{totalItems}</span> รายการ
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
    </div>
  );
}
