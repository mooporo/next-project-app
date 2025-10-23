"use client";

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, FileText } from 'lucide-react';

// Helper component for the form field label and input group
const FormField = ({ label, required, children, helperText }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
  </div>
);

// Simplified File Upload Drop Zone Component
const FileUploadDropZone = ({ icon: Icon, title, description, buttonText, acceptedFormat }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50 hover:border-blue-500 transition duration-300 cursor-pointer">
    <div className="flex justify-center text-blue-500 mb-3">
      <Icon size={36} className="text-gray-400" />
    </div>
    <p className="text-lg text-gray-600 mb-3 font-medium">{title}</p>
    {description && <p className="text-lg text-gray-600 mb-4">{description}</p>}
    <button
      type="button"
      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out mt-1"
    >
      {buttonText}
    </button>
    <p className="mt-3 text-xs text-gray-500">{acceptedFormat}</p>
  </div>
);

const UploadPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    researchType: '',
    coAuthors: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-12 flex justify-center font-sans">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
          อัปโหลดงานวิจัย
        </h1>

        {/* Main Information Section */}
        <section className="mb-10 p-5 border border-gray-100 rounded-xl bg-white">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">ข้อมูลหลัก</h2>

          <FormField label="ชื่อ​งานวิจัย (Title)" required>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ระบุชื่อ​งานวิจัย​ของ​คุณ..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base shadow-sm"
            />
          </FormField>

          <FormField label="บทคัดย่อ (Abstract)" required>
            <textarea
              rows={4}
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              placeholder="ใส่บทคัดย่อหรือคำอธิบายสั้นๆ เกี่ยวกับงานวิจัย..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base resize-none shadow-sm"
            />
          </FormField>

          <FormField label="คีย์เวิร์ด (Keywords)" required helperText="คั่นแต่ละคีย์เวิร์ดด้วยเครื่องหมายจุลภาค (comma)">
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="เช่น AI, Machine Learning, Data Science"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base shadow-sm"
            />
          </FormField>
        </section>

        {/* Research File Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">ไฟล์งานวิจัย</h2>

          <FileUploadDropZone
            icon={Upload}
            title="ลากไฟล์ PDF ของคุณมาวางที่นี่"
            description="หรือ"
            buttonText="เลือกไฟล์"
            acceptedFormat="รองรับไฟล์ PDF เท่านั้น, ขนาดสูงสุด 50MB"
          />
        </section>

        {/* Additional Information Section */}
        <section className="mb-10 p-5 border border-gray-100 rounded-xl bg-white">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">
            ข้อมูลเพิ่มเติม <span className="text-red-500 ml-1">*</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <FormField label="ประเภทงานวิจัย">
                <select
                  name="researchType"
                  value={formData.researchType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base appearance-none shadow-sm cursor-pointer"
                >
                  <option value="" disabled>-- เลือกประเภท --</option>
                  <option value="journal">บทความวารสาร</option>
                  <option value="conference">การประชุมวิชาการ</option>
                </select>
              </FormField>
            </div>

            <div className="flex-1">
              <FormField label="ผู้เขียนร่วม (Co-authors)">
                <input
                  type="text"
                  name="coAuthors"
                  value={formData.coAuthors}
                  onChange={handleChange}
                  placeholder="เช่น อลิสา ไอดี, วิทยา พัฒนาดี"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base shadow-sm"
                />
              </FormField>
            </div>
          </div>

          <FormField label="รูปปก (Cover Image)">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-green-500 transition duration-300 cursor-pointer">
              <div className="flex justify-center text-gray-400 mb-3">
                <ImageIcon size={30} />
              </div>
              <p className="text-gray-600 mb-3">อัปโหลดรูปปก (ไม่บังคับ)</p>
              <button
                type="button"
                className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                เลือกไฟล์รูปภาพ
              </button>
              <p className="mt-3 text-xs text-gray-500">รองรับ JPG, PNG (อัตราส่วน 16:9 แนะนำ)</p>
            </div>
          </FormField>
        </section>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-sm"
          >
            บันทึกเป็นฉบับร่าง
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <Upload size={18} className="mr-2 -ml-1" />
            อัปโหลดและส่งตรวจสอบ
          </button>
        </div>

      </div>
    </div>
  );
};

export default UploadPage;
