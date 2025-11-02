"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // ต้อง import useRouter
import { supabase } from "../lib/supabaseClient"; // ✅ KLA : import Supabase client
import { Edit, MoreHorizontalIcon, Pin, PinOff, Trash2 } from "lucide-react";
import { useAuth } from "../auth"; //เจมส์ : เพิ่ม useAuth เพิ่มเรียกใช้ user state

// --- Research Card Component  ---
const ResearchCard = ({ item, onClick, isPinned, paperId, onPinned }) => {

  const [cardMenuState, setCardMenuState] = useState(false);
  const menuRef = useRef(null);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setCardMenuState(prev => !prev);
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    onPinned(paperId, isPinned); //เด่วมาเพิ่ม isPinned
  };

  // Logic to handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setCardMenuState(false);
      }
    };

    if (cardMenuState) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardMenuState]);

  const handleCardClick = (e) => {
    if (cardMenuState) {
      setCardMenuState(false);
    } else {
      onClick(item);
    }
  };


  return ( //เจมส์ : ครอบด้วย return
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer relative overflow-hidden border border-gray-100"
      onClick={handleCardClick}
    >
      <div className="h-40 flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={item.paper_image || "/no-image.png"}
          alt={item.paper_title}
          className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-gray-900 font-bold text-lg leading-snug truncate">
          {item.paper_title}
        </h3>
        <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{item.paper_views?.toLocaleString() || 0}</span>
            </div>
          </div>
          <span className="text-xs">
            {item.created_at ? new Date(item.created_at).toLocaleDateString("th-TH") : "-"}
          </span>
          {/*เจมส์ : เพิ่มปุ่มเลือก popup*/}
          <button
            className={`rounded-full hover:bg-gray-100 cursor-pointer transition-colors p-1`}
            aria-label="More options"
            onClick={handleToggleMenu}
          >
            <MoreHorizontalIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
      {cardMenuState && (
        <div
          ref={menuRef}
          className="absolute right-2 bottom-10 mt-10 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 origin-top-right"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            {isPinned === false ? (
              <button
                onClick={handlePinClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Pin className="h-4 w-4 mr-2 text-blue-600" /> ปักหมุด
              </button>
            ) : (
              <button
                onClick={handlePinClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <PinOff className="h-4 w-4 mr-2 text-red-500" /> เลิกปักหมุด
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// KLA : Pagination Component ใช้สำหรับแบ่งหน้า 1 2 3 ...
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-end items-center space-x-1 text-sm mt-4">
      <button
        className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`h-8 w-8 rounded-lg font-semibold ${page === currentPage ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
            } transition-colors`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
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
  const [sortOption, setSortOption] = useState("date"); // KLA : ตัวเลือกการเรียงข้อมูล
  const itemsPerPage = 6;

  //  KLA : ดึงข้อมูลจาก Supabase จริง
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth(); // เจมส์ : เพิ่ม user state

  const [pinnedIds, setPinnedIds] = useState(new Set());

  const fetchPinnedData = async () => {

    try {
      const { data, error } = await supabase
        .from('paper_pin_mtb')
        .select('paper_id')
        .eq('user_id', user?.user_id);

      if (error) {
        console.error("Has no pinned", error);
        return new Set();
      }

      console.log(data);
      return new Set(data.map(item => item.paper_id));

    } catch (error) {
      console.error("Has no pinned", error);
      return new Set();
    }

  };

  // KLA : ฟังก์ชันดึงข้อมูลงานวิจัยจาก Supabase
  const fetchResearchData = async () => {
    setLoading(true);

    // เจมส์ : ดึงข้อมูลการปักหมุดของผู้ใช้นี้
    const fetchedPinnedIds = await fetchPinnedData(user?.user_id);
    setPinnedIds(fetchedPinnedIds);

    const { data: papers, error } = await supabase
      .from("paper_tb")
      .select("paper_id, user_id, paper_title, paper_image, paper_views, created_at") // เลือกเฉพาะฟิลด์ที่ต้องการมาเพื่อแสดงผล
      .order("created_at", { ascending: false }); // เรียงลำดับจากใหม่ไปเก่า

    if (error) {
      console.error("❌ Error fetching data:", error);
      setResearchData(papers || []);
    } else {
      const combinedData = (papers || []).map(paper => {
        //แปลง paper_id เป็น String และใช้ .trim() ก่อนนำไปเทียบกับ Set
        const paperIdAsString = String(paper.paper_id).trim();
        const is_pinned = fetchedPinnedIds.has(paperIdAsString);

        return {
          ...paper,
          is_pinned: is_pinned,
        };
      });
      setResearchData(combinedData);
      console.log(combinedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.user_id) fetchResearchData();
  }, [user?.user_id]); //เจมส์ : เพิ่มให้ useEffect รอ user_id

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
        r.paper_id === item.paper_id ? { ...r, paper_views: newViews } : r
      )
    );

    // ไปหน้าแสดงรายละเอียด (ภายหลังจะสร้างจริง)
    router.push(`/research/${item.paper_id}`);
  };

  // KLA : กรองข้อมูลตามคำค้นหา
  const filteredData = researchData.filter(
    (item) =>
      item.paper_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // KLA : ฟังก์ชันเรียงข้อมูล
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption === "views") {
      return (b.paper_views || 0) - (a.paper_views || 0);
    } else if (sortOption === "date") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOption === "title") {
      return a.paper_title.localeCompare(b.paper_title);
    }
    return 0;
  });

  const startIndex = (currentPage - 1) * itemsPerPage; // KLA : คำนวณดัชนีเริ่มต้นของหน้าปัจจุบัน
  const currentItems = sortedData.slice(startIndex, startIndex + itemsPerPage); // KLA : ดึงข้อมูลของหน้าปัจจุบัน

  // KLA : ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(sortedData.length / itemsPerPage)) return;
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
    setSortOption("date");
    setSearchTerm("");
    setCurrentPage(1);
  };

  //เจมส์ : เพิ่ม function ปักหมุด
  const handlePinClick = async (paperId, isPinned) => {
    try {
      if (isPinned == true) {
        const { error } = await supabase
          .from('paper_pin_mtb')
          .delete()
          .eq('paper_id', paperId)
          .eq('user_id', user?.user_id)
        if (!error) fetchResearchData();
      }
      if (isPinned == false) {
        const { error } = await supabase
          .from('paper_pin_mtb')
          .insert([
            {
              user_id: user?.user_id,
              paper_id: paperId,
            }
          ])
        if (!error) fetchResearchData();
      }
    } catch (error) {
      console.error('Swap pin state error:', error);
    }
  }

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
          <div className="flex items-center border border-gray-300 rounded-lg flex-grow px-3 py-2 bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อเรื่อง..."
              className="w-full focus:outline-none bg-gray-50 text-gray-700"
              value={inputTerm}
              onChange={(e) => setInputTerm(e.target.value)} // KLA : อัพเดตคำค้นหา
              onKeyDown={handleKeyDown} // KLA : จับการกดปุ่ม Enter
            />
          </div>

          {/* KLA : เพื่มฟังก์ชัน  Dropdown สำหรับเลือกการเรียงลำดับ แทนที่ keyword */}
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value); // KLA : อัพเดตตัวเลือกเรียงข้อมูล
              setCurrentPage(1); // KLA : กลับไปหน้าแรกเมื่อเปลี่ยนการเรียง
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px] bg-white"
          >
            <option value="date">เรียงจากวันที่อัปโหลด</option>
            <option value="views">เรียงจากยอดวิว</option>
            <option value="title">เรียงตามตัวอักษร</option>
          </select>

          <button
            onClick={handleSearch} // KLA : เรียกใช้ฟังก์ชันค้นหา
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition duration-150 min-w-[100px]"
          >
            ค้นหา
          </button>

          <button
            onClick={handleClear} // KLA : เรียกใช้ฟังก์ชันล้างการค้นหา
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-red-700 transition duration-150 min-w-[100px]"
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
              <ResearchCard
                key={item.paper_id}
                item={item}
                onClick={handleView}
                //เจมส์ : เพิ่ม prop อื่นๆ
                paperId={item.paper_id}
                isPinned={item.is_pinned}
                onPinned={handlePinClick}
              />
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
              {sortedData.length === 0
                ? 0
                : `${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, sortedData.length)}`}
            </span>{" "}
            จาก {sortedData.length} รายการ
          </span>

          <Pagination
            totalItems={sortedData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
