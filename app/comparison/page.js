"use client";

import React from "react";
import { Search, Eye, MessageSquare, Plus } from "lucide-react";

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* หัวข้อ */}
      <h1 className="text-2xl font-semibold mt-8 mb-6 text-gray-800">
        เปรียบเทียบงานวิจัย
      </h1>

      {/* ส่วนเปรียบเทียบ */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 w-full max-w-6xl px-4">
        {/* การ์ดงานวิจัยที่เลือก */}
        <div className="bg-white rounded-2xl shadow-md w-full md:w-[420px] p-5 relative border border-gray-100 flex flex-col">
          {/* ปก */}
          <div className="bg-blue-500 text-white h-40 rounded-xl flex items-center justify-center text-xl font-semibold mb-4">
            Research Cover 1
          </div>

          {/* ชื่อเรื่อง */}
          <h2 className="text-lg font-semibold text-gray-900 leading-snug">
            การพัฒนาระบบแนะนำร้านอาหารด้วย Machine Learning
          </h2>

          {/* ผู้เขียน */}
          <p className="text-sm text-gray-600 mt-1 mb-3">
            โดย: สมเกียรติ รักวิชัย, อลิษา ใจดี
          </p>

          {/* บทคัดย่อ */}
          <div className="border-t border-gray-200 pt-3 mb-3 flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">บทคัดย่อ</h3>
            <p className="text-sm text-gray-600 leading-loose mb-8">
              งานวิจัยนี้มีวัตถุประสงค์เพื่อพัฒนาระบบแนะนำร้านอาหารสำหรับบุคคลโดยใช้เทคนิค
              Machine Learning ประยุกต์กับ Collaborative Filtering และ
              Content-Based Filtering เพื่อเพิ่มความแม่นยำในการแนะนำร้าน...
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

        {/* การ์ดเปล่าสำหรับเลือกเปรียบเทียบ (เนื้อหาอยู่ตรงกลาง) */}
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl w-full md:w-[420px] p-6 flex flex-col justify-center items-center text-center shadow-sm">
          <Plus size={40} className="text-gray-400 mb-3" />
          <p className="text-gray-700 font-medium mb-2">
            เลือกงานวิจัยเพื่อเปรียบเทียบ
          </p>
          <p className="text-sm text-gray-500 mb-4">
            คลิกเพื่อค้นหาและเพิ่มงานวิจัยที่ต้องการ
          </p>
          <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            <Search size={16} />
            <span>ค้นหางานวิจัย</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 text-sm text-center py-4 mt-12">
        © 2025 Siam Archive. สงวนลิขสิทธิ์.
      </footer>
    </div>
  );
}
