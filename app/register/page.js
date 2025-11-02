"use client";

import React, { useState } from "react";
import Image from "next/image";
import BookImg from "../images/book.png";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

const GoogleIcon = (props) => (
  <svg {...props} viewBox="0 0 48 48" width="20" height="20">
    <clipPath id="g">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.3 0-13.3-6-13.3-13.3s6-13.3 13.3-13.3c3.9 0 7.2 1.5 9.8 3.2L41.3 9c-4.4-2.6-9.8-4-15.3-4C13.5 5 5 13.5 5 24s8.5 19 19 19c11.1 0 17.7-8.1 17.7-17.9 0-1.3-.1-2.6-.4-3.9z" />
    </clipPath>
    <path clipPath="url(#g)" fill="#FBBC04" d="M0 37V11l17 13z" />
    <path clipPath="url(#g)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V5z" />
    <path clipPath="url(#g)" fill="#34A853" d="M0 37l30-23 7.9 1L48 37z" />
    <path clipPath="url(#g)" fill="#4285F4" d="M48 14l-4.1 2.5H24v8.5h20.5z" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    user_email: "",
    user_fullname: "",
    user_birthdate: "",
    user_type_id: "",
    user_org_id: "",
    user_password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.user_password !== formData.confirmPassword) {
      alert("❌ รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.user_email,
        password: formData.user_password,
      });

      if (authError) {
        alert("❌ ลงทะเบียนไม่สำเร็จ: " + authError.message);
        return;
      }

      const user_id = authData.user.id;

      const { data, error } = await supabase.from("user_tb").insert([
        {
          user_id,
          username: formData.username,
          user_email: formData.user_email,
          user_fullname: formData.user_fullname,
          user_birthdate: formData.user_birthdate,
          user_type_id: formData.user_type_id,
          user_org_id: formData.user_org_id,
          user_status: 1,
          user_image: null,
          user_password: formData.user_password,
        },
      ]);

      if (error) {
        console.error(error);
        alert("❌ เกิดข้อผิดพลาด: " + error.message);
        return;
      }

      alert("✅ ลงทะเบียนสำเร็จ! ตรวจสอบอีเมลเพื่อยืนยันบัญชี");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาด: " + err.message);
    }
  };

  const userTypeOptions = [
    { value: "", label: "โปรดเลือกประเภทผู้ใช้" },
    { value: "1", label: "นักศึกษา" },
    { value: "2", label: "อาจารย์/นักวิจัย" },
    { value: "3", label: "บุคคลทั่วไป" },
  ];

  const userOrgOptions = [
    { value: "", label: "โปรดเลือกสังกัด" },
    { value: "1", label: "คณะวิศวกรรมศาสตร์" },
    { value: "2", label: "คณะวิทยาศาสตร์" },
    { value: "3", label: "สังกัดอื่นๆ" },
  ];

  return (
    <div className="min-h-screen flex font-['Inter']">
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white z-10">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
            ลงทะเบียนผู้ใช้
          </h1>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="ชื่อผู้ใช้"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="user_fullname" className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <input
                id="user_fullname"
                name="user_fullname"
                type="text"
                required
                placeholder="ชื่อ-นามสกุล"
                value={formData.user_fullname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                required
                placeholder="อีเมล"
                value={formData.user_email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="user_birthdate" className="block text-sm font-medium text-gray-700 mb-1">วัน/เดือน/ปี เกิด</label>
              <input
                id="user_birthdate"
                name="user_birthdate"
                type="date"
                required
                value={formData.user_birthdate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="user_type_id" className="block text-sm font-medium text-gray-700 mb-1">ประเภทผู้ใช้</label>
              <select
                id="user_type_id"
                name="user_type_id"
                required
                value={formData.user_type_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                {userTypeOptions.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.value === ""}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="user_org_id" className="block text-sm font-medium text-gray-700 mb-1">สังกัด</label>
              <select
                id="user_org_id"
                name="user_org_id"
                required
                value={formData.user_org_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                {userOrgOptions.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.value === ""}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="user_password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <input
                id="user_password"
                name="user_password"
                type="password"
                required
                placeholder="รหัสผ่าน"
                value={formData.user_password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="ยืนยันรหัสผ่าน"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-150"
              >
                ลงทะเบียน
              </button>
            </div>
          </form>
        </div>

        {/* 🔹 ปุ่มย้อนกลับ (อยู่ล่างสุดของหน้า) */}
        <div className="w-full max-w-md mx-auto mt-8 text-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← ย้อนกลับ
          </button>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <Image src={BookImg} alt="หนังสือและเอกสารวิจัย" fill className="object-cover" priority />
      </div>
    </div>
  );
}
