"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Eye, MessageSquare, Plus, Trash2, ArrowBigDownDash } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth";
import { N8N_TUNNEL_URL } from "../lib/config";
import axios from "axios";

const mockCompareData = [
  { id: 1, title: "การชะลอความสุกของกล้วยไข่ด้วยถ่านไม้", score: 0.985, abstract: "โครงงานวิชาวิทยาศาสตร์..." },
  { id: 2, title: "เทคนิคการเก็บรักษาผลไม้หลังการเก็บเกี่ยว", score: 0.912, abstract: "ศึกษาการใช้สารเคมี..." },
  { id: 3, title: "ผลกระทบของถ่านต่อการสลายตัวของเอทิลีน", score: 0.850, abstract: "วิเคราะห์คุณสมบัติของถ่าน..." },
];

//เจมส์ : popup สำหรับ search
const ShowSearchPopup = ({ Plus, onSearchChange, currentSearchQuery, onSelectResearch, papers, onPinnedEnabledClick }) => {
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
          flex flex-row justify-center items-center p-3
          text-center cursor-pointer 
          ${isOpen ? 'border-b border-gray-200 hover:bg-gray-50' : 'hover:bg-gray-100/70'}
        `}
        onClick={handleToggle}
      >
        <p className={`text-lg font-medium text-gray-700 mr-2 select-none ${isOpen ? 'text-red-500' : ''}`}>
          {isOpen ? 'ปิดช่องค้นหา' : 'ค้นหาเอกสาร'}
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
        <div className="flex flex-row items-center justify-center mb-4">
          <input
            type="text"
            placeholder="พิมพ์ชื่อเอกสาร..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={currentSearchQuery}
            // ใช้ onChange เพื่อค้นหาทันทีที่มีการเปลี่ยนแปลง
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <div className="flex items-center space-x-2 whitespace-nowrap ml-4">

            <span className="text-sm text-gray-700">เอกสารปักหมุด:</span>

            {/* ห่อทุกอย่างด้วย Label เดียว */}
            <label htmlFor="pin-toggle" className="flex items-center space-x-2 cursor-pointer">

              {/* กลไกสวิตช์: ใช้ Checkbox ที่ซ่อนไว้ */}
              <input
                type="checkbox"
                id="pin-toggle"
                className="sr-only peer"
                onClick={onPinnedEnabledClick}
              />

              {/* Visual Switch (ตัวสไลด์) - ส่วนที่คุณคลิกแล้วไม่ทำงาน */}
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>

            </label>
          </div>
        </div>

        {/* 2. List ผลลัพธ์ */}
        <div className="max-h-100 overflow-y-auto border border-gray-200 rounded-lg">
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

//เจมส์ : แสดงรายการความคล้ายคลึง
const CompareResultItem = ({ item }) => (
  <div onClick={() => window.open(`/research/${item.paper_id}`, '_blank')}
    className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:bg-gray-100 transition cursor-pointer">
    <div className="flex flex-row items-center mb-2">

      <h2 className="text-lg font-semibold leading-snug">
        <a
          href={`/research/${item.paper_id}`}
          target="_blank"
          className="text-gray-900 hover:text-blue-600 hover:underline cursor-pointer inline"
        >
          {item.paper_title}
        </a>
      </h2>

      <span className={`text-xl font-bold ml-auto ${parseFloat(item.score) > 0.9 ? 'text-green-600' : 'text-yellow-600'}`}>
        {(parseFloat(item.score) * 100).toFixed(1)}%
      </span>

    </div>
    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.abstract}</p>
    <p className="text-sm text-gray-600 mb-2">ผู้แต่ง: {item.paper_authors}</p>
  </div>
);

export default function ComparisonPage() {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isPinnedEnabled, setIsPinnedEnabled] = useState(false);

  //เจมส์ : ค่าของเอกสารสำหรับแสดงให้ผู้ใช้เห็น
  const [papers, setPapers] = useState(null);
  //เจมส์ : เก็บเอกสารที่ถูกปักหมุด
  const [pinPaper, setPinPaper] = useState([]);
  //เจมส์ : เก็บเอกสารที่ไม่ถูกปักหมุด
  const [unpinPaper, setUnpinPaper] = useState([]);
  //เจมส์ : เก็บค่าของเอกสารที่เทียบ
  const [comparePaper, setComparePaper] = useState([]);

  const { user } = useAuth();

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
      .in('paper_status', [2, 4])
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPinPaper(data);

      if (!papers) {
        setPapers(data);
      }
    }
  }

  const getAllPinnedPapers = async () => {

    if(user?.user_id === null) return;

    const { data, error } = await supabase
      .from('paper_pin_mtb')
      .select(`
                          paper_tb:paper_id ( 
                              *,
                              users:user_id ( 
                                  user_fullname,
                                  user_email 
                              )
                          )
                      `)
      .eq('user_id', user?.user_id)
      .filter('paper_tb.paper_status', 'in', '(2,4)')
      .order('created_at', { referencedTable: 'paper_tb', ascending: false });

    if (error) {
      console.error("", error);
    } else {
      const cleanData = data.filter(item => item.paper_tb)
        .map(item => ({
          ...item.paper_tb,
        })) || [];

      setUnpinPaper(cleanData);
    }
  }

  //โหลดข้อมูล paper จาก supabase เพื่อส่งเป็น props ไปให้ ShowSearchPopup
  useEffect(() => {
    getAllPapers();
    getAllPinnedPapers();
  }, [user?.user_id]);

  const handlePinnedEnabledClick = () => {
    setIsPinnedEnabled(!isPinnedEnabled);

    if (isPinnedEnabled === true) {
      setPapers(pinPaper);
    }
    if (isPinnedEnabled === false) {
      setPapers(unpinPaper);
    }

    // console.log(isPinnedEnabled);
  };

  const handleSelectResearchClick = (paper) => {
    setSelectedPaper(paper);
    setIsPinnedEnabled(false);
    console.log(paper);
    // console.log(isPinnedEnabled)
  };

  const handleCompareClick = async () => {

    // console.log(selectedPaper.paper_id);

    try {
      const res = await axios.get(`${N8N_TUNNEL_URL}/webhook/8c1db8bc-42a9-4a9c-8a68-82546d1c3254/comparison/${selectedPaper.paper_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      // console.log(res.data.data);
      setComparePaper(res.data.output);
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการเปรียบเทียบ" + error);
    }

  };

  return (
    // หน้าเปรียบเทียบ
    <div className="flex flex-col items-center">
      <div className="container min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-semibold mb-2 text-gray-800 mt-20">
          เปรียบเทียบเอกสาร
        </h1>
        <p className="mb-5 text-gray-600">
          เลือกเอกสารที่คุณสนใจเพื่อค้นหาเอกสารที่ใกล้เคียงกัน โดยระบบจะตรวจสอบจากความใกล้เคียงกันของบทคัดย่อ
        </p>

        {selectedPaper === null ? (

          <div className="bg-white border rounded-2xl w-full md:w-[800px] p-6 flex flex-col justify-center items-center text-center shadow-sm">

            <ShowSearchPopup
              Plus={Plus}
              papers={papers}
              currentSearchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectResearch={handleSelectResearchClick}
              onPinnedEnabledClick={handlePinnedEnabledClick}
            />

            <p className="text-gray-700 font-medium mb-2">
              เลือกเอกสารเพื่อเปรียบเทียบ
            </p>
            <p className="text-sm text-gray-500 mb-4">
              คลิกเพื่อค้นหาและเพิ่มเอกสารที่ต้องการ
            </p>
          </div>

        ) : (

          <div className="bg-white rounded-2xl shadow-md w-full md:w-[800px] p-6 relative border border-gray-100 flex flex-col">
            {/* ปุ่มปิด (Close Button) - ตำแหน่ง Absolute */}
            <button
              onClick={() => setSelectedPaper(null)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 z-10"
              aria-label="ปิดรายละเอียดเอกสาร"
            >
              <Trash2 className="h-6 w-6" />
            </button>

            {/* ปก */}
            <div className="bg-blue-500 text-white h-60 rounded-xl flex items-center justify-center text-xl font-semibold mb-4 overflow-hidden">
              {selectedPaper.paper_image ? (
                <img
                  src={selectedPaper.paper_image}
                  alt={selectedPaper.paper_title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <p>{selectedPaper.paper_title}</p>
              )}
            </div>

            {/* ชื่อเรื่อง */}
            <h2 className="text-lg font-semibold leading-snug">
              <a
                href={`/research/${selectedPaper.paper_id}`}
                target="_blank"
                className="text-gray-900 hover:text-blue-600 hover:underline cursor-pointer inline"
              >
                {selectedPaper.paper_title}
              </a>
            </h2>

            {/* ผู้เขียน */}
            <p className="text-sm text-gray-600 mt-1">
              ผู้แต่ง: {selectedPaper.paper_authors}
            </p>

            {/* ผู้อัปโหลด */}
            <p className="text-sm text-gray-600 mt-1 mb-3">
              ผู้อัปโหลด: {selectedPaper.users.user_fullname}
            </p>

            {/* บทคัดย่อ */}
            <div className="border-t border-gray-200 pt-3 mb-3 flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">บทคัดย่อ</h3>
              <p className="text-sm text-gray-600 leading-loose line-clamp-5">
                {selectedPaper.paper_abstract}
              </p>
            </div>

            {/* ปุ่มดูรายละเอียด */}
            <button
              onClick={handleCompareClick}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 cursor-pointer transition mt-auto">
              เริ่มเปรียบเทียบ 🚀
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-5 mb-5">
          <ArrowBigDownDash className="text-gray-500" />
          <ArrowBigDownDash className="text-gray-500" />
          <ArrowBigDownDash className="text-gray-500" />
        </div>

        {comparePaper?.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-500 rounded-2xl w-full md:w-[800px] p-6 flex flex-col justify-center items-center text-center shadow-sm mb-20">
            <h1 className="text-gray-500 text-xl mb-2">รอการเปรียบเทียบ</h1>
            <p className="text-gray-500">รายการเอกสารที่คล้ายคลึงจะแสดงเมื่อประมวลผลเสร็จสิ้น...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md w-full md:w-[800px] p-6 relative border border-gray-100 flex flex-col mb-20">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              พบเอกสารที่เกี่ยวข้อง {comparePaper?.length} ฉบับ
            </h2>
            {comparePaper?.map((item, index) => (
              <CompareResultItem key={index} item={item} />
            ))}
          </div>
        )}

      </div>
    </div >
  );
}
