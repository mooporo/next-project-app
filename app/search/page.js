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

  // KLA : เพิ่ม useState สำหรับสีพื้นหลังสุ่ม เพียงครั้งเดียวจบ
  const [bgColor] = useState(() => {
    const colors = [
      "#2563EB", // blue-600
      "#1E40AF", // blue-800
      "#9333EA", // purple-600
      "#7E22CE", // purple-700
      "#DB2777", // pink-600
      "#BE185D", // pink-700
      "#059669", // green-600
      "#047857", // emerald-700
      "#16A34A", // green-600 
      "#EA580C", // orange-600
      "#C2410C", // orange-700  
      "#1E3A8A", // indigo-900
      "#0F766E", // teal-700
      "#DC2626", // red-600
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  });

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
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer relative overflow-hidden border border-gray-100 hover:-translate-y-1 transform hover:scale-102"
      onClick={handleCardClick}
    >
      <div className="h-40 flex items-center justify-center overflow-hidden">
        {item.paper_image ? (
          <img
            src={item.paper_image}
            alt={item.paper_title}
            className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // KLA เพิ่ม ถ้าไม่มีรูปให้สุ่มสีพื้นหลัง พร้อมชื่อเรื่องตรงกลาง
          <div
            className="w-full h-full flex items-center justify-center text-center px-6"
            style={{ backgroundColor: bgColor }}
          >
            <span className="text-white text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
              {item.paper_title || "ไม่มีชื่อเรื่อง"}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-gray-900 font-bold text-lg leading-snug truncate hover:text-blue-600 transition-colors duration-300">
          {item.paper_title}
        </h3>

        {/* 🔹 เพิ่มชื่อผู้ใช้ */}
        <p className="text-sm text-gray-500 truncate">
          โดย: {item.user_fullname || "ไม่ระบุชื่อ"}
        </p>

        <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="font-medium">{item.paper_views?.toLocaleString() || 0}</span>
            </div>

            {/* KLA  :  เพิ่มจำนวนคอมเมนต์ */}
            <div className="flex items-center space-x-1 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="font-medium">{item.comment_count || 0} คอมเมนต์</span>
            </div>
          </div>
          <span className="text-xs text-gray-400 italic">
            {item.created_at ? new Date(item.created_at).toLocaleDateString("th-TH") : "-"}
          </span>
          {/*เจมส์ : เพิ่มปุ่มเลือก popup*/}
          <button
            className={`rounded-full hover:bg-gray-100 cursor-pointer transition-colors p-1`}
            aria-label="More options"
            onClick={handleToggleMenu}
          >
            <MoreHorizontalIcon className="h-6 w-6 text-gray-600 hover:text-blue-600 transition-colors" />
          </button>
        </div>
      </div>
      {cardMenuState && (
        <div
          ref={menuRef}
          className="absolute right-2 bottom-10 mt-10 w-44 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 origin-top-right animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            {isPinned === false ? (
              <button
                onClick={handlePinClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              >
                <Pin className="h-4 w-4 mr-2 text-blue-600" /> ปักหมุด
              </button>
            ) : (
              <button
                onClick={handlePinClick}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors"
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
        className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-50 transition-colors"
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
        className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-50 transition-colors"
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
  const [keywordTerm, setKeywordTerm] = useState(""); // เจมส์ : เพิ่ม state สำหรับช่องเลือกคีย์เวิร์ด
  const [searchTerm, setSearchTerm] = useState(""); // KLA : คำค้นหาที่ใช้กรองข้อมูล
  const [sortOption, setSortOption] = useState("date"); // KLA : ตัวเลือกการเรียงข้อมูล
  const itemsPerPage = 6;

  //  KLA : ดึงข้อมูลจาก Supabase จริง
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth(); // เจมส์ : เพิ่ม user state
  const [pinnedPapers, setPinnedPapers] = useState([]); // เจมส์ : เพิ่ม user state

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

    // 🔹 ดึง paper_tb พร้อมชื่อผู้ใช้จาก user_tb และกรองเฉพาะที่อนุมัติแล้ว
    const { data: papers, error } = await supabase
      .from("paper_tb")
      .select(`
      paper_id,
      user_id,
      paper_title,
      paper_image,
      paper_views,
      created_at,
      user_tb:user_id ( user_fullname ),
      paper_status
    `)
      .eq("paper_status", 2) // 🔹 เพิ่มตรงนี้
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching data:", error);
      setResearchData(papers || []);
    } else {

      // KLA : ดึงจำนวนคอมเมนต์ต่อ paper_id
      const { data: commentsData, error: commentsError } = await supabase
        .from("comment_tb")
        .select("paper_id, comment_id");

      if (commentsError) console.error("❌ Error fetching comments:", commentsError);

      const commentCountMap = {};
      (commentsData || []).forEach((c) => {
        const pid = String(c.paper_id).trim(); // แปลงเป็น string และ trim
        commentCountMap[pid] = (commentCountMap[pid] || 0) + 1;
      });

      const combinedData = (papers || []).map(paper => {
        const paperIdAsString = String(paper.paper_id).trim();

        // 🔹 แปลง paper_image เป็น public URL
        let paperImageUrl = null;
        if (paper.paper_image) {
          const { data: imgUrl } = supabase.storage
            .from("paper_bk") // 🔹 ใช้ bucket ให้ตรงกับ storage ของคุณ
            .getPublicUrl(paper.paper_image);
          paperImageUrl = `${imgUrl.publicUrl}?t=${new Date().getTime()}`;
        }

        const is_pinned = fetchedPinnedIds.has(paperIdAsString);
        return {
          ...paper,
          paper_image: paperImageUrl, // <-- แทน path ด้วย public URL
          is_pinned,
          user_fullname: paper.user_tb?.user_fullname || "ไม่ระบุชื่อ",
          comment_count: commentCountMap[paperIdAsString] || 0,
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

  // KLA : กรองข้อมูลตามคำค้นหา + keyword
  const filteredData = researchData.filter(
    (item) =>
      item.paper_title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.paper_title?.toLowerCase().includes(keywordTerm.toLowerCase())
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
  // const handleClear = () => {
  //   setInputTerm("");
  //   setKeywordTerm("");
  //   setSortOption("date");
  //   setSearchTerm("");
  //   setCurrentPage(1);
  // };

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 font-[Inter] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 pt-4">
          <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">คลังงานวิจัย</h1>
          <button
            onClick={() => router.push("/upload")} // KLA : เปลี่ยนเส้นทางไปยังหน้าอัพโหลด
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition duration-150 flex items-center space-x-2 transform hover:scale-105"
          >
            <span>อัพโหลดงานวิจัย</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-xl mb-8 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-stretch">

          {/* 🔹 ช่องค้นหาชื่อเรื่อง */}
          <div className="flex items-center border border-gray-300 rounded-lg flex-grow px-3 py-2 bg-gray-50 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อเรื่อง..."
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
              value={inputTerm}
              onChange={(e) => setInputTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 🔹 ช่องเลือก keyword */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 shadow-inner">
            <input
              type="text"
              placeholder="ค้นหาด้วย keyword..."
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
              value={keywordTerm}
              onChange={(e) => setKeywordTerm(e.target.value)}
            />
          </div>

          {/* 🔹 ปุ่มค้นหา */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-150 shadow-md transform hover:scale-105"
          >
            ค้นหา
          </button>

          {/* 🔹 ปุ่มล้าง */}
          {/* <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-150 shadow-md transform hover:scale-105"
            >
              ล้าง
            </button> */}


          {/* 🔹 เลือกการเรียงข้อมูล */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 shadow-inner text-gray-700"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date">เรียงตามวันที่</option>
            <option value="views">เรียงตามยอดวิว</option>
            <option value="title">เรียงตามชื่อเรื่อง</option>
          </select>
        </div>

        {/* Research Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500 col-span-full text-center py-20">กำลังโหลด...</p>
          ) : currentItems.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-20">ไม่พบงานวิจัย</p>
          ) : (
            currentItems.map((item) => (
              <ResearchCard
                key={item.paper_id}
                item={item}
                onClick={handleView}
                isPinned={item.is_pinned}
                paperId={item.paper_id}
                onPinned={handlePinClick}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={sortedData.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
