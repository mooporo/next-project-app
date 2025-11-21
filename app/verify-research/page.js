"use client";

import React, { useState, useEffect } from "react";
import { Search, RefreshCcw, ChevronRight, ChevronLeft, Eye, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import DrawerAdmin from "../components/DrawerAdmin";

// Sort Dropdown
const SortDropdown = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-gray-300 rounded-lg p-2 text-gray-700 bg-white shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-sm md:text-base w-full"
  >
    <option value="date">เรียงจากวันที่อัปโหลด</option>
    <option value="name">เรียงตามชื่อเรื่อง</option>
  </select>
);

export default function VerifyResearchPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("date");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const handleDrawerToggle = (isOpen) => setDrawerOpen(isOpen);

  // โหลดข้อมูลงานวิจัย
  const fetchAllPapers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("paper_tb")
        .select(`paper_id, paper_title, created_at, paper_status, user_id, users:user_id (user_fullname)`)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else {
        setPapers(
          data.map((item) => ({
            id: item.paper_id,
            title: item.paper_title,
            author: item.users?.user_fullname || "ไม่ทราบชื่อ",
            date: new Date(item.created_at).toLocaleString("th-TH", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
            status:
              item.paper_status === 2 || item.paper_status === 4
                ? "อนุมัติ"
                : item.paper_status === 3
                ? "ไม่อนุมัติ"
                : "รออนุมัติ",
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPapers();
  }, []);

  const handleApprove = async (paperId) => {
    await supabase.from("paper_tb").update({ paper_status: 2 }).eq("paper_id", paperId);
    fetchAllPapers();
  };

  const handleReject = async (paperId) => {
    await supabase.from("paper_tb").update({ paper_status: 3 }).eq("paper_id", paperId);
    fetchAllPapers();
  };

  const handleView = (paperId) => router.push(`/admin-research/${paperId}`);

  // Search + Sort + Pagination
  const filteredData = papers
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortField === "name") return a.title.localeCompare(b.title);
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
      {/* Drawer */}
      <DrawerAdmin onToggle={handleDrawerToggle} />

      {/* เนื้อหาหลัก */}
      <div className={`flex-1 transition-all duration-300`} style={{ marginLeft: drawerOpen ? "18rem" : "0" }}>
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
              ตรวจสอบงานวิจัยทั้งหมด
            </h1>
            <button
              onClick={fetchAllPapers}
              className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition duration-150 flex items-center space-x-2 w-full sm:w-auto text-base"
            >
              <RefreshCcw className="w-5 h-5" />
              <span>รีเฟรชรายการ</span>
            </button>
          </header>

          {/* Search & Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center border border-gray-300 rounded-xl p-3 flex-grow md:flex-[2] bg-gray-50 shadow-inner">
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

            <div className="flex md:flex-[1]">
              <SortDropdown
                value={sortField}
                onChange={(val) => {
                  setSortField(val);
                  handleSearch();
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-2 flex-[1.5]">
              <button
                onClick={() => {
                  setSearch(inputValue);
                  handleSearch();
                }}
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

          {/* Table View */}
          {loading ? (
            <p className="text-center text-gray-500 py-10">กำลังโหลดข้อมูล...</p>
          ) : currentData.length === 0 ? (
            <p className="text-center text-gray-500 py-10">ยังไม่มีงานวิจัยให้ตรวจสอบ</p>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-900 font-semibold text-base">
                  <tr>
                    <th className="px-6 py-4 border-b">ID</th>
                    <th className="px-6 py-4 border-b">ชื่อเรื่อง</th>
                    <th className="px-6 py-4 border-b">ผู้ส่ง</th>
                    <th className="px-6 py-4 border-b">วันที่อัปโหลด</th>
                    <th className="px-6 py-4 border-b">สถานะ</th>
                    <th className="px-6 py-4 border-b text-center">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 border-b font-mono">{data.id}</td>
                      <td className="px-6 py-4 border-b font-medium text-gray-900">{data.title}</td>
                      <td className="px-6 py-4 border-b">{data.author}</td>
                      <td className="px-6 py-4 border-b">{data.date}</td>
                      <td className="px-6 py-4 border-b">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            data.status === "รออนุมัติ"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                              : data.status === "อนุมัติ"
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : data.status === "ไม่อนุมัติ"
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-gray-100 text-gray-800 border border-gray-300"
                          }`}
                        >
                          {data.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => handleView(data.id)}
                            className="text-gray-600 hover:text-blue-600 transition duration-150 flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>ดู</span>
                          </button>
                          <button
                            onClick={() => handleApprove(data.id)}
                            className="text-green-600 hover:text-green-700 transition duration-150 flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>อนุมัติ</span>
                          </button>
                          <button
                            onClick={() => handleReject(data.id)}
                            className="text-red-600 hover:text-red-700 transition duration-150 flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>ไม่อนุมัติ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
