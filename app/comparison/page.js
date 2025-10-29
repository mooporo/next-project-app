"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, Eye, MessageSquare, Plus } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const mockResearchData = [
  { id: 1, title: "การวิเคราะห์ปัจจัยที่มีผลต่อการยอมรับ AI ในองค์กร", year: 2023 },
  { id: 2, title: "ผลกระทบของ Big Data ต่อการตัดสินใจทางการตลาด", year: 2022 },
  { id: 3, title: "เปรียบเทียบประสิทธิภาพของ Machine Learning Models ในการพยากรณ์", year: 2024 },
  { id: 4, title: "แนวทางการประยุกต์ใช้ Blockchain ในระบบ Supply Chain", year: 2021 },
  { id: 5, title: "การพัฒนาโมเดลจำลองเพื่อทำนายความเสี่ยงด้านเครดิต", year: 2023 },
];

//popup สำหรับ search
const ShowSearchPopup = ({ Plus, onSearchChange, currentSearchQuery, onSelectResearch, papers, }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e) => {
    // ป้องกันการคลิกจาก Input
    if (e.target.tagName === 'INPUT') {
      return;
    }
    setIsOpen(!isOpen);
    // เมื่อปิด ให้ล้างค่าค้นหาเพื่อให้ดูเป็นระเบียบ
    if (isOpen && onSearchChange) {
      onSearchChange("");
    }
  };

  // ใน ShowSearchPopup.js

  const filteredResults = useMemo(() => {
    // **เพิ่มการตรวจสอบว่า papers เป็น Array และมีค่าหรือไม่**
    if (!papers || !Array.isArray(papers)) {
      return [];
    }

    if (!currentSearchQuery) {
      return papers;
    }

    const query = currentSearchQuery.toLowerCase();
    return papers.filter(paper => // เปลี่ยนชื่อตัวแปรใน filter จาก 'papers' เป็น 'paper' เพื่อความชัดเจน
      paper.paper_title.toLowerCase().includes(query) ||
      // ตรวจสอบว่า paper.created_at มีค่าและเป็น String ก่อนจะใช้ .includes
      (paper.created_at && String(paper.created_at).toLowerCase().includes(query))
    );
  }, [currentSearchQuery, papers]); // เพิ่ม papers ใน dependency array ด้วย!
  // คุณต้องเพิ่ม papers เข้าไปใน dependency array เพื่อให้ useMemo คำนวณใหม่เมื่อข้อมูลโหลดเสร็จ

  return (
    <div
      className={`
        bg-white border border-gray-300 rounded-2xl w-full mb-4 relative
        shadow-md transition-shadow duration-200 overflow-hidden 
        ${!isOpen ? 'hover:shadow-lg cursor-pointer' : 'shadow-xl'}
      `}
    >

      {/* ส่วนหัว: ใช้คลิกเพื่อ Toggle */}
      <div
        className={`
          flex flex-row justify-center items-center p-6 
          text-center cursor-pointer 
          ${isOpen ? 'border-b border-gray-200 hover:bg-gray-50' : 'hover:bg-gray-100/70'}
        `}
        onClick={handleToggle}
      >
        <p className={`text-lg font-medium text-gray-700 mr-2 select-none ${isOpen ? 'text-red-500' : ''}`}>
          {isOpen ? 'ปิดช่องค้นหา' : 'ค้นหางานวิจัย'}
        </p>

      </div>

      {/* ส่วนเนื้อหา: จัดการแอนิเมชัน */}
      <div
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${isOpen ? 'max-h-[500px] p-6 pt-4' : 'max-h-0'}
        `}
      >
        {/* 1. Input Search */}
        <input
          type="text"
          placeholder="พิมพ์ชื่อเอกสาร, คีย์เวิร์ด, หรือปีที่พิมพ์..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
          value={currentSearchQuery}
          // ใช้ onChange เพื่อค้นหาทันทีที่มีการเปลี่ยนแปลง
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {/* 2. List ผลลัพธ์ */}
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredResults.length > 0 ? (
            filteredResults.map((paper) => (
              <div
                key={paper.paper_id}
                className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => {
                  if (onSelectResearch) {
                    onSelectResearch(paper);
                    setIsOpen(false); // ปิด popup หลังจากเลือก
                    console.log(paper);
                  }
                }}
              >
                <p className="font-semibold text-gray-800 line-clamp-1">{paper.paper_title}</p>
                <p className="text-sm text-gray-500">ชื่อผู้อัปโหลด: {paper.users.user_fullname}</p>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">
              ไม่พบผลลัพธ์ที่ตรงกับ &quot;{currentSearchQuery}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComparisonPage() {

  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);

  //โหลดข้อมูล paper จาก supabase เพื่อส่งเป็น props ไปให้ ShowSearchPopup
  useEffect(() => {
    const getAllPapers = async () => {
      const { data, error } = await supabase
        .from('paper_tb')
        .select(`
                    *,
                    users:user_id ( 
                        user_fullname,
                        user_email 
                    )
                `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        console.log(data);
        setPapers(data);
      }
    }
    getAllPapers();
  }, []);

  const handleSelectResearchClick = (paper) => {
    setSelectedPaper(paper);
    console.log(paper);
  };

  return (
    // หน้าเปรียบเทียบ
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mt-8 mb-6 text-gray-800">
        เปรียบเทียบงานวิจัย
      </h1>

      {selectedPaper === null ? (

        <div className="bg-white border rounded-2xl w-full md:w-[700px] p-6 flex flex-col justify-center items-center text-center shadow-sm">

          <ShowSearchPopup
            Plus={Plus}
            papers={papers}
            currentSearchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectResearch={handleSelectResearchClick}
          />
          
          {/* ✅ แก้เฉพาะตรงนี้ — เพิ่ม props ให้เหมือนตัวแรก */}
          <ShowSearchPopup
            Plus={Plus}
            papers={papers}
            currentSearchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectResearch={handleSelectResearchClick}
          />

          <p className="text-gray-700 font-medium mb-2">
            เลือกงานวิจัยเพื่อเปรียบเทียบป
          </p>
          <p className="text-sm text-gray-500 mb-4">
            คลิกเพื่อค้นหาและเพิ่มงานวิจัยที่ต้องการ
          </p>
          <button onClick={() => handleSelectResearchClick()} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer">
            <Search size={16} />
            <span>ค้นหางานวิจัย</span>
          </button>
        </div>

      ) : (

        <div className="bg-white rounded-2xl shadow-md w-full md:w-[700px] p-5 relative border border-gray-100 flex flex-col mb-10">
          {/* ปก */}
          <div className="bg-blue-500 text-white h-60 rounded-xl flex items-center justify-center text-xl font-semibold mb-4 overflow-hidden">
            {selectedPaper.paper_image ?
              (
                  <img
                    src={selectedPaper.paper_image}
                    alt={selectedPaper.paper_title}
                    className="object-cover w-full"
                  />
              )
              :
              (
                  <p>{selectedPaper.paper_title}</p>
              )}
          </div>

          {/* ชื่อเรื่อง */}
          <h2 className="text-lg font-semibold text-gray-900 leading-snug">
            {selectedPaper.paper_title}
          </h2>

          {/* ผู้เขียน */}
          <p className="text-sm text-gray-600 mt-1 mb-3">
            {selectedPaper.users.user_fullname}
          </p>

          {/* บทคัดย่อ */}
          <div className="border-t border-gray-200 pt-3 mb-3 flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">บทคัดย่อ</h3>
            <p className="text-sm text-gray-600 leading-loose mb-8">
              {selectedPaper.paper_abstract}
              <span className="text-gray-400"> (เนื้อหาย่อ)</span>
            </p>
          </div>

          {/* คีย์เวิร์ด */}
          <div className="border-t border-gray-200 pt-3 mb-3">
            <h3 className="font-semibold text-gray-800 mb-1">คีย์เวิร์ด</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                Machine Learning
              </span>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                Recommendation System
              </span>
            </div>
          </div>

          {/* สถิติ */}
          <div className="border-t border-gray-200 pt-3 mb-3">
            <h3 className="font-semibold text-gray-800 mb-2">สถิติ</h3>
            <div className="flex gap-5 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <Eye size={16} /> <span>1,204</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare size={16} /> <span>15</span>
              </div>
            </div>
          </div>

          {/* ปุ่มดูรายละเอียด */}
          <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition mt-auto">
            ดูรายละเอียด
          </button>
        </div>

      )}

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 text-sm text-center py-4 mt-auto">
        © 2025 Siam Archive. สงวนลิขสิทธิ์.
      </footer>
    </div>
  );
}
